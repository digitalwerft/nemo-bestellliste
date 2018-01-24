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

Route::get('fundraiser', function (Request $request) {
  return [
    "id" => 324,
    "user_id" => 352,
    "email" => "karsten.huettenberger@gmx.de",
    "title" => "Herr",
    "first_name" => "Karsten",
    "last_name" => "H\u00fcttenberger",
    "gender" => 0,
    "addressing" => 0,
    "date_of_birth" => "1976-03-25 00:00:00",
    "phone" => "+49 6753 1237690",
    "mobile" => "+49 160 94955202",
    "remark" => null,
    "availability" => 1,
    "comment" => "Mo - Fr: 8.00 - 12.30",
    "created_at" => "2017-03-10 00:00:00",
    "updated_at" => "2017-09-24 20:35:52",
    "deleted_at" => null,
    "identifier" => "0324",
    "url" => [
        "identifier" => "fundraiser\/324",
        "create" => "http:\/\/test.dev\/fundraiser",
        "read" => "http:\/\/test.dev\/fundraiser\/324",
        "update" => "http:\/\/test.dev\/fundraiser\/324",
        "delete" => "http:\/\/test.dev\/fundraiser\/324"
    ],
  ];
});

Route::get('campaign/xyz', function (Request $request) {
  return [
    "id" => 324,
    "fundraiser_id" => 324,
    "group" => "Klasse 8a",
    "members" => 26,
    "samples" => null,
    "organisation" => "Realschule plus Meisenheim",
    "city" => "Meisenheim \/ Glan",
    "purpose" => "Klassenkasse f\u00fcr gemeinsame Klassenfahrt",
    "learned_about" => "Info von EVR Reisen",
    "comment" => null,
    "remark" => "V02 || Mo - Fr: 8.00 - 12.30",
    "legacy" => "V02\nCHa 05.05.\nnicht erreicht, Zwischenstandsmail geschickt\nKB 04.05.\nnicht erreicht\nMH 19.04.\nStarterpaket gepackt, geht heute raus.\nUM 10.04.\nf\u00fcr Aktionserinnerung erreicht. Starterpaket geht an Privatadresse. Sollen es so zuschicken, dass es zum 21. oder 22.04. ankommt, da er davor im Urlaub ist. TNZ von 23 auf 26\nMH 17.03.\nMB zur\u00fcck: 1+\nCHa 16.03.\nFestnetz ist Schulnummer, nicht erreicht. Mobil erreicht, Startergespr\u00e4ch gef\u00fchrt. Sch\u00fcler wissen alle Bescheid, Eltern werden noch von ihm per Elterninfobrief informiert, schicke ich ihm zu. Fl\u00fcpo angesprochen.\nMK 10.03\nInfoplus gepackt, geht heute raus",
    "starts_at" => "2017-04-24 00:00:00",
    "ends_at" => "2017-05-15 00:00:00",
    "created_at" => "2017-03-10 00:00:00",
    "updated_at" => "2017-05-31 12:33:36",
    "deleted_at" => null,
    "url" => [
        "identifier" => "campaign\/324",
        "create" => "http:\/\/test.dev\/campaign",
        "read" => "http:\/\/test.dev\/campaign\/324",
        "update" => "http:\/\/test.dev\/campaign\/324",
        "delete" => "http:\/\/test.dev\/campaign\/324"
    ],
    "identifier" => "0324",
    "shipping_address" => [
        "id" => 423,
        "title" => null,
        "first_name" => "Karsten",
        "last_name" => "H\u00fcttenberger",
        "organisation" => "Realschule plus Meisenheim",
        "address" => "Carl-Hellermann-Stra\u00dfe 1",
        "route" => "Carl-Hellermann-Stra\u00dfe",
        "street_number" => "1",
        "amendment" => null,
        "zip_code" => "55590",
        "city" => "Meisenheim",
        "country_id" => "276",
        "latitude" => null,
        "longitude" => null,
        "supplied" => null,
        "created_at" => "2017-05-08 14:55:39",
        "updated_at" => "2017-05-08 14:55:39",
        "deleted_at" => null,
        "url" => [
            "identifier" => "address\/423",
            "create" => "http:\/\/test.dev\/address",
            "read" => "http:\/\/test.dev\/address\/423",
            "update" => "http:\/\/test.dev\/address\/423",
            "delete" => "http:\/\/test.dev\/address\/423"
        ],
        "identifier" => "0423",
        "name" => "Karsten H\u00fcttenberger",
        "postal" => "55590 Meisenheim",
        "pivot" => [
            "addressable_id" => 324,
            "address_id" => 423,
            "type" => 2,
            "created_at" => "2017-05-08 14:55:39",
            "updated_at" => "2017-08-13 20:27:28"
        ]
    ]
  ];
});

