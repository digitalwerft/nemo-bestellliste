<template>
<div class="row buyer small-gutters mb-1 row-eq-height">
  <div class="col-md-7">
    <div class="card buyer-name-card" :class="{editing: editing, deleting: showModal}">
      <div class="card-body buyer-name">
        <div class="input-group">
          <input type="text" class="form-control" v-if="editing" placeholder="Name" v-model="buyerName" ref="name">
          <div class="mobile-save-modal d-flex d-md-none">
            <a href="#" class="btn btn-light save-buyer text-success" @click="handleLeftButtonClick">
              <i class="mdi" :class="{'mdi-pencil': !editing, 'mdi-check': editing}"></i>
            </a>
            <a href="#" class="btn btn-light cancel-edit text-danger" @click="handeRightButtonClick">
              <i class="mdi" :class="{'mdi-delete': !editing, 'mdi-close': editing}"></i>
            </a>
          </div>
          <div class="input-group buyer-name-title" :class="{ hidden: editing}">
            <h6 v-html="highlight(buyer.name)" @click.prevent="makeEditable"></h6>
          </div>
        </div>
        <div class="buyer-details mt-3">
          <small class="text-muted">Artikel: {{ articleCount }} | Summe: {{ totalPrice }}€</small>
        </div>
      </div>
      <div class="card-footer" :class="{collapsed: collapsed}">
        <a href="#" class="btn btn-light btn-block show-articles d-block d-md-none" @click.prevent="collapsed = !collapsed"><i class="mdi" :class="{'mdi-chevron-down': collapsed, 'mdi-chevron-up': !collapsed}"></i></a>
        <div class="row no-gutters edit-buyer d-none d-md-flex">
          <div class="col">
            <a href="" class="btn btn-light text-success btn-sm btn-block" @click="handleLeftButtonClick" :class="{active: editing}">
                                <i class="mdi" :class="{'mdi-pencil': !editing, 'mdi-check': editing}"></i>
                                <span v-if="editing">speichern</span>
                                <span v-if="!editing">bearbeiten</span>
                            </a>
          </div>
          <div class="col">
            <a href="" class="btn btn-light text-danger btn-sm btn-block" @click="handeRightButtonClick">
                                <i class="mdi" :class="{'mdi-delete': !editing, 'mdi-close': editing}"></i>
                                <span v-if="editing">abbrechen</span>
                                <span v-if="!editing">löschen</span>
                            </a>
          </div>
        </div>

      </div>
    </div>

  </div>
  <div class="col-md-11 article-list" :class="{editing: editing, deleting: showModal, collapsed: collapsed}">
    <div class="card">
      <div class="card-body">
        <div v-for="(article, index) in buyer.articles">
          <article-item :articleId="article.id" :amount="article.amount" :buyerId="buyerId" :article-index="index" :disabled="editing"></article-item>
        </div>
        <div class="no-articles text-center" v-if="buyer.articles.length<1">
          <small class="text-muted text-danger text-center" v-if="!buyer.name">Dieser Teilnehmer braucht einen Namen, bevor du ihm Artikel zuweisen kannst.</small>
          <small class="text-muted text-center" v-if="buyer.name">{{ buyer.name }} hat noch keine Artikel gekauft.</small>
            <a href="#" class="btn btn-light btn-block btn-sm" @click.prevent="addArticle" v-if="buyer.name"><i class="mdi mdi-plus"></i> Artikel Hinzufügen?</a>
        </div>
      </div>
      <div class="card-footer">
        <a href="#" class="btn btn-light btn-block btn-sm" :class="{disabled: !buyer.name || articleList.length == buyer.articles.length}" @click.prevent="addArticle"><i class="mdi mdi-plus"></i> Artikel hinzufügen</a>
      </div>
      <div class="article-blocker" v-if="editing"></div>
    </div>
  </div>
  <modal v-if="showModal" @close="showModal = false">
    <h5 slot="header">Bestellung wirklich löschen?</h5>
    <span slot="body">
                Diese Aktion kann nicht rückgängig gemacht werden.
            </span>
    <div slot="footer" class="modal-footer">
      <a href="#" class="btn btn-secondary col" @click.prevent="showModal = false">abbrechen</a>
      <a href="#" class="btn btn-danger col" @click.prevent="archive" v-shortkey="['enter']" @shortkey="archive">löschen</a>
    </div>
  </modal>
</div>
</template>
<script>
import ArticleItem from './article-item.vue'
import modal from './modal.vue'

