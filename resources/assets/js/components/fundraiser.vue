<template>
<div class="container">
  <div class="card">
    <div class="card-body">
      <a href="#" class="show-help"  @click="$emit('display-info')">
        <i class="mdi mdi-help-box"></i>
      </a>
      <transition name="fade" mode="out-in">
        <popover name="help-info" :event="'hover'">
          Infos zum Bestellablauf anzeigen
        </popover>
      </transition>
      <h4 class="card-title pb-3 mb-3">
          Sammelbestellung:&nbsp; #<strong>{{ campaign.id }}</strong>&nbsp;–&nbsp;<span class="group-name">{{ campaign.group }}</span>
          </h4>
      <div class="row">
        <div class="col-lg-7 mb-4">
          <label class="text-muted">Kontaktdaten</label>
          <h6>{{ fundraiser.first_name }} {{ fundraiser.last_name }}</h6>
          <h6>{{ fundraiser.email }}</h6>
          <h6>{{ fundraiser.street }}</h6>
          <h6>{{ fundraiser.postal }}</h6>
          <h6>Tel.: {{ fundraiser.phone }}</h6>
          <h6>Mobil: {{ fundraiser.mobile }}</h6>
        </div>
        <div class="col-lg-11">
          <label class="text-muted">
              Lieferadresse
            </label>
          <div class="form-group" v-if="editingDetails">
            <label for="shipping-first-name">Vorname, Nachname</label>
            <div class="row">
              <div class="col">
                <input id="shipping-first-name" type="text" class="form-control form-control" v-model="form.first_name" placeholder="Vorname">
              </div>
              <div class="col">
                <input id="shipping-last-name" type="text" class="form-control form-control" v-model="form.last_name" placeholder="Nachname">
              </div>
            </div>
          </div>
          <h6 v-if="!editingDetails">{{ shippingAddress.first_name }} {{ shippingAddress.last_name }}</h6>
          <div class="form-group" v-if="editingDetails">
            <label for="shipping-organisation">Name der Firma/Organisation/ Schule/Pfarrei <small>(optional)</small></label>
            <input id="shipping-organisation" type="text" class="form-control form-control" v-model="form.organisation" placeholder="Name der Firma/Organisation/Schule/Pfarrei">
          </div>
          <h6 v-if="!editingDetails">{{ shippingAddress.organisation }}</h6>
          <div class="form-group" v-if="editingDetails">
            <label for="shipping-route">Straße, Hausnummer</label>
            <div class="row">
              <div class="col-14">
                <input id="shipping-route" type="text" class="form-control form-control" v-model="form.route" placeholder="Straße">
              </div>
              <div class="col">
                <input id="shipping-street-number" type="text" class="form-control form-control" v-model="form.street_number" placeholder="Hausnummer">
              </div>
            </div>
          </div>
          <h6 v-if="!editingDetails">{{ shippingAddress.address }}</h6>
          <div class="form-group" v-if="editingDetails">
            <label for="shipping-zip">PLZ, Ort</label>
            <div class="row">
              <div class="col-18 col-sm-5 mb-3">
                <input id="shipping-zip" type="text" class="form-control form-control" v-model="form.zip_code" placeholder="PLZ">
              </div>
              <div class="col">
                <input id="shipping-city" type="text" class="form-control form-control" v-model="form.city" placeholder="Ort">
              </div>
            </div>
          </div>
          <h6 v-if="!editingDetails">{{ shippingAddress.postal }} {{ shippingAddress.city }}</h6>
          <a href="#" class="btn btn-link btn-sm pl-0" @click.prevent="editingDetails = !editingDetails" v-if="!editingDetails">[
              {{ editingDetails ? 'Abbrechen' : 'Ändern' }}]</a>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="fundraiser-message" class="text-muted mt-3">Kommentar zu deiner Bestellung</label>
          <textarea v-bind:value="campaign.comment" class="form-control" id="fundraiser-message" :disabled="!editingDetails"></textarea>
          <small class="form-text text-muted">
            Wenn Ihr Rückfragen zu diesem Formular habt, ruft uns gerne jederzeit von Mo-Fr 9-18 Uhr unter <a href="tel:076170788833">0761 / 707 888 33</a> an <br>oder schreibt uns eine E-Mail an <a href="mailto:bestellung@neuemasche.com">bestellung@neuemasche.com</a>.
              </small>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col">
          <div class="float-right">
            <a href="#" class="btn btn-danger ml-auto" @click.prevent="cancelEdit" v-if="editingDetails">Abbrechen</a>
            <a href="#" class="btn btn-primary ml-auto" @click.prevent="editingDetails = true" v-if="!editingDetails">Ändern</a>
            <a href="#" class="btn btn-success" @click.prevent="saveShippingDetails" v-if="editingDetails" :class="{disabled: !hasChanged}">Speichern</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  export default {
    created() {
      const store = this.$store
      const self  = {self: this}
      // Fetch Data if not already happened
      store.dispatch('fetchFundraiser', self).then(()=> {
        this.form = _.clone(this.campaign.shipping_address)
        setTimeout(() => {
          this.hasChanged = false
        }, 250)
      })
    },
    data() {
      return {
        editingDetails: false,
        hasChanged: false,
        form: {
          city: '',
          street_number: '',
          route: '',
          first_name: '',
          last_name: '',
          organisation: '',
          zip_code: ''
        }
      }
    },
    watch: {
      form: {
        deep: true,
        handler() {
          if(!_.isEqual(this.campaign.shipping_address, this.form)) {
            this.hasChanged = true
            this.$store.commit('START_EDITING')
          } else {
            this.hasChanged = false
            this.$store.commit('STOP_EDITING')
          }
        }
      }
    },
    computed: {
      fundraiser() {
        return this.$store.state.fundraiser.data
      },
      campaign() {
        return this.$store.state.campaign.data
      },
      shippingAddress() {
        return this.campaign.shipping_address
      }
    },
    methods: {
      saveShippingDetails(e) {
        e.preventDefault()
        if(!this.hasChanged) {
          return
        }
        this.$store.dispatch('updateShippingAddress', {address: this.form, campaign_id: this.campaign.id }).then(() => {
          this.editingDetails = false
          this.hasChanged = false
          this.$note.info({
            message: 'Lieferadresse erfolgreich geändert'
          })
        })
      },
      cancelEdit() {
        this.form = _.clone(this.shippingAddress)
        this.editingDetails = false
        this.hasChanged = false
      }
    }
  }
</script>
