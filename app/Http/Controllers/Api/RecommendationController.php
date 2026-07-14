<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;

class RecommendationController extends Controller
{
    /**
     * Apriori-based "Frequently Bought Together" recommendations.
     *
     * Given a product_id, this method:
     *   1. Finds all orders that contain that product (support).
     *   2. Counts how often each *other* product appears in those same orders (confidence).
     *   3. Returns the top 3 co-purchased products sorted by frequency.
     */
    public function show(int $product)
    {
        // Step 1: Find all order_ids that contain the target product
        $orderIds = DB::table('order_items')
            ->where('product_id', $product)
            ->pluck('order_id');

        if ($orderIds->isEmpty()) {
            return response()->json([]);
        }

        // Step 2: In those orders, count the frequency of every *other* product
        $recommendations = DB::table('order_items')
            ->join('products', 'order_items.product_id', '=', 'products.product_id')
            ->whereIn('order_items.order_id', $orderIds)
            ->where('order_items.product_id', '!=', $product)
            ->where('products.is_active', true)
            ->select(
                'products.product_id',
                'products.flower_name',
                'products.price',
                DB::raw('COUNT(DISTINCT order_items.order_id) as frequency')
            )
            ->groupBy('products.product_id', 'products.flower_name', 'products.price')
            ->orderByDesc('frequency')
            ->limit(3)
            ->get();

        // Step 3: Add confidence score (frequency / total orders containing target)
        $totalOrders = $orderIds->count();

        $recommendations->transform(function ($item) use ($totalOrders) {
            $item->confidence = round($item->frequency / $totalOrders, 2);
            return $item;
        });

        return response()->json($recommendations);
    }
}
