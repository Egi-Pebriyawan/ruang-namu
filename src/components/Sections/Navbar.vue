<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Menu', href: '#menu' },
  { name: 'Facilities', href: '#facilities' },
  { name: 'Location', href: '#location' }
]

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}
</script>

<template>
  <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200/50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 md:h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <a href="#home" class="font-playfair text-2xl md:text-3xl font-bold text-amber-900 hover:text-amber-700 transition-colors duration-300">
            Ruang Namu
          </a>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-1">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            class="relative text-stone-700 hover:text-amber-900 font-medium px-4 py-2 transition-colors duration-300 group"
          >
            {{ link.name }}
            <span class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-900 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
          </a>
          <a
            href="#menu"
            class="ml-4 bg-gradient-to-r from-amber-900 to-amber-800 text-white px-7 py-2.5 rounded-full font-medium hover:from-amber-800 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105"
          >
            Order Now
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <div class="md:hidden">
          <button
            @click="toggleMenu"
            class="text-stone-700 hover:text-amber-900 p-2 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu v-if="!isMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-4"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-4"
    >
      <div v-if="isMenuOpen" class="md:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg">
        <div class="px-4 py-5 space-y-2">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            @click="closeMenu"
            class="block text-stone-700 hover:text-amber-900 font-medium py-3 px-3 rounded-lg hover:bg-amber-50 transition-all duration-300"
          >
            {{ link.name }}
          </a>
          <a
            href="#menu"
            @click="closeMenu"
            class="block bg-gradient-to-r from-amber-900 to-amber-800 text-white text-center px-6 py-3 rounded-full font-medium hover:from-amber-800 hover:to-amber-700 transition-all duration-300 shadow-md mt-4"
          >
            Order Now
          </a>
        </div>
      </div>
    </transition>
  </nav>
</template>
