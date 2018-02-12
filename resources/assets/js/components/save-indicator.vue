<template>
  <div class="save-indicator">

    <transition name="fade">
      <div class="indicator-wrapper" v-if="(!isEditing && !isSaving)">
        <small class="status-text text-success">gespeichert</small>
        <i class="mdi mdi-check-circle-outline mdi-24px text-success"></i>
      </div>
    </transition>

    <transition name="fade">
      <div class="indicator-wrapper saving" v-if="isSaving">
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
      <div class="indicator-wrapper" v-if="(isEditing && !isSaving)">
        <small class="status-text text-danger">Daten geändert</small>
        <i class="mdi mdi-adjust text-danger mdi-24px text-danger"></i>
      </div>
    </transition>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import Spinner from './spinner.vue'
  export default {
    props: ['isSaving', 'isEditing'],
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
