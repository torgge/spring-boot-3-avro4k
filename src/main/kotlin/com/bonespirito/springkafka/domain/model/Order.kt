package com.bonespirito.springkafka.domain.model

import java.time.LocalDateTime

data class Order(
    val id: Long?,
    val items: List<Material>,
    val createdAt: LocalDateTime,
)
