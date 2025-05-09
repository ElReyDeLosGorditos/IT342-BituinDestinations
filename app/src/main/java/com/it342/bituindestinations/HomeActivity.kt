package com.it342.bituindestinations

import android.app.Activity
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.view.inputmethod.EditorInfo
import android.widget.EditText
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
import com.it342.bituindestinations.model.Destination
import com.it342.bituindestinations.utils.WishlistManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class HomeActivity : Activity() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var menuIcon: ImageView
    private lateinit var drawerLayout: DrawerLayout
    private lateinit var navView: NavigationView
    private lateinit var searchEditText: EditText // Add this line
    private lateinit var originalDestinations: List<Destination> // To hold the original data
    private lateinit var adapter: DestinationAdapter // Declare the adapter here
    private var allDestinations: MutableList<Destination> = mutableListOf()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_home)

        recyclerView = findViewById(R.id.destinationRecyclerView)
        recyclerView.layoutManager = GridLayoutManager(this, 2)

        menuIcon = findViewById(R.id.menu_icon)
        drawerLayout = findViewById(R.id.drawer_layout)
        navView = findViewById(R.id.nav_view)
        searchEditText = findViewById(R.id.searchEditText) // Initialize searchEditText

        val headerView = navView.getHeaderView(0) // Assuming the header is the first view

        // Find the userNameTextView within the header view
        val userNameTextView: TextView? = headerView.findViewById(R.id.userNameTextView)

        // Retrieve the username from the Intent
        val userName = intent.getStringExtra("name")

        // Set the username in the header TextView if it exists and is not empty
        userNameTextView?.let {
            if (!userName.isNullOrEmpty()) {
                it.text = "SETTINGS"
            } else {
                it.text = "SETTINGS"
            }
        }

        menuIcon.setOnClickListener {
            drawerLayout.openDrawer(GravityCompat.START)
        }

        navView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_home -> {
                    val intent = Intent(this, HomeActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
                R.id.nav_whislist -> {
                    val intent = Intent(this, WhislistActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
                R.id.nav_booking -> {
                    val intent = Intent(this, SeeBookingsActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
                R.id.nav_logout -> {
                    (application as MyApplication).email = ""
                    (application as MyApplication).password = ""

                    val intent = Intent(this, LoginActivity::class.java)
                    intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK
                    startActivity(intent)
                    finish()
                }
            }
            true
        }

        fetchDestinations()

        // Set up the search functionality
        searchEditText.setOnEditorActionListener { _, actionId, _ ->
            if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                val query = searchEditText.text.toString().trim()
                filterDestinations(query)
                true // Indicate that the action has been handled
            } else {
                false
            }
        }
    }

    override fun onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }

    private fun fetchDestinations() {
        val apiService = RetrofitClient.instance
        apiService.getDestinations().enqueue(object : Callback<List<Destination>> {
            override fun onResponse(call: Call<List<Destination>>, response: Response<List<Destination>>) {
                if (response.isSuccessful) {
                    originalDestinations = response.body() ?: emptyList()
                    Log.d("HomeActivity", "Destinations: $originalDestinations")

                    // Convert the initial list to MutableList here
                    val mutableOriginalDestinations = originalDestinations.toMutableList()

                    allDestinations.clear()
                    allDestinations.addAll(response.body() ?: emptyList())

                    // Remove wishlist logic from adapter and just show the destinations
                    adapter = DestinationAdapter(
                        allDestinations,
                        onItemClick = { destination ->
                            // Open DestinationToursActivity and pass the destination_id
                            val intent = Intent(this@HomeActivity, DestinationToursActivity::class.java)
                            intent.putExtra("destination_id", destination.id)  // Pass the destination ID
                            startActivity(intent)
                        },
                        displayMode = "home" // No wishlist, just display destinations
                    )
                    recyclerView.adapter = adapter
                } else {
                    Toast.makeText(this@HomeActivity, "Failed to load data", Toast.LENGTH_SHORT).show()
                }
            }

            override fun onFailure(call: Call<List<Destination>>, t: Throwable) {
                Toast.makeText(this@HomeActivity, "Error: ${t.message}", Toast.LENGTH_SHORT).show()
            }
        })
    }

    private fun filterDestinations(query: String) {
        val filteredList = originalDestinations.filter {
            it.destinationName.contains(query, ignoreCase = true)
        }
        if (::adapter.isInitialized) {
            adapter.updateList(filteredList) // Use the updateList function
        }
    }
}