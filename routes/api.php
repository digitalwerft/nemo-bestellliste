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
                "id" => 1,
                'name' => 'Vorname Name',
                'articles' => [
                    [
                        "id" => 350,
                        "amount" => 2,
                    ],
                    [
                        "id" => 212,
                        "amount" => 1,
                    ],
                ],
            ], [
                "id" => 2,
                'name' => 'Max Mustermann',
                'articles' => [
                    [
                        "id" => 350,
                        "amount" => 4
                    ],
                    [
                        "id" => 212,
                        "amount" => 1,
                    ],
                ],
            ], [
                "id" => 3,
                'name' => 'Marianne Musterfrau',
                'articles' => [
                    [
                        "id" => 351,
                        "amount" => 2
                    ],
                    [
                        "id" => 350,
                        "amount" => 1,
                    ],
                ],
            ], [
                "id" => 4,
                'name' => 'Marianne Musterfrau',
                'articles' => [
                    [
                        "id" => 352,
                        "amount" => 2,
                    ],
                    [
                        "id" => 211,
                        "amount" => 1,
                    ],
                ],
            ], [
                "id" => 5,
                'name' => 'Marianne Musterfrau',
                'articles' => [
                    [
                        "id" => 211,
                        "amount" => 2,
                    ],
                    [
                        "id" => 350,
                        "amount" => 1,
                    ],
                ],
            ], [
                "id" => 6,
                'name' => 'Marianne Musterfrau',
                'articles' => [
                    [
                        "id" => 212,
                        "amount" => 2,
                    ],
                    [
                        "id" => 352,
                        "amount" => 1,
                    ],
                ],
            ], [
                "id" => 7,
                'name' => 'Marianne Musterfrau',
                'articles' => [
                    [
                        "id" => 211,
                        "amount" => 2,
                    ],
                    [
                        "id" => 350,
                        "amount" => 1,
                    ],
                ],
            ], [
                "id" => 8,
                'name' => 'Marianne Musterfrau',
                'articles' => [
                    [
                        "id" => 212,
                        "amount" => 2,
                    ],
                    [
                        "id" => 352,
                        "amount" => 1,
                ],
            ],
        ],
    ];
});

Route::get('user/123', function () {
    return [
        'orderNr' => '3425',
        'groupName' => 'Schulklasse XY',
        'firstName' => 'Alfred',
        'lastName' => 'Befred',
        'email' => 'alfred@befred.com',
        'street' => 'Meine Straße 29',
        'zip' => '19283',
        'city' => 'Freiburg',
        'message' => 'Ich will meine Socken in Rosarot!',
        'shipping_name' => 'Alfred Befred',
        'shipping_organisation' => 'Befred & Co. KG',
        'shipping_street' => 'Straßenname 12',
        'shipping_zip' => '79199',
        'shipping_city' => 'Kirchzarten'
    ];
});

Route::get('articles/list', function () {
    return [
        [
            "id" => "350",
            "name" => "Leon",
            "size" => "35-38",
            "price" => 15,
            "returns" => 4,
            "description" => "Der Abwechslungsreiche | Extra stabile Garnqualität | Komfort-Abschlussrand | Material:  80% Baumwolle, 17% Polyamid, 3% Elasthan",
            "includes" => "Pro Box: 4x gestreift, 1x uni",
      ], [
            "id" => "351",
            "name" => "Leon",
            "size" => "39-42",
            "price" => 16,
            "returns" => 4,
            "description" => "Der Abwechslungsreiche | Extra stabile Garnqualität | Komfort-Abschlussrand | Material:  80% Baumwolle, 17% Polyamid, 3% Elasthan",
            "includes" => "Pro Box: 4x gestreift, 1x uni",
      ], [
            "id" => "352",
            "name" => "Leon",
            "size" => "43-46",
            "price" => 17,
            "returns" => 5,
            "description" => "Der Abwechslungsreiche | Extra stabile Garnqualität | Komfort-Abschlussrand | Material:  80% Baumwolle, 17% Polyamid, 3% Elasthan",
            "includes" => "Pro Box: 4x gestreift, 1x uni",
      ], [
            "id" => "211",
            "name" => "Fridolin",
            "size" => "39-42",
            "price" => 18,
            "returns" => 6,
            "description" => "Der Sommerliche | Rutscht nicht von der Ferse | Herrenschnitt | Extra feine Maschenqualität | Komfort-Abschlussrand | Material: 80% Baumwolle, 17% Polyamid, 3% Elasthan",
            "includes" => "Pro Box: 3x schwarz, 3x weiß",
      ], [
            "id" => "212",
            "name" => "Fridolin",
            "size" => "43-46",
            "price" => 19,
            "returns" => 4,
            "description" => "Der Sommerliche | Rutscht nicht von der Ferse | Herrenschnitt | Extra feine Maschenqualität | Komfort-Abschlussrand | Material: 80% Baumwolle, 17% Polyamid, 3% Elasthan",
            "includes" => "Pro Box: 3x schwarz, 3x weiß",
        ]
      ];
});
