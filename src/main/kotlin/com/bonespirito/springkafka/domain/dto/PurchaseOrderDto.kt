package com.bonespirito.springkafka.domain.dto

import com.github.avrokotlin.avro4k.AvroDoc
import com.github.avrokotlin.avro4k.AvroName
import com.github.avrokotlin.avro4k.AvroNamespace
import kotlinx.serialization.Required
import kotlinx.serialization.Serializable


@Serializable
@AvroName("Order")
@AvroNamespace("supply-channel.income.order.v1")
data class PurchaseOrderDto(
    @AvroDoc("Order ID") val id: Long?,
    @AvroDoc("Order Items") @Required val items: List<PurchaseOrderItemDto>,
    @AvroDoc("Created Order at") val createdAt: String
)
