package com.it342.bituindestinations.api

import com.it342.bituindestinations.model.User
import retrofit2.Call
import retrofit2.http.GET
import retrofit2.http.Body
import retrofit2.http.POST
import retrofit2.http.Path

interface ApiService {

    // Save new user (sign-up)
    @POST("/user/save")
    fun saveUser(@Body user: User): Call<User>

    // User login
    @POST("/user/login")
    fun loginUser(@Body user: User): Call<User>

    // Get all users
    @GET("/user/getAll")
    fun getAllUsers(): Call<List<User>>

    // Get user by ID
    @GET("/user/getUserById/{userId}")
    fun getUserById(@Path("userId") userId: Int): Call<User>
}