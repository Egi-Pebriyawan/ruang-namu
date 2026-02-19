<script setup>
import { ref } from 'vue'
import { menuCategories } from '@/data/menuData'

const activeCategory = ref(menuCategories[0].id)
</script>

<template>
  <section id="menu" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12 md:mb-16">
        <span class="inline-block text-amber-700 font-medium text-sm md:text-base mb-3 tracking-wider uppercase">
          Discover Our Flavors
        </span>
        <h2 class="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 mb-4">
          Our Menu
        </h2>
        <div class="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6 rounded-full"></div>
        <p class="text-stone-600 text-base md:text-lg max-w-2xl mx-auto">
          Discover our carefully crafted selection of coffee, non-coffee beverages, and freshly baked pastries.
        </p>
      </div>

      <!-- Category Tabs -->
      <div class="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-12">
        <button
          v-for="category in menuCategories"
          :key="category.id"
          @click="activeCategory = category.id"
          :class="[
            'px-5 md:px-7 py-2.5 md:py-3 rounded-full font-medium transition-all duration-300 border-2',
            activeCategory === category.id
              ? 'bg-amber-900 text-white border-amber-900 shadow-lg scale-105'
              : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400 hover:bg-amber-50'
          ]"
        >
          {{ category.name }}
        </button>
      </div>

      <!-- Menu Items Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <transition-group
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-8"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-300 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-8"
        >
          <div
            v-for="item in menuCategories.find(c => c.id === activeCategory).items"
            :key="item.id"
            class="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-stone-100"
          >
            <!-- Item Image -->
            <div class="relative h-48 md:h-56 overflow-hidden">
              <img
                :src="item.image"
                :alt="item.name"
                loading="lazy"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <!-- Price Badge -->
              <div class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-amber-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {{ item.price }}
              </div>
              <!-- Overlay on hover -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>

            <!-- Item Info -->
            <div class="p-5 md:p-6">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-playfair text-xl md:text-2xl font-semibold text-amber-900">
                  {{ item.name }}
                </h3>
                <span class="text-amber-700 font-bold text-lg md:hidden">{{ item.price }}</span>
              </div>
              <p class="text-stone-600 text-sm md:text-base leading-relaxed">
                {{ item.description }}
              </p>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
  </section>
</template>
