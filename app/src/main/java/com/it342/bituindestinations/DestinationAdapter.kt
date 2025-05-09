package com.it342.bituindestinations

import android.content.Intent
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.it342.bituindestinations.model.Destination

class DestinationAdapter(
    private var destinations: MutableList<Destination>,
    private val onItemClick: (Destination) -> Unit,
    private val displayMode: String // "home" or "wishlist"
) : RecyclerView.Adapter<RecyclerView.ViewHolder>() {

    companion object {
        private const val BASE_URL = "https://it342-bituindestinations-qrwd.onrender.com"
        private const val VIEW_TYPE_DESTINATION = 0
    }

    // ViewHolder for Homepage items
    inner class DestinationViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val image: ImageView = view.findViewById(R.id.destinationImage)
        val name: TextView = view.findViewById(R.id.destinationName)
        val description: TextView = view.findViewById(R.id.destinationDescription)
        // Removed wishlistIcon from here since it's no longer needed
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return when (viewType) {
            VIEW_TYPE_DESTINATION -> {
                val view = LayoutInflater.from(parent.context).inflate(R.layout.item_destination, parent, false)
                DestinationViewHolder(view)
            }
            else -> {
                // You could return a different ViewHolder here if needed for other types
                val view = LayoutInflater.from(parent.context).inflate(R.layout.item_destination, parent, false)
                DestinationViewHolder(view)
            }
        }
    }

    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val destination = destinations[position]
        val imageUrl = "$BASE_URL/uploads/${destination.destinationImage}"

        if (holder is DestinationViewHolder) {
            holder.name.text = destination.destinationName
            holder.description.text = destination.destinationDescription

            Glide.with(holder.itemView.context)
                .load(imageUrl)
                .error(R.drawable.ic_placeholder)
                .into(holder.image)

            holder.itemView.setOnClickListener {
                // Navigate to DestinationToursActivity when a destination is clicked
                onItemClick(destination)
            }
        }
    }

    override fun getItemCount(): Int = destinations.size

    override fun getItemViewType(position: Int): Int {
        return VIEW_TYPE_DESTINATION
    }

    // New method to update the list in the adapter
    fun updateList(newDestinations: List<Destination>) {
        destinations.clear()
        destinations.addAll(newDestinations)
        notifyDataSetChanged() // Notify the adapter to update the UI
    }
}