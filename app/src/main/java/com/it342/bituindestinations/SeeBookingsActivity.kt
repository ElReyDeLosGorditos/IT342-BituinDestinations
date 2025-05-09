package com.it342.bituindestinations

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.navigation.NavigationView
import com.it342.bituindestinations.api.RetrofitClient
import com.it342.bituindestinations.app.MyApplication
import com.it342.bituindestinations.model.Booking
import com.it342.bituindestinations.model.BookingDTO
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class SeeBookingsActivity : Activity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var menuIcon: ImageView
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navView: NavigationView

    private lateinit var adapter: BookingAdapter  // Adapter for bookings list
    private var allBookings: MutableList<Booking> = mutableListOf()  // Store fetched bookings

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_see_bookings)

        // Initialize UI elements
        drawerLayout = findViewById(R.id.drawer_layout)
        navView = findViewById(R.id.nav_view)
        menuIcon = findViewById(R.id.menu_icon)

        // Set SETTINGS in header
        val headerView = navView.getHeaderView(0)
        val userNameTextView: TextView? = headerView.findViewById(R.id.userNameTextView)
        userNameTextView?.text = "SETTINGS"

        menuIcon.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        navView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_home -> startActivity(Intent(this, HomeActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                })
                R.id.nav_whislist -> startActivity(Intent(this, WhislistActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                })
                R.id.nav_booking -> startActivity(Intent(this, BookingActivity::class.java).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                })
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

        recyclerView = findViewById(R.id.bookingsRecyclerView)
        recyclerView.layoutManager = GridLayoutManager(this, 1)

        // Fetch bookings and update UI
        fetchBookings()
    }

    private fun fetchBookings() {
        val apiService = RetrofitClient.instance
        val userId = (application as MyApplication).userId ?: -1  // Fetch the userId from the app's MyApplication class

        if (userId == -1) {
            Toast.makeText(this, "User not logged in", Toast.LENGTH_SHORT).show()
            return
        }

        // Fetch bookings for the logged-in user
//        apiService.getUserBookings(userId).enqueue(object : Callback<List<Booking>> {
//            override fun onResponse(call: Call<List<Booking>>, response: Response<List<Booking>>) {
//                if (response.isSuccessful) {
//                    allBookings = response.body()?.toMutableList() ?: mutableListOf()
//
//                    // Pass the bookings list to the adapter
//                    adapter = BookingAdapter(allBookings) { booking ->
//                        // Handle booking item click, for example navigate to booking details
//                        val intent = Intent(this@SeeBookingsActivity, BookingDetailsActivity::class.java)
//                        intent.putExtra("bookingId", booking.id)
//                        startActivity(intent)
//                    }
//
//                    recyclerView.adapter = adapter
//                } else {
//                    Toast.makeText(this@SeeBookingsActivity, "Failed to load bookings", Toast.LENGTH_SHORT).show()
//                }
//            }
//
//            override fun onFailure(call: Call<List<Booking>>, t: Throwable) {
//                Toast.makeText(this@SeeBookingsActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
//            }
//        })
    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }
}