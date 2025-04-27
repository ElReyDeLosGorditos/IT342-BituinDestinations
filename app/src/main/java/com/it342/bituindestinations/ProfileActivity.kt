package com.it342.bituindestinations

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.EditText
import android.widget.Toast
import android.content.SharedPreferences
import android.util.Log
import android.widget.Button
import com.it342.bituindestinations.api.ApiService
import com.it342.bituindestinations.model.User
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

class ProfileActivity : Activity() {

    private lateinit var nameEditText: EditText
    private lateinit var emailEditText: EditText
    private lateinit var passwordEditText: EditText
    private lateinit var apiService: ApiService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_profile)

        // Initialize views
        nameEditText = findViewById(R.id.nameEditText)
        emailEditText = findViewById(R.id.emailEditText)
        passwordEditText = findViewById(R.id.passwordEditText)

        // Initialize API service
        val retrofit = Retrofit.Builder()
            .baseUrl("https://192.168.110.252:8080") // Replace with your API base URL
            .addConverterFactory(GsonConverterFactory.create())
            .build()

        apiService = retrofit.create(ApiService::class.java)

        // Fetch the logged-in user ID from shared preferences
        val sharedPref: SharedPreferences = getSharedPreferences("UserPrefs", MODE_PRIVATE)
        val userId = sharedPref.getInt("userId", -1)
        Log.d("ProfileActivity", "Retrieved userId: $userId")

        if (userId != -1) {
            Log.d("ProfileActivity", "Fetching user details for userId: $userId")
            fetchUserDetails(userId)
        } else {
            Toast.makeText(this, "No user logged in", Toast.LENGTH_SHORT).show()
        }

        // Back Button Action
        val backButton: Button = findViewById(R.id.backButton)
        backButton.setOnClickListener {
            val intent = Intent(this, HomeActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            startActivity(intent)
            finish()
        }

        // Save Button Action
        val saveButton: Button = findViewById(R.id.saveButton)
        saveButton.setOnClickListener {
            val updatedName = nameEditText.text.toString()
            val updatedEmail = emailEditText.text.toString()
            val updatedPassword = passwordEditText.text.toString()

            // Ensure the fields are not empty
            if (updatedName.isNotEmpty() && updatedEmail.isNotEmpty() && updatedPassword.isNotEmpty()) {
                // Create the updated user object
                val updatedUser = User(userId, updatedEmail, updatedPassword, updatedName, "User")  // Assuming role is "User"

                // Call the updateUser API method
                apiService.updateUser(userId, updatedUser).enqueue(object : Callback<User> {
                    override fun onResponse(call: Call<User>, response: Response<User>) {
                        if (response.isSuccessful) {
                            // Handle success
                            Toast.makeText(this@ProfileActivity, "User updated successfully", Toast.LENGTH_SHORT).show()
                        } else {
                            // Handle error response
                            Toast.makeText(this@ProfileActivity, "Failed to update user", Toast.LENGTH_SHORT).show()
                        }
                    }

                    override fun onFailure(call: Call<User>, t: Throwable) {
                        // Handle network error
                        Toast.makeText(this@ProfileActivity, "Network error: ${t.message}", Toast.LENGTH_SHORT).show()
                    }
                })
            } else {
                // Show a message if the fields are empty
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun fetchUserDetails(userId: Int) {
        apiService.getUserById(userId).enqueue(object : Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                Log.d("ProfileActivity", "API Response Code: ${response.code()}")
                if (response.isSuccessful) {
                    val user = response.body()
                    Log.d("ProfileActivity", "User details: $user")
                    if (user != null) {
                        nameEditText.setText(user.name)
                        emailEditText.setText(user.email)
                        passwordEditText.setText(user.password)
                    }
                } else {
                    Log.e("ProfileActivity", "Error loading user data: ${response.errorBody()?.string()}")
                    Toast.makeText(this@ProfileActivity, "Error loading user data", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                Log.e("ProfileActivity", "Network error: ${t.message}")
                Toast.makeText(this@ProfileActivity, "Network error", Toast.LENGTH_SHORT).show()
            }
        })
    }
}