<template>
  <div v-if="!isLoading">
    <info-box :visible="displayInfo"></info-box>
    <section class="details">
      <fundraiser v-on:display-info="displayInfo = !displayInfo"></fundraiser>
    </section>


    <section class="order-navigation">
      <navbar v-model="search" @oncollectorcreate="createCollector"></navbar>
    </section>
    <section class="orders">
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
  </div>
</template>
<script>
import store from '../store'

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
    infoBox
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
      //$list = $('.orders')
    },
    data(obj) {
      //console.log(obj);
    }
  },
  methods: {
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
    createCollector(e) {
      if (e) {
        e.preventDefault();
      }
      this.$store.commit('CREATE_COLLECTOR')
    }
  }
}
</script>
