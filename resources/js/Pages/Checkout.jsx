import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Head, Link } from '@inertiajs/react';
import { useCart } from '../Contexts/CartContext';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ── PSGC API base ───────────────────────────────────────────────────
const PSGC_API = 'https://psgc.gitlab.io/api';

// ── Leaflet helpers ─────────────────────────────────────────────────
function LocationMarker({ position, setPosition }) {
    useMapEvents({
        click(e) {
            setPosition(e.latlng);
        },
    });
    return position === null ? null : <Marker position={position} />;
}

function MapUpdater({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 15);
        }
    }, [position, map]);
    return null;
}

// ── Constants ───────────────────────────────────────────────────────
const TIME_OPTIONS = [
    'Select Time',
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM',
];

const ADD_ONS = [
    { id: 'card', label: 'Card/Message', icon: '✉' },
    { id: 'cake_tag', label: 'Cake Tag', icon: '🎂' },
    { id: 'balloon_sticker', label: 'Balloon Sticker', icon: '📍' },
    { id: 'note', label: 'Note', icon: '✏' },
];

// ── Main Component ──────────────────────────────────────────────────
export default function Checkout() {
    const { cartItems, cartSubtotal, cartCount, clearCart } = useCart();
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // ── Form State ──
    const [customer, setCustomer] = useState({ firstName: '', lastName: '', contact: '', email: '' });
    const [receiver, setReceiver] = useState({ firstName: '', lastName: '', contact: '', email: '' });
    const [sameAsSender, setSameAsSender] = useState(false);

    const [deliveryMethod, setDeliveryMethod] = useState('delivery');
    const [address, setAddress] = useState({
        regionCode: '', regionName: '',
        provinceCode: '', provinceName: '',
        cityCode: '', cityName: '',
        barangayCode: '', barangayName: '',
        street: '',
        landmark: '',
    });

    const [deliveryLocation, setDeliveryLocation] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [isLocating, setIsLocating] = useState(false);

    const [schedule, setSchedule] = useState({ date: '', time: '' });
    const [paymentMethod, setPaymentMethod] = useState('GCash');
    const [specialRequests, setSpecialRequests] = useState({ addOns: [], note: '' });
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // ── PSGC Dropdown Data ──
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);
    const [loadingRegions, setLoadingRegions] = useState(true);
    const [loadingProvinces, setLoadingProvinces] = useState(false);
    const [loadingCities, setLoadingCities] = useState(false);
    const [loadingBarangays, setLoadingBarangays] = useState(false);

    // ── Derived ──
    const shopName = cartItems.length > 0 ? (cartItems[0].shop_name || 'Bloom&Grow') : 'Bloom&Grow';
    const shippingFee = deliveryMethod === 'delivery' ? 50 : 0;
    const total = cartSubtotal + shippingFee;

    // ── Image map ──
    const getImageUrl = (name) => {
        const map = {
            "Red Roses Bouquet": "/images/red_roses_white_center_bouquet.png",
            "Sunflowers": "/images/money_bouquet_sunflower.png",
            "Carnations": "/images/colorful_carnation_rose_bouquet.png",
            "White Lilies": "/images/pink_lily_and_roses_bouquet.png",
            "Chrysanthemums": "/images/white_lisianthus_bouquet_1.png",
            "Peonies": "/images/pink_roses_chantelle_collection.png",
        };
        return map[name] || "/images/large_pink_rose_bouquet.png";
    };

    // ── Same-as-sender toggle ──
    useEffect(() => {
        if (sameAsSender) {
            setReceiver({ ...customer });
        }
    }, [sameAsSender, customer]);

    // ═══════════════════ PSGC CASCADING FETCHES ═══════════════════════

    // Fetch regions on mount
    useEffect(() => {
        setLoadingRegions(true);
        fetch(`${PSGC_API}/regions/`)
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                setRegions(sorted);

                // Auto-select Region XI (Davao Region)
                const davao = sorted.find(r => r.name.toLowerCase().includes('davao'));
                if (davao) {
                    setAddress(prev => ({ ...prev, regionCode: davao.code, regionName: davao.name }));
                }
            })
            .catch(() => setRegions([]))
            .finally(() => setLoadingRegions(false));
    }, []);

    // Fetch provinces when region changes
    useEffect(() => {
        if (!address.regionCode) { setProvinces([]); return; }
        setLoadingProvinces(true);
        setProvinces([]);
        setCities([]);
        setBarangays([]);
        fetch(`${PSGC_API}/regions/${address.regionCode}/provinces/`)
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                setProvinces(sorted);

                // Auto-select Davao Del Sur if in Davao region
                const davaoDS = sorted.find(p => p.name.toLowerCase().includes('davao del sur'));
                if (davaoDS && !address.provinceName) {
                    setAddress(prev => ({ ...prev, provinceCode: davaoDS.code, provinceName: davaoDS.name }));
                }
            })
            .catch(() => setProvinces([]))
            .finally(() => setLoadingProvinces(false));
    }, [address.regionCode]);

    // Fetch cities when province changes
    useEffect(() => {
        if (!address.provinceCode) { setCities([]); return; }
        setLoadingCities(true);
        setCities([]);
        setBarangays([]);
        fetch(`${PSGC_API}/provinces/${address.provinceCode}/cities-municipalities/`)
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                setCities(sorted);
            })
            .catch(() => setCities([]))
            .finally(() => setLoadingCities(false));
    }, [address.provinceCode]);

    // Fetch barangays when city changes
    useEffect(() => {
        if (!address.cityCode) { setBarangays([]); return; }
        setLoadingBarangays(true);
        setBarangays([]);
        fetch(`${PSGC_API}/cities-municipalities/${address.cityCode}/barangays/`)
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                setBarangays(sorted);
            })
            .catch(() => setBarangays([]))
            .finally(() => setLoadingBarangays(false));
    }, [address.cityCode]);

    // ── Cascading address handlers ──
    const handleRegionChange = (code) => {
        const region = regions.find(r => r.code === code);
        setAddress(prev => ({
            ...prev,
            regionCode: code, regionName: region?.name || '',
            provinceCode: '', provinceName: '',
            cityCode: '', cityName: '',
            barangayCode: '', barangayName: '',
        }));
    };

    const handleProvinceChange = (code) => {
        const province = provinces.find(p => p.code === code);
        setAddress(prev => ({
            ...prev,
            provinceCode: code, provinceName: province?.name || '',
            cityCode: '', cityName: '',
            barangayCode: '', barangayName: '',
        }));
    };

    const handleCityChange = (code) => {
        const city = cities.find(c => c.code === code);
        setAddress(prev => ({
            ...prev,
            cityCode: code, cityName: city?.name || '',
            barangayCode: '', barangayName: '',
        }));
    };

    const handleBarangayChange = (code) => {
        const brgy = barangays.find(b => b.code === code);
        setAddress(prev => ({
            ...prev,
            barangayCode: code, barangayName: brgy?.name || '',
        }));
    };

    // ── Toggle add-on ──
    const toggleAddOn = (id) => {
        setSpecialRequests(prev => ({
            ...prev,
            addOns: prev.addOns.includes(id)
                ? prev.addOns.filter(a => a !== id)
                : [...prev.addOns, id],
        }));
    };

    // ═══════════════════ REVERSE GEOCODING (NOMINATIM) ════════════════

    const reverseGeocode = useCallback(async (lat, lng) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en`,
                { headers: { 'User-Agent': 'BloomAndGrow-Checkout/1.0' } }
            );
            const data = await res.json();
            if (!data.address) return;

            const addr = data.address;

            // Map OSM address fields to PH equivalents safely
            const osmRegion = addr.region || '';
            const osmProvince = addr.state || addr.county || addr.state_district || '';
            const osmCity = addr.city || addr.town || addr.municipality || '';
            const osmBarangay = addr.suburb || addr.village || addr.quarter || addr.neighbourhood || '';
            const osmStreet = [addr.house_number, addr.road].filter(Boolean).join(' ');

            const safeMatch = (list, searchStr) => {
                if (!searchStr || !list) return null;
                const lowerSearch = searchStr.toLowerCase().replace(/[^a-z0-9]/g, '');
                if (!lowerSearch) return null;
                return list.find(item => {
                    const lowerItem = item.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                    return lowerItem.includes(lowerSearch) || lowerSearch.includes(lowerItem);
                });
            };

            let targetRegionCode = address.regionCode;
            let targetRegionName = address.regionName;
            let targetProvinceCode = '';
            let targetProvinceName = osmProvince;
            let targetCityCode = '';
            let targetCityName = osmCity;
            let targetBarangayCode = '';
            let targetBarangayName = osmBarangay;

            // 1. Match Region
            const matchedRegion = safeMatch(regions, osmRegion);
            if (matchedRegion) {
                targetRegionCode = matchedRegion.code;
                targetRegionName = matchedRegion.name;
            }

            // 2. Fetch and Match Province
            if (targetRegionCode) {
                try {
                    const provRes = await fetch(`${PSGC_API}/regions/${targetRegionCode}/provinces/`);
                    const provList = await provRes.json();
                    const matchedProv = safeMatch(provList, osmProvince);
                    if (matchedProv) {
                        targetProvinceCode = matchedProv.code;
                        targetProvinceName = matchedProv.name;

                        // 3. Fetch and Match City
                        const cityRes = await fetch(`${PSGC_API}/provinces/${targetProvinceCode}/cities-municipalities/`);
                        const cityList = await cityRes.json();
                        const matchedCity = safeMatch(cityList, osmCity);
                        if (matchedCity) {
                            targetCityCode = matchedCity.code;
                            targetCityName = matchedCity.name;

                            // 4. Fetch and Match Barangay
                            const brgyRes = await fetch(`${PSGC_API}/cities-municipalities/${targetCityCode}/barangays/`);
                            const brgyList = await brgyRes.json();
                            const matchedBrgy = safeMatch(brgyList, osmBarangay);
                            if (matchedBrgy) {
                                targetBarangayCode = matchedBrgy.code;
                                targetBarangayName = matchedBrgy.name;
                            }
                        }
                    }
                } catch (e) {
                    console.error("PSGC fetch failed during reverse geocode", e);
                }
            }

            // Set the complete address state at once
            // The existing useEffects will trigger based on the new codes and load the dropdown lists.
            setAddress(prev => ({
                ...prev,
                regionCode: targetRegionCode, regionName: targetRegionName,
                provinceCode: targetProvinceCode, provinceName: targetProvinceName,
                cityCode: targetCityCode, cityName: targetCityName,
                barangayCode: targetBarangayCode, barangayName: targetBarangayName,
                street: osmStreet || prev.street,
            }));
        } catch (err) {
            console.error('Reverse geocoding failed:', err);
        }
    }, [regions, address.regionCode, address.regionName]);

    // ── Use My Current Location (Auto-detect + reverse geocode) ──
    const handleAutoLocate = useCallback(() => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser.');
            return;
        }
        setIsLocating(true);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setDeliveryLocation(coords);
                setShowMap(true);
                await reverseGeocode(coords.lat, coords.lng);
                setIsLocating(false);
            },
            () => {
                alert('Unable to retrieve your location. Please check your browser permissions.');
                setIsLocating(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    }, [reverseGeocode]);

    // ── Pin Location on Map (just show the map) ──
    const handleShowMap = () => {
        setShowMap(true);
    };

    // ── Submit ──
    const handlePlaceOrder = async () => {
        if (!agreedToTerms) {
            alert('Please agree to the Terms of Service & Privacy Policy.');
            return;
        }
        if (cartItems.length === 0) {
            alert('Your cart is empty.');
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                cartItems,
                customer,
                receiver,
                deliveryMethod,
                address: deliveryMethod === 'delivery' ? {
                    region: address.regionName,
                    province: address.provinceName,
                    city: address.cityName,
                    barangay: address.barangayName,
                    street: address.street,
                    landmark: address.landmark,
                } : {},
                deliveryLocation: deliveryMethod === 'delivery' ? deliveryLocation : null,
                schedule,
                paymentMethod,
                specialRequests,
            };

            const response = await axios.post('/checkout', payload);
            if (response.status === 200) {
                clearCart();
                setIsOrderPlaced(true);
            }
        } catch (error) {
            alert('Failed to place order: ' + (error.response?.data?.error || error.message));
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Section header helper ──
    const SectionIcon = ({ children, color = 'text-rose' }) => (
        <span className={`${color} mr-2 text-lg`}>{children}</span>
    );

    // ── Loading spinner helper ──
    const Spinner = () => (
        <svg className="animate-spin w-4 h-4 text-rose inline-block ml-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
    );

    // ═══════════════════════ RENDER ═══════════════════════════════════
    if (isOrderPlaced) {
        return (
            <>
                <Head title="Order Confirmed — Bloom&Grow" />
                <div className="min-h-screen bg-peach flex items-center justify-center px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg w-full text-center">
                        <div className="w-20 h-20 bg-rose-light rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-gray-800 mb-3">Thank You!</h1>
                        <p className="text-gray-500 mb-8">Your order has been placed successfully. We'll get your flowers ready!</p>
                        <Link href="/" className="inline-block px-8 py-3 bg-rose hover:bg-rose-dark text-white font-bold rounded-full transition-colors shadow-md">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Head title="Checkout — Bloom&Grow" />
            <div className="min-h-screen bg-[#faf5f0] font-sans">

                {/* ── Header ── */}
                <header className="bg-white border-b border-peach-dark/30">
                    <div className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between">
                        <Link href="/" className="font-serif text-3xl font-bold tracking-tight text-sage-dark">Bloom&amp;Grow</Link>
                        <div className="text-gray-500 text-sm font-semibold tracking-wider">CHECKOUT</div>
                    </div>
                </header>

                {/* ── Main Container ── */}
                <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px]">

                            {/* ════════════════ LEFT COLUMN ════════════════ */}
                            <div className="p-6 md:p-10 space-y-8 border-r border-gray-100">

                                {/* Header */}
                                <div>
                                    <h1 className="font-serif text-3xl font-bold text-gray-800">Checkout</h1>
                                    <p className="text-sm text-gray-500 mt-1">Ordering from <span className="font-semibold text-rose">{shopName}</span></p>
                                </div>

                                {/* ── 1. Customer Info ── */}
                                <section className="border border-gray-200 rounded-xl p-5 space-y-4">
                                    <h2 className="flex items-center font-bold text-gray-800 text-base">
                                        <SectionIcon>👤</SectionIcon>
                                        Customer Information
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">First Name</label>
                                            <input type="text" value={customer.firstName} onChange={e => setCustomer({ ...customer, firstName: e.target.value })} placeholder="Juan" className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Last Name</label>
                                            <input type="text" value={customer.lastName} onChange={e => setCustomer({ ...customer, lastName: e.target.value })} placeholder="Dela Cruz" className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Contact Number</label>
                                            <input type="tel" value={customer.contact} onChange={e => setCustomer({ ...customer, contact: e.target.value })} placeholder="09XX XXX XXXX" className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Email (Optional)</label>
                                            <input type="email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} placeholder="email@example.com" className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose" />
                                        </div>
                                    </div>
                                </section>

                                {/* ── 2. Receiver Info ── */}
                                <section className="border border-gray-200 rounded-xl p-5 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h2 className="flex items-center font-bold text-gray-800 text-base">
                                            <SectionIcon>👥</SectionIcon>
                                            Receiver Information
                                        </h2>
                                        <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer select-none">
                                            <input type="checkbox" checked={sameAsSender} onChange={e => setSameAsSender(e.target.checked)} className="rounded border-gray-300 text-rose focus:ring-rose w-4 h-4" />
                                            <span>Same as sender</span>
                                        </label>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">First Name</label>
                                            <input type="text" value={receiver.firstName} onChange={e => !sameAsSender && setReceiver({ ...receiver, firstName: e.target.value })} readOnly={sameAsSender} placeholder="Juan" className={`w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose ${sameAsSender ? 'bg-gray-50 text-gray-400' : ''}`} />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Last Name</label>
                                            <input type="text" value={receiver.lastName} onChange={e => !sameAsSender && setReceiver({ ...receiver, lastName: e.target.value })} readOnly={sameAsSender} placeholder="Dela Cruz" className={`w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose ${sameAsSender ? 'bg-gray-50 text-gray-400' : ''}`} />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Contact Number</label>
                                            <input type="tel" value={receiver.contact} onChange={e => !sameAsSender && setReceiver({ ...receiver, contact: e.target.value })} readOnly={sameAsSender} placeholder="09XX XXX XXXX" className={`w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose ${sameAsSender ? 'bg-gray-50 text-gray-400' : ''}`} />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Email (Optional)</label>
                                            <input type="email" value={receiver.email} onChange={e => !sameAsSender && setReceiver({ ...receiver, email: e.target.value })} readOnly={sameAsSender} placeholder="email@example.com" className={`w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose ${sameAsSender ? 'bg-gray-50 text-gray-400' : ''}`} />
                                        </div>
                                    </div>
                                </section>

                                {/* ── 3. Delivery Details ── */}
                                <section className="border border-gray-200 rounded-xl p-5 space-y-5">
                                    <h2 className="flex items-center font-bold text-gray-800 text-base">
                                        <SectionIcon>📍</SectionIcon>
                                        Delivery Details
                                    </h2>

                                    {/* Toggle Cards */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setDeliveryMethod('delivery')}
                                            className={`relative flex flex-col items-center justify-center py-6 rounded-xl border-2 transition-all ${deliveryMethod === 'delivery' ? 'border-rose bg-rose-light' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                        >
                                            <svg className={`w-6 h-6 mb-2 ${deliveryMethod === 'delivery' ? 'text-rose' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                                            <span className={`font-bold text-sm ${deliveryMethod === 'delivery' ? 'text-rose' : 'text-gray-600'}`}>Delivery</span>
                                            <span className={`text-xs mt-0.5 ${deliveryMethod === 'delivery' ? 'text-rose-dark' : 'text-gray-400'}`}>From ₱50</span>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDeliveryMethod('pickup')}
                                            className={`relative flex flex-col items-center justify-center py-6 rounded-xl border-2 transition-all ${deliveryMethod === 'pickup' ? 'border-rose bg-rose-light' : 'border-gray-200 bg-white hover:border-gray-300'}`}
                                        >
                                            <svg className={`w-6 h-6 mb-2 ${deliveryMethod === 'pickup' ? 'text-rose' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                            <span className={`font-bold text-sm ${deliveryMethod === 'pickup' ? 'text-rose' : 'text-gray-600'}`}>Pick-up</span>
                                            <span className={`text-xs mt-0.5 ${deliveryMethod === 'pickup' ? 'text-rose-dark' : 'text-gray-400'}`}>Free</span>
                                        </button>
                                    </div>

                                    {/* Helper text */}
                                    <div className="flex items-start gap-2 text-xs text-gray-500 bg-rose-light/40 rounded-lg px-3 py-2">
                                        <svg className="w-4 h-4 text-rose flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        <span>Base delivery fee of <strong>₱50</strong> applies to Poblacion. Additional fees may apply for other areas.</span>
                                    </div>

                                    {/* ── DELIVERY view ── */}
                                    {deliveryMethod === 'delivery' && (
                                        <div className="space-y-4">
                                            {/* Address Dropdowns — Real PSGC data */}
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                                        Region {loadingRegions && <Spinner />}
                                                    </label>
                                                    <select
                                                        value={address.regionCode}
                                                        onChange={e => handleRegionChange(e.target.value)}
                                                        disabled={loadingRegions}
                                                        className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose disabled:bg-gray-50"
                                                    >
                                                        <option value="">Select Region</option>
                                                        {regions.map(r => (
                                                            <option key={r.code} value={r.code}>
                                                                {r.regionName ? `${r.regionName} - ${r.name}` : r.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                                        Province {loadingProvinces && <Spinner />}
                                                    </label>
                                                    <select
                                                        value={address.provinceCode}
                                                        onChange={e => handleProvinceChange(e.target.value)}
                                                        disabled={loadingProvinces || !address.regionCode}
                                                        className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose disabled:bg-gray-50"
                                                    >
                                                        <option value="">Select Province</option>
                                                        {provinces.map(p => <option key={p.code} value={p.code}>{p.name}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                                        City / Municipality {loadingCities && <Spinner />}
                                                    </label>
                                                    <select
                                                        value={address.cityCode}
                                                        onChange={e => handleCityChange(e.target.value)}
                                                        disabled={loadingCities || !address.provinceCode}
                                                        className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose disabled:bg-gray-50"
                                                    >
                                                        <option value="">Select City/Municipality</option>
                                                        {cities.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                                                        Barangay {loadingBarangays && <Spinner />}
                                                    </label>
                                                    <select
                                                        value={address.barangayCode}
                                                        onChange={e => handleBarangayChange(e.target.value)}
                                                        disabled={loadingBarangays || !address.cityCode}
                                                        className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose disabled:bg-gray-50"
                                                    >
                                                        <option value="">Select Barangay</option>
                                                        {barangays.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            {/* Street & Landmark */}
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Street Address</label>
                                                <input type="text" value={address.street} onChange={e => setAddress({ ...address, street: e.target.value })} placeholder="House/Building No., Street Name" className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose" />
                                            </div>
                                            <div>
                                                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Landmark / Additional Instructions</label>
                                                <textarea value={address.landmark} onChange={e => setAddress({ ...address, landmark: e.target.value })} rows="3" placeholder="Near school, beside sari-sari store, gate color, etc..." className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose" />
                                            </div>

                                            {/* ── Location Buttons ── */}
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <button
                                                    type="button"
                                                    onClick={handleAutoLocate}
                                                    disabled={isLocating}
                                                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-rose hover:bg-rose-dark rounded-full transition-colors shadow-sm disabled:opacity-60"
                                                >
                                                    {isLocating ? (
                                                        <>
                                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                            Detecting Location...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <span>📍</span> Use My Current Location
                                                        </>
                                                    )}
                                                </button>
                                                {!showMap && (
                                                    <button
                                                        type="button"
                                                        onClick={handleShowMap}
                                                        className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose border-2 border-rose hover:bg-rose-light rounded-full transition-colors"
                                                    >
                                                        <span>🗺️</span> Pin Location on Map
                                                    </button>
                                                )}
                                            </div>

                                            {/* ── Leaflet Map (hidden by default) ── */}
                                            {showMap && (
                                                <div className="space-y-2">
                                                    <div className="h-64 w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                                        <MapContainer
                                                            center={deliveryLocation ? [deliveryLocation.lat, deliveryLocation.lng] : [6.6833, 125.3500]}
                                                            zoom={deliveryLocation ? 15 : 13}
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
                                                        <p className="text-xs text-gray-500">
                                                            📌 Pinned: {deliveryLocation.lat.toFixed(5)}, {deliveryLocation.lng.toFixed(5)}
                                                        </p>
                                                    )}
                                                    {!deliveryLocation && (
                                                        <p className="text-xs text-gray-400 italic">Click anywhere on the map to drop a pin.</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* ── PICKUP view ── */}
                                    {deliveryMethod === 'pickup' && (
                                        <div className="bg-rose-light/40 border border-rose/20 rounded-xl p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                    <svg className="w-5 h-5 text-rose" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-700">Pick-up Location:</p>
                                                    <p className="text-sm text-gray-500">Main Storefront, Hagonoy, Davao del Sur</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>

                                {/* ── 4. Schedule & Payment ── */}
                                <section className="border border-gray-200 rounded-xl p-5 space-y-4">
                                    <h2 className="flex items-center font-bold text-gray-800 text-base">
                                        <SectionIcon>📅</SectionIcon>
                                        Schedule & Payment
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Date</label>
                                            <input type="date" value={schedule.date} onChange={e => setSchedule({ ...schedule, date: e.target.value })} className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose" />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Time</label>
                                            <select value={schedule.time} onChange={e => setSchedule({ ...schedule, time: e.target.value })} className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose">
                                                {TIME_OPTIONS.map(t => <option key={t} value={t === 'Select Time' ? '' : t}>{t}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Payment Method</label>
                                            <input type="text" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose bg-gray-50" />
                                        </div>
                                    </div>
                                </section>

                                {/* ── 5. Special Requests ── */}
                                <section className="border border-gray-200 rounded-xl p-5 space-y-4">
                                    <h2 className="flex items-center font-bold text-gray-800 text-base">
                                        <SectionIcon>✨</SectionIcon>
                                        Special Requests
                                    </h2>
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Add-ons</p>
                                    <div className="grid grid-cols-2 gap-3">
                                        {ADD_ONS.map(addon => (
                                            <button
                                                key={addon.id}
                                                type="button"
                                                onClick={() => toggleAddOn(addon.id)}
                                                className={`flex items-center gap-3 p-3.5 rounded-xl border-2 text-left text-sm font-medium transition-all ${specialRequests.addOns.includes(addon.id) ? 'border-rose bg-rose-light text-rose-dark' : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'}`}
                                            >
                                                <span className="text-base">{addon.icon}</span>
                                                {addon.label}
                                            </button>
                                        ))}
                                    </div>
                                    {specialRequests.addOns.includes('note') && (
                                        <div>
                                            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">Note</label>
                                            <textarea value={specialRequests.note} onChange={e => setSpecialRequests({ ...specialRequests, note: e.target.value })} rows="2" placeholder="Requests, additional messages..." className="w-full rounded-lg border-gray-200 text-sm focus:border-rose focus:ring-rose" />
                                        </div>
                                    )}
                                </section>

                                {/* ── Terms + Place Order ── */}
                                <div className="space-y-5 pt-2">
                                    <label className="flex items-start gap-3 cursor-pointer select-none">
                                        <input type="checkbox" checked={agreedToTerms} onChange={e => setAgreedToTerms(e.target.checked)} className="rounded border-gray-300 text-rose focus:ring-rose w-4 h-4 mt-0.5" />
                                        <span className="text-sm text-gray-600">
                                            By placing your order, you agree to our{' '}
                                            <a href="#" className="text-rose font-medium hover:underline">Privacy Policy</a>{' '}and{' '}
                                            <a href="#" className="text-rose font-medium hover:underline">Terms of Service</a>
                                        </span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={handlePlaceOrder}
                                        disabled={!agreedToTerms || isSubmitting || cartItems.length === 0}
                                        className="w-full py-4 bg-gradient-to-r from-rose to-rose-dark hover:from-rose-dark hover:to-rose text-white font-bold text-sm tracking-wider rounded-full shadow-lg shadow-rose/30 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                                                PLACING ORDER...
                                            </>
                                        ) : (
                                            <>
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                                PLACE ORDER
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* ════════════════ RIGHT COLUMN — ORDER SUMMARY ════════════════ */}
                            <div className="bg-[#fdfaf7] p-6 md:p-8 lg:p-10">
                                <div className="sticky top-8 space-y-6">
                                    <h2 className="font-serif text-2xl font-bold text-gray-800">Your Order</h2>

                                    {cartItems.length === 0 ? (
                                        <p className="text-sm text-gray-400">Your cart is empty.</p>
                                    ) : (
                                        <>
                                            {/* Items */}
                                            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                                                {cartItems.map(item => (
                                                    <div key={item.product_id} className="flex items-center gap-3">
                                                        <img
                                                            src={getImageUrl(item.flower_name)}
                                                            alt={item.flower_name}
                                                            className="w-14 h-14 object-cover rounded-xl border border-gray-100 shadow-sm"
                                                        />
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="text-sm font-bold text-gray-800 uppercase truncate">{item.flower_name}</h3>
                                                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                        </div>
                                                        <span className="text-sm font-bold text-rose whitespace-nowrap">₱{(item.price * item.quantity).toFixed(2)}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Totals */}
                                            <div className="border-t border-dashed border-gray-200 pt-4 space-y-3 text-sm">
                                                <div className="flex justify-between text-gray-500">
                                                    <span>Subtotal ({cartCount} items)</span>
                                                    <span>₱{cartSubtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between text-gray-500">
                                                    <span>Shipping</span>
                                                    <span>{deliveryMethod === 'pickup' ? <span className="text-green-600 font-medium">Free</span> : `₱${shippingFee.toFixed(2)}`}</span>
                                                </div>
                                                <div className="flex justify-between font-bold text-lg text-gray-800 pt-2 border-t border-gray-200">
                                                    <span>Total</span>
                                                    <span className="text-rose">₱{total.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
