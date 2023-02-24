package com.bonespirito.springkafka

import com.bonespirito.springkafka.domain.dto.PurchaseOrderDto
import com.bonespirito.springkafka.domain.model.Material
import com.bonespirito.springkafka.domain.model.Order
import com.bonespirito.springkafka.domain.service.OrderService
import com.github.avrokotlin.avro4k.Avro
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import java.time.LocalDateTime

@SpringBootApplication
class KafkaSpring3Application : ApplicationRunner {
    @Autowired
    lateinit var orderService: OrderService
    override fun run(args: ApplicationArguments?) {
        val materials = listOf(
            Material(
                id = 10L,
                orderId = null,
                skuCode = "1010",
                quantity = 1,
                brand = "BOT",
            ),
            Material(
                id = 11L,
                orderId = null,
                skuCode = "1111",
                quantity = 1,
                brand = "EUD",
            ),
        )
        val order = Order(
            id = 1L,
            createdAt = LocalDateTime.now(),
            items = materials,
        )

        println(Avro.default.schema(PurchaseOrderDto.serializer()))
        println("The order: $order")

        orderService.produce(order)
    }
}

fun main(vararg args: String) {
    runApplication<KafkaSpring3Application>(*args)
}