Route::get('articles', function (Request $request) {
  return [
    [
    "term" => "#110 \u2013 Sneakersocke - Hilda Gr. 35-38",
    "data" => [
        "number" => "110",
        "name" => "Sneakersocke - Hilda Gr. 35-38",
        "orderable" => true,
        "returnable" => false,
        "gross_price" => "11.0000",
        "net_price" => "9.2437",
        "vat" => "19.0000",
        "suggested_donation" => "4.0000"
    ]
], [
    "term" => "#111 \u2013 Sneakersocke - Hilda Gr. 39-42",
    "data" => [
        "number" => "111",
        "name" => "Sneakersocke - Hilda Gr. 39-42",
        "orderable" => true,
        "returnable" => false,
        "gross_price" => "11.0000",
        "net_price" => "9.2437",
        "vat" => "19.0000",
        "suggested_donation" => "4.0000"
    ]
], [
    "term" => "#120 \u2013 Socke - Waltraud Gr. 35-38",
    "data" => [
        "number" => "120",
        "name" => "Socke - Waltraud Gr. 35-38",
        "orderable" => true,
        "returnable" => false,
        "gross_price" => "11.0000",
        "net_price" => "9.2437",
        "vat" => "19.0000",
        "suggested_donation" => "4.0000"
    ],
],
];
});

Route::get('campaign/xyz/quote/collectors', function(Request $request) {
  return [
        [
            "id" => 1,
            'name' => 'Vorname Name',
            'articles' => [
                [
                    "number" => "110",
                    "amount" => 2,
                ],
                [
                    "number" => "111",
                    "amount" => 1,
                ],
            ],
        ], [
            "id" => 2,
            'name' => 'Max Mustermann',
            'articles' => [
                [
                    "number" => "110",
                    "amount" => 4
                ],
                [
                    "number" => "120",
                    "amount" => 1,
                ],
            ],
        ], [
            "id" => 3,
            'name' => 'Marianne Musterfrau',
            'articles' => [
                [
                    "number" => "120",
                    "amount" => 2
                ],
                [
                    "number" => "111",
                    "amount" => 1,
                ],
            ],
        ], [
            "id" => 4,
            'name' => 'Marianne Musterfrau',
            'articles' => [
                [
                    "number" => "111",
                    "amount" => 2,
                ],
                [
                    "number" => "110",
                    "amount" => 1,
                ],
            ],
        ], [
            "id" => 5,
            'name' => 'Marianne Musterfrau',
            'articles' => [
                [
                    "number" => "120",
                    "amount" => 2,
                ],
                [
                    "number" => "110",
                    "amount" => 1,
                ],
            ],
        ], [
            "id" => 6,
            'name' => 'Marianne Musterfrau',
            'articles' => [
                [
                    "number" => "120",
                    "amount" => 2,
                ],
                [
                    "number" => "120",
                    "amount" => 1,
                ],
            ],
        ], [
            "id" => 7,
            'name' => 'Marianne Musterfrau',
            'articles' => [
                [
                    "number" => "111",
                    "amount" => 2,
                ],
                [
                    "number" => "110",
                    "amount" => 1,
                ],
            ],
        ], [
            "id" => 8,
            'name' => 'Marianne Musterfrau',
            'articles' => [
                [
                    "number" => "110",
                    "amount" => 2,
                ],
                [
                    "number" => "111",
                    "amount" => 1,
            ],
        ],
    ],
  ];
});

/*
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
});*/
