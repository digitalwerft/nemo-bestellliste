<template>
<div class="row collector small-gutters mb-1 row-eq-height" :class="{opened: !collapsed}">
  <div class="col-md-5">
    <div class="card collector-name-card" :class="{editing: editing, deleting: showModal}">
      <div class="card-body collector-name">
        <div class="input-group">
          <textarea type="text" class="form-control" v-if="editing" placeholder="Name" v-model="collectorName" v-focus="true" @keydown.esc="cancelEdit" ref="textarea" @input="resizeTextarea" :style="{height: textareaSize}" @keypress.enter.prevent="saveCollector"></textarea>
          <div class="mobile-save-modal d-flex d-md-none">
            <a href="#" class="btn btn-light save-collector text-success" @click="handleLeftButtonClick">
              <i class="mdi" :class="{'mdi-pencil': !editing, 'mdi-check': editing}"></i>
            </a>
            <a href="#" class="btn btn-light cancel-edit text-danger" @click="handeRightButtonClick">
              <i class="mdi" :class="{'mdi-delete': !editing, 'mdi-close': editing}"></i>
            </a>
          </div>
          <div class="input-group collector-name-title" :class="{ hidden: editing}">
            <h6 v-html="highlight(collector.name)" @click.prevent="makeEditable"></h6>
          </div>
        </div>
        <div class="collector-details mt-1">
          <small class="text-muted">Boxen: {{ itemCount }} | Gesamtbetrag: {{ totalPrice }}€ | <span class="d-none d-sm-inline">davon</span> Spenden: {{ totalEarnings }}€</small>
        </div>
      </div>
      <div class="card-footer" :class="{collapsed: collapsed}">
        <a href="#" class="btn btn-light btn-block show-items d-block d-md-none" @click.prevent="collapsed = !collapsed"><i class="mdi" :class="{'mdi-chevron-down': collapsed, 'mdi-chevron-up': !collapsed}"></i></a>
        <div class="row no-gutters edit-collector d-none d-md-flex">
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
  <div class="col-md-13 item-list" :class="{editing: editing, deleting: showModal, collapsed: collapsed}">
    <div class="card">
      <div class="card-body">
        <div v-for="(item, index) in collector.items">
          <item :item="item" :disabled="editing" v-on:selected="select" :collectorId="collector.id" :campaignId="collector.campaign_id" :index="index"></item>
        </div>
        <div class="no-items text-center" v-if="collector.items.length<1">
          <small class="text-muted text-danger text-center" v-if="!collector.name">Dieser Teilnehmer braucht einen Namen, bevor du ihm Artikel zuweisen kannst.</small>
          <small class="text-muted text-center" v-if="collector.name">Der Teilnehmer <mark>{{ collector.name }}</mark> hat noch keine Bestellung abgegeben..</small>
        </div>
      </div>
      <div class="card-footer">
        <a href="#" class="btn btn-light btn-block btn-sm" :class="{disabled: !collector.name}" @click.prevent="addItem"><i class="mdi mdi-plus"></i> Artikel hinzufügen</a>
      </div>
      <div class="item-blocker" v-if="editing"></div>
    </div>
  </div>
  <modal v-if="showModal" @close="showModal = false">
    <h5 slot="header">Teilnehmer wirklich löschen?</h5>
    <span slot="body">
                Diese Aktion kann nicht rückgängig gemacht werden.
            </span>
    <div slot="footer" class="modal-footer">
      <a href="#" class="btn btn-secondary col" @click.prevent="showModal = false" v-shortkey="['esc']" @shortkey="showModal = false">abbrechen</a>
      <a href="#" class="btn btn-danger col" @click.prevent="archive" v-shortkey="['enter']" @shortkey="archive">löschen</a>
    </div>
  </modal>
</div>
</template>
<script>
import item from './item.vue'
import modal from './modal.vue'

