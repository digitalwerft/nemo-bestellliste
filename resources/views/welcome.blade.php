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
    <link rel="stylesheet" href="/css/app.css">
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
                                        <h6>@{{ data.user.firstName }}</h6>
                                        <input v-model="data.user.firstName" class="form-control" type="text" placeholder="Vorname" :class="{hidden: !editingDetails}">
                                    </div>
                                    <div class="col">
                                        <h6>@{{ data.user.lastName }}</h6>
                                        <input v-model="data.user.lastName"class="form-control" type="text" placeholder="Nachname" :class="{hidden: !editingDetails}">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group">
                                <h6>@{{ data.user.email }}</h6>
                                <input v-model="data.user.email" class="form-control" type="email" placeholder="E-Mail" :class="{hidden: !editingDetails}">
                            </div>
                            <div class="form-group">
                                <h6>@{{ data.user.address.street }}</h6>
                                <input v-model="data.user.address.street" class="form-control" type="text" placeholder="Straße, Hausnummer" :class="{hidden: !editingDetails}">
                            </div>

                        </div>
                        <div class="col-lg-11">
                            <div class="form-group">
                                <label>Sonstiges:</label>
                                <h6>@{{ data.user.message }}</h6>
                                <textarea v-model="data.user.message" class="form-control" id="exampleFormControlTextarea1" rows="3" placeholder="Sonstiges" :class="{hidden: !editingDetails}"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-7">
                            <div class="form-group">
                                <div class="row">
                                    <div class="col-5">
                                        <h6>@{{ data.user.address.zip }}</h6>
                                        <input v-model="data.user.address.zip" class="form-control" type="text" placeholder="PLZ" :class="{hidden: !editingDetails}">
                                    </div>
                                    <div class="col">
                                        <h6>@{{ data.user.address.city }}</h6>
                                        <input v-model="data.user.address.city" class="form-control" type="text" placeholder="Ort" :class="{hidden: !editingDetails}">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-11">
                            <a href="" class="btn btn-primary float-right">Bearbeiten</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>


        <section class="order-navigation">
            <navbar v-model="search"></navbar>
        </section>
        <section class="orders">
            <div class="container">
                <div v-for="(buyer, index) in filteredBuyer">
                    <div v-if="buyer.state == 'active'">
                        <buyer :buyer-data="buyer" :buyer-index="index" :filterkey="search" @on-buyer-delete="deleteBuyer($event)"></buyer>
                    </div>
                </div>
                <a href="" class="btn btn-light btn-lg btn-block mt-3" @click="createBuyer" :class="{hidden: (search != '')}">
                    <i class="mdi mdi-library-plus"></i> Besteller hinzufügen
                </a>
            </div>
        </section>

        <div class="loading-overlay" :class="{loading: isLoading}">
                <div class="spinner">
                  <div class="double-bounce1"></div>
                  <div class="double-bounce2"></div>
                </div>
        </div>
        <div class="container sticky-container">
            <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-bottom">

                <a class="navbar-brand" href="#">Neue Masche</a>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            Besteller: @{{ data.buyers.length }}&nbsp;|&nbsp;
                        </li>
                        <li class="nav-item">
                            Bestellungen: @{{ totalOrders }}&nbsp;|&nbsp;
                        </li>
                        <li class="nav item">
                            Gewinn: @{{ winnings }}€
                        </li>
                    </ul>
                    <ul class="navbar-nav ml-auto">
                        <li class="nav-item mr-3">
                            <a href="#" class="btn btn-outline-secondary my-2 my-sm-0" @click="createBuyer" :class="{hidden: (search != '')}">
                                <i class="mdi mdi-plus"></i>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="#" class="btn btn-outline-danger my-2 my-sm-0">Bestellung aufgeben
                                <i class="mdi mdi-chevron-right"></i>
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
        </div>
    </div>
    <script src="/js/app.js" charset="utf-8"></script>
</body>

</html>
