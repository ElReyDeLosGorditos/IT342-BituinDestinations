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
import com.it342.bituindestinations.utils.isNotValid
import com.it342.bituindestinations.utils.toast

class RegisterActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_register)

        val editTextRegEmail = findViewById<EditText>(R.id.editTextRegEmail)
        val editTextRegPassword = findViewById<EditText>(R.id.editTextRegPassword)
        val editTextRegConfirmPassword = findViewById<EditText>(R.id.editTextRegConfirmPassword)

        val buttonSignUp = findViewById<Button>(R.id.buttonSignUp)
        buttonSignUp.setOnClickListener {

            // Basic Validation
            if (editTextRegEmail.isNotValid() || editTextRegPassword.isNotValid()
                || editTextRegConfirmPassword.isNotValid()) {
                toast("Any form cannot be empty")
                return@setOnClickListener
            }

            // Validate the email format
            val email = editTextRegEmail.text.toString()
            if (!isValidEmail(email)) {
                toast("Invalid email format")
                return@setOnClickListener
            }

            // Check if password and confirm password match
            if (editTextRegPassword.text.toString() != editTextRegConfirmPassword.text.toString()) {
                toast("Passwords do not match")
                return@setOnClickListener
            }

            // Proceed with the registration process
            saveRegistration(email, editTextRegPassword.text.toString())
        }

        // Link to Sign In page
        val goToSignIn = findViewById<TextView>(R.id.textViewGotoSignIn)
        goToSignIn.setOnClickListener {
            startActivity(Intent(this, LoginActivity::class.java))
        }
    }

    // Function to validate email format
    private fun isValidEmail(email: String): Boolean {
        val emailPattern = "[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}"
        return email.matches(Regex(emailPattern))
    }

    private fun saveRegistration(email: String, password: String) {
        // Create a User object with the provided data
        val user = User(userId = 0, name = "", email = email, password = password, role = "USER")

        // Send the user data to the backend using Retrofit
        RetrofitClient.instance.saveUser(user).enqueue(object : Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                if (response.isSuccessful) {
                    // Registration successful
                    Toast.makeText(this@RegisterActivity, "User registered successfully!", Toast.LENGTH_LONG).show()

                    // Redirect to the login screen
                    startActivity(Intent(this@RegisterActivity, LoginActivity::class.java))
                } else {
                    // Handle error (e.g., email already exists)
                    Toast.makeText(this@RegisterActivity, "Error: ${response.message()}", Toast.LENGTH_LONG).show()
                }
            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                // Handle failure (e.g., no internet connection)
                Toast.makeText(this@RegisterActivity, "Failure: ${t.message}", Toast.LENGTH_LONG).show()
            }
        })
    }
}