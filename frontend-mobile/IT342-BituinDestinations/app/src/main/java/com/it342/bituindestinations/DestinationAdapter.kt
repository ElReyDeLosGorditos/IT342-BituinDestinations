package com.it342.bituindestinations

import android.graphics.drawable.Drawable
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageView
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import com.bumptech.glide.load.engine.GlideException
import com.it342.bituindestinations.model.Destination
import com.bumptech.glide.load.resource.drawable.DrawableTransitionOptions
import com.bumptech.glide.request.RequestListener
import com.bumptech.glide.request.target.Target
import com.bumptech.glide.load.DataSource

class DestinationAdapter(
    private val destinations: List<Destination>,
    private val onItemClick: (Destination) -> Unit // Add this parameter
) : RecyclerView.Adapter<DestinationAdapter.ViewHolder>() {

    companion object {
        private const val BASE_URL = "http://192.168.110.252:8080/"
    }

    class ViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val image: ImageView = view.findViewById(R.id.destinationImage)
        val name: TextView = view.findViewById(R.id.destinationName)
        val description: TextView = view.findViewById(R.id.destinationDescription)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_destination, parent, false)
        return ViewHolder(view)
    }

    override fun onBindViewHolder(holder: ViewHolder, position: Int) {
        val destination = destinations[position]
        holder.name.text = destination.destinationName
        holder.description.text = destination.destinationDescription

        val imageUrl = "${BASE_URL}uploads/${destination.destinationImage}"
        Glide.with(holder.itemView.context)
            .load(imageUrl)
            .into(holder.image)

        // Handle item click
        holder.itemView.setOnClickListener {
            onItemClick(destination)
        }
    }

    override fun getItemCount() = destinations.size
}