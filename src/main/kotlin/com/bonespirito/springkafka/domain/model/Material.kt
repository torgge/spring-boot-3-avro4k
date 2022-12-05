package com.bonespirito.springkafka.domain.model

data class Material(
    val id: Long?,
    val orderId: Long?,
    val skuCode: String,
    val quantity: Int,
    val brand: String
)

