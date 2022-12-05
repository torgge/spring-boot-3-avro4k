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
![Screenshot](https://raw.githubusercontent.com/torgge/spring-boot-3-avro4k/blob/main/doc/assets/Screenshot%202022-12-05%20at%2010.36.13.png)
