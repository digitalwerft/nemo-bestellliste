<template>
  <div v-if="!isLoading">
    <section>
      <div class="container" style="max-width: 700px">
        <div class="card">
          <div class="card-body">
            <a href="#" @click.prevent="logout" class="btn btn-sm btn-outline-danger logout-button ml-3 float-right"><i class="mdi mdi-logout">&nbsp;</i>abmelden</a>
            <h4 class="card-title pb-3 mb-3">Hallo {{ fundraiser.first_name }}!</h4>

            <p>
              Bitte wähle das Projekt, für das du eine Sammelbestellung aufgeben möchtest.
            </p>
          </div>
        </div>
      </div>
    </section>
    <section class="campaigns">
      <div class="container" style="max-width: 700px">
        <div v-for="(campaign, index) in campaigns" class="card mt-1">
          <div class="card-body">
            <h5 class="card-title">
              Sammelbestellnummer: #{{ campaign.id }} – <router-link :to="{ name: 'campaign', params: {id: campaign.id}}" class="font-weight-bold">{{ campaign.group }}</router-link>
            </h5>
            <p class="card-text">
              Aktionszeitraum: {{ date(campaign.starts_at) }} - {{ date(campaign.ends_at) }}
            </p>
          </div>
          <div class="card-footer">
            <div class="row no-gutters">
              <div class="col">
                <router-link :to="{ name: 'campaign', params: {id: campaign.id}}" class="btn btn-primary btn-block">{{ buttonText }}</router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import store from '../store'
import utils from '../services/utils'
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
    const modules = ['fundraiser', 'campaigns']

    if (store.getters.hasLoaded(modules)) {
      return
    }

    store.dispatch('fetchModules', {modules: modules, self: this})
      .then(this.hideSpinner)
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
    buttonText() {
        return "Bestellung eingeben"
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
  methods: {
    date(date) {
      return utils.formatDate(date)
    },
    hideSpinner() {
      const spinner = $('.loading-overlay')

      setTimeout(() => {
        spinner.removeClass('loading');
        setTimeout(() => {
          spinner.addClass('hidden');
        }, 1000);
      }, 600);
    },
    logout() {
      this.$store.dispatch('logout').then(() => {
        this.$router.push({name: 'login'})
      })
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
