/*
This is a k6 test script that imports the xk6-kafka and
tests Kafka with a 100 Avro messages per iteration.
*/
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import {
    Writer,
    Reader,
    Connection,
    SchemaRegistry,
    KEY,
    VALUE,
    TOPIC_NAME_STRATEGY,
    RECORD_NAME_STRATEGY,
    SCHEMA_TYPE_AVRO,
    SCHEMA_TYPE_STRING
} from "k6/x/kafka"; // import kafka extension

const brokerIp = __ENV.SERVICE_HOSTNAME
const brokers = [`${brokerIp}:9092`];
const topic = "order-abc";

const writer = new Writer({
    brokers: brokers,
    topic: topic,
    autoCreateTopic: true,
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
    connection.createTopic({ topic: topic });
}

const valueSchema = `{
    "type": "record",
    "name": "Order",
    "namespace": "supply-channel.income.order.v1-value",
    "fields": [
      {
        "name": "id",
        "type": [
          "null",
          "long"
        ],
        "doc": "Order ID"
      },
      {
        "name": "items",
        "type": {
          "type": "array",
          "items": {
            "type": "record",
            "name": "Item",
            "namespace": "supply-channel.income.item.v1",
            "fields": [
              {
                "name": "id",
                "type": [
                  "null",
                  "long"
                ]
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
      },
      {
        "name": "createdAt",
        "type": "string",
        "doc": "Created Order at",
        "nombre": "teste"
      },
      {
        "name": "inst",
        "type": {
          "type": "string"
        }
      }
    ]
  }`;
  
  const valueSubjectName = schemaRegistry.getSubjectName({
    topic: topic,
    element: VALUE,
    subjectNameStrategy: RECORD_NAME_STRATEGY,
    schema: valueSchema,
  });
  
  const valueSchemaObject = schemaRegistry.createSchema({
    subject: valueSubjectName,
    schema: valueSchema,
    schemaType: SCHEMA_TYPE_AVRO,
  });

export default function () {

        let messages = [
            {
                key: schemaRegistry.serialize({
                    data: uuidv4(),
                    schemaType: SCHEMA_TYPE_STRING,
                  }),
                value: schemaRegistry.serialize({
                    data: {
                        id: 10,
                        createdAt: '2023-02-25T00:00:01',
                        inst:'2023-02-25T00:00:01',
                        items: [
                            {
                                id: 51,
                                skuCode: "1010",
                                quantity: 2,
                                brand: "PHILCO"
                            }
                        ]
                    },
                    schema: valueSchemaObject,
                    schemaType: SCHEMA_TYPE_AVRO,
                }),
            },
        ];
        writer.produce({ messages: messages });
    

    // let messages = reader.consume({ limit: 20 });
    // check(messages, {
    //     "20 message returned": (msgs) => msgs.length == 20,
    //     "key starts with 'ssn-' string": (msgs) =>
    //         schemaRegistry
    //             .deserialize({
    //                 data: msgs[0].key,
    //                 // schema: keySchemaObject,
    //                 schemaType: SCHEMA_TYPE_STRING,
    //             })
    //             .ssn.startsWith("ssn-"),
    //     "value contains 'id' and 'createdAt-' strings": (msgs) =>
    //         schemaRegistry
    //             .deserialize({
    //                 data: msgs[0].value,
    //                 schema: valueSchemaObject,
    //                 schemaType: SCHEMA_TYPE_AVRO,
    //             })
    //             .firstName.startsWith("id") &&
    //         schemaRegistry
    //             .deserialize({
    //                 data: msgs[0].value,
    //                 schema: valueSchemaObject,
    //                 schemaType: SCHEMA_TYPE_AVRO,
    //             })
    //             .lastName.startsWith("createdAt"),
    // });
}

export function teardown(data) {
    if (__VU == 0) {
        // Delete the topic
        connection.deleteTopic(topic);
    }
    writer.close();
    // reader.close();
    connection.close();
}

//docker run --rm -i mostafamoradian/xk6-kafka:latest -e SERVICE_HOSTNAME=192.168.0.164 run - <./docker/k6/script.js
