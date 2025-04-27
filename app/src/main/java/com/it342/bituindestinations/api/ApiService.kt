package com.it342.bituindestinations.api

import com.it342.bituindestinations.model.Destination
import com.it342.bituindestinations.model.User
import okhttp3.MultipartBody
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.POST
import retrofit2.http.PUT
import retrofit2.http.Path
import retrofit2.http.Multipart
import retrofit2.http.Part
import retrofit2.http.DELETE
import retrofit2.http.Header

interface ApiService {

    // Save new user (sign-up)
    @POST("/user/save")
    fun saveUser(@Body user: User): Call<User>

    // User login
    @POST("/user/login")
    fun loginUser(@Body user: User): Call<User>

    // Get all users
    @GET("/user/getAll")
    fun getAllUsers(@Header("Authorization") token: String): Call<List<User>>

    // Get user by ID
    @GET("/user/getUserById/{userId}")
    fun getUserById(
        @Path("userId") userId: Int
    ): Call<User>

    // Update user by ID
    @PUT("/user/update/{userId}")
    fun updateUser(
        @Path("userId") userId: Int,
        @Body user: User  // Pass the user object to update
    ): Call<User>  // This returns the updated User entity

    // Get all destinations
    @GET("/destination/getAll")
    fun getDestinations(): Call<List<Destination>>  // Add token header

    // Get destination by ID
    @GET("/destination/getById/{id}")
    fun getDestinationById(
        @Path("id") id: Int,
        @Header("Authorization") token: String
    ): Call<Destination>  // Add token header

    // Save new destination
    @Multipart
    @POST("/destination/save")
    fun saveDestination(
        @Part("destinationName") destinationName: String,
        @Part("destinationDescription") destinationDescription: String,
        @Part("destinationType") destinationType: String,
        @Part("region") region: String,
        @Part("destinationLocation") destinationLocation: String,
        @Part destinationImage: MultipartBody.Part,  // For image upload
        @Header("Authorization") token: String  // Add token header
    ): Call<Destination>

    // Update existing destination
    @Multipart
    @PUT("/destination/update/{id}")
    fun updateDestination(
        @Path("id") id: Int,
        @Part("destinationName") destinationName: String,
        @Part("destinationDescription") destinationDescription: String,
        @Part("destinationType") destinationType: String,
        @Part("region") region: String,
        @Part("destinationLocation") destinationLocation: String,
        @Part destinationImage: MultipartBody.Part, // For image upload (optional)
        @Header("Authorization") token: String  // Add token header
    ): Call<Destination>

    // Delete destination by ID
    @DELETE("/destination/delete/{id}")
    fun deleteDestination(
        @Path("id") id: Int,
        @Header("Authorization") token: String  // Add token header
    ): Call<Void>
}
