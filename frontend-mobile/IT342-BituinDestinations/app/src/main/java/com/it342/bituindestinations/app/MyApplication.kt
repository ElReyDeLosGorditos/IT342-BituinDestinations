package com.it342.bituindestinations.app

import android.app.Application
import android.util.Log

class MyApplication : Application() {

    var email: String = ""
    var userId: Int = 0
    var password: String = ""
    var name: String = ""
    var authToken: String? = null

    override fun onCreate() {
        super.onCreate()
        Log.e("Trial", "MyApp is called")
    }
}