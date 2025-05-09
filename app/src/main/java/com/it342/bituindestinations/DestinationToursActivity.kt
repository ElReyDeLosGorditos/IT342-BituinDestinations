package com.it342.bituindestinations

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.widget.ImageView
import android.widget.TextView
import android.widget.Toast
import androidx.core.view.GravityCompat
import androidx.drawerlayout.widget.DrawerLayout
import androidx.recyclerview.widget.GridLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.navigation.NavigationView
import com.it342.bituindestinations.api.RetrofitClient
import com.it342.bituindestinations.app.MyApplication
import com.it342.bituindestinations.model.TourPackage
import com.it342.bituindestinations.utils.WishlistManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class DestinationToursActivity : Activity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var menuIcon: ImageView
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navView: NavigationView
    private lateinit var adapter: TourPackageAdapter // Now correctly referencing the adapter in this package
    private var wishlist = WishlistManager.getWishlist() // Declare wishlist here to ensure it's available

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_destiantion_tours)

        drawerLayout = findViewById(R.id.drawer_layout)
        navView = findViewById(R.id.nav_view)
        menuIcon = findViewById(R.id.menu_icon)
        recyclerView = findViewById(R.id.tourRecyclerView)
        recyclerView.layoutManager = GridLayoutManager(this, 1)

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

        val destinationId = intent.getIntExtra("destination_id", -1)
        if (destinationId != -1) {
            fetchTourPackages(destinationId)
        } else {
            Toast.makeText(this, "Invalid destination", Toast.LENGTH_SHORT).show()
        }
    }

    private fun fetchTourPackages(destinationId: Int) {
        val apiService = RetrofitClient.instance
        val call = apiService.getTourPackagesByDestination(destinationId)

        call.enqueue(object : Callback<List<TourPackage>> {
            override fun onResponse(
                call: Call<List<TourPackage>>,
                response: Response<List<TourPackage>>
            ) {
                if (response.isSuccessful && response.body() != null) {
                    val tourPackages = response.body()!!

                    // Re-fetch the updated wishlist first
                    wishlist = WishlistManager.getWishlist()

                    // Set up the adapter after fetching the wishlist
                    adapter = TourPackageAdapter(
                        tourPackages,
                        wishlist,
                        context = this@DestinationToursActivity,
                        onWishlistClick = { tourPackage ->
                            // Handle wishlist action
                            if (wishlist.contains(tourPackage.id)) {
                                WishlistManager.removeFromWishlist(tourPackage.id)
                            } else {
                                WishlistManager.addToWishlist(tourPackage.id)
                            }

                            // Re-fetch the updated wishlist
                            wishlist = WishlistManager.getWishlist()

                            // Update the adapter with the new wishlist
                            adapter.setWishlist(wishlist)
                        }
                    )

                    // Set the adapter to the RecyclerView
                    recyclerView.adapter = adapter
                } else {
                    Toast.makeText(this@DestinationToursActivity, "No packages found", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<TourPackage>>, t: Throwable) {
                Toast.makeText(this@DestinationToursActivity, "Error: ${t.message}", Toast.LENGTH_LONG).show()
            }
        })
    }


    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }
}