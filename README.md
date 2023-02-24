# Proof of concept to test avro4k library

---

### Rest endpoint to produce a message
```shell
curl -X POST --location "http://localhost:8199/produce" \
    -H "Content-Type: application/json" \
    -d "{
          \"id\": 9999,
          \"createdAt\":\"2022-07-30T10:24:35.511\",
          \"items\":[
            {
              \"id\": 10,
              \"skuCode\":\"144789\",
              \"quantity\":1,
              \"brand\":\"XIAOMI\"
            },
            {
              \"id\": 11,
              \"skuCode\":\"51234\",
              \"quantity\":1,
              \"brand\":\"APPLE\"
            },
            {
              \"id\": 12,
              \"skuCode\":\"50000\",
              \"quantity\":1,
              \"brand\":\"POSITIVO\"
            }
          ]
        }"
```

### Docker Compose on root project
```Shell
 docker-compose -f ./docker/docker-compose.yml up -d
```
### Avro4k Example
```kotlin
@Serializable
@AvroName("Order")
@AvroNamespace("supply-channel.income.order.v1")
data class PurchaseOrderDto(
    @AvroDoc("Order ID") val id: Long?,
    @AvroDoc("Order Items") @Required val items: List<PurchaseOrderItemDto>,
    @AvroDoc("Created Order at") val createdAt: String
)
```

### Generated Avro fom @Avro Annotation
```JSON
{
  "type": "record",
  "name": "Order",
  "namespace": "supply-channel.income.order.v1",
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
      "doc": "Created Order at"
    }
  ]
}
```
### AKHQ
![Screenshot](./doc/assets/Screenshot%202022-12-05%20at%2010.36.13.png)

# K6 Stress tests - Direct produce message in Kafka
### Docker using [LensesIO](https://github.com/lensesio/fast-data-dev)
```shell
sudo docker run \                                                               
    --detach --rm \
    --name lensesio \
    -p 2181:2181 \
    -p 3030:3030 \
    -p 8081-8083:8081-8083 \
    -p 9581-9585:9581-9585 \
    -p 9092:9092 \
    -e ADV_HOST=192.168.0.164 \ #Your IP
    -e RUN_TESTS=0 \
    dougdonohoe/fast-data-dev:latest
```
### LensesIO UI
http://localhost:3030/

### Command
````shell
docker run --rm -i mostafamoradian/xk6-kafka:latest -e SERVICE_HOSTNAME=192.168.0.164 run - <./docker/k6/script.js
````
