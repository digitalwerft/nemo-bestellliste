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

Route::get('order/123/buyers', function () {
    return [
            [
                'name' => 'Vorname Name',
                'id' => 12,
                'state' => 'active',
                'articles' => [
                    [
                        'id' => '350',
                        'amount' => 2,
                    ], [
                        'id' => '212',
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
                        'amount' => 4,
                    ], [
                        'id' => '212',
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
                        'amount' => 2,
                    ], [
                        'id' => '582',
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
                        'amount' => 2,
                    ], [
                        'id' => '582',
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
                        'amount' => 2,
                    ], [
                        'id' => '582',
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
                        'amount' => 2,
                    ], [
                        'id' => '582',
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
                        'amount' => 2,
                    ], [
                        'id' => '582',
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
                        'amount' => 2,
                    ], [
                        'id' => '582',
                        'amount' => 1,
                    ],
                ],
            ],
        ];
});

Route::get('user/123', function() {
    return [
        'orderNr' => '125673bnkc546',
        'firstName' => 'Alfred',
        'lastName' => 'Befred',
        'email' => 'alfred@befred.com',
        'street' => 'Meine Straße 29',
        'zip' => '19283',
        'city' => 'Freiburg',
        'message' => 'ahjsgdjkhasgdhahsjgdakgjhjhasgd',
    ];
});

Route::get('articles/list', function () {
    return [
    [
      "id" => "350",
      "name" => "Leon",
      "size" => "35-38",
      "price" => 15,
      "description" => "Der Abwechslungsreiche | Extra stabile Garnqualität | Komfort-Abschlussrand | Material:  80% Baumwolle, 17% Polyamid, 3% Elasthan",
      "includes" => "Pro Box: 4x gestreift, 1x uni",
    ], [
      "id" => "351",
      "name" => "Leon",
      "size" => "39-42",
      "price" => 15,
      "description" => "Der Abwechslungsreiche | Extra stabile Garnqualität | Komfort-Abschlussrand | Material:  80% Baumwolle, 17% Polyamid, 3% Elasthan",
      "includes" => "Pro Box: 4x gestreift, 1x uni",
    ], [
      "id" => "352",
      "name" => "Leon",
      "size" => "43-46",
      "price" => 15,
      "description" => "Der Abwechslungsreiche | Extra stabile Garnqualität | Komfort-Abschlussrand | Material:  80% Baumwolle, 17% Polyamid, 3% Elasthan",
      "includes" => "Pro Box: 4x gestreift, 1x uni",
    ], [
      "id" => "211",
      "name" => "Fridolin",
      "size" => "39-42",
      "price" => 15,
      "description" => "Der Sommerliche | Rutscht nicht von der Ferse | Herrenschnitt | Extra feine Maschenqualität | Komfort-Abschlussrand | Material: 80% Baumwolle, 17% Polyamid, 3% Elasthan",
      "includes" => "Pro Box: 3x schwarz, 3x weiß",
    ], [
      "id" => "212",
      "name" => "Fridolin",
      "size" => "43-46",
      "price" => 15,
      "description" => "Der Sommerliche | Rutscht nicht von der Ferse | Herrenschnitt | Extra feine Maschenqualität | Komfort-Abschlussrand | Material: 80% Baumwolle, 17% Polyamid, 3% Elasthan",
      "includes" => "Pro Box: 3x schwarz, 3x weiß",
    ]
  ];
});
