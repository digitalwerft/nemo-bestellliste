<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('order/123/buyers', function() {
    return [
        'orderNr' => '1736567738872-WD',
        'user' => [
            'firstName' => 'Alfred',
            'lastName' => 'Befred',
            'email' => 'alfred@befred.com',
            'address' => [
                'street' => 'Meine Straße 29',
                'zip' => '19283',
                'city' => 'Freiburg',
            ],
            'message' => 'ahjsgdjkhasgdhahsjgdakgjhjhasgd',
        ],
       'buyers' => [
            [
                'name' => 'Vorname Name',
                'id' => 12,
                'state' => 'active',
                'articles' => [
                    [
                        'id' => '350',
                        'name' => 'Leon 35-38',
                        'price' => 15,
                        'amount' => 2,
                    ], [
                        'id' => '212',
                        'name' => 'Fridolin 43-46',
                        'price' => 15,
                        'amount' => 1,
                    ],
                ],
            ], [
                'name' => 'Max Mustermann',
                'id' => 2,
                'state' => 'active',
                'articles' => [
                    [
                        'id' => '350',
                        'name' => 'Leon 35-38',
                        'price' => 15,
                    'amount' => 4,
                    ], [
                        'id' => '212',
                        'name' => 'Fridolin 43-46',
                        'price' => 15,
                        'amount' => 1,
                    ],
                ],
            ], [
                'name' => 'Marianne Musterfrau',
                'id' => 13,
                'state' => 'active',
                'articles' => [
                    [
                        'id' => '395',
                        'name' => 'Svenja 39-42',
                        'price' => 15,
                        'amount' => 2,
                    ], [
                        'id' => '582',
                        'name' => 'Lotta',
                        'price' => 20,
                        'amount' => 1,
                    ],
                ],
            ], [
                'name' => 'Marianne Musterfrau',
                'id' => 14,
                'state' => 'active',
                'articles' => [
                    [
                        'id' => '395',
                        'name' => 'Svenja 39-42',
                        'price' => 15,
                        'amount' => 2,
                    ], [
                        'id' => '582',
                        'name' => 'Lotta',
                        'price' => 20,
                        'amount' => 1,
                    ],
                ],
            ], [
                'name' => 'Marianne Musterfrau',
                'id' => 15,
                'state' => 'active',
                'articles' => [
                    [
                        'id' => '395',
                        'name' => 'Svenja 39-42',
                        'price' => 15,
                        'amount' => 2,
                    ], [
                        'id' => '582',
                        'name' => 'Lotta',
                        'price' => 20,
                        'amount' => 1,
                    ],
                ],
            ], [
                'name' => 'Marianne Musterfrau',
                'id' => 16,
                'state' => 'active',
                'articles' => [
                    [
                        'id' => '395',
                        'name' => 'Svenja 39-42',
                        'price' => 15,
                        'amount' => 2,
                    ], [
                        'id' => '582',
                        'name' => 'Lotta',
                        'price' => 20,
                        'amount' => 1,
                    ],
                ],
            ], [
                'name' => 'Marianne Musterfrau',
                'id' => 17,
                'state' => 'active',
                'articles' => [
                    [
                        'id' => '395',
                        'name' => 'Svenja 39-42',
                        'price' => 15,
                        'amount' => 2,
                    ], [
                        'id' => '582',
                        'name' => 'Lotta',
                        'price' => 20,
                        'amount' => 1,
                    ],
                ],
            ], [
                'name' => 'Marianne Musterfrau',
                'id' => 18,
                'state' => 'active',
                'articles' => [
                    [
                        'id' => '395',
                        'name' => 'Svenja 39-42',
                        'price' => 15,
                        'amount' => 2,
                    ], [
                        'id' => '582',
                        'name' => 'Lotta',
                        'price' => 20,
                        'amount' => 1,
                    ],
                ],
            ],
        ],
    ];
});
