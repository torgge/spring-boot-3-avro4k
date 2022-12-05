package com.bonespirito.springkafka.domain.dto

import com.github.avrokotlin.avro4k.AvroName
import com.github.avrokotlin.avro4k.AvroNamespace
import kotlinx.serialization.Required
import kotlinx.serialization.Serializable
import org.apache.avro.reflect.AvroDoc

@Serializable
@AvroName("Item")
@AvroNamespace("supply-channel.income.item.v1")
data class PurchaseOrderItemDto(
    @AvroDoc("Order item id") val id: Long?,
    @AvroDoc("Sku code") @Required val skuCode: String,
    @AvroDoc("Required quantity") @Required val quantity: Int,
    @AvroDoc("Brand name") @Required val brand: String
)
