<template>
  <div v-if="!isLoading">
    <section>
      <div class="container">
        <div class="card">
          <div class="card-body">
            <h4 class="card-title pb-3 mb-3">Hallo {{ fundraiser.first_name }}!</h4>
            <p>
              Bitte wähle zunächst dasjenige Projekt aus, für welches du
              eine Sammelbestellung aufgeben/erstellen möchtest:
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="campaigns">
      <div class="container">
        <div v-for="(campaign, index) in campaigns" class="card mt-1">
          <div class="card-body">
            SBNr #{{ campaign.id }}: <router-link :to="{ name: 'campaign', params: {id: campaign.id}}">{{ campaign.group }}</router-link>
          </div>
        </div>
      </div>
    </section>
    <!--
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
  -->
  </div>
</template>
<script>
import store from '../store'

import collector from '../components/collector.vue'
import navbar from '../components/navbar.vue'
import infoBox from '../components/info-box.vue'

export default {
  components: {
    collector,
    navbar,
    infoBox
  },
  created() {
    const store = this.$store
    const self  = {self: this}

    if (store.getters.hasLoaded('fundraiser')) {
      return
    }

    store.dispatch('fetchFundraiser', self)
      .then(() => {
        store.dispatch('fetchCampaigns', self)
          .then(this.hideSpinner)
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
    fundraiser() {
      return this.$store.getters.getFundraiser
    },
    campaigns() {
      return this.$store.getters.getCampaigns
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
      return !this.$store.getters.hasLoaded([
        'fundraiser',
        //'campaigns'
      ])
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
        spinner.removeClass('loading');
        setTimeout(() => {
          spinner.addClass('hidden');
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
    }
  }
}
</script>