export default {
  props: ['buyerId', 'filterkey'],
  components: {
    ArticleItem,
    modal
  },
  mounted() {
    if (this.buyer.name === '') {
      this.editing = true;
    }
    this.$on('delete-buyer', (name)=> {
      // only show message if buyer wasn't new
      if(this.oldName) {
        this.$note.info({
          message: '<strong>'+name+ '</strong> wurde aus der Liste entfernt.'
        })
      }
    })

  },
  data() {
    return {
      editing: false,
      oldName: '',
      showModal: false,
      collapsed: true,
      state: 'active' // not in use yet, optional for undo feature
    }
  },
  computed: {
    // workaround vor v-model values on vuex-models
    // (see: https://vuex.vuejs.org/en/forms.html)
    buyerName: {
      get() {
        return this.buyer.name
      },
      set(value) {
        this.$store.commit('updateBuyerName', {
          buyer: this.buyer,
          newName: value
        })
      }
    },
    // get current Buyer by this.buyerId from store component
    buyer() {
      return this.$store.getters.getBuyerById(this.buyerId);
    },
    // count all articles
    articleCount() {
      return this.$store.getters.getArticlesAmountByBuyerId(this.buyerId)
    },
    articleList() {
      return this.$store.state.articles.all
    },
    // evaluate price of all articles togehter
    totalPrice() {
      return this.$store.getters.getTotalOrdersPriceByBuyerId(this.buyerId)
    }
  },
  watch: {
    // watch for changes in this.editing
    editing(isEditing) {
      // if user edits buyer
      if (isEditing) {
        // tell parent
        this.$emit('editing-buyer', true)
        // and focus name (won't work without  timeout)
        setTimeout(() => {
          this.$refs.name.focus()
        }, 100)
      } else {
        // tell parent
        this.$emit('editing-buyer', false)
      }
    }
  },
  methods: {
    test(e) {
      console.log(e)
    },
    makeEditable(e) {
      // enter editing mode
      e.preventDefault();
      this.editing = true;
      // save current Name, for restoring if name was changed but cancelled.
      this.oldName = this.buyer.name;
    },
    cancelEdit() {
      // Cancel Edit and revert Name Changes
      this.$store.commit('updateBuyerName', {
        buyer: this.buyer,
        newName: this.oldName
      })
    },
    // method to hilghlight words that are searched for
    highlight(words) {
      // only highlight text if search term (this.filterkey) isn't empty
      if (this.filterkey != '') {
        // match pattern for search term (i = ignore case, g = global match;
        // find all matches rather than stopping after the first match)
        var iQuery = new RegExp(this.filterkey, "ig");
        // wrap matched term in <span class="highlight">$term</span>
        return words.toString().replace(iQuery, function(matchedTxt, a, b) {
          return ('<span class=\'highlight\'>' + matchedTxt + '</span>');
        });
      } else {
        // don't highlight anything if nothing was searched
        return words;
      }
    },
    handeRightButtonClick(e)  {
      e.preventDefault();
      // if not in editing mode, deletion is requested
      if (!this.editing) {
        this.showModal = true;
        // if buyer is newly added (hence, it has no name and no articles)
        // delete it when clicked an 'cancel'
      } else if (this.oldName == '' && this.buyer.articles.length < 1) {
        this.archive();
        // leave editing mode and revert changes
      } else {
        this.editing = false;
        this.cancelEdit();
      }
    },
    handleLeftButtonClick(e) {
      e.preventDefault();
      // enter editing mode if not already happened
      if (!this.editing) {
        this.makeEditable(e)
      } else if (!this.buyer.name) {    // if in editing mode dont save buyer if name is empty
        return
      } else {                          // close editing mode and syve changes
        this.$emit('save-buyer')
        this.oldName = '';
        this.editing = false;
      }
    },
    // Wrapper for this.delete() for optional undo feature
    archive() {
      this.showModal = false
      this.delete()
    },
    delete() {
      // Tell parent component that buyer was deleted
      this.$emit('delete-buyer', this.buyer.name)
      // Send delete-request to Store Component
      this.$store.commit('delete-buyer', {
        buyer: this.buyer,
        buyerId: this.buyerId
      })
      // Only notify when article was saved before
      if(this.buyer.articles.length) {
        this.$note.info({
          message: 'Teilnehmer wurde gelöscht.'
        })
      }
    },
    addArticle() {
      // dont add Article when in editing mode
      if(!this.editing) {
        // add new Article to Store Component
        this.$store.commit('newArticle', {
          buyerId: this.buyerId,
          initialId: this.$store.state.articles.all[0].id
        })
      }
    }
  }
}
</script>
