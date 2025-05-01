package com.it342.bituindestinations.model

data class User(
    val userId: Int,
    val email: String,
    val password: String,
    val name: String,
    val role: String
)