export default {
  props: ['collectorId', 'filterkey'],
  components: {
    item,
    modal
  },
  mounted() {
    if (this.collector.name === '') {
      this.editing = true;
    }
    this.$on('delete-collector', (name)=> {
      // only show message if collector wasn't new
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
      textareaSize: '38px'
    }
  },
  computed: {
    // workaround vor v-model values on vuex-models
    // (see: https://vuex.vuejs.org/en/forms.html)
    collectorName: {
      get() {
        return this.collector.name
      },
      set(value) {
        this.$store.commit('UPDATE_COLLECTOR_NAME', {
          collector: this.collector,
          newName: value
        })
      }
    },
    // get current Collector by this.collectorId from store component
    collector() {
      return this.$store.getters.getCollectorById(this.collectorId);
    },
    // count all items
    itemCount() {
      return this.$store.getters.getItemsQuantityByCollectorId(this.collectorId)
    },
    itemList() {
      return this.$store.state.items.all
    },
    // evaluate price of all items togehter
    totalPrice() {
      return this.$store.getters.getTotalItemsPriceByCollectorId(this.collectorId)
    },
    totalEarnings() {
      return this.$store.getters.getAllItemsDonationsByCollectorId(this.collectorId)
    }
  },
  watch: {
    // watch for changes in this.editing
    editing(isEditing) {
      // if user edits collector
      if (isEditing) {
        // tell parent
        this.$emit('editing-collector', true)
      } else {
        // tell parent
        this.$emit('editing-collector', false)
      }
    },
    collectorName(name) {
      if(this.$store.state.action == 'SEARCHING') {
        return
      }
      if(name != this.oldName || name == '') {
        this.$store.commit('START_EDITING', 'EDITING_COLLECTOR')
      }
    }
  },
  methods: {
    validateName(input) {
      //
    },
    resizeTextarea() {
      this.textareaSize = this.$refs.textarea.scrollHeight + 'px';
    },
    select(item) {
      //console.log(item)
    },
    makeEditable(e) {
      // enter editing mode
      e.preventDefault();
      this.editing = true;
      // save current Name, for restoring if name was changed but cancelled.
      this.oldName = this.collector.name;
    },
    cancelEdit() {
      if (this.oldName == '' && this.collector.items.length < 1) {
        this.archive();
        // leave editing mode and revert changes
      } else {
        // Cancel Edit and revert Name Changes
        if(!this.$store.getters.hasUnsavedItems) {
          this.$store.commit('STOP_EDITING')
        }
        if(this.editing) {
          this.editing = false
          this.$store.commit('UPDATE_COLLECTOR_NAME', {
            collector: this.collector,
            newName: this.oldName
          })
        }
      }
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
        // if collector is newly added (hence, it has no name and no items)
        // delete it when clicked an 'cancel'
      } else {
        this.cancelEdit()
      }
    },
    handleLeftButtonClick(e) {
      e.preventDefault();
      // enter editing mode if not already happened
      if (!this.editing) {
        this.makeEditable(e)
      } else if (!this.collector.name) {    // if in editing mode dont save collector if name is empty
        return
      } else {                          // close editing mode and syve changes
        this.saveCollector()
      }
    },
    saveCollector() {
      this.$emit('save-collector')
      if(this.collector.state != 'new') {
        this.$store.dispatch('updateCollectorName', this.collector)
        this.oldName = ''
        this.editing = false
      } else {
        this.$store.dispatch('createCollector', this.collector).then(() => {
          this.oldName = ''
          this.editing = false
        }).catch(error => {
          //
        })
      }
    },
    handleShortkeys(e) {
      /*if(e.srcKey == 'delete') {
        this.archive()
      }*/
      if(e.srcKey == 'cancel') {
        this.showModal = false
      }
    },
    // Wrapper for this.delete() for optional undo feature
    archive() {
      this.showModal = false
      this.delete()
    },
    delete() {
      // Tell parent component that collector was deleted
      this.$emit('delete-collector', this.collector.name)
      this.$emit('editing-collector', false)
      // Send delete-request to Store Component
      this.$store.dispatch('deleteCollector', this.collector)

      if(!this.$store.getters.hasUnsavedItems) {
        this.$store.commit('STOP_EDITING')
      }

    },
    addItem: _.debounce(function() {
      // dont enable adding Items when in editing mode
      if(!this.editing && this.$store.state.action != 'SEARCHING') {
        // add new Item to Store Component
        //this.$store.dispatch('createItem', this.collector)
        this.$store.commit('START_EDITING', 'CREATING_ITEM')
        this.$store.commit('CREATE_ITEM', this.collector)
      }
    }, 500)
  }
}
</script>
