import React from 'react';

function Wishlist({ items, removeFromWishlist }) {
    return (
        <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Wishlist</h2>
            {items.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>Your wishlist is empty.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-gray-50 rounded-lg shadow-md p-4 hover:shadow-lg transition"
                        >
                            <img
                                src={item.image || '/placeholder-image.jpg'}
                                alt={item.name}
                                className="w-full h-40 object-cover rounded-md mb-4"
                            />
                            <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                            <p className="text-sm text-gray-600 mb-4">{item.description}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-indigo-600 font-medium">
                                    ₱{item.price.toLocaleString()}
                                </span>
                                <button
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="text-red-500 hover:text-red-600 text-sm font-medium"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;