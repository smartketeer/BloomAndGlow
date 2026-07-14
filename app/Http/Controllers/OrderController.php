<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cartItems' => 'required|array',
            'cartItems.*.product_id' => 'required|integer',
            'cartItems.*.quantity' => 'required|integer',
            'cartItems.*.price' => 'required|numeric',
            'deliveryLocation' => 'required|array',
            'deliveryLocation.lat' => 'required|numeric',
            'deliveryLocation.lng' => 'required|numeric',
            'name' => 'nullable|string',
            'phone' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        DB::beginTransaction();

        try {
            // Calculate total amount
            $totalAmount = 0;
            foreach ($validated['cartItems'] as $item) {
                $totalAmount += $item['price'] * $item['quantity'];
            }
            
            $deliveryFee = 5.00; // Fixed delivery fee for now
            $totalAmount += $deliveryFee;

            // 1. Create Order
            // Use auth user if logged in, otherwise dummy user ID 1
            $userId = Auth::id() ?? 1;
            
            $orderId = DB::table('orders')->insertGetId([
                'user_id' => $userId,
                'total_amount' => $totalAmount,
                'order_status' => 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // 2. Insert Order Items
            $orderItems = [];
            foreach ($validated['cartItems'] as $item) {
                $orderItems[] = [
                    'order_id' => $orderId,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'subtotal' => $item['price'] * $item['quantity'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
            DB::table('order_items')->insert($orderItems);

            // 3. Create Delivery Record
            DB::table('deliveries')->insert([
                'order_id' => $orderId,
                'dropoff_latitude' => $validated['deliveryLocation']['lat'],
                'dropoff_longitude' => $validated['deliveryLocation']['lng'],
                'delivery_fee' => $deliveryFee,
                'delivery_status' => 'Pending',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            DB::commit();

            return response()->json(['message' => 'Order placed successfully!'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'An error occurred while processing your order.', 'details' => $e->getMessage()], 500);
        }
    }
}
