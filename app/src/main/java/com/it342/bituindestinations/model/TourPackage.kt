package com.it342.bituindestinations.model

import android.os.Parcel
import android.os.Parcelable

data class TourPackage(
    val id: Int,
    val title: String,
    val description: String?,
    val agenda: String?,
    val price: Double,
    val duration: String,
    val availableSlots: Int,
    val startDate: String,
    val endDate: String,
    val destination: Destination // This is the Destination object
) : Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readInt(),
        parcel.readString() ?: "",
        parcel.readString(),
        parcel.readString(),
        parcel.readDouble(),
        parcel.readString() ?: "",
        parcel.readInt(),
        parcel.readString() ?: "",
        parcel.readString() ?: "",
        parcel.readParcelable(Destination::class.java.classLoader) ?: Destination(0, "", "", "", "", "", "") // Default value for the destination
    )

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeInt(id)
        parcel.writeString(title)
        parcel.writeString(description)
        parcel.writeString(agenda)
        parcel.writeDouble(price)
        parcel.writeString(duration)
        parcel.writeInt(availableSlots)
        parcel.writeString(startDate)
        parcel.writeString(endDate)
        parcel.writeParcelable(destination, flags) // Pass the destination object
    }

    override fun describeContents(): Int {
        return 0
    }

    companion object CREATOR : Parcelable.Creator<TourPackage> {
        override fun createFromParcel(parcel: Parcel): TourPackage {
            return TourPackage(parcel)
        }

        override fun newArray(size: Int): Array<TourPackage?> {
            return arrayOfNulls(size)
        }
    }
}