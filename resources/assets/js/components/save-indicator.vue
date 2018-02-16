<template>
  <div class="save-indicator">

    <transition name="fade">
      <div class="indicator-wrapper" v-if="(!isEditing && !isSaving && !hasError)">
        <small class="status-text text-success">gespeichert</small>
        <i class="mdi mdi-check-circle-outline mdi-24px text-success"></i>
      </div>
    </transition>

    <transition name="fade">
      <div class="indicator-wrapper saving" v-if="(isSaving && !hasError)">
        <small class="status-text">speichere...</small>
        <span class="spinner-wrapper">
          <spinner
            :status="true"
            :color="'#627794'"
            :size="20"
            :depth="3"
            :rotation="true"
            :speed="0.8">
          </spinner>
        </span>
      </div>

    </transition>

    <transition name="fade">
      <div class="indicator-wrapper" v-if="(isEditing && !isSaving && !hasError)">
        <small class="status-text text-warning">Daten geändert</small>
        <i class="mdi mdi-adjust text-warning mdi-24px"></i>
      </div>
    </transition>

    <transition name="fade">
      <div class="indicator-wrapper" v-if="hasError">
        <small class="status-text text-danger">Fehler beim Speichern</small>
        <i class="mdi mdi-close-circle-outline text-danger mdi-24px"></i>
      </div>
    </transition>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import Spinner from './spinner.vue'
  export default {
    props: ['isSaving', 'isEditing', 'hasError'],
    components: {
      Spinner
    },
    data() {
      return {}
    },
    methods: {
      emitSave() {
        if(this.isSaving) {
          this.$emit('saving', false)
        } else {
          this.$emit('saving', true)
        }
      }
    }
  }
</script>
