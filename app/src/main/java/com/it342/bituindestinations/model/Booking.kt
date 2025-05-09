package com.it342.bituindestinations.model

import java.time.LocalDate
import java.time.LocalDateTime

data class Booking(
    val id: Long,
    val travelDate: LocalDate,
    val numOfTravelers: Int,
    val totalPrice: Double,
    val paymentMethod: String,
    val bookingStatus: String,
    val createdAt: LocalDateTime? = null,
    val user: User,
    val tourPackage: TourPackage
)
