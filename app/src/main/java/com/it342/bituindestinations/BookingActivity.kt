package com.it342.bituindestinations

import android.app.Activity
import android.app.DatePickerDialog
import android.content.Intent
import android.os.Bundle
import android.widget.*
import androidx.core.view.GravityCompat
import com.google.android.material.navigation.NavigationView
import com.it342.bituindestinations.api.RetrofitClient
import com.it342.bituindestinations.app.MyApplication
import com.it342.bituindestinations.model.Booking
import com.it342.bituindestinations.model.BookingDTO
import com.it342.bituindestinations.model.TourPackage
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response
import java.util.*

class BookingActivity : Activity() {

    private lateinit var drawerLayout: androidx.drawerlayout.widget.DrawerLayout
    private lateinit var menuIcon: ImageView
    private lateinit var navView: NavigationView

    private lateinit var travelDateEditText: EditText
    private lateinit var numTravelersEditText: EditText
    private lateinit var totalPriceTextView: TextView
    private lateinit var pricePerPersonTextView: TextView
    private lateinit var numberOfTravelersSummaryTextView: TextView
    private lateinit var paymentMethodSpinner: Spinner
    private lateinit var confirmBookingButton: Button

    private var selectedDate: Calendar? = null
    private var selectedTourPackage: TourPackage? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_booking)

        // Get passed tour package
        selectedTourPackage = intent.getParcelableExtra("tourPackage")

        // View bindings
        drawerLayout = findViewById(R.id.drawer_layout)
        navView = findViewById(R.id.nav_view)
        menuIcon = findViewById(R.id.menu_icon)

        travelDateEditText = findViewById(R.id.travel_date_edit_text)
        numTravelersEditText = findViewById(R.id.number_of_travelers_edit_text)
        totalPriceTextView = findViewById(R.id.total_price_text_view)
        pricePerPersonTextView = findViewById(R.id.price_per_person_text_view)
        numberOfTravelersSummaryTextView = findViewById(R.id.number_of_travelers_summary_text_view)
        paymentMethodSpinner = findViewById(R.id.payment_method_spinner)
        confirmBookingButton = findViewById(R.id.confirm_booking_button)

        menuIcon.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        navView.setNavigationItemSelectedListener { menuItem ->
            drawerLayout.closeDrawer(GravityCompat.START)
            when (menuItem.itemId) {
                R.id.nav_home -> {
                    startActivity(Intent(this, HomeActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    })
                }
                R.id.nav_whislist -> {
                    startActivity(Intent(this, WhislistActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    })
                }
                R.id.nav_booking -> {
                    startActivity(Intent(this, SeeBookingsActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    })
                }
                R.id.nav_logout -> {
                    (application as MyApplication).email = ""
                    (application as MyApplication).password = ""
                    startActivity(Intent(this, LoginActivity::class.java).apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    })
                }
            }
            true
        }

        selectedTourPackage?.let {
            pricePerPersonTextView.text = "₱%.2f".format(it.price)
        } ?: run {
            pricePerPersonTextView.text = "₱0.00"
        }

        travelDateEditText.setOnClickListener {
            val calendar = Calendar.getInstance()
            DatePickerDialog(this,
                { _, year, month, dayOfMonth ->
                    selectedDate = Calendar.getInstance().apply {
                        set(year, month, dayOfMonth)
                    }
                    travelDateEditText.setText("$year-${month + 1}-$dayOfMonth")
                },
                calendar.get(Calendar.YEAR),
                calendar.get(Calendar.MONTH),
                calendar.get(Calendar.DAY_OF_MONTH)
            ).show()
        }

        numTravelersEditText.setOnFocusChangeListener { _, hasFocus ->
            if (!hasFocus) updateSummary()
        }

        confirmBookingButton.setOnClickListener {
            val travelDate = selectedDate?.time
            val numTravelers = numTravelersEditText.text.toString().toIntOrNull()
            val paymentMethod = paymentMethodSpinner.selectedItem.toString()

            if (travelDate == null || numTravelers == null || numTravelers <= 0) {
                Toast.makeText(this, "Please complete the form.", Toast.LENGTH_SHORT).show()
                return@setOnClickListener
            }

            val totalPrice = selectedTourPackage?.price?.times(numTravelers) ?: 0.0

            val bookingDTO = BookingDTO(
                travelDate = travelDate,
                numOfTravelers = numTravelers,
                totalPrice = totalPrice,
                paymentMethod = paymentMethod,
                bookingStatus = "Pending",
                userId = (application as MyApplication).userId ?: -1,
                tourPackageId = selectedTourPackage?.id ?: -1
            )

            val apiService = RetrofitClient.instance
            val call = apiService.createBooking(bookingDTO)

            call.enqueue(object : Callback<Booking> {
                override fun onResponse(call: Call<Booking>, response: Response<Booking>) {
                    if (response.isSuccessful) {
                        val bookingResponse = response.body()
                        if (bookingResponse != null) {
                            Toast.makeText(this@BookingActivity, "Booking successful! Booking ID: ${bookingResponse.id}", Toast.LENGTH_LONG).show()
                            val intent = Intent(this@BookingActivity, BookingConfirmedActivity::class.java).apply {
                                putExtra("totalPrice", totalPrice)
                                putExtra("numTravelers", numTravelers)
                                putExtra("paymentMethod", paymentMethod)
                            }
                            startActivity(intent)
                            finish()
                        } else {
                            Toast.makeText(this@BookingActivity, "Booking successful, but no booking details received.", Toast.LENGTH_LONG).show()
                            startActivity(Intent(this@BookingActivity, BookingConfirmedActivity::class.java))
                            finish()
                        }
                    } else {
                        Toast.makeText(this@BookingActivity, "Booking failed. Error code: ${response.code()}", Toast.LENGTH_LONG).show()
                        println("Error Body: ${response.errorBody()?.string()}")
                    }
                }

                override fun onFailure(call: Call<Booking>, t: Throwable) {
                    Toast.makeText(this@BookingActivity, "Network error: ${t.localizedMessage}", Toast.LENGTH_LONG).show()
                    t.printStackTrace()
                }
            })
        }
    }

    private fun updateSummary() {
        val numTravelers = numTravelersEditText.text.toString().toIntOrNull() ?: 1
        val totalPrice = selectedTourPackage?.price?.times(numTravelers) ?: 0.0

        totalPriceTextView.text = "₱%.2f".format(totalPrice)
        numberOfTravelersSummaryTextView.text = numTravelers.toString()
    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }
}