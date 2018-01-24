<template>
  <div v-if="!isLoading">
    <info-box :visible="displayInfo"></info-box>
    <section class="details">
      <user v-on:display-info="displayInfo = !displayInfo"></user>
    </section>


    <section class="order-navigation">
      <navbar v-model="search" @onbuyercreate="createBuyer"></navbar>
    </section>
    <section class="orders">
      <div class="container">
        <div v-for="(buyer, index) in filteredBuyer">
          <div v-if="buyer.state == 'active'">
            <buyer :buyer-id="buyer.id" :filterkey="search" v-on:delete-buyer="onBuyerDeleted" v-on:save-buyer="onBuyerSaved" v-on:editing-buyer="handleEditing"></buyer>
          </div>
        </div>
        <div class="alert alert-no-buyers mt-3 text-muted text-center" v-if="filteredBuyer && filteredBuyer.length < 1">
          Deine Suche nach <mark>{{ search }}</mark> erzielte leider keine Treffer.
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
    <footer-nav></footer-nav>
  </div>
</template>
<script>
import store from '../store'

import buyer from '../components/buyer.vue'
import footerNav from '../components/footer-nav.vue'
import navbar from '../components/navbar.vue'
import user from '../components/user.vue'
import infoBox from '../components/info-box.vue'

export default {
  components: {
    buyer,
    footerNav,
    navbar,
    user,
    infoBox
  },
  created() {
    // Fetch Data if not already happened
    if(!this.$store.getters.hasFullyLoaded) {
      this.$store.dispatch('fetchAll', {
        self: this
      }).then(() => {
        this.finishLoading()
      })
    }
    if (!this.buyers) {
      displayInfo = true;
    }
  },
  store,
  data() {
    return {
      loadingProgress: 0,
      search: '',
      totalWinnings: 0,
      showModal: false,
      hasUnsavedBuyer: false,
      savingComplete: false,
      displayInfo: false
    };
  },
  computed: {
    buyers() {
      return this.$store.getters.getAllBuyers;
    },
    articles() {
      return this.$store.getters.getAllArticles;
    },
    filteredBuyer() {
      if (!_.isEmpty(this.buyers)) {
        var v = this.buyers.filter((buyer) => {
          return _.lowerCase(buyer.name).match(_.lowerCase(this.search));
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
    handleEditing(isEditing) {
      if (isEditing) {
        this.hasUnsavedBuyer = true
      } else {
        this.hasUnsavedBuyer = false
      }
    },
    onBuyerEdit(a) {
      //console.log(a)
    },
    onBuyerSaved() {
      if (this.hasUnsavedBuyer) {
        this.hasUnsavedBuyer = false
      }
    },
    onBuyerDeleted() {
      if (this.hasUnsavedBuyer) {
        this.hasUnsavedBuyer = false
      }
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
    createBuyer(e) {
      if (e) {
        e.preventDefault();
      }
      if (!this.hasUnsavedBuyer) {
        this.hasUnsavedBuyer = true
        this.$store.commit('newBuyer')
      }
    }
  }
}
</script>
