import React, { useState } from 'react';
import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import { useCart } from '../Contexts/CartContext';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet icons in React
/*
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});
*/

// Map click event handler component
function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });
    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

// Component to programmatically fly the map to the new position
function MapUpdater({ position }) {
    const map = useMap();
    React.useEffect(() => {
        if (position) {
            map.flyTo(position, 15);
        }
    }, [position, map]);
    return null;
}

export default function Checkout() {
    const { cartItems, cartSubtotal, cartCount, clearCart } = useCart();
    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [formData, setFormData] = useState({ name: '', phone: '', notes: '' });

    const getImageUrl = (name) => {
        const map = {
            "Red Roses Bouquet": "/images/red_roses_white_center_bouquet.png",
            "Sunflowers": "/images/money_bouquet_sunflower.png",
            "Carnations": "/images/colorful_carnation_rose_bouquet.png",
            "White Lilies": "/images/pink_lily_and_roses_bouquet.png",
            "Chrysanthemums": "/images/white_lisianthus_bouquet_1.png",
            "Peonies": "/images/pink_roses_chantelle_collection.png"
        };
        return map[name] || "/images/large_pink_rose_bouquet.png";
    };

    const handleLocateMe = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                setDeliveryLocation({ lat: latitude, lng: longitude });
            },
            (error) => {
                alert('Unable to retrieve your location. Please check your browser permissions.');
                console.error(error);
            }
        );
    };

    const handleConfirmOrder = async (e) => {
        e.preventDefault();
        if (!deliveryLocation) {
            alert("Please drop a pin on the map for your delivery location.");
            return;
        }

        try {
            const response = await axios.post('/checkout', {
                cartItems,
                deliveryLocation,
                name: formData.name,
                phone: formData.phone,
                notes: formData.notes
            });
            if (response.status === 200) {
                clearCart();
                setIsOrderPlaced(true);
            }
        } catch (error) {
            alert("Failed to place order: " + (error.response?.data?.error || error.message));
        }
    };

    return (
        <>
            <Head title="Checkout - Bloom&Grow" />
            <div className="min-h-screen bg-peach text-gray-800 font-sans">
                {isOrderPlaced ? (
                    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
                        <div className="w-24 h-24 bg-sage rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        <h1 className="font-serif text-4xl font-bold text-sage-dark mb-4">Thank You!</h1>
                        <p className="text-gray-600 text-lg mb-8">Your order has been placed successfully and will be delivered to your pinned location soon.</p>
                        <Link href="/" className="px-8 py-3 bg-sage hover:bg-sage-dark text-white font-semibold rounded-full transition-colors">
                            Back to Home
                        </Link>
                    </div>
                ) : (
                <>
                {/* Header */}
                <header className="px-6 md:px-12 py-6 border-b border-peach-dark/30 bg-white">
                    <div className="flex items-center justify-between max-w-7xl mx-auto">
                        <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-sage-dark">
                            Bloom&Grow
                        </Link>
                        <div className="text-gray-500 text-sm font-semibold">
                            CHECKOUT
                        </div>
                    </div>
                </header>

                <main className="max-w-7xl mx-auto px-6 md:px-12 py-12">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {/* Left Column: Delivery Details & Map */}
                        <div className="flex-1 space-y-8">
                            <section>
                                <h2 className="font-serif text-2xl font-bold text-sage-dark mb-6">Delivery Details</h2>
                                <form className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                            <input 
                                                type="text"
                                                value={formData.name}
                                                onChange={e => setFormData({...formData, name: e.target.value})}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-sage focus:ring-sage"
                                                placeholder="Jane Doe"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                            <input 
                                                type="tel"
                                                value={formData.phone}
                                                onChange={e => setFormData({...formData, phone: e.target.value})}
                                                className="w-full rounded-md border-gray-300 shadow-sm focus:border-sage focus:ring-sage"
                                                placeholder="+63 912 345 6789"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address Notes</label>
                                        <textarea
                                            value={formData.notes}
                                            onChange={e => setFormData({...formData, notes: e.target.value})}
                                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-sage focus:ring-sage" 
                                            rows="3" 
                                            placeholder="E.g., Near the blue gate..."
                                        ></textarea>
                                    </div>
                                </form>
                            </section>

                            <section>
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <h2 className="font-serif text-2xl font-bold text-sage-dark mb-1">Pin Location</h2>
                                        <p className="text-gray-500 text-sm">Click on the map or use your current location.</p>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleLocateMe}
                                        className="flex items-center px-4 py-2 bg-peach hover:bg-peach-dark text-sage-dark font-semibold rounded-full transition-colors text-sm border border-peach-dark shadow-sm"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                        Locate Me
                                    </button>
                                </div>
                                <div className="h-96 w-full rounded-2xl overflow-hidden shadow-md border border-peach-dark">
                                    <MapContainer 
                                        center={[6.6833, 125.3500]} 
                                        zoom={14} 
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <LocationMarker position={deliveryLocation} setPosition={setDeliveryLocation} />
                                        <MapUpdater position={deliveryLocation} />
                                    </MapContainer>
                                </div>
                                {deliveryLocation && (
                                    <p className="text-sm text-sage-dark mt-2 font-medium">
                                        Location pinned at: {deliveryLocation.lat.toFixed(4)}, {deliveryLocation.lng.toFixed(4)}
                                    </p>
                                )}
                            </section>
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:w-96">
                            <div className="bg-white rounded-3xl p-8 shadow-sm border border-peach-dark/30 sticky top-12">
                                <h2 className="font-serif text-2xl font-bold text-sage-dark mb-6">Order Summary</h2>
                                
                                {cartItems.length === 0 ? (
                                    <p className="text-gray-500 text-sm">Your cart is empty.</p>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
                                            {cartItems.map((item) => (
                                                <div key={item.product_id} className="flex gap-4">
                                                    <img 
                                                        src={getImageUrl(item.flower_name)} 
                                                        alt={item.flower_name}
                                                        className="w-16 h-16 object-cover rounded-lg"
                                                    />
                                                    <div className="flex-1">
                                                        <h3 className="font-bold text-sm text-gray-800 uppercase">{item.flower_name}</h3>
                                                        <div className="flex justify-between items-center mt-1">
                                                            <span className="text-gray-500 text-sm">Qty: {item.quantity}</span>
                                                            <span className="font-semibold text-tangerine">${(item.price * item.quantity).toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="border-t border-gray-100 pt-4 space-y-3">
                                            <div className="flex justify-between text-gray-500">
                                                <span>Subtotal ({cartCount} items)</span>
                                                <span>${cartSubtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-gray-500">
                                                <span>Shipping</span>
                                                <span>Calculated at next step</span>
                                            </div>
                                            <div className="flex justify-between font-bold text-lg text-sage-dark pt-2 border-t border-gray-100">
                                                <span>Total</span>
                                                <span>${cartSubtotal.toFixed(2)}</span>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleConfirmOrder}
                                            disabled={cartItems.length === 0}
                                            className="w-full py-4 mt-6 bg-sage hover:bg-sage-dark text-white font-bold rounded-full transition-colors shadow-md disabled:bg-gray-300 disabled:cursor-not-allowed"
                                        >
                                            CONFIRM ORDER
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
                </>
                )}
            </div>
        </>
    );
}
