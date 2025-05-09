package com.it342.bituindestinations.model

import java.util.Date

data class BookingDTO(
    val travelDate: Date?,
    val numOfTravelers: Int,
    val totalPrice: Double,
    val paymentMethod: String,
    val bookingStatus: String,
    val userId: Int,
    val tourPackageId: Int
)