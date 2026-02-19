<script setup>
import { useOperatingHours } from '@/composables/useOperatingHours'

const { isOpen, statusText, statusColor, operatingHoursText } = useOperatingHours()
</script>

<template>
  <section
    id="home"
    class="relative min-h-screen flex items-center justify-center overflow-hidden"
  >
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <img
        src="https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1920&h=1080&fit=crop"
        alt="Coffee shop interior"
        class="w-full h-full object-cover"
        loading="eager"
      />
      <div class="absolute inset-0 bg-black/60"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <!-- Status Badge -->
      <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 md:mb-8">
        <span :class="`w-2.5 h-2.5 rounded-full ${statusColor} animate-pulse`"></span>
        <span class="text-white text-sm md:text-base font-medium">
          {{ statusText }} • {{ operatingHoursText }}
        </span>
      </div>

      <!-- Heading -->
      <h1 class="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
        Where Every Cup<br class="hidden sm:block" /> Tells a Story
      </h1>

      <!-- Subheading -->
      <p class="text-stone-200 text-base sm:text-lg md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
        Experience artisan coffee crafted with passion in a warm, inviting space.
        Your perfect cup awaits at Ruang Namu.
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <a
          href="#menu"
          class="w-full sm:w-auto bg-amber-900 text-white px-8 py-4 rounded-full font-medium hover:bg-amber-800 transition-all duration-300 hover:scale-105 text-center"
        >
          View Menu
        </a>
        <a
          href="#location"
          class="w-full sm:w-auto border border-white text-white px-8 py-4 rounded-full font-medium hover:bg-white hover:text-amber-900 transition-all duration-300 hover:scale-105 text-center"
        >
          Find Us
        </a>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
      <div class="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
        <div class="w-1.5 h-3 bg-white/70 rounded-full animate-bounce"></div>
      </div>
    </div>
  </section>
</template>
