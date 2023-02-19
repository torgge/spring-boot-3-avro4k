package com.bonespirito.springkafka.domain.dto

import com.github.avrokotlin.avro4k.AvroDoc
import com.github.avrokotlin.avro4k.AvroName
import com.github.avrokotlin.avro4k.AvroNamespace
import com.github.avrokotlin.avro4k.AvroProp
import com.github.avrokotlin.avro4k.serializer.LocalDateTimeSerializer
import kotlinx.serialization.Required
import kotlinx.serialization.Serializable
import java.time.LocalDateTime

@Serializable
@AvroName("Order")
@AvroNamespace("supply-channel.income.order.v1")
data class PurchaseOrderDto(
    @AvroDoc("Order ID") val id: Long?,
    @AvroDoc("Order Items") @Required val items: List<PurchaseOrderItemDto>,
    @AvroDoc("Created Order at")
    @AvroProp("nombre", "teste")
    val createdAt: String,
    @Serializable(with = LocalDateTimeSerializer::class)
    val inst: LocalDateTime = LocalDateTime.now(),
)
