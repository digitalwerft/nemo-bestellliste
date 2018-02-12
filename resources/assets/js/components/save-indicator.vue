<template>
  <div class="text-success save-indicator">

    <transition name="fade">
      <div class="indicator-wrapper" v-if="(!isEditing && !isSaving)">
        <small class="status-text text-success">Änderungen gespeichert</small>
        <i class="mdi mdi-check-circle-outline mdi-24px"></i>
      </div>
    </transition>

    <transition name="fade">
      <div class="indicator-wrapper" v-if="isSaving">
        <small class="status-text text-danger">Daten geändert</small>
        <spinner
          :status="true"
          :color="'#627794'"
          :size="20"
          :depth="3"
          :rotation="true"
          :speed="0.8">
        </spinner>
      </div>

    </transition>

    <transition name="fade">
      <div class="indicator-wrapper" v-if="(isEditing && !isSaving)">
        <small class="status-text text-warning">speichere...</small>
        <i class="mdi mdi-adjust text-danger mdi-24px"></i>
      </div>
    </transition>
  </div>
</template>
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
