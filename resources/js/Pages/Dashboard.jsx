import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, Link } from '@inertiajs/react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { HomeIcon, ChartBarIcon, CurrencyDollarIcon, ShoppingCartIcon, UsersIcon, ArrowTrendingUpIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

// Component to programmatically fly the map to a specific position
function MapUpdater({ position }) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, 15);
        }
    }, [position, map]);
    return null;
}

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

export default function Dashboard({ auth, role, data }) {
    // -----------------------------------------------------------------
    // SUPER ADMIN VIEW (Premium Analytics Dashboard)
    // -----------------------------------------------------------------
    if (role === 'super_admin') {
        const handleToggleStatus = (shopId, currentStatus) => {
            const newStatus = currentStatus === 'approved' ? 'pending' : 'approved';
            router.patch(`/admin/shops/${shopId}`, { status: newStatus }, {
                preserveScroll: true
            });
        };

        const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];
        const pieData = [
            { name: 'Completed', value: 45 },
            { name: 'Pending', value: 20 },
            { name: 'Shipped', value: 25 },
            { name: 'Cancelled', value: 10 }
        ];

        return (
            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Super Admin Analytics Dashboard</h2>}
            >
                <Head title="Super Admin Dashboard" />
                <div className="flex bg-gray-50 min-h-screen">
                    {/* Sidebar */}
                    <aside className="w-64 bg-white border-r border-gray-200 hidden md:block">
                        <div className="h-full px-3 py-6">
                            <ul className="space-y-2 font-medium">
                                <li>
                                    <a href="#" className="flex items-center p-3 text-white bg-blue-600 rounded-xl">
                                        <ChartBarIcon className="w-5 h-5 text-white transition duration-75" />
                                        <span className="ms-3">Dashboards</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center p-3 text-gray-700 rounded-xl hover:bg-gray-100">
                                        <UsersIcon className="w-5 h-5 text-gray-400 transition duration-75 group-hover:text-gray-900" />
                                        <span className="ms-3">CRM</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center p-3 text-gray-700 rounded-xl hover:bg-gray-100">
                                        <ShoppingCartIcon className="w-5 h-5 text-gray-400 transition duration-75 group-hover:text-gray-900" />
                                        <span className="ms-3">Ecommerce</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="#" className="flex items-center p-3 text-gray-700 rounded-xl hover:bg-gray-100">
                                        <ArrowTrendingUpIcon className="w-5 h-5 text-gray-400 transition duration-75 group-hover:text-gray-900" />
                                        <span className="ms-3">Analytics</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="flex-1 p-6 md:p-8">
                        {/* Top Row */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back, Super Admin!</h1>
                            <p className="text-sm text-gray-500 mt-1">Here's what's happening across your multi-vendor marketplace today.</p>
                        </div>

                        {/* Second Row: KPI Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
                                        <h3 className="text-3xl font-bold text-gray-900">${parseFloat(data.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                                    </div>
                                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                                        <CurrencyDollarIcon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm">
                                    <span className="text-green-500 font-medium flex items-center"><ArrowTrendingUpIcon className="w-4 h-4 mr-1"/> +14.5%</span>
                                    <span className="text-gray-400 ml-2">from last month</span>
                                </div>
                                <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <CurrencyDollarIcon className="w-32 h-32 text-blue-600" />
                                </div>
                            </div>
                            
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Total Orders</p>
                                        <h3 className="text-3xl font-bold text-gray-900">{data.total_orders}</h3>
                                    </div>
                                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                                        <ShoppingCartIcon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm">
                                    <span className="text-green-500 font-medium flex items-center"><ArrowTrendingUpIcon className="w-4 h-4 mr-1"/> +8.2%</span>
                                    <span className="text-gray-400 ml-2">from last month</span>
                                </div>
                                <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <ShoppingCartIcon className="w-32 h-32 text-purple-600" />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Active Shops</p>
                                        <h3 className="text-3xl font-bold text-gray-900">{data.total_shops}</h3>
                                    </div>
                                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                                        <HomeIcon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm">
                                    <span className="text-green-500 font-medium flex items-center"><ArrowTrendingUpIcon className="w-4 h-4 mr-1"/> +2</span>
                                    <span className="text-gray-400 ml-2">new vendors</span>
                                </div>
                                <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <HomeIcon className="w-32 h-32 text-emerald-600" />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative overflow-hidden group">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500 mb-1">Conversion Rate</p>
                                        <h3 className="text-3xl font-bold text-gray-900">4.8%</h3>
                                    </div>
                                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                                        <GlobeAltIcon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm">
                                    <span className="text-red-500 font-medium flex items-center"><ArrowTrendingUpIcon className="w-4 h-4 mr-1 transform rotate-180"/> -1.2%</span>
                                    <span className="text-gray-400 ml-2">from last month</span>
                                </div>
                                <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <GlobeAltIcon className="w-32 h-32 text-orange-600" />
                                </div>
                            </div>
                        </div>

                        {/* Third Row: Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Revenue Overview</h3>
                                <div className="h-80 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={data.revenue_data}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dx={-10} tickFormatter={(value) => `$${value}`} />
                                            <RechartsTooltip 
                                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'}}
                                                formatter={(value) => [`$${value}`, 'Revenue']}
                                            />
                                            <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={4} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6, strokeWidth: 0}} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            
                            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Orders by Status</h3>
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 grid grid-cols-2 gap-2">
                                    {pieData.map((entry, index) => (
                                        <div key={entry.name} className="flex items-center text-xs">
                                            <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: PIE_COLORS[index] }}></div>
                                            <span className="text-gray-600 font-medium">{entry.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Fourth Row: Tables & Feeds */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Top Performing Shops (2/3 width) */}
                            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="text-lg font-bold text-gray-900">Top Performing Shops</h3>
                                    <button className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">View All Shops</button>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Shop Name</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Sales (Orders)</th>
                                                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {data.top_shops.map((shop) => (
                                                <tr key={shop.id} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center border border-blue-300">
                                                                <HomeIcon className="h-5 w-5 text-blue-600" />
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{shop.name}</div>
                                                                <div className="text-sm text-gray-500">ID: #{shop.id}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm text-gray-900 font-medium">{shop.orders_count} Orders</div>
                                                        <div className="text-sm text-gray-500">Volumetric Leading</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${shop.status === 'approved' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                                                            {shop.status.charAt(0).toUpperCase() + shop.status.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        <button 
                                                            onClick={() => handleToggleStatus(shop.id, shop.status)}
                                                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${shop.status === 'approved' ? 'text-red-600 bg-red-50 hover:bg-red-100' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'}`}
                                                        >
                                                            {shop.status === 'approved' ? 'Revoke Access' : 'Approve Shop'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Recent Activity Timeline (1/3 width) */}
                            <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100">
                                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                                    <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                                </div>
                                <div className="p-6">
                                    <div className="flow-root">
                                        <ul className="-mb-8">
                                            {data.recent_activity.map((activity, index) => (
                                                <li key={activity.order_id}>
                                                    <div className="relative pb-8">
                                                        {index !== data.recent_activity.length - 1 ? (
                                                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true"></span>
                                                        ) : null}
                                                        <div className="relative flex space-x-3">
                                                            <div>
                                                                <span className="h-8 w-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center ring-8 ring-white">
                                                                    <ShoppingCartIcon className="h-4 w-4 text-blue-600" aria-hidden="true" />
                                                                </span>
                                                            </div>
                                                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                                                                <div>
                                                                    <p className="text-sm text-gray-500">
                                                                        New order <span className="font-medium text-gray-900">#{activity.order_id}</span> at <span className="font-medium text-gray-900">{activity.shop.name}</span>
                                                                    </p>
                                                                </div>
                                                                <div className="whitespace-nowrap text-right text-xs text-gray-500">
                                                                    {new Date(activity.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-6 border-t border-gray-100 pt-4">
                                        <button className="w-full flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                                            View all activity <ArrowTrendingUpIcon className="w-4 h-4 ml-1.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </AuthenticatedLayout>
        );
    }

    // -----------------------------------------------------------------
    // VENDOR ADMIN VIEW
    // -----------------------------------------------------------------
    if (role === 'vendor_admin') {
        const [selectedOrder, setSelectedOrder] = useState(null);
        
        // Hagonoy Default coords
        const defaultPosition = [6.6833, 125.3500];
        
        const mapPosition = selectedOrder && selectedOrder.delivery 
            ? [selectedOrder.delivery.dropoff_latitude, selectedOrder.delivery.dropoff_longitude]
            : defaultPosition;

        const handleMarkDelivered = (orderId) => {
            router.patch(`/admin/orders/${orderId}`, { status: 'Delivered' }, {
                preserveScroll: true,
                onSuccess: () => {
                    if (selectedOrder && selectedOrder.order_id === orderId) {
                        setSelectedOrder({...selectedOrder, order_status: 'Delivered'});
                    }
                }
            });
        };

        return (
            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Vendor Dashboard</h2>}
            >
                <div className="min-h-screen bg-peach text-gray-800 font-sans flex flex-col">
                    <Head title="Vendor Dashboard" />
                    <header className="px-6 md:px-12 py-6 bg-white border-b border-peach-dark flex justify-between items-center">
                        <div>
                            <h1 className="font-serif text-3xl font-bold text-sage-dark">{data.shop.name} Dashboard</h1>
                            <p className="text-sm text-gray-500 mt-1">Manage your incoming orders and deliveries</p>
                        </div>
                        <Link href="/" className="px-6 py-2 bg-sage hover:bg-sage-dark text-white font-semibold rounded-full transition-colors text-sm">View Storefront</Link>
                    </header>

                    <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12 flex flex-col lg:flex-row gap-8 h-full">
                        
                        {/* Left Column: Orders List */}
                        <div className="lg:w-1/2 flex flex-col h-[800px]">
                            <h2 className="font-serif text-2xl font-bold text-sage-dark mb-4">Incoming Orders</h2>
                            <div className="flex-1 overflow-y-auto bg-white rounded-3xl shadow-sm border border-peach-dark p-2 space-y-2">
                                {data.orders.length === 0 ? (
                                    <p className="p-6 text-gray-500 text-center mt-10">No orders received yet.</p>
                                ) : (
                                    data.orders.map((order) => (
                                        <div 
                                            key={order.order_id} 
                                            onClick={() => setSelectedOrder(order)}
                                            className={`p-5 rounded-2xl cursor-pointer transition-all border ${selectedOrder?.order_id === order.order_id ? 'bg-sage-light/10 border-sage' : 'border-transparent hover:bg-gray-50'}`}
                                        >
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <h3 className="font-bold text-gray-800">Order #{order.order_id}</h3>
                                                    <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                                                </div>
                                                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-tangerine-light/20 text-tangerine-dark'}`}>
                                                    {order.order_status}
                                                </span>
                                            </div>
                                            
                                            <div className="space-y-2 mb-4">
                                                {order.order_items.map(item => (
                                                    <div key={item.id} className="flex justify-between text-sm">
                                                        <span className="text-gray-600">{item.quantity}x {item.product.flower_name}</span>
                                                        <span className="font-medium">${item.subtotal}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            
                                            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                                                <span className="font-bold text-sage-dark text-lg">${order.total_amount}</span>
                                                {order.order_status !== 'Delivered' && (
                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleMarkDelivered(order.order_id); }}
                                                        className="px-4 py-2 bg-sage hover:bg-sage-dark text-white text-xs font-bold rounded-full transition-colors"
                                                    >
                                                        Mark Delivered
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Right Column: Delivery Map */}
                        <div className="lg:w-1/2 flex flex-col h-[800px]">
                            <h2 className="font-serif text-2xl font-bold text-sage-dark mb-4">Delivery Map</h2>
                            <div className="flex-1 bg-gray-100 rounded-3xl overflow-hidden shadow-sm border border-peach-dark relative z-0">
                                {selectedOrder ? (
                                    <MapContainer 
                                        center={mapPosition} 
                                        zoom={15} 
                                        style={{ height: '100%', width: '100%' }}
                                    >
                                        <TileLayer
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                        <Marker position={mapPosition}></Marker>
                                        <MapUpdater position={mapPosition} />
                                    </MapContainer>
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center bg-white z-0">
                                        <div className="text-center text-gray-400">
                                            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                                            <p>Select an order to view its delivery location</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </main>
                </div>
            </AuthenticatedLayout>
        );
    }

    // -----------------------------------------------------------------
    // CUSTOMER VIEW (Order History)
    // -----------------------------------------------------------------
    if (role === 'customer') {
        return (
            <AuthenticatedLayout
                header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">My Orders</h2>}
            >
                <div className="min-h-screen bg-peach text-gray-800 font-sans p-6 md:p-12">
                    <Head title="My Orders" />
                    <div className="max-w-4xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="font-serif text-3xl font-bold text-sage-dark">My Orders</h1>
                            <Link href="/" className="px-6 py-2 bg-sage hover:bg-sage-dark text-white font-semibold rounded-full transition-colors text-sm">Back to Store</Link>
                        </div>

                        <div className="space-y-6">
                            {data.orders.length === 0 ? (
                                <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-peach-dark">
                                    <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
                                    <Link href="/" className="px-8 py-3 bg-sage hover:bg-sage-dark text-white font-semibold rounded-full transition-colors">Start Shopping</Link>
                                </div>
                            ) : (
                                data.orders.map(order => (
                                    <div key={order.order_id} className="bg-white rounded-3xl shadow-sm border border-peach-dark overflow-hidden">
                                        <div className="bg-sage-light/20 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Order Placed</span>
                                                <p className="font-medium text-gray-900">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total</span>
                                                <p className="font-medium text-gray-900">${order.total_amount}</p>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 uppercase font-bold tracking-wider">Order #</span>
                                                <p className="font-medium text-gray-900">{order.order_id}</p>
                                            </div>
                                            <div>
                                                <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-tangerine-light text-tangerine-dark'}`}>
                                                    {order.order_status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="space-y-4">
                                                {order.order_items.map(item => (
                                                    <div key={item.id} className="flex items-center gap-4">
                                                        <img src={getImageUrl(item.product.flower_name)} alt={item.product.flower_name} className="w-16 h-16 object-cover rounded-xl shadow-sm border border-gray-100" />
                                                        <div className="flex-1">
                                                            <h4 className="font-bold text-gray-800">{item.product.flower_name}</h4>
                                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                                        </div>
                                                        <div className="font-semibold text-sage-dark">
                                                            ${item.subtotal}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    return null;
}
