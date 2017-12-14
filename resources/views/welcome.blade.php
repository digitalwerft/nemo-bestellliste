<!doctype html>
<html lang="{{ app()->getLocale() }}">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{!! csrf_token() !!}" />

    <title>Laravel</title>

    <!-- Fonts -->
    <link rel="stylesheet" href="//cdn.materialdesignicons.com/2.0.46/css/materialdesignicons.min.css">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
</head>

<body>
    <div id="app">
    <section class="details">
        <div class="container">
            <div class="card">
                <div class="card-body">
                    <h4 class="card-title pb-3 mb-5">
                        <div class="input-group">
                            Sammelbestellung:&nbsp; <i class="mdi mdi-pound"></i> <strong>@{{ data.orderNr }}</strong>
                        </div>
                    </h4>
                    <div class="row">
                        <div class="col-lg-7">
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <input v-model="data.user.firstName" class="form-control" type="text" placeholder="Vorname">
                                    </div>
                                    <div class="col">
                                        <input v-model="data.user.lastName"class="form-control" type="text" placeholder="Nachname">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <input v-model="data.user.email" class="form-control" type="email" placeholder="E-Mail">
                            </div>
                            <div class="form-group">
                                <input v-model="data.user.address.street" class="form-control" type="text" placeholder="Straße, Hausnummer">
                            </div>

                        </div>
                        <div class="col-lg-11">
                            <div class="form-group">
                                <label>Sonstiges</label>
                                <textarea v-model="data.user.message" class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Sonstiges"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-7">
                            <div class="form-group">
                                <div class="row">
                                    <div class="col">
                                        <input v-model="data.user.address.zip" class="form-control" type="text" placeholder="PLZ">
                                    </div>
                                    <div class="col">
                                        <input v-model="data.user.address.city" class="form-control" type="text" placeholder="Ort">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-11">
                            <a href="" class="btn btn-primary float-right">Speichern</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


        <section class="order-navigation">
            <navbar></navbar>
        </section>
        <section class="orders">
            <div class="container">
                <div v-for="(buyer, index) in data.buyers">
                    <buyer :buyer-data="buyer" :buyer-index="index" @on-buyer-delete="deleteBuyer($event)"></buyer>
                </div>
                <a href="" class="btn btn-light btn-lg btn-block mt-3" @click="createBuyer">
                    <i class="mdi mdi-library-plus"></i> Bestellung hinzufügen
                </a>
            </div>
        </section>
    </div>
    <script src="{{ asset('js/app.js') }}" charset="utf-8"></script>
</body>

</html>
