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
  <link rel="stylesheet" href="css/app.css?v=1.02">
</head>

<body>
  <div id="app">
    <div v-if="!isLoading">
      <info-box :visible="displayInfo"></info-box>
      <section class="details">
        <user v-on:display-info="displayInfo = !displayInfo"></user>
      </section>


      <section class="order-navigation">
        <navbar v-model="search" @onBuyerCreate="createBuyer"></navbar>
      </section>
      <section class="orders">
        <div class="container">
          <a href="#" class="btn btn-outline-success btn-block btn-lg d-md-none mt-2 mb-2">Zur Übersicht</a>
          <div v-for="(buyer, index) in filteredBuyer">
            <div v-if="buyer.state == 'active'">
              <buyer :buyer-id="buyer.id" :filterkey="search" v-on:delete-buyer="onBuyerDeleted" v-on:save-buyer="onBuyerSaved" v-on:editing-buyer="handleEditing"></buyer>
            </div>
          </div>
          <div class="alert alert-no-buyers mt-3 text-muted text-center" v-if="filteredBuyer && filteredBuyer.length < 1">
            Deine Suche nach <mark>@{{ search }}</mark> erzielte leider keine Treffer.
          </div>
          <div class="alert alert-no-buyers mt-3 text-muted text-center" v-if="buyers.length < 1">
            Noch wurden keine Teilnehmer zu dieser Bestellung hinzugefügt.
            <a href="#" class="btn btn-lg btn-block btn-success mt-3" @click.prevent="createBuyer" >Jetzt ersten Teilnehmer hinzufügen!</a>
          </div>
          <a href="" class="btn btn-light btn-lg btn-block mt-3" @click.prevent="createBuyer" :class="{hidden: (search != ''), disabled: hasUnsavedBuyer}" v-if="buyers.length > 0">
                        <i class="mdi mdi-account-plus"></i> Teilnehmer hinzufügen
                    </a>
        </div>
      </section>
      <div class="container sticky-container ">
        <nav class="navbar navbar-expand-md navbar-light bg-white fixed-bottom footer-bar">
          <div class="row no-gutters w-100 d-flex d-md-none">
              <div class="d-none d-sm-flex col">
                <a href="#" class="btn btn-primary btn-block btn-lg">zur Übersicht</a>
              </div>
              <div class="col">
                <a href="#" class="btn btn-success btn-block btn-lg">Bestellung aufgeben</a>
              </div>
          </div>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav">
              <li class="nav-item">
                <i class="mdi mdi-account">&nbsp;</i>Besteller: @{{ buyers.length }}&nbsp;|&nbsp;
              </li>
              <li class="nav-item">
                <i class="mdi mdi-library-books">&nbsp;</i>Bestellungen: @{{ totalOrders }}&nbsp;|&nbsp;
              </li>
              <li class="nav-item">
                <i class="mdi mdi-currency-eur">&nbsp;</i>Umsatz: @{{ winnings }}€&nbsp;|&nbsp;
              </li>
              <li class="nav-item">
                <i class="mdi mdi-currency-eur">&nbsp;</i>Erlös: @{{ earnings }}€
              </li>
            </ul>
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <a href="#" class="btn btn-outline-danger my-2 my-sm-0 order-now">Bestellung aufgeben
                  <i class="mdi mdi-chevron-right"></i>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

    </div>
  </div>

  <div class="loading-overlay loading">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </div>

  <script src="js/app.js?v=1.07" charset="utf-8"></script>
</body>

</html>
