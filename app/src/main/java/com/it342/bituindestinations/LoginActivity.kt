package com.it342.bituindestinations

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import android.widget.Toast
import com.it342.bituindestinations.api.RetrofitClient
import com.it342.bituindestinations.model.User
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import com.it342.bituindestinations.app.MyApplication
import com.it342.bituindestinations.utils.toast
import com.google.android.gms.auth.api.identity.BeginSignInRequest
import com.google.android.gms.auth.api.identity.Identity
import com.google.android.gms.auth.api.identity.SignInClient
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInAccount

class LoginActivity : Activity() {

    private lateinit var signInClient: SignInClient
    private lateinit var signInRequest: BeginSignInRequest

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_login)

        val buttonContinueWithGoogle = findViewById<LinearLayout>(R.id.buttonContinueWithGoogle)
        buttonContinueWithGoogle.setOnClickListener {
            // Start Google sign-in process
            initiateGoogleSignIn()
        }

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

        // Initialize Google Sign-In Client
        signInClient = Identity.getSignInClient(this)
        signInRequest = BeginSignInRequest.builder()
            .setPasswordRequestOptions(
                BeginSignInRequest.PasswordRequestOptions.builder()
                    .setSupported(true)
                    .build()
            )
            .build()
    }

    private fun initiateGoogleSignIn() {
        signInClient.beginSignIn(signInRequest)
            .addOnSuccessListener { result ->
                try {
                    // Use startIntentSenderForResult to start the sign-in activity
                    startIntentSenderForResult(
                        result.pendingIntent.intentSender,
                        REQUEST_GOOGLE_SIGN_IN,
                        null, // You can pass additional data here if needed
                        0, 0, 0
                    )
                } catch (e: Exception) {
                    // Handle any potential errors
                    Toast.makeText(this, "Error starting sign-in intent: ${e.message}", Toast.LENGTH_LONG).show()
                }
            }
            .addOnFailureListener { exception ->
                Toast.makeText(this, "Google Sign-In failed: ${exception.message}", Toast.LENGTH_LONG).show()
            }
    }


    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_GOOGLE_SIGN_IN && resultCode == Activity.RESULT_OK) {
            val account: GoogleSignInAccount? = GoogleSignIn.getSignedInAccountFromIntent(data).result

            if (account != null) {
                val googleUserId = account.id // Google's unique ID for the user
                val name = account.displayName
                val email = account.email
                val token = account.idToken

                // Save relevant data, using "userId" for consistency
                val sharedPref = getSharedPreferences("UserPrefs", MODE_PRIVATE)
                val editor = sharedPref.edit()
                editor.putString("googleToken", token).apply() // You might want to save the Google token
                editor.putString("userName", name).apply()
                editor.putString("userEmail", email).apply()

                // For your app's internal user ID (if your backend associates Google users with your system's IDs)
                // you might need to send the Google ID to your backend and retrieve your app's userId.
                // For now, let's just save the Google ID under "userId" for simplicity in ProfileActivity.
                editor.putString("userId", googleUserId).apply() // Saving Google's ID as userId

                startActivity(Intent(this, HomeActivity::class.java))
                finish()
            } else {
                Toast.makeText(this, "Google Sign-In failed", Toast.LENGTH_LONG).show()
            }
        } else {
            Toast.makeText(this, "Google Sign-In failed", Toast.LENGTH_LONG).show()
        }
    }

    private fun loginUser(user: User) {
        RetrofitClient.instance.loginUser(user).enqueue(object : Callback<User> {
            override fun onResponse(call: Call<User>, response: Response<User>) {
                if (response.isSuccessful) {
                    val loggedInUser = response.body()
                    val userId = loggedInUser?.userId
                    Log.d("LoginActivity", "User ID from server: $userId")
                    if (userId != null) {
                        val sharedPref = getSharedPreferences("UserPrefs", MODE_PRIVATE)
                        val editor = sharedPref.edit()
                        editor.putInt("userId", userId)
                        editor.apply()
                        Toast.makeText(this@LoginActivity, "Login successful", Toast.LENGTH_LONG).show()
                        startActivity(Intent(this@LoginActivity, HomeActivity::class.java))
                        finish()
                    }
                } else {
                    Toast.makeText(this@LoginActivity, "Error: Invalid credentials", Toast.LENGTH_LONG).show()
                }
            }

            override fun onFailure(call: Call<User>, t: Throwable) {
                Toast.makeText(this@LoginActivity, "Failure: ${t.message}", Toast.LENGTH_LONG).show()
            }
        })
    }

    companion object {
        const val REQUEST_GOOGLE_SIGN_IN = 1001
    }
}