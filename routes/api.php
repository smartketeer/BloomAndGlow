<?php

use App\Http\Controllers\Api\RecommendationController;
use Illuminate\Support\Facades\Route;

Route::get('/recommendations/{product}', [RecommendationController::class, 'show']);
