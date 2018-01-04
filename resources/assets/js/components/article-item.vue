<template>
<div class="input-group row no-gutters article-item mb-2" :id="id" :class="{'dialog-open': showModal, disabled: disabled}">
  <div class="input-group col-8 col-lg-5 no-gutters spinner-col">
    <span class="input-group-btn col">
                <!--<input-number :step="step" :min="min" :max="max" :maxlength="maxLength"  :startQuantity="amount" @onInputNumberChange="onAmountChange"></input-number>-->
                <input-spinner
                  :min="1"
                  :max="1000"
                  :step="1"
                  :integerOnly="true"
                  v-model="quantity"
                  @onInputNumberChange="onAmountChange"
                  ></input-spinner>
            </span>
    <span class="input-group col-hash">
      <i class="mdi mdi-pound"></i>
    </span>
  </div>
  <div class="col-6 col-lg-4 select-col">
    <v-select v-model="details.id" :options="autocomplete" :on-change="onArticleChange" label="id">
      <span slot="no-options">Keine(n) Artikel gefunden.</span>
    </v-select>
  </div>
  <span class="input-group-addon col-lg-5 col-9 name-col">
            {{ name ? name : '--' }}&nbsp;<small class="text-muted">{{ size ? '('+size+')' : '' }}</small>
        </span>
  <span class="input-group-addon col-lg-2 col-9 font-weight-bold sum-col">
            <small class="d-inline d-lg-none font-weight-normal text-muted">Summe/Erlös:&nbsp;</small>{{ sum }}€<small class="text-muted">/{{ returns }}€</small>
        </span>
  <span class="input-group-btn col-4 col-lg-2 delete-col">
            <a href="#" class="btn btn-outline-danger btn-block" v-on:click.prevent="showModal = true">
                <i class="mdi mdi-delete"></i>
            </a>
        </span>
  <div class="article-modal-overlay" v-if="showModal" :class="{ active: showModal }">
    <div class="row no-gutters">
      <div class="col-10 confirm-message font-weight-bold"><span class="d-none d-md-inline">Artikel</span> wirklich löschen?</div>
      <div class="col-4 cancel-article-delete">
        <a href="#" class="btn btn-outline-danger btn-block" @click="onArticleDelete">
          <i class="mdi mdi-check"></i>
          <span class="d-none d-lg-inline">löschen</span></a>
      </div>
      <div class="col-4 delete-article">
        <a href="#" class="btn btn-outline-primary btn-block" @click.prevent="showModal = false">
          <i class="mdi mdi-close"></i>
          <span class="d-none d-lg-inline">abbrechen</span>
        </a>
      </div>
    </div>
  </div>
  <transition name="modal">
    <div class="modal-mask" v-if="showModal" @click="showModal = false"></div>
  </transition>
</div>
</template>

<script>
import vSelect from 'vue-select'
import InputSpinner from './input-spinner.vue'
import confirm from './confirm.vue'

export default {
  name: 'article-item',
  components: {
    vSelect,
    InputSpinner,
    confirm
  },
  props: {
    amount: {
      type: Number,
      default: 0
    },
    articleId: {
    },
    articleIndex: {
      type: Number
    },
    buyerId: {
      type: Number
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      step: 1,
      min: 1,
      max: 100,
      maxLength: 3,
      showModal: false
    };
  },
  computed: {
    name() {
      return this.details ? this.details.name : false
    },
    // get unique id for each element for dom-events
    id() {
      return 'buyer-' + this.buyerId + '__article-' + this.articleId
    },
    // v-model workaround for article amount
    quantity: {
      get() {
        return this.amount;
      },
      set(value) {
        // store new article quantity
        this.$store.commit('changeArticleAmount', {
          buyerId: this.buyerId,
          value: value,
          index: this.articleId
        });
      }
    },
    // get details from article store (like prices and names etc.)
    details() {
      // default obj, if none is selected
      var def = {
        id: 0,
        price: 0
      };
      var details = this.$store.getters.getArticleById(this.articleId);
      // if this.articleId is not specified (when article is newly added and
      // no article is specified) return default values
      return details ? details : def
    },
    // get size value of current article, if selected
    size() {
      return this.details ? this.details.size : ''
    },
    // get price of this article with speciied amount
    sum() {
      return this.details ? this.amount * this.details.price : '';
    },
    returns() {
      return this.details ? this.amount * this.details.returns : '';
    },
    // get array with all available articles
    autocomplete() {
      var articles = _.clone(this.$store.state.articles.all)
      var buyerArticles = this.$store.getters.getArticlesByBuyerId(this.buyerId);
      var newArticles = [];
      for(var i =0; i < articles.length+1; i++) {
        for(var j = 0; j < buyerArticles.length; j++) {
          if(articles[i]) {
            if(
              parseInt(articles[i].id) == parseInt(buyerArticles[j].id)
              || parseInt(articles[i].id == parseInt(this.articleId))
            ) {
              //console.log('same', articles[i].id)
              //articles.splice(i, 1)
              newArticles[i] = articles[i]
            }
          }
        }
      }
      _.each(newArticles, newArticle => {
        _.pull(articles, newArticle)
      })
      return articles
    }
  },
  methods: {
    // update article quantity in store
    onAmountChange(value) {
      this.$store.commit('changeArticleAmount', {
        buyerId: this.buyerId,
        value: value,
        index: this.articleId
      });
    },
    // Invoke article deletion
    onArticleDelete(e) {
      e.preventDefault();


        this.$store.commit('deleteArticle', {
          buyerId: this.buyerId,
          articleIndex: this.articleIndex
        })

      this.showModal = false;
      this.$note.info({
        message: 'Artikel wurde gelöscht'
      })
    },
    onArticleChange(newArticle) {
      if (typeof(newArticle) === 'object') {
        this.$store.commit('changeArticleId', {
          buyerId: this.buyerId,
          newId: newArticle.id,
          oldId: this.articleId
        })
      }
    }
  }
}
</script>
<style lang="scss">
@import '../../sass/modules/select.scss'
</style>
