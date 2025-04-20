package com.it342.bituindestinations.app

import android.app.Application
import android.util.Log

class MyApplication : Application() {

    var email: String = ""
    var password: String = ""

    override fun onCreate() {
        super.onCreate()
        Log.e("Trial", "MyApp is called")
    }
}