package com.it342.bituindestinations

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.TextView
import android.widget.Toast
import com.it342.bituindestinations.api.RetrofitClient
import com.it342.bituindestinations.model.User
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import com.it342.bituindestinations.app.MyApplication
import com.it342.bituindestinations.utils.isNotValid
import com.it342.bituindestinations.utils.toast


class LoginActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val editInTextEmail = findViewById<EditText>(R.id.editInTextEmail)
        val editInTextPassword = findViewById<EditText>(R.id.editInTextPassword)

        // Optional: Pre-fill email and password from previous registration (MyApplication)
        editInTextEmail.setText((application as MyApplication).email)
        editInTextPassword.setText((application as MyApplication).password)

        val buttonSignIn = findViewById<Button>(R.id.buttonSignIn)
        buttonSignIn.setOnClickListener {

            val email = editInTextEmail.text.toString()
            val password = editInTextPassword.text.toString()

            // Validate the input
            if (email.isNullOrEmpty() || password.isNullOrEmpty()) {
                toast("Email and Password cannot be empty")
                return@setOnClickListener
            }

            // Create User object, make sure to pass all required fields
            val user = User(
                userId = 0,
                name = "",
                email = email,
                password = password,
                role = "USER"  // Default role
            )

            // Perform login via Retrofit
            loginUser(user)
        }

        // Go to SignUp screen
        val goToSignUp = findViewById<TextView>(R.id.textViewGotoSignUp)
        goToSignUp.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }

    private fun loginUser(user: User) {
        // Send login request via Retrofit
        RetrofitClient.instance.loginUser(user).enqueue(object : Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                if (response.isSuccessful) {
                    // Login successful, navigate to HomeActivity
                    Toast.makeText(this@LoginActivity, "Login successful", Toast.LENGTH_LONG).show()
                    startActivity(Intent(this@LoginActivity, HomeActivity::class.java))
                    finish()  // Close LoginActivity
                } else {
                    // Handle error (e.g., wrong credentials)
                    Toast.makeText(this@LoginActivity, "Error: Invalid credentials", Toast.LENGTH_LONG).show()
                }
            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                // Handle failure (e.g., network issues)
                Toast.makeText(this@LoginActivity, "Failure: ${t.message}", Toast.LENGTH_LONG).show()
            }
        })
    }
}