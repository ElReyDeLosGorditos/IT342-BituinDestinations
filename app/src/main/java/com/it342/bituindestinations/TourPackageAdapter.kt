package com.it342.bituindestinations

import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.it342.bituindestinations.model.TourPackage

class TourPackageAdapter(
    private var tourPackages: List<TourPackage>,
    private var wishlist: Set<Int>,
    private val context: Context, // Add context to start new activity
    private val onWishlistClick: (TourPackage) -> Unit
) : RecyclerView.Adapter<TourPackageAdapter.TourPackageViewHolder>() {

    inner class TourPackageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        val title: TextView = itemView.findViewById(R.id.tourPackageTitle)
        val description: TextView = itemView.findViewById(R.id.tourPackageDescription)
        val agenda: TextView = itemView.findViewById(R.id.tourPackageAgenda)
        val price: TextView = itemView.findViewById(R.id.tourPackagePrice)
        val wishlistIcon: ImageView = itemView.findViewById(R.id.wishlistIcon)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TourPackageViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_tour_package, parent, false)
        return TourPackageViewHolder(view)
    }

    override fun onBindViewHolder(holder: TourPackageViewHolder, position: Int) {
        val item = tourPackages[position]
        holder.title.text = item.title
        holder.description.text = item.description ?: "No description"
        holder.agenda.text = item.agenda ?: "No agenda"
        holder.price.text = "₱%.2f".format(item.price)

        val isWishlisted = wishlist.contains(item.id)
        holder.wishlistIcon.setImageResource(
            if (isWishlisted) R.drawable.ic_heart_filled else R.drawable.ic_heart_outline
        )

        // Handle wishlist icon click
        holder.wishlistIcon.setOnClickListener {
            onWishlistClick(item)  // Trigger the wishlist action
        }

        // Handle package item click to navigate to BookingActivity
        holder.itemView.setOnClickListener {
            // Pass the TourPackage data to BookingActivity
            val intent = Intent(context, ToursActivity::class.java)

            // Create a Bundle to hold the TourPackage data
            val bundle = Bundle().apply {
                putInt("id", item.id)
                putString("title", item.title)
                putString("description", item.description)
                putString("agenda", item.agenda)
                putDouble("price", item.price)
                putString("duration", item.duration)
                putInt("availableSlots", item.availableSlots)
                putString("startDate", item.startDate)
                putString("endDate", item.endDate)

                // Null-safe destination handling
                item.destination?.let {
                    putString("destinationName", it.destinationName)
                    putString("destinationDescription", it.destinationDescription)
                }
            }

            // Attach the Bundle to the Intent
            intent.putExtras(bundle)

            // Start the BookingActivity
            context.startActivity(intent)
        }
    }

    override fun getItemCount() = tourPackages.size

    fun setWishlist(newWishlist: Set<Int>) {
        wishlist = newWishlist
        notifyDataSetChanged()
    }

    fun updateList(newTourPackages: List<TourPackage>) {
        tourPackages = newTourPackages
        notifyDataSetChanged()
    }
}