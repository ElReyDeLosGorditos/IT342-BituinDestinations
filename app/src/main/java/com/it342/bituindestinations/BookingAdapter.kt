package com.it342.bituindestinations

import android.content.Context
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import android.widget.Toast
import androidx.recyclerview.widget.RecyclerView
import com.it342.bituindestinations.model.Booking

class BookingAdapter(
    private val bookings: List<Booking>,
    private val onItemClick: (Booking) -> Unit // Click listener for each booking
) {

}