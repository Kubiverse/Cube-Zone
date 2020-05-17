<template>
  <v-avatar size="24" :title="cuber.name">
    <v-img v-if="cuber.avatar" :src="cuber.avatar" />
    <v-icon v-else>mdi-account</v-icon>
  </v-avatar>
</template>

<script>
export default {
  props: {
    cuber: {},
  },
}
</script>
