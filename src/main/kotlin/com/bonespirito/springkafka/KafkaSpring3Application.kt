package com.bonespirito.springkafka

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class KafkaSpring3Application

fun main(args: Array<String>) {
	runApplication<KafkaSpring3Application>(*args)
}
