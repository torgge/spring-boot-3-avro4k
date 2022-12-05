package com.bonespirito.springkafka.domain.utils.converter

import com.bonespirito.springkafka.domain.dto.PurchaseOrderDto
import com.bonespirito.springkafka.domain.dto.PurchaseOrderItemDto
import com.bonespirito.springkafka.domain.model.Material
import com.bonespirito.springkafka.domain.model.Order
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME

fun Order.toDto() = PurchaseOrderDto(
    id = this.id,
    items = this.items.map { it.toDto() },
    createdAt = this.createdAt.format(ISO_LOCAL_DATE_TIME)
)

fun PurchaseOrderDto.toVO() = Order(
    id = this.id,
    items = this.items!!.map { it.toVO(this.id) },
    createdAt = LocalDateTime.parse(this.createdAt)
)

fun Material.toDto() = PurchaseOrderItemDto(
    id = this.id,
    skuCode = this.skuCode,
    quantity = this.quantity,
    brand = this.brand
)

fun PurchaseOrderItemDto.toVO(orderId: Long?) = Material(
    id = this.id,
    orderId = orderId,
    skuCode = this.skuCode,
    quantity = this.quantity,
    brand = this.brand
)
