<template>
  <div v-if="hasLoaded">
    <info-box :visible="displayInfo" @close-info="displayInfo = false"></info-box>
    <section class="details">
      <fundraiser v-on:display-info="displayInfo = !displayInfo" @logout="logout"></fundraiser>
    </section>


    <section class="order-navigation">
      <navbar v-model="search" @oncollectorcreate="createCollector"></navbar>
    </section>
    <section class="orders">
      <div class="container">
        <div v-for="(collector, index) in filteredCollector">
          <collector :collector-id="collector.id" :filterkey="search" v-on:delete-collector="onCollectorDelete(collector)" v-on:save-collector="onCollectorSave(collector)" v-on:editing-collector="handleEditing"></collector>
        </div>
        <div class="has-orders alert alert-warning mt-3 text-center" v-if="hasOrders">
          <small>Hinweis: Dieses Projekt enthält bereits abgeschlossene Bestellungen. Um alle Bestellungen zu sehen, rufe die <router-link :to="{ name: 'summary'}">Zusammenfassung</router-link> auf.</small>
        </div>
        <div class="alert alert-no-collectors mt-3 text-muted text-center" v-if="filteredCollector && filteredCollector.length < 1">
          Deine Suche nach <mark>{{ search }}</mark> erzielte leider keine Treffer.
        </div>
        <div class="alert alert-no-collectors mt-3 text-muted text-center" v-if="collectors.length < 1">
          Noch wurden keine Teilnehmer zu dieser Bestellung hinzugefügt.
          <a href="#" class="btn btn-lg btn-block btn-success mt-3" @click.prevent="createCollector" >Jetzt ersten Teilnehmer hinzufügen!</a>
        </div>
        <a href="" class="btn btn-light btn-lg btn-block mt-3" @click.prevent="createCollector" :class="{hidden: (search != ''), disabled: hasUnsavedCollector}" v-if="collectors.length > 0">
                      <i class="mdi mdi-account-plus"></i> Teilnehmer hinzufügen
                  </a>
      </div>
    </section>
    <footer-nav></footer-nav>
    <transition name="fade">
      <div class="offline-container" v-if="!isOnline">
        <div class="offline-ui">
          <div class="offline-ui-content">
            Keine Verbindung zum Internet möglich. Bitte verbinde dich erneut mit dem Internet und lade die Seite neu.
            <a href="#" @click.prevent="reload" class="btn btn-block btn-primary text-white"><i class="mdi mdi-reload"></i>Neu Laden</a>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
<style lang="scss">
  .offline-container {
    background: rgba(black, .2);
    z-index: 2000;
    position: fixed;
    top: 0;
    left: 0;
    height: 100%;
    right: 0;
  }
  .offline-ui {
    position: fixed;
    z-index: 2001;
    margin: auto;
    top: 1em;
    left: 0;
    right: 0;
    border-radius: 4px;
    font-family: "Helvetica Neue", sans-serif;
    padding: 1em;
    top: 1em;
    width: 38em;
    max-width: 100%;
    overflow: hidden;
    background: #f8ecad;
    color: #7c6d1f;
  }
</style>
<script>
import store from '../store'

import { OfflineIndicator, VueOnline } from 'vue-online'

import collector from '../components/collector.vue'
import footerNav from '../components/footer-nav.vue'
import navbar from '../components/navbar.vue'
import fundraiser from '../components/fundraiser.vue'
import infoBox from '../components/info-box.vue'

export default {
  components: {
    collector,
    footerNav,
    navbar,
    fundraiser,
    infoBox,
    OfflineIndicator
  },
  created() {
    const store = this.$store
    const self  = {self: this}
    //this.showSpinner()

    let modules = ['campaign', 'items', 'collectors', 'fundraiser', 'orders']
    let reload = this.forceReload

    if(!store.getters.isCurrentCampaign(this.$route.params.id)) {
      reload = true
    }

    if (store.getters.hasLoaded(modules) && !reload && store.getters.isCurrentCampaign(this.$route.params.id)) {
      this.loadingComplete = true
      this.hideSpinner()
      return
    }
    // Fetch Data if not already happened
    store.dispatch('fetchModules', {modules: modules, self: this, reload: reload})
      .then(() => {
        store.commit('NO_RELOAD')
        this.loadingComplete = true
        this.hideSpinner()
      })
  },
  store,
  data() {
    return {
      loadingProgress: 0,
      search: '',
      totalWinnings: 0,
      showModal: false,
      hasUnsavedCollector: false,
      savingComplete: false,
      displayInfo: false,
      loadingComplete: false
    };
  },
  computed: {
    isOnline() {
      return VueOnline.isOnline
    },
    collectors() {
      return this.$store.getters.getAllCollectors;
    },
    items() {
      return this.$store.getters.getAllItems;
    },
    filteredCollector() {
      if (!_.isEmpty(this.collectors)) {
        var v = this.collectors.filter((collector) => {
          return _.lowerCase(collector.name).match(_.lowerCase(this.search));
        });
        return v;
      }
    },
    hasLoaded() {
      return this.$store.getters.hasLoaded(['campaign', 'items', 'collectors', 'fundraiser', 'orders'])
    },
    forceReload() {
      return this.$store.getters.forceReload
    },
    hasOrders() {
      return this.$store.getters.hasOrders
    }
  },
  watch: {
    search(term) {
      if(term != '') {
        this.$store.commit('SEARCHING')
      } else {
        this.$store.commit('RESET_ACTIONS')
      }
    },
    hasLoaded(value) {
      if(value) {
        this.hideSpinner()
      } else {
        this.showSpinner()
      }
    }
  },
  methods: {
    reload() {
      location.reload()
    },
    hideSpinner() {
      const spinner = $('.loading-overlay')

      setTimeout(() => {
        spinner.removeClass('loading')
        setTimeout(() => {
          spinner.addClass('hidden')
        }, 1200);
      }, 600);
    },
    showSpinner() {
      const spinner = $('.loading-overlay')
      spinner.removeClass('hidden')
      setTimeout(()=> {
        spinner.addClass('loading')
      }, 150)
    },
    showSpinnerOnLoad() {
      const spinner = $('.loading-overlay')
      spinner.addClass('loading').removeClass('hidden')
    },
    handleEditing(isEditing) {
      if (isEditing) {
        this.hasUnsavedCollector = true
      } else {
        this.hasUnsavedCollector = false
      }
    },
    onCollectorSave(collector) {
      //this.$store.dispatch('updateCollectorName', collector)
    },
    onCollectorDelete(collector) {
      //this.$store.dispatch('deleteCollector', collector)
    },
    finishLoading() {
      setTimeout(() => {
        $('.loading-overlay').removeClass('loading');
        setTimeout(() => {
          $('.loading-overlay').addClass('hidden');
        }, 1000);
      }, 600);
    },
    note(options) {
      var opt = {
        title: 'title',
        message: 'message',
        color: 'green',
        icon: 'mdi mdi-check'
      };
      iziToast.show(_.merge(opt, options));
    },
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({name: 'login'})
      })
    },
    createCollector(e) {
      if (e) {
        e.preventDefault();
      }
      if(!this.hasUnsavedCollector) {
        this.$store.commit('CREATE_COLLECTOR', this.$route.params.id)
      }
    }
  }
}
</script>
