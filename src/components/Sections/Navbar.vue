<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'

const isMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Menu', href: '#menu' },
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
  <nav class="bg-white/70 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 md:h-20">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <a href="#home" class="font-playfair text-2xl md:text-3xl font-bold text-amber-900 hover:text-amber-800 transition-colors">
            Ruang Namu
          </a>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:flex items-center space-x-8">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            class="text-stone-700 hover:text-amber-900 font-medium transition-colors duration-300"
          >
            {{ link.name }}
          </a>
          <a
            href="#menu"
            class="bg-amber-900 text-white px-6 py-2.5 rounded-full font-medium hover:bg-amber-800 transition-all duration-300"
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
      <div v-if="isMenuOpen" class="md:hidden bg-white border-t border-stone-200">
        <div class="px-4 py-4 space-y-3">
          <a
            v-for="link in navLinks"
            :key="link.name"
            :href="link.href"
            @click="closeMenu"
            class="block text-stone-700 hover:text-amber-900 font-medium py-2 transition-colors"
          >
            {{ link.name }}
          </a>
          <a
            href="#menu"
            @click="closeMenu"
            class="block bg-amber-900 text-white text-center px-6 py-3 rounded-full font-medium hover:bg-amber-800 transition-all duration-300 mt-4"
          >
            Order Now
          </a>
        </div>
      </div>
    </transition>
  </nav>
</template>
