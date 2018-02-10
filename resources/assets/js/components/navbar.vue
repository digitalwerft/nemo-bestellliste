<template>
<div class="pt-1">
  <div v-waypoint="{active: true, callback: onWaypoint, options: intersectionOptions}"></div>
  <div class="container sticky-container" v-bind:class="{ 'fixed-top': isFixed }">

    <nav class="navbar navbar-expand navbar-light bg-white">

      <span class="navbar-brand mr-0">Bestellliste</span>
      <transition name="fade">
        <div class="form-inline d-block d-sm-none" v-if="showSearch">
          <input class="form-control" type="search" ref="searchInput-1" placeholder="Suchen" aria-label="Search" :value="value" @input="updateSearch()" id="search-input">
          <a href="" class="mdi mdi-close-circle-outline clear-search" @click="clearSearch"></a>
        </div>
      </transition>

      <div class="form-inline d-none d-sm-flex ml-2">
        <input class="form-control" type="search" ref="searchInput-2" placeholder="Suchen" aria-label="Search" :value="value" @input="updateSearch()" id="search-input">
        <label for="search-input" class="search-icon" v-if="!value">
          <i class="mdi mdi-magnify"></i>
        </label>
        <a href="" class="mdi mdi-close-circle-outline clear-search" @click="clearSearch" :class="{hidden: (value=='')}"></a>
      </div>

        <ul class="navbar-nav ml-auto">
          <li class="nav-item text-success save-indicator">
            <save-indicator :is-saving="isSaving" :is-editing="isEditing"></save-indicator>
          </li>
          <li class="nav-item d-none d-sm-list-item">
            <a href="#" class="btn btn-outline-primary mr-2" @click.prevent="createCollector()">
              <i class="mdi mdi-account-plus">&nbsp;</i>
              <span class="d-none d-lg-inline">neuer Teilnehmer</span>
            </a>
          </li>
          <li class="nav-item d-sm-none d-xs-list-item">
            <a href="#" class="btn btn-outline-primary mr-2" @click.prevent="showSearch = !showSearch"><i class="mdi mdi-magnify"></i></a>
          </li>
          <li class="nav-item">
            <router-link :to="{name: 'summary'}" class="btn btn-outline-primary">
              <i class="mdi mdi-format-list-bulleted">&nbsp;</i>
              <span class="d-none d-md-inline">Zusammenfassung</span>
            </router-link>
          </li>
        </ul>
        <transition name="fade" mode="out-in">
          <popover name="save" :event="'click'">
            Deine Liste wird automatisch gespeichert sobald du daran Änderungen vornimmst.
          </popover>
        </transition>

    </nav>
    <div class="d-none d-lg-block field-titles bg-white ">
      <div class="row">
        <div class="col-md-5">
          <h6 class="ml-3">Name</h6>
        </div>
        <div class="col-md-13">
          <div class="row no-gutters ml-4 mr-4">
            <div class="col">
              <h6 class="">Art.-Nr.</h6>
            </div>
            <div class="col-lg-8">
              <h6 class="">Produktname</h6>
            </div>
            <div class="col-lg-3">
              <h6 class="">Menge</h6>
            </div>
            <div class="col-lg-5">
              <h6 class=""><small>Preis p. Box/</small>Gesamt</h6>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <a href="#" class="btn btn-lg btn-primary floating-button d-inline-block d-sm-none" @click.prevent="createCollector()">
    <i class="mdi mdi-account-plus"></i>
  </a>

</div>
</template>

<script>
//import Spinner from './spinner.vue'
import SaveIndicator from './save-indicator.vue'

export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  components: {
    SaveIndicator
  },
  mounted() {
  },
  data() {
    return {
      isFixed: false,
      showSearch: false,
      intersectionOptions: {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        thresholds: [0]
      }
    }
  },
  computed: {
    isSaving() {
      return this.$store.state.isLoading
    },
    isEditing() {
      return this.$store.state.editing
    }
  },
  methods: {
    onWaypoint ({ going, direction }) {
      // going: in, out
      // direction: top, right, bottom, left
      if (going === this.$waypointMap.GOING_IN) {
        this.isFixed = false
      }

      if (direction === this.$waypointMap.DIRECTION_TOP && going === this.$waypointMap.GOING_OUT) {
        this.isFixed = true
      }
    },
    createCollector() {
      this.$emit('oncollectorcreate');
    },
    inHandler() {
      this.isFixed = false;
    },
    outHandler(e) {
      $('.order-navigation').height($('.order-navigation').height());
      this.isFixed = true;
    //  console.log(this.$waypointMap)
    },
    updateSearch() {
      if(this.showSearch) {
        this.$emit('input', this.$refs['searchInput-1'].value)
      } else {
        this.$emit('input', this.$refs['searchInput-2'].value)
      }
    },
    clearSearch(e) {
      e.preventDefault();
      this.$emit('input', '');
      this.showSearch = false
    },
    saving(isSaving) {
      this.isSaving = isSaving;
    }
  }
}
</script>
