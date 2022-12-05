package com.bonespirito.springkafka.domain.service

import com.bonespirito.springkafka.domain.model.Order

interface OrderService {
    fun produce(order: Order)
    fun consume()
}
