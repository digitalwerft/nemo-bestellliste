<template>
<div class="input-group row no-gutters single-item mb-2" :id="id" :class="{'dialog-open': showModal, disabled: disabled, selected: selected, 'not-saved': (!saved || hasNoNumber), 'saved': savedTimeout}"  ref="item">
  <div class="col select-col">
    <v-select v-model="item.number" :options="autocomplete" :on-change="onNumberChange" label="number" placeholder="Art.-Nr.">
      <span slot="no-options">Art. Nr. nicht gefunden.</span>
    </v-select>
  </div>
  <span class="input-group-addon col-lg-8 col-9 name-col pl-2">
    <small class="d-none d-md-inline">{{ name ? name : '--' }}</small>
    <small class="d-inline d-md-none">Artikel-Nr.</small>
  </span>
  <div class="input-group col-4 col-lg-3 no-gutters spinner-col">
    <span class="input-group-btn col">
      <input-spinner
        :min="1"
        :max="1000"
        :step="1"
        :integerOnly="true"
        v-model="quantity"
        :disabled="hasNoNumber"
        @onInputNumberChange="onQuantityChange"
        ></input-spinner>
    </span>
  </div>

  <span class="input-group-addon col-lg-3 col-9 font-weight-bold sum-col">
    <small>{{ parseFloat(item.gross_price) + parseFloat(item.suggested_donation) }}€/</small>
    <small class="d-inline d-lg-none font-weight-normal text-muted">Gesamtbetrag:&nbsp;</small>{{ sum }}€
  </span>
  <span class="input-group-btn col-3 col-lg-2 delete-col">
            <a href="#" class="btn btn-outline-danger btn-block" v-on:click.prevent="showModal = true">
                <i class="mdi mdi-delete"></i>
            </a>
        </span>
  <div class="item-modal-overlay" v-if="showModal" :class="{ active: showModal }">
    <div class="row no-gutters">
      <div class="col-10 confirm-message font-weight-bold"><span class="d-none d-md-inline">Artikel</span> wirklich löschen?</div>
      <div class="col-4 cancel-item-delete">
        <a href="#" class="btn btn-outline-danger btn-block" @click="onItemDelete" v-shortkey="['enter']" @shortkey="onItemDelete">
          <i class="mdi mdi-check"></i>
          <span class="d-none d-lg-inline">löschen</span></a>
      </div>
      <div class="col-4 delete-item">
        <a href="#" class="btn btn-outline-primary btn-block" @click.prevent="showModal = false" v-shortkey="['esc']" @shortkey="showModal = false">
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

const item = {
  name: 'item',
  components: {
    vSelect,
    InputSpinner,
    confirm
  },
  props: {
    item: {
      type: Object
    },
    collectorId: {
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    campaignId: {
      default: null
    },
    index: {
      type: Number
    }
  },
  created() {
    this.oldId = this.itemId
    // Declare debounce function wehn component is created
    // otherwise the same debounce function will be called for every item
    this.debouncer = _.debounce(function(value) {
      if(this.$store.state.action != 'SEARCHING') {
        /*if(this.oldId == this.itemId) {*/
          if(!_.startsWith(this.item.id, 'new-item')) {
            this.$store.dispatch('updateItemQuantity', {collector: this.collector, itemObj: this, quantity: value}).then(() => {
              this.saved = true
              this.savedTimeout = true
            })
          }
        //}
      }
    }, 700)
  },
  data: () => ({
      step: 1,
      min: 1,
      max: 100,
      maxLength: 3,
      showModal: false,
      selected: false,
      isInitial: true,
      isNewItem: false,
      oldId: 0,
      saved: true,
      savedTimeout: false
  }),
  watch: {
    savedTimeout(value) {
      if(value) {
        setTimeout(()=> {
          this.savedTimeout = false
        }, 500)
      }
    },
    selected(val) {
      if(val) {
        this.$emit('selected', this.$refs.item)
      }
    }
  },
  computed: {
    name() {
      return this.item.name ? this.item.name : false
    },
    // get unique id for each element for dom-events
    id() {
      return 'collector-' + this.collectorId + '__item-' + this.item.number
    },
    itemId() {
      return this.item.id
    },
    hasNoNumber() {
      return _.startsWith(this.item.id, 'new-item')
    },
    // v-model workaround for item quantity
    quantity: {
      get() {
        return this.item.quantity;
      },
      set(value){ return this.debouncer(value) }
    },
    // get price of this item with speciied quantity
    sum() {
      return this.item.quantity * (parseInt(this.item.gross_price) + parseInt(this.item.suggested_donation));
    },
    collector() {
      return this.$store.getters.getCollectorById(this.collectorId)
    },
    returns() {
      var returns = parseInt(this.item.quantity) * parseInt(this.item.suggested_donation);
      return returns ? returns : 0
    },
    // get array with all available items
    autocomplete() {
      return _.sortBy(this.$store.getters.getAllItemNumbers, (number)=> {
        return parseInt(number)
      })
    }
  },
  methods: {
    // update item quantityValue in store
    onQuantityChange(value) {
      if(this.$store.state.action != 'SEARCHING') {
        this.$store.commit('START_EDITING', 'EDITING_ITEM')
        this.saved = false
      }
    },
    // Invoke item deletion
    onItemDelete(e) {
      e.preventDefault()
      // If item has no number it exists only in the data store
      if(!this.hasNoNumber) {
        this.$store.dispatch('deleteItem', {itemObj: this, collector: {id: this.collectorId, campaign_id: this.campaignId}}).then(()=> {
          setTimeout(()=> {
            this.oldId = this.itemId
          }, 250)
        })
      } else {
        this.$store.commit('DELETE_ITEM', this)
        if(!this.$store.getters.hasUnsavedItems) {
          this.$store.commit('STOP_EDITING')
        }

      }
      this.showModal = false;
    },
    onNumberChange(number) {
      if(this.$store.state.action != 'SEARCHING') {
        if(this.oldId == this.itemId) {
          if(this.isInitial && !this.item.isNewItem) {
            this.isInitial = false
            return
          } else if(this.item.isNewItem) {
            this.isInitial = false
          }
          if(!_.startsWith(this.item.id, 'new-item')) {
            this.saved = false
            this.$store.dispatch('updateItemNumber', {itemObj: this, collector: {id: this.collectorId, campaign_id: this.campaignId}, number: number}).then(() => {
              this.saved = true
              this.savedTimeout = true
            })
          } else {
            this.saved = false
            this.$store.dispatch('createItem', { collector: this.collector, item: this.item, newNumber: number, quantity: this.item.quantity })
              .then(response => {
                this.saved = true
                this.savedTimeout = true
                this.oldId = this.item.id
              })
          }
        }
      }
    }
  }
}

export default item
</script>

<style lang="scss">
  @import '../../sass/modules/select.scss';
</style>
