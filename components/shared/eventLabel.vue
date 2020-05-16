<template>
  <v-chip v-if="chip">
    <v-avatar left>
      <span class="cubing-icon" :class="event.icon"></span>
    </v-avatar>
    {{ event.name }}
  </v-chip>
  <div v-else>
    <span class="cubing-icon" :class="event.icon"></span> 
    <span v-if="full">
      {{ event.name }}
    </span>
  </div>
</template>

<script>

export default {
  props: {
    event: {},
    full: {
      type: Boolean,
      default: true,
    },
    chip: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style scoped>
  span {
    vertical-align: middle;
  }
</style>