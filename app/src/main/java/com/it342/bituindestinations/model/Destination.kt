package com.it342.bituindestinations.model

import android.os.Parcel
import android.os.Parcelable

data class Destination(
    val id: Int,
    val destinationName: String,
    val destinationDescription: String,
    val destinationType: String,
    val region: String,
    val destinationImage: String,  // This will be the image filename
    val destinationLocation: String
) : Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readInt(),
        parcel.readString() ?: "",
        parcel.readString() ?: "",
        parcel.readString() ?: "",
        parcel.readString() ?: "",
        parcel.readString() ?: "",
        parcel.readString() ?: ""
    )

    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeInt(id)
        parcel.writeString(destinationName)
        parcel.writeString(destinationDescription)
        parcel.writeString(destinationType)
        parcel.writeString(region)
        parcel.writeString(destinationImage)
        parcel.writeString(destinationLocation)
    }

    override fun describeContents(): Int = 0

    companion object {
        @JvmField
        val CREATOR = object : Parcelable.Creator<Destination> {
            override fun createFromParcel(parcel: Parcel): Destination {
                return Destination(parcel)
            }

            override fun newArray(size: Int): Array<Destination?> {
                return arrayOfNulls(size)
            }
        }
    }
}