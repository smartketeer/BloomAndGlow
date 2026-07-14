import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCart } from '../Contexts/CartContext';
import { Link } from '@inertiajs/react';

export default function CartDrawer({ getImageUrl }) {
    const { 
        cartItems, 
        isCartOpen, 
        closeCartDrawer, 
        updateQuantity, 
        removeFromCart, 
        addToCart,
        cartSubtotal 
    } = useCart();

    const [recommendations, setRecommendations] = useState([]);
    const [loadingRecs, setLoadingRecs] = useState(false);

    // Fetch Apriori recommendations whenever the cart changes
    useEffect(() => {
        if (cartItems.length === 0) {
            setRecommendations([]);
            return;
        }

        // Use the most recently added item (last in the array)
        const lastItem = cartItems[cartItems.length - 1];
        const productId = lastItem.product_id;

        setLoadingRecs(true);
        axios.get(`/api/recommendations/${productId}`)
            .then((res) => {
                // Filter out products already in the cart
                const cartProductIds = cartItems.map(i => i.product_id);
                const filtered = res.data.filter(r => !cartProductIds.includes(r.product_id));
                setRecommendations(filtered.slice(0, 3));
            })
            .catch((err) => {
                console.error('Failed to fetch recommendations:', err);
                setRecommendations([]);
            })
            .finally(() => setLoadingRecs(false));
    }, [cartItems]);

    return (
        <>
            {/* Backdrop */}
            <div 
                className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={closeCartDrawer}
            />

            {/* Drawer */}
            <div 
                className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-serif text-2xl font-bold text-sage-dark">Your Cart</h2>
                    <button 
                        onClick={closeCartDrawer}
                        className="p-2 text-gray-400 hover:text-tangerine transition-colors rounded-full"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                    {cartItems.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500">
                            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                            <p className="text-lg">Your cart is empty.</p>
                            <button 
                                onClick={closeCartDrawer}
                                className="mt-6 px-6 py-2 border border-sage text-sage font-semibold rounded-full hover:bg-sage hover:text-white transition-colors"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <>
                            <ul className="space-y-6">
                                {cartItems.map((item) => (
                                    <li key={item.product_id} className="flex items-center gap-4">
                                        <img 
                                            src={getImageUrl(item.flower_name)} 
                                            alt={item.flower_name} 
                                            className="w-20 h-20 object-cover rounded-xl shadow-sm border border-gray-100"
                                        />
                                        <div className="flex-1">
                                            <h3 className="font-bold text-sm text-gray-800 uppercase">{item.flower_name}</h3>
                                            <p className="text-tangerine font-semibold mt-1">${item.price}</p>
                                            
                                            <div className="flex items-center mt-3 bg-gray-50 rounded-full w-min border border-gray-200">
                                                <button 
                                                    onClick={() => updateQuantity(item.product_id, -1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-tangerine transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                                                <button 
                                                    onClick={() => updateQuantity(item.product_id, 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-tangerine transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => removeFromCart(item.product_id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                        </button>
                                    </li>
                                ))}
                            </ul>

                            {/* Frequently Bought Together — Apriori Recommendations */}
                            {recommendations.length > 0 && (
                                <div className="mt-8 pt-6 border-t border-dashed border-peach-dark/40">
                                    <div className="flex items-center gap-2 mb-4">
                                        <svg className="w-5 h-5 text-tangerine" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                        <h3 className="font-serif text-base font-bold text-sage-dark">Frequently Bought Together</h3>
                                    </div>
                                    <ul className="space-y-3">
                                        {recommendations.map((rec) => (
                                            <li key={rec.product_id} className="flex items-center gap-3 bg-peach-light/50 rounded-xl p-3 border border-peach-dark/20 transition-all hover:shadow-sm">
                                                <img 
                                                    src={getImageUrl(rec.flower_name)} 
                                                    alt={rec.flower_name}
                                                    className="w-12 h-12 object-cover rounded-lg shadow-sm"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="text-xs font-bold text-gray-800 uppercase truncate">{rec.flower_name}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-tangerine font-semibold text-sm">${rec.price}</span>
                                                        <span className="text-[10px] text-gray-400 font-medium bg-white px-1.5 py-0.5 rounded-full">{Math.round(rec.confidence * 100)}% match</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => addToCart({ product_id: rec.product_id, flower_name: rec.flower_name, price: rec.price })}
                                                    className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-sage hover:bg-sage-dark text-white text-xs font-bold rounded-full transition-colors shadow-sm"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                                    Add
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                {cartItems.length > 0 && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-600 font-medium">Subtotal</span>
                            <span className="font-bold text-xl text-sage-dark">${cartSubtotal.toFixed(2)}</span>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                        <Link href="/checkout" className="block text-center w-full py-4 bg-sage hover:bg-sage-dark text-white font-bold rounded-full transition-colors shadow-lg">
                            PROCEED TO CHECKOUT
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
