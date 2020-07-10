<template>
  <v-btn
    v-bind="$attrs"
    :color="icon ? undefined : inversed ? textColor : parsedColor"
    :style="
      !icon &&
      parsedVariant === 'contained' && {
        color: inversed ? parsedColor : textColor,
      }
    "
    :outlined="parsedVariant === 'outlined'"
    :text="parsedVariant === 'text'"
    :icon="icon"
    @click="$emit('click', $event)"
  >
    <slot />
  </v-btn>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: 'primary',
    },
    variant: {
      type: String,
      default: 'contained',
    },
    inversed: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      colorToTextColorMap: {
        dark: {
          primary: '#000',
          secondary: '#000',
          accent: '#fff',
          success: '#000',
          warning: '#000',
          error: '#000',
          info: '#000',
        },
        light: {
          primary: '#fff',
          secondary: '#fff',
          accent: '#000',
          success: '#000',
          warning: '#000',
          error: '#000',
          info: '#000',
        },
      },
    }
  },
  computed: {
    parsedVariant: function () {
      return this.isAcceptedVariant(this.variant) ? this.variant : 'contained'
    },
    parsedColor: function () {
      const color = this.isAcceptedColor(this.color) ? this.color : 'primary'
      return this.$vuetify.theme.currentTheme[color]
    },
    textColor: function () {
      const theme = this.$vuetify.theme.dark ? 'dark' : 'light'
      const color = this.isAcceptedColor(this.color) ? this.color : 'primary'
      return this.colorToTextColorMap[theme][color]
    },
  },

  methods: {
    isAcceptedColor: (color) => {
      return (
        color === 'primary' ||
        color === 'secondary' ||
        color === 'accent' ||
        color === 'info' ||
        color === 'success' ||
        color === 'warning' ||
        color === 'error'
      )
    },
    isAcceptedVariant: (variant) => {
      return (
        variant === 'contained' || variant === 'outlined' || variant === 'text'
      )
    },
  },
}
</script>
