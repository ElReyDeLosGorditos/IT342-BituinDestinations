package com.it342.bituindestinations.model

import androidx.room.ColumnInfo
import androidx.room.Entity
import androidx.room.PrimaryKey

data class Destination(
    val id: Int,
    val destinationName: String,
    val destinationDescription: String,
    val destinationType: String,
    val region: String,
    val destinationImage: String,  // This will be the image filename
    val destinationLocation: String
)