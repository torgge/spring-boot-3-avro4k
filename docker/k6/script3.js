/*
This is a k6 test script that imports the xk6-kafka and
tests Kafka with a 100 Avro messages per iteration.
*/

import {check} from "k6";
import {
    Writer,
    Reader,
    Connection,
    SchemaRegistry,
    KEY,
    VALUE,
    TOPIC_NAME_STRATEGY,
    RECORD_NAME_STRATEGY,
    VALUE_SUBJECT_NAME_STRATEGY,
    SCHEMA_TYPE_AVRO,
    SCHEMA_TYPE_STRING,
} from "k6/x/kafka"; // import kafka extension
import {uuidv4} from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

const brokerIp = __ENV.SERVICE_HOSTNAME
const brokers = [`${brokerIp}:9092`];
const topic = "supply-chain.income.order.v1";

const writer = new Writer({
    brokers: brokers,
    topic: topic,
    autoCreateTopic: false,
});
const reader = new Reader({
    brokers: brokers,
    topic: topic,
});
const connection = new Connection({
    address: brokers[0],
});
const schemaRegistry = new SchemaRegistry({
    url: `http://${brokerIp}:8081`,
});

if (__VU == 0) {
    connection.createTopic({topic: topic});
}

const valueSchema = `{
  "type": "record",
  "name": "order",
  "namespace": "supplychain.income.order.v1",
  "fields": [
    {
      "name": "id",
      "type": "long",
      "doc": "Order ID"
    },
    {
      "name": "createdAt",
      "type": "string",
      "doc": "Created Order at"
    },
    {
      "name": "inst",
      "type": "string",
      "doc": "Inst"
    },
    {
      "name": "items",
      "type": {
        "type": "array",
        "items": {
          "type": "record",
          "name": "Item",
          "fields": [
            {
              "name": "id",
              "type": "long"
            },
            {
              "name": "skuCode",
              "type": "string"
            },
            {
              "name": "quantity",
              "type": "int"
            },
            {
              "name": "brand",
              "type": "string"
            }
          ]
        }
      },
      "doc": "Order Items"
    }
  ]
}`;

const valueSubjectName = schemaRegistry.getSubjectName({
    topic: topic,
    element: VALUE,
    subjectNameStrategy: VALUE_SUBJECT_NAME_STRATEGY,
    schema: valueSchema,
});

console.log(`valueSubjectName ${valueSubjectName}`)

const valueSchemaObject = schemaRegistry.createSchema({
    subject: valueSubjectName,
    schema: valueSchema,
    schemaType: SCHEMA_TYPE_AVRO,
});

export default function () {

    let uuid = uuidv4();
    let messages = [
        {
            key: schemaRegistry.serialize({
                data: uuid,
                schemaType: SCHEMA_TYPE_STRING,
            }),
            value: schemaRegistry.serialize({
                data: {
                    id: 10,
                    createdAt: "2023-02-26T23:30:36Z",
                    inst: "2023-02-26T23:30:36Z",
                    items: [
                        {
                            id: 1,
                            skuCode: "10",
                            quantity: 1,
                            brand: "abc"
                        }
                    ]
                },
                schema: valueSchemaObject,
                schemaType: SCHEMA_TYPE_AVRO,
            }),
        },
    ];
    writer.produce({messages: messages});


    let results = reader.consume({limit: 1});

    check(results, {
        "teste": (msgs) => {
            console.log(`Teste ${JSON.stringify(schemaRegistry
                .deserialize({
                    data: msgs[0].value,
                    schema: valueSchemaObject,
                    schemaType: SCHEMA_TYPE_AVRO,
                }))}`)
        },
        "20 message returned": (msgs) => msgs.length === 1,
        "key starts with string": (msgs) =>
            schemaRegistry
                .deserialize({
                    data: msgs[0].key,
                    schemaType: SCHEMA_TYPE_STRING,
                }) === uuid,
        "value contains 'id' and 'createdAt' strings": (msgs) =>
            schemaRegistry
                .deserialize({
                    data: msgs[0].value,
                    schema: valueSchemaObject,
                    schemaType: SCHEMA_TYPE_AVRO,
                }).id === 10 &&
            schemaRegistry
                .deserialize({
                    data: msgs[0].value,
                    schema: valueSchemaObject,
                    schemaType: SCHEMA_TYPE_AVRO,
                })
                .createdAt.startsWith("2"),
    });
}

export function teardown(data) {
    if (__VU == 0) {
        // Delete the topic
        // connection.deleteTopic(topic);
    }
    writer.close();
    reader.close();
    connection.close();
}
