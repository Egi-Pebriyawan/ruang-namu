<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  href: {
    type: String,
    default: null
  },
  external: {
    type: Boolean,
    default: false
  }
})

const baseClasses = 'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2'

const variantClasses = computed(() => {
  if (props.variant === 'primary') {
    return 'bg-amber-900 text-white hover:bg-amber-800 focus:ring-amber-900'
  }
  return 'border border-amber-900 text-amber-900 hover:bg-amber-50 focus:ring-amber-900'
})

const sizeClasses = computed(() => {
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }
  return sizes[props.size]
})

const classes = computed(() => {
  return `${baseClasses} ${variantClasses.value} ${sizeClasses.value}`
})

const linkProps = computed(() => {
  if (props.href) {
    return {
      href: props.href,
      target: props.external ? '_blank' : null,
      rel: props.external ? 'noopener noreferrer' : null
    }
  }
  return {}
})
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :class="classes"
    v-bind="linkProps"
  >
    <slot />
  </component>
</template>
