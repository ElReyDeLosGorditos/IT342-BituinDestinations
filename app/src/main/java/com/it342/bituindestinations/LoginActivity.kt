package com.it342.bituindestinations

import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.util.Patterns
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.it342.bituindestinations.api.ApiService
import com.it342.bituindestinations.api.RetrofitClient
import com.it342.bituindestinations.model.User
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class LoginActivity : AppCompatActivity() {

    private lateinit var editTextEmail: EditText
    private lateinit var editTextPassword: EditText
    private lateinit var buttonSignIn: Button
    private lateinit var textViewSignUp: TextView
    private lateinit var apiService: ApiService

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        // Initialize UI elements using correct IDs from your layout
        editTextEmail = findViewById(R.id.editInTextEmail)
        editTextPassword = findViewById(R.id.editInTextPassword)
        buttonSignIn = findViewById(R.id.buttonSignIn)
        textViewSignUp = findViewById(R.id.textViewGotoSignUp)

        // Initialize ApiService using RetrofitClient
        apiService = RetrofitClient.instance

        // Set click listeners for buttons
        buttonSignIn.setOnClickListener {
            // Perform login validation
            val email = editTextEmail.text.toString().trim()
            val password = editTextPassword.text.toString().trim()

            if (isValidInput(email, password)) {
                // Call the login API
                loginUser(email, password)
            }
        }

        textViewSignUp.setOnClickListener {
            // Handle sign up functionality (intent to registration activity)
            val intent = Intent(this, RegisterActivity::class.java)
            startActivity(intent)
        }
    }

    private fun isValidInput(email: String, password: String): Boolean {
        if (email.isEmpty()) {
            editTextEmail.error = "Email is required"
            return false
        }
        if (!Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            editTextEmail.error = "Invalid email address"
            return false
        }
        if (password.isEmpty()) {
            editTextPassword.error = "Password is required"
            return false
        }
        return true
    }

    private fun loginUser(email: String, password: String) {
        // Assuming your User model constructor is: User(userId, name, email, password, role)
        val user = User(0, email, password, "","USER") // Set userId to 0 for login, name might be empty or unused for login
        val call = apiService.loginUser(user)

        call.enqueue(object : Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                if (response.isSuccessful) {
                    val loggedInUser = response.body()
                    if (loggedInUser != null) {
                        Log.d("LoginActivity", "Logged in user name being sent: ${loggedInUser.name}")
                        val userId = loggedInUser.userId.toString()
                        val name = loggedInUser.name
                        val userEmail = loggedInUser.email
                        val userPassword = loggedInUser.password

                        val intent = Intent(this@LoginActivity, HomeActivity::class.java)
                        intent.putExtra("userId", userId)
                        intent.putExtra("name", name)
                        intent.putExtra("email", userEmail)
                        intent.putExtra("password", userPassword)
                        startActivity(intent)
                        finish()
                        Toast.makeText(this@LoginActivity, "Login successful!", Toast.LENGTH_SHORT).show()
                    } else {
                        Toast.makeText(this@LoginActivity, "Login failed: User object is null", Toast.LENGTH_SHORT).show()
                    }
                } else {
                    Toast.makeText(this@LoginActivity, "Login failed: " + response.message(), Toast.LENGTH_SHORT).show()
                }

            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                Toast.makeText(this@LoginActivity, "Error: " + t.message, Toast.LENGTH_SHORT).show()
            }
        })
    }
}