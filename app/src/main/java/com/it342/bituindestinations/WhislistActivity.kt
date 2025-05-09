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

class WhislistActivity : Activity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var adapter: TourPackageAdapter // Use the TourPackageAdapter
    private lateinit var menuIcon: ImageView
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navView: NavigationView
    private lateinit var allTourPackages: MutableList<TourPackage> // Use TourPackage list

    private val wishlist: MutableSet<Int> = WishlistManager.getWishlist() // Assuming the wishlist stores TourPackage IDs

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_whislist)

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
                R.id.nav_booking -> startActivity(Intent(this, SeeBookingsActivity::class.java).apply {
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

        recyclerView = findViewById(R.id.wishlistRecyclerView)
        recyclerView.layoutManager = GridLayoutManager(this, 1)

        // Fetch tour packages and update wishlist
        fetchTourPackages()
    }

    private fun fetchTourPackages() {
        val apiService = RetrofitClient.instance
        apiService.getAllTourPackages().enqueue(object : Callback<List<TourPackage>> {
            override fun onResponse(call: Call<List<TourPackage>>, response: Response<List<TourPackage>>) {
                if (response.isSuccessful) {
                    allTourPackages = response.body()?.toMutableList() ?: mutableListOf()

                    // Filter tour packages that are in the wishlist
                    val wishlistedTourPackages = allTourPackages.filter { wishlist.contains(it.id) }

                    // Pass the filtered list to the adapter, and provide the required parameters
                    adapter = TourPackageAdapter(
                        wishlistedTourPackages, // Only show tour packages in the wishlist
                        wishlist, // Wishlist set to track wishlisted tour packages
                        this@WhislistActivity, // ✅ Pass context here
                        onWishlistClick = { tourPackage -> // Wishlist item click handling
                            // Handle wishlist toggle for individual tours
                            if (wishlist.contains(tourPackage.id)) {
                                WishlistManager.removeFromWishlist(tourPackage.id)
                            } else {
                                WishlistManager.addToWishlist(tourPackage.id)
                            }

                            // Update wishlist and adapter
                            val updatedWishlist = WishlistManager.getWishlist()
                            val updatedList = allTourPackages.filter { updatedWishlist.contains(it.id) }
                            adapter.updateList(updatedList) // Update the displayed list
                        }
                    )

                    recyclerView.adapter = adapter
                } else {
                    Toast.makeText(this@WhislistActivity, "Failed to load tour packages", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<TourPackage>>, t: Throwable) {
                Toast.makeText(this@WhislistActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
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