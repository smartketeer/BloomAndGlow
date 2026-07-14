<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Shop;
use App\Models\Order;
use App\Models\Delivery;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->role === 'super_admin') {
            $shops = Shop::all();
            
            // Calculate aggregations
            $totalShops = $shops->count();
            
            // Assume completed/delivered orders
            $totalRevenue = Order::whereIn('order_status', ['Completed', 'Delivered', 'Shipped'])->sum('total_amount');
            $totalOrders = Order::count();
            
            // Top 5 shops by sales volume (sum of completed orders)
            // Or simple approach: top shops by number of orders
            $topShops = Shop::withCount('orders')->orderBy('orders_count', 'desc')->take(5)->get();
            
            // 5 most recent orders across platform
            $recentActivity = Order::with('shop')->latest()->take(5)->get();
            
            // Dummy revenue data for the last 7 days for the chart
            $revenueData = [
                ['name' => 'Mon', 'revenue' => 1200],
                ['name' => 'Tue', 'revenue' => 1800],
                ['name' => 'Wed', 'revenue' => 1400],
                ['name' => 'Thu', 'revenue' => 2200],
                ['name' => 'Fri', 'revenue' => 2700],
                ['name' => 'Sat', 'revenue' => 3100],
                ['name' => 'Sun', 'revenue' => 2900],
            ];

            return Inertia::render('Dashboard', [
                'role' => 'super_admin',
                'data' => [
                    'shops' => $shops,
                    'total_shops' => $totalShops,
                    'total_revenue' => $totalRevenue,
                    'total_orders' => $totalOrders,
                    'top_shops' => $topShops,
                    'recent_activity' => $recentActivity,
                    'revenue_data' => $revenueData
                ]
            ]);
        }

        if ($user->role === 'vendor_admin') {
            $orders = Order::where('shop_id', $user->shop_id)
                ->with(['orderItems.product', 'delivery', 'user'])
                ->latest()
                ->get();
                
            return Inertia::render('Dashboard', [
                'role' => 'vendor_admin',
                'data' => [
                    'orders' => $orders,
                    'shop' => $user->shop
                ]
            ]);
        }

        if ($user->role === 'customer') {
            $orders = Order::where('user_id', $user->id)
                ->with(['orderItems.product', 'delivery'])
                ->latest()
                ->get();
                
            return Inertia::render('Dashboard', [
                'role' => 'customer',
                'data' => [
                    'orders' => $orders
                ]
            ]);
        }
        
        return redirect('/');
    }

    public function updateShopStatus(Request $request, Shop $shop)
    {
        if (auth()->user()->role !== 'super_admin') {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $shop->update(['status' => $validated['status']]);

        return redirect()->back()->with('success', 'Shop status updated.');
    }

    public function updateOrderStatus(Request $request, Order $order)
    {
        if (auth()->user()->role !== 'vendor_admin' || $order->shop_id !== auth()->user()->shop_id) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'status' => 'required|string' // e.g. Delivered
        ]);

        $order->update(['order_status' => $validated['status']]);
        
        if ($order->delivery) {
            $order->delivery->update(['delivery_status' => $validated['status']]);
        }

        return redirect()->back()->with('success', 'Order status updated.');
    }
}
