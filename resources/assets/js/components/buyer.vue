<template>
<div class="row buyer small-gutters mb-1 row-eq-height">
  <div class="col-7">
    <div class="card buyer-name-card" :class="{editing: editing}">
      <div class="card-body buyer-name">
        <div class="input-group">
          <input type="text" class="form-control" :class="{ hidden: !editing}" placeholder="Name" v-model="buyerName" ref="name">
          <div class="input-group buyer-name-title" :class="{ hidden: editing}">
            <h6 v-html="highlight(buyer.name)" @click="makeEditable"></h6>
          </div>
        </div>
        <div class="buyer-details mt-3">
          <small class="text-muted">Artikel: {{ articleCount }} | Summe: {{ totalPrice }}€</small>
        </div>
      </div>
      <div class="card-footer">
        <div class="row no-gutters">
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
  <div class="col-11 article-list" :class="{editing: editing}">
    <div class="card">
      <div class="card-body">
        <div v-for="(article, index) in buyer.articles">
          <article-item :articleId="article.id" :amount="article.amount" :buyerId="buyerId" :article-index="index"></article-item>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-light btn-block btn-sm" :disabled="!buyer.name" @click="addArticle"><i class="mdi mdi-plus"></i> Artikel hinzufügen</button>
      </div>

    </div>
  </div>
  <modal v-if="showModal" @close="showModal = false">
    <h5 slot="header">Bestellung wirklich löschen?</h5>
    <span slot="body">
                Diese Aktion kann nicht rückgängig gemacht werden.
            </span>
    <div slot="footer" class="modal-footer">
      <a href="#" class="btn btn-secondary col" @click.prevent="showModal = false">Abbrechen</a>
      <a href="#" class="btn btn-danger col" @click.prevent="archive">Löschen</a>
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
      state: 'active'
    }
  },
  computed: {
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
    buyer() {
      return this.$store.getters.getBuyerById(this.buyerId);
    },
    articleCount() {
      return this.$store.getters.getArticlesAmountByBuyerId(this.buyerId)
    },
    totalPrice() {
      return this.$store.getters.getTotalOrdersPriceByBuyerId(this.buyerId)
    }
  },
  watch: {
    editing(isEditing) {
      if (isEditing) {
        this.$emit('editing-buyer', this.buyerId)
        setTimeout(() => {
          this.$refs.name.focus()
        }, 100)
      } else {
        this.$emit('save-buyer');
      }
    }
  },
  methods: {
    makeEditable(e) {
      e.preventDefault();
      this.editing = true;
      this.oldName = this.buyer.name;
    },
    cancelEdit() {
      this.$store.commit('updateBuyerName', {
        buyer: this.buyer,
        newName: this.oldName
      })
    },
    highlight(words) {
      if (this.filterkey != '') {
        var iQuery = new RegExp(this.filterkey, "ig");

        return words.toString().replace(iQuery, function(matchedTxt, a, b) {
          return ('<span class=\'highlight\'>' + matchedTxt + '</span>');
        });
      } else {
        return words;
      }
    },
    handeRightButtonClick(e)  {
      e.preventDefault();

      if (!this.editing) {
        this.showModal = true;
      } else if (this.oldName == '' && this.buyer.articles.length < 1) {
        this.archive();
      } else {
        this.editing = false;
        this.cancelEdit();
      }
    },
    handleLeftButtonClick(e) {
      e.preventDefault();
      // edit if not editing
      if (!this.editing) {
        this.makeEditable(e)
      } else if (!this.buyer.name) {    // dont save if name is empty
        return
      } else {                          // close editing mode
        this.$emit('save-buyer')
        this.oldName = '';
        this.editing = false;
      }
    },
    archive() {
      this.showModal = false
      this.delete()
    },
    delete() {
      this.$emit('delete-buyer', this.buyer.name)
      this.$store.commit('delete-buyer', {
        buyer: this.buyer,
        buyerId: this.buyerId
      })
    },
    undo() {
      this.buyer.state = 'active';
    },
    addArticle() {
      this.$store.commit('newArticle', {
        buyerId: this.buyerId,
        initialId: this.$store.state.articles.all[0].id
      })
    }
  }
}
</script>
