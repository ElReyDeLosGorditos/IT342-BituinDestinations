package com.it342.bituindestinations.view

import android.app.Activity
import android.net.Uri
import android.os.Bundle
import androidx.browser.customtabs.CustomTabsIntent

class WebViewActivity : Activity() {  // Extends Activity

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Set up the correct authorization URL for Google OAuth
        val authUrl = "https://accounts.google.com/o/oauth2/v2/auth"  // Update with the correct URL

        // Set up CustomTabsIntent to launch the URL
        val builder = CustomTabsIntent.Builder()
        val customTabsIntent = builder.build()

        // Launch the custom tab using the activity context
        try {
            customTabsIntent.launchUrl(this, Uri.parse(authUrl))
        } catch (e: Exception) {
            // Handle potential errors (e.g., invalid URL, network issues, etc.)
            e.printStackTrace()
        }
    }
}