package com.bonespirito.springkafka.infraestructure.resource

import com.bonespirito.springkafka.application.OrderServiceImpl
import com.bonespirito.springkafka.domain.dto.PurchaseOrderDto
import com.bonespirito.springkafka.domain.utils.converter.toVO
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpEntity
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody

@Controller
class OrderController(
    @Autowired private val orderService: OrderServiceImpl
) {

    @PostMapping("/produce")
    fun produceKafkaMessage(@RequestBody purchaseOrder: PurchaseOrderDto): HttpEntity<Any?> {
        val order = purchaseOrder.toVO()
        orderService.produce(order)
        return ResponseEntity.status(HttpStatus.CREATED).build()
    }
}
