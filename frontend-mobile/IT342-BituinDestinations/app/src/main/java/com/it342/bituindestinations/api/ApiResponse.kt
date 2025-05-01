package com.it342.bituindestinations.api

import com.it342.bituindestinations.model.User

data class ApiResponse(
    val status: String,
    val user: User
)