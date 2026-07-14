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
            'cartItems' => 'required|array|min:1',
            'cartItems.*.product_id' => 'required|integer',
            'cartItems.*.quantity' => 'required|integer|min:1',
            'cartItems.*.price' => 'required|numeric|min:0',

            // Customer info
            'customer.firstName' => 'nullable|string|max:255',
            'customer.lastName' => 'nullable|string|max:255',
            'customer.contact' => 'nullable|string|max:50',
            'customer.email' => 'nullable|email|max:255',

            // Receiver info
            'receiver.firstName' => 'nullable|string|max:255',
            'receiver.lastName' => 'nullable|string|max:255',
            'receiver.contact' => 'nullable|string|max:50',
            'receiver.email' => 'nullable|email|max:255',

            // Delivery
            'deliveryMethod' => 'required|in:delivery,pickup',
            'address.region' => 'nullable|string|max:255',
            'address.province' => 'nullable|string|max:255',
            'address.city' => 'nullable|string|max:255',
            'address.barangay' => 'nullable|string|max:255',
            'address.street' => 'nullable|string|max:500',
            'address.landmark' => 'nullable|string|max:1000',

            // Location (nullable for pickup orders)
            'deliveryLocation' => 'nullable|array',
            'deliveryLocation.lat' => 'nullable|numeric',
            'deliveryLocation.lng' => 'nullable|numeric',

            // Schedule & payment
            'schedule.date' => 'nullable|date',
            'schedule.time' => 'nullable|string|max:50',
            'paymentMethod' => 'nullable|string|max:50',

            // Special requests
            'specialRequests.addOns' => 'nullable|array',
            'specialRequests.note' => 'nullable|string|max:2000',
        ]);

        DB::beginTransaction();

        try {
            // Calculate total amount
            $totalAmount = 0;
            foreach ($validated['cartItems'] as $item) {
                $totalAmount += $item['price'] * $item['quantity'];
            }

            $isDelivery = ($validated['deliveryMethod'] ?? 'delivery') === 'delivery';
            $deliveryFee = $isDelivery ? 50.00 : 0.00;
            $totalAmount += $deliveryFee;

            $userId = Auth::id() ?? 1;

            // Determine shop_id from the first cart item
            $shopId = null;
            $firstProductId = $validated['cartItems'][0]['product_id'] ?? null;
            if ($firstProductId) {
                $product = DB::table('products')->where('product_id', $firstProductId)->first();
                $shopId = $product->shop_id ?? null;
            }

            // 1. Create Order
            $orderId = DB::table('orders')->insertGetId([
                'user_id' => $userId,
                'shop_id' => $shopId,
                'total_amount' => $totalAmount,
                'order_status' => 'Pending',
                'customer_first_name' => $validated['customer']['firstName'] ?? null,
                'customer_last_name' => $validated['customer']['lastName'] ?? null,
                'customer_contact' => $validated['customer']['contact'] ?? null,
                'customer_email' => $validated['customer']['email'] ?? null,
                'receiver_first_name' => $validated['receiver']['firstName'] ?? null,
                'receiver_last_name' => $validated['receiver']['lastName'] ?? null,
                'receiver_contact' => $validated['receiver']['contact'] ?? null,
                'receiver_email' => $validated['receiver']['email'] ?? null,
                'delivery_method' => $validated['deliveryMethod'] ?? 'delivery',
                'payment_method' => $validated['paymentMethod'] ?? 'GCash',
                'scheduled_date' => $validated['schedule']['date'] ?? null,
                'scheduled_time' => $validated['schedule']['time'] ?? null,
                'special_requests' => isset($validated['specialRequests']) ? json_encode($validated['specialRequests']) : null,
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
            $deliveryData = [
                'order_id' => $orderId,
                'dropoff_latitude' => $validated['deliveryLocation']['lat'] ?? null,
                'dropoff_longitude' => $validated['deliveryLocation']['lng'] ?? null,
                'delivery_fee' => $deliveryFee,
                'delivery_status' => 'Pending',
                'region' => $validated['address']['region'] ?? null,
                'province' => $validated['address']['province'] ?? null,
                'city' => $validated['address']['city'] ?? null,
                'barangay' => $validated['address']['barangay'] ?? null,
                'street_address' => $validated['address']['street'] ?? null,
                'landmark' => $validated['address']['landmark'] ?? null,
                'created_at' => now(),
                'updated_at' => now(),
            ];

            DB::table('deliveries')->insert($deliveryData);

            DB::commit();

            return response()->json(['message' => 'Order placed successfully!'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'An error occurred while processing your order.', 'details' => $e->getMessage()], 500);
        }
    }
}
