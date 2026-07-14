<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\OrderController;

Route::get('/', function () {
    $products = \Illuminate\Support\Facades\DB::table('products')
        ->join('shops', 'products.shop_id', '=', 'shops.id')
        ->where('products.is_active', true)
        ->where('shops.status', 'approved')
        ->select('products.*', 'shops.name as shop_name')
        ->get();

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'products' => $products,
    ]);
});

use App\Http\Controllers\Admin\DashboardController;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::patch('/admin/shops/{shop}', [DashboardController::class, 'updateShopStatus'])->name('admin.shops.update');
    Route::patch('/admin/orders/{order}', [DashboardController::class, 'updateOrderStatus'])->name('admin.orders.update');
});

Route::get('/checkout', function () {
    return Inertia::render('Checkout');
})->name('checkout');

Route::post('/checkout', [OrderController::class, 'store'])->name('checkout.store');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
