package com.it342.bituindestinations

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.Button
import android.widget.ImageView
import android.widget.TextView
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import com.google.android.material.navigation.NavigationView
import com.it342.bituindestinations.model.TourPackage
import com.it342.bituindestinations.model.Destination

class ToursActivity : Activity() {

    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navView: NavigationView
    private lateinit var menuIcon: ImageView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_tours)

        drawerLayout = findViewById(R.id.drawer_layout)
        navView = findViewById(R.id.nav_view)
        menuIcon = findViewById(R.id.menu_icon)

        // Open drawer when menu icon is clicked
        menuIcon.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        // Handle navigation menu item clicks
        navView.setNavigationItemSelectedListener { menuItem ->
            drawerLayout.closeDrawer(GravityCompat.START) // Close drawer when item is clicked
            when (menuItem.itemId) {
                R.id.nav_home -> startActivity(Intent(this, HomeActivity::class.java)
                    .apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    })
                R.id.nav_whislist -> startActivity(Intent(this, WhislistActivity::class.java)
                    .apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    })
                R.id.nav_booking -> startActivity(Intent(this, SeeBookingsActivity::class.java)
                    .apply {
                        flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    })
                R.id.nav_logout -> {
                    // Handle logout
                    startActivity(Intent(this, LoginActivity::class.java)
                        .apply {
                            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                        })
                }
            }
            true
        }

        // Get tour data from the intent extras
        val bundle = intent.extras
        val title = bundle?.getString("title") ?: "No title available"
        val description = bundle?.getString("description") ?: "No description available"
        val agenda = bundle?.getString("agenda") ?: "No agenda available"
        val price = bundle?.getDouble("price") ?: 0.0
        val duration = bundle?.getString("duration") ?: "No duration available"
        val availableSlots = bundle?.getInt("availableSlots") ?: 0
        val startDate = bundle?.getString("startDate") ?: "Not available"
        val endDate = bundle?.getString("endDate") ?: "Not available"
        val destinationName = bundle?.getString("destinationName") ?: "Unknown destination"
        // Assuming you also pass a location, region, or other destination info from the previous screen
        val destinationLocation = bundle?.getString("destinationLocation") ?: "Unknown location"
        val destinationRegion = bundle?.getString("destinationRegion") ?: "Unknown region"

        // Create the Destination object
        val destination = Destination(
            id = 0, // Pass a valid ID if available
            destinationName = destinationName,
            destinationDescription = "",  // You can pass a description if available
            destinationType = "",  // You can pass the type if available
            region = destinationRegion,
            destinationImage = "",  // Pass an image filename if available
            destinationLocation = destinationLocation
        )

        // Create the TourPackage object
        val selectedTourPackage = TourPackage(
            id = -1, // Or use an actual ID if available
            title = title,
            description = description,
            agenda = agenda,
            price = price,
            duration = duration,
            availableSlots = availableSlots,
            startDate = startDate,
            endDate = endDate,
            destination = destination // Pass the Destination object
        )

        // Populate views
        findViewById<TextView>(R.id.tourTitle).text = title
        findViewById<TextView>(R.id.tourDescription).text = "Description: $description"
        findViewById<TextView>(R.id.tourAgenda).text = "Agenda: $agenda"
        findViewById<TextView>(R.id.tourPrice).text = "Price: ₱$price"
        findViewById<TextView>(R.id.tourDuration).text = "Duration: $duration"
        findViewById<TextView>(R.id.tourSlots).text = "Available Slots: $availableSlots"
        findViewById<TextView>(R.id.tourStartDate).text = "Start Date: $startDate"
        findViewById<TextView>(R.id.tourEndDate).text = "End Date: $endDate"
        findViewById<TextView>(R.id.tourDestination).text = "Destination: $destinationName"

        // Book button click listener
        findViewById<Button>(R.id.bookNowButton).setOnClickListener {
            val intent = Intent(this, BookingActivity::class.java).apply {
                putExtra("tourPackage", selectedTourPackage)  // Pass the TourPackage object
            }
            startActivity(intent)
        }
    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }
}