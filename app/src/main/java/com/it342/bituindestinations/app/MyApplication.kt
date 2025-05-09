package com.it342.bituindestinations.app

import android.app.Application
import android.util.Log
import com.it342.bituindestinations.utils.WishlistManager

class MyApplication : Application() {

    var email: String = ""
    var userId: Int? = null
    var password: String = ""
    var name: String = ""
    var role: String = "USER"

    override fun onCreate() {
        super.onCreate()
        Log.e("Trial", "MyApp is called")
        WishlistManager.init(this)
    }
}