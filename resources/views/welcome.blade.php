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
    <div v-if="!isLoading">
      <section class="details">
        <user></user>
      </section>


      <section class="order-navigation">
        <navbar v-model="search"></navbar>
      </section>
      <section class="orders">
        <div class="container">
          <div v-for="(buyer, index) in filteredBuyer">
            <div v-if="buyer.state == 'active'">
              <buyer :buyer-id="buyer.id" :filterkey="search" v-on:delete-buyer="onBuyerDeleted" v-on:save-buyer="onBuyerSaved" v-on:editing-buyer="hasUnsavedBuyer=true"></buyer>
            </div>
          </div>
          <a href="" class="btn btn-light btn-lg btn-block mt-3" @click="createBuyer" :class="{hidden: (search != ''), disabled: hasUnsavedBuyer}">
                        <i class="mdi mdi-library-plus"></i> Teilnehmer hinzufügen
                    </a>
        </div>
      </section>
      <div class="container sticky-container ">
        <nav class="navbar navbar-expand-lg navbar-light bg-white fixed-bottom footer-bar">

          <a class="navbar-brand" href="#">NEUE MASCHE</a>

          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav">
              <li class="nav-item">
                Besteller: @{{ buyers.length }}&nbsp;|&nbsp;
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
                  <i class="mdi mdi-plus"></i> Teilnehmer hinzufügen
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
  </div>

  <div class="loading-overlay loading">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </div>

  <script src="/js/app.js" charset="utf-8"></script>
</body>

</html>
