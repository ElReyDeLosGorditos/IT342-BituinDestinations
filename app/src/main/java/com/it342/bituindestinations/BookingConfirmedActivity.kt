package com.it342.bituindestinations

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.TextView
import android.widget.LinearLayout
import androidx.cardview.widget.CardView

class BookingConfirmedActivity : Activity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_booking_confirmed)

        // Get the booking details from intent extras
        val bookingId = intent.getIntExtra("bookingId", -1)
        val totalPrice = intent.getDoubleExtra("totalPrice", 0.0)
        val numTravelers = intent.getIntExtra("numTravelers", 0)
        val paymentMethod = intent.getStringExtra("paymentMethod") ?: "N/A"
        val paymentStatus = intent.getStringExtra("paymentStatus") ?: "Pending" // Added paymentStatus

        // Reference the TextViews
        val totalPriceTextView = findViewById<TextView>(R.id.total_price_text_view)
        val numTravelersTextView = findViewById<TextView>(R.id.num_travelers_value)
        val paymentMethodTextView = findViewById<TextView>(R.id.payment_method_value)
        val paymentStatusTextView = findViewById<TextView>(R.id.payment_status_value)

        // Set the values
        totalPriceTextView.text = "Total Price: ₱%.2f".format(totalPrice)
        numTravelersTextView.text = "Number of Travelers: $numTravelers"
        paymentMethodTextView.text = paymentMethod
        paymentStatusTextView.text = paymentStatus

        // Optional: Update payment status indicator color based on payment status
        /* val paymentStatusIndicator = findViewById<TextView>(R.id.payment_status_indicator)
        if (paymentStatus.equals("Completed", ignoreCase = true)) {
            paymentStatusIndicator.setBackgroundColor(resources.getColor(R.color.teal_200))
        } else {
            paymentStatusIndicator.setBackgroundColor(resources.getColor(R.color.red))
        } */

        findViewById<Button>(R.id.back_to_home_button).setOnClickListener {
            val intent = Intent(this, HomeActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
            }
            startActivity(intent)
            finish()
        }

        // Add logic for handling view bookings if needed
        /* findViewById<Button>(R.id.view_my_bookings_button).setOnClickListener {
            val intent = Intent(this, ViewBookingsActivity::class.java)
            startActivity(intent)
        } */
    }
}
