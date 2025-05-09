package com.it342.bituindestinations.utils

import android.content.Context
import android.content.SharedPreferences

object WishlistManager {
    private const val PREF_NAME = "wishlist_prefs"
    private const val KEY_WISHLIST = "wishlist_ids"
    private lateinit var prefs: SharedPreferences

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    }

    fun getWishlist(): MutableSet<Int> {
        val set = prefs.getStringSet(KEY_WISHLIST, emptySet()) ?: emptySet()
        return set.mapNotNull { it.toIntOrNull() }.toMutableSet()
    }

    fun addToWishlist(id: Int) {
        val set = getWishlist()
        set.add(id)
        saveWishlist(set)
    }

    fun removeFromWishlist(id: Int) {
        val set = getWishlist()
        set.remove(id)
        saveWishlist(set)
    }

    fun isWishlisted(id: Int): Boolean {
        return getWishlist().contains(id)
    }

    private fun saveWishlist(set: Set<Int>) {
        val stringSet = set.map { it.toString() }.toSet()
        prefs.edit().putStringSet(KEY_WISHLIST, stringSet).apply()
    }
}