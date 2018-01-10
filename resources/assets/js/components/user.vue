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
          Sammelbestellung:&nbsp; <i class="mdi mdi-pound"></i> <strong>{{ user.orderNr }}</strong>&nbsp;–&nbsp;<span class="group-name">{{ user.groupName }}</span>
          </h4>
      <div class="row">
        <div class="col-lg-7 mb-4">
          <label class="text-muted">Kontaktdaten</label>
          <h6>{{ user.firstName }} {{ user.lastName }}</h6>
          <h6>{{ user.email }}</h6>
          <h6>{{ user.street }}</h6>
          <h6>{{ user.zip }} {{ user.city }}</h6>
        </div>
        <div class="col-lg-11">
          <label class="text-muted">
              Lieferadresse
            </label>
          <div class="form-group" v-if="editingDetails">
            <label for="shipping-name">Vorname, Nachname</label>
            <input id="shipping-name" type="text" class="form-control form-control" v-bind:value="user.shipping_name" placeholder="Vorname, Nachname">
          </div>
          <h6 v-if="!editingDetails">{{ user.shipping_name }}</h6>
          <div class="form-group" v-if="editingDetails">
            <label for="shipping-organisation">Name der Firma/Organisation/ Schule/Pfarrei <small>(optional)</small></label>
            <input id="shipping-organisation" type="text" class="form-control form-control" v-bind:value="user.shipping_organisation" placeholder="Name der Firma/Organisation/Schule/Pfarrei">
          </div>
          <h6 v-if="!editingDetails">{{ user.shipping_organisation }}</h6>
          <div class="form-group" v-if="editingDetails">
            <label for="shipping-street">Straße, Hausnummer</label>
            <input id="shipping-street" type="text" class="form-control form-control" v-bind:value="user.shipping_street" placeholder="Straße, Hausnummer">
          </div>
          <h6 v-if="!editingDetails">{{ user.shipping_street }}</h6>
          <div class="form-group" v-if="editingDetails">
            <label for="shipping-zip">PLZ, Ort</label>
            <div class="row">
              <div class="col-18 col-sm-5 mb-3">
                <input id="shipping-zip" type="text" class="form-control form-control" v-bind:value="user.shipping_zip" placeholder="PLZ">
              </div>
              <div class="col">
                <input id="shipping-city" type="text" class="form-control form-control" v-bind:value="user.shipping_city" placeholder="Ort">
              </div>
            </div>
          </div>
          <h6 v-if="!editingDetails">{{ user.shipping_zip }} {{ user.shipping_city }}</h6>
        </div>
      </div>
      <div class="row">
        <div class="col">
          <label for="user-message" class="text-muted mt-3">Kommentar zu deiner Bestellung</label>
          <textarea v-bind:value="user.message" class="form-control" id="user-message" :disabled="!editingDetails"></textarea>
          <small class="form-text text-muted">
                Wenn Ihr Rückfragen zu diesem Formular habt, ruft uns bitte jederzeit unter <a href="tel:076170788833">0761 / 707 888 33</a> an.
              </small>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col">
          <div class="float-right">
            <a href="#" class="btn ml-auto" @click="editingDetails = !editingDetails" :class="{'btn-primary': !editingDetails, 'btn-danger': editingDetails}">
                {{ editingDetails ? 'Abbrechen' : 'Ändern' }}</a>
            <a href="#" class="btn btn-success" @click="saveShippingDetails" v-if="editingDetails">Speichern</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
  export default {
    data() {
      return {
        editingDetails: false
      }
    },
    computed: {
      user() {
        var user = this.$store.state.user.data;
        if(this.$store.getters.hasFullyLoaded) {
          return user
        }
        return {
          shipping: {
            name: ''
          }
        }
      },
    },
    methods: {
      saveShippingDetails(e) {
        e.preventDefault();
      },
    }
  }
</script>
