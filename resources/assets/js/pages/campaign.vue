<template>
  <div v-if="!isLoading">
    <info-box :visible="displayInfo"></info-box>
    <section class="details">
      <fundraiser v-on:display-info="displayInfo = !displayInfo" @logout="logout"></fundraiser>
    </section>


    <section class="order-navigation">
      <navbar v-model="search" @oncollectorcreate="createCollector"></navbar>
    </section>
    <section class="orders" @shortkey="handleShortcuts" v-shortkey="{down: ['arrowdown'], up: ['arrowup'], tab: ['tab'], shiftTab: ['shift', 'tab'], plus: ['arrowright'], minus: ['arrowleft'], delete: ['46'], create: ['enter'], cancel: ['esc'], createCollector: ['shift', 't'], number: ['1']}">
      <div class="container">
        <div v-for="(collector, index) in filteredCollector">
          <collector :collector-id="collector.id" :filterkey="search" v-on:delete-collector="onCollectorDelete(collector)" v-on:save-collector="onCollectorSave(collector)" v-on:editing-collector="handleEditing"></collector>
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

    if (store.getters.hasLoaded(['campaign', 'items', 'collectors'])) {
      return
    }

    this.showSpinner()
    // Fetch Data if not already happened
    store.dispatch('fetchCampaign', self)
      .then(() => {
        store.dispatch('fetchItems', self)
          .then(() => {
            store.dispatch('fetchCollectors', self)
              .then(this.hideSpinner)
          })
      })
      if (!store.getters.hasLoaded('fundraiser')) {
        store.dispatch('fetchFundraiser', self)
      }
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
      displayInfo: false
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
    isLoading() {
      if(this.$store.getters.hasFullyLoaded) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    search(term) {
      if(term != '') {
        this.$store.commit('SEARCHING')
      } else {
        this.$store.commit('RESET_ACTIONS')
      }
    }
  },
  methods: {
    handleShortcuts(event) {
      //console.log(event)
      switch (event.srcKey) {
        case 'down':
          if(!this.$store.state.collectors.selectedItem) {
            var firstCollector = this.$store.state.collectors.all[0]
            var firstItem = firstCollector.items[0]
            if(firstItem) {
              this.$store.commit('SELECT_ITEM', firstItem.id)
              this.$store.commit('SELECT_COLLECTOR', firstCollector.id)
            }
          }
          else {
            var next = this.$store.getters.getNextItemWithCollector
            if(next) {
              this.$store.commit('SELECT_ITEM', next.item.id)
              this.$store.commit('SELECT_COLLECTOR', next.collector.id)
            }
          }
        break
        case 'up':
          if(!this.$store.state.collectors.selectedItem) {
            var firstCollector = this.$store.state.collectors.all[0]
            var firstItem = firstCollector.items[0]
            if(firstItem) {
              this.$store.commit('SELECT_ITEM', firstItem.id)
              this.$store.commit('SELECT_COLLECTOR', firstCollector.id)
            }
          }
          var previous = this.$store.getters.getPreviousItemWithCollector
          if(previous) {
            this.$store.commit('SELECT_ITEM', previous.item.id)
            this.$store.commit('SELECT_COLLECTOR', previous.collector.id)
          }
        break
        case 'tab':
          var nextCollector = this.$store.getters.getNextCollector
          if(nextCollector) {
            this.$store.commit('SELECT_COLLECTOR', nextCollector.id)
            if(nextCollector.items[0]) {
              this.$store.commit('SELECT_ITEM', nextCollector.items[0].id)
            }
          }
        break
        case 'shiftTab':
        var previousCollector = this.$store.getters.getPreviousCollector
        if(previousCollector) {
          this.$store.commit('SELECT_COLLECTOR', previousCollector.id)
          if(previousCollector.items[0]) {
            this.$store.commit('SELECT_ITEM', previousCollector.items[previousCollector.items.length-1].id)
          }
        }
        break
        case 'plus':
          var item = this.getSelectedItemComponent()
          if(item) {
            item.increaseQuantity()
          }
        break
        case 'minus':
          var item = this.getSelectedItemComponent()
          if(item) {
            item.decreaseQuantity()
          }
        break
        case 'create':
          var collector = this.$store.getters.getCollectorById(this.$store.state.collectors.selectedCollector)
          if(collector) {
            this.$store.commit('START_EDITING', 'CREATING_ITEM')
            this.$store.commit('CREATE_ITEM', collector)
            this.$store.commit('SELECT_ITEM', collector.items[collector.items.length-1].id)
          }
        break
        case 'cancel':
          if(this.$store.state.action == 'EDITING_COLLECTOR') {
            this.cancelCollectorEditing()
          } else if(this.$store.state.action == 'CREATING_ITEM') {
            this.cancelItemCreation()
          }
        break
        case 'createCollector':
          this.createCollector()
        break
        case 'number':
          console.log(event)
        break
      }
    },
    reload() {
      location.reload()
    },
    cancelCollectorEditing() {
      console.log('cancel collector editing')
    },
    cancelItemCreation() {
      var item = this.getSelectedItemComponent()
      if(this.$store.getters.itemHasNoNumber(item.item.id)) {
        item.destroy()
      }
    },
    getSelectedItemComponent() {
      var collectorComponents = _.filter(this.$children, component => {
        return component.isCollector
      })
      var collectorComponent = _.filter(collectorComponents, collector => {
        return collector.collectorId == this.$store.state.collectors.selectedCollector
      })
      if(collectorComponent.length > 0) {
        var itemComponent = _.filter(collectorComponent[0].$children, item => {
          return item.item.id == this.$store.state.collectors.selectedItem
        })
      }
      if(itemComponent && itemComponent.length > 0) {
        return itemComponent[0]
      }
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
      console.log('logout')
      this.$store.dispatch('logout').then(() => {
        this.$router.push('home')
      })
    },
    createCollector(e) {
      console.log(e)
      if (e) {
        e.preventDefault();
      }
      if(!this.hasUnsavedCollector) {
        this.$store.commit('CREATE_COLLECTOR')
        this.$store.commit('EDITING_COLLECTOR')
      }
    }
  }
}
</script>
