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
  <link rel="stylesheet" href="css/app.css?v=1.06">
</head>

<body>
  <div id="app">
    <transition name="fade-page">
      <router-view></router-view>
    </transition>
  </div>

  <div class="loading-overlay loading">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
  </div>

  <script src="js/app.js?v=1.10" charset="utf-8"></script>
</body>

</html>
