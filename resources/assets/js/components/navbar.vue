<template>
<div class="pt-1">
  <v-waypoint @waypoint-in="inHandler" @waypoint-out="outHandler"></v-waypoint>
  <div class="container sticky-container" v-bind:class="{ 'fixed-top': isFixed }">

    <nav class="navbar navbar-expand-lg navbar-light bg-white">

      <a class="navbar-brand" href="#">Bestelliste</a>
      <div class="form-inline">
        <input class="form-control" type="search" ref="searchInput" placeholder="Suchen" aria-label="Search" :value="value" @input="updateSearch()" id="search-input">
        <label for="search-input" class="search-icon" v-if="!value">
          <i class="mdi mdi-magnify"></i>
        </label>
        <a href="" class="mdi mdi-close-circle-outline clear-search" @click="clearSearch" :class="{hidden: (value=='')}"></a>
      </div>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">

        <ul class="navbar-nav ml-auto">
          <li class="nav-item text-success save-indicator" v-popover:save @click="isSaving = !isSaving">
            <transition name="fade">
              <i class="mdi mdi-check-circle-outline mdi-24px" v-if="!isSaving"></i>
            </transition>
            <transition name="fade">
              <spinner
                :status="true"
                :color="'#627794'"
                :size="20"
                :depth="3"
                :rotation="true"
                :speed="0.8" v-if="isSaving">
              </spinner>
            </transition>


          </li>
          <li class="nav-item">
            <a href="#" class="btn btn-outline-primary mr-2" @click.prevent="createBuyer()">
              <i class="mdi mdi-account-plus">&nbsp;</i>
              neuer Teilnehmer
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="btn btn-outline-primary mr-2">
              <i class="mdi mdi-printer">&nbsp;</i>
              Drucken
            </a>
          </li>
          <li class="nav-item">
            <a href="#" class="btn btn-outline-primary">
              <i class="mdi mdi-grid">&nbsp;</i>
              Übersicht
            </a>
          </li>
        </ul>
        <transition name="fade" mode="out-in">
          <popover name="save" :event="'click'">
            Deine Liste wird automatisch gespeichert sobald du daran Änderungen vornimmst.
          </popover>
        </transition>
      </div>
    </nav>
    <div class="d-none d-lg-block field-titles bg-white ">
      <div class="row">
        <div class="col-7">
          <h6 class="ml-3">Name</h6>
        </div>
        <div class="col-11">
          <div class="row no-gutters ml-4 mr-4">
            <div class="col-3">
              <h6 class="">Anzahl</h6>
            </div>
            <div class="col-5">
              <h6 class="">Artikelnummer</h6>
            </div>
            <div class="col-6">
              <h6 class="">Produktname</h6>
            </div>
            <div class="col-4">
              <h6 class="">Summe/Erlös</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import Spinner from './spinner.vue'

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  components: {
    Spinner
  },
  mounted() {
  },
  data() {
    return {
      isFixed: false,
      isSaving: false
    }
  },
  methods: {
    createBuyer() {
      this.$emit('onbuyercreate');
    },
    inHandler() {
      this.isFixed = false;
    },
    outHandler() {
      $('.order-navigation').height($('.order-navigation').height());
      this.isFixed = true;
    },
    updateSearch() {
      this.$emit('input', this.$refs.searchInput.value)
    },
    clearSearch(e) {
      e.preventDefault();
      this.$emit('input', '');
    }
  }
}
</script>
