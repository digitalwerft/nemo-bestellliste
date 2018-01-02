<template>
<div class="input-group row no-gutters article-item mb-2" :id="id" :class="{'dialog-open': showModal}">
  <div class="input-group col-3 no-gutters">
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
  <div class="col-7">
    <v-select v-model="details.id" :options="autocomplete" :on-change="onArticleChange" label="id">
      <span slot="no-options">Sorry, den Artikel gibt es nicht.</span>
    </v-select>
  </div>
  <span class="input-group-addon col-4">
            {{ name ? name : '--' }}&nbsp;<small class="text-muted">{{ size ? '('+size+')' : '' }}</small>
        </span>
  <span class="input-group-addon col-2 font-weight-bold">
            {{ sum }}€
        </span>
  <span class="input-group-btn col-2">
            <a href="#" class="btn btn-outline-danger btn-block" v-on:click.prevent="showModal = true">
                <i class="mdi mdi-delete"></i>
            </a>
        </span>
  <div class="article-modal-overlay" v-if="showModal" :class="{active: showModal}">
    <div class="row no-gutters">
      <div class="col-10 confirm-message font-weight-bold">Artikel wirklich löschen?</div>
      <div class="col-4 cancel-article-delete">
        <a href="#" class="btn btn-outline-danger btn-block" @click="onArticleDelete">Löschen</a>
      </div>
      <div class="col-4 delete-article">
        <a href="#" class="btn btn-outline-primary btn-block" @click.prevent="showModal = false">Abbrechen</a>
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
  props: ['amount', 'articleId', 'articleIndex', 'buyerId'],
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
    id() {
      return 'buyer-' + this.buyerId + '__article-' + this.articleId
    },
    quantity: {
      get() {
        return this.amount;
      },
      set(value) {
        this.$store.commit('changeArticleAmount', {
          buyerId: this.buyerId,
          value: value,
          index: this.articleId
        });
      }
    },
    details() {
      var def = {
        id: 0,
        price: 0
      };
      var details = this.$store.getters.getArticleById(this.articleId);
      return details ? details : def
    },
    size() {
      return this.details ? this.details.size : ''
    },
    sum() {
      return this.details ? this.amount * this.details.price : '';
    },
    autocomplete() {
      return this.$store.state.articles.all;
    }
  },
  methods: {
    onAmountChange(value) {
      this.$store.commit('changeArticleAmount', {
        buyerId: this.buyerId,
        value: value,
        index: this.articleId
      });
    },
    onArticleDelete(e) {
      e.preventDefault();
      setTimeout(() => {
        if (this.$store.getters.getBuyerById(this.buyerId).articles.length > 1) {
          this.$store.commit('deleteArticle', {
            buyerId: this.buyerId,
            articleIndex: this.articleIndex
          })
        } else {
          this.$store.commit('resetArticle', {
            buyerId: this.buyerId,
            articleIndex: this.articleIndex
          })
        }
        this.showModal = false;
        this.$note.info({
          message: 'Artikel wurde gelöscht'
        })
      }, 0)
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
<style>
.v-select .open-indicator {
  width: auto;
  height: auto;
  top: 4px;
}

.v-select.searchable .dropdown-toggle {
  border-right: none;
  border-left: none;
  border-radius: 0;
  border-top: 1px solid transparent;
  border-bottom: 1px solid transparent;
}

.v-select .open-indicator:before {
  border: none;
  content: "\F140";
  display: inline-block;
  font: normal normal normal 24px/1 "Material Design Icons";
  font-size: 20px;
  text-rendering: auto;
  line-height: inherit;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  transform: rotate(0deg);
  width: auto;
  height: auto;
}

.v-select.open .open-indicator:before {
  transform: rotate(180deg);
}
</style>
