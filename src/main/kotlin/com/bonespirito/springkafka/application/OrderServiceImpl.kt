package com.bonespirito.springkafka.application

import com.bonespirito.springkafka.domain.dto.PurchaseOrderDto
import com.bonespirito.springkafka.domain.model.Order
import com.bonespirito.springkafka.domain.service.OrderService
import com.bonespirito.springkafka.domain.utils.converter.toDto
import com.github.avrokotlin.avro4k.Avro
import org.apache.avro.generic.GenericRecord
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Service
import java.util.*

@Service
class OrderServiceImpl(
    @Autowired private val kafkaTemplate: KafkaTemplate<String, GenericRecord>,
) : OrderService {

    @Value("\${app.kafka.producer.topics}")
    private val topic: String = "order"

    override fun produce(order: Order) {
        val uuid: String = UUID.randomUUID().toString()
        val dto = order.toDto()
        val avroRecord = Avro.default.toRecord(PurchaseOrderDto.serializer(), dto)

        println("AVRO ---> ${avroRecord.schema}")

        kafkaTemplate.send(
            topic,
            uuid,
            avroRecord,
        )
    }

    override fun consume() {
        TODO("Not yet implemented")
    }
}
