<script setup>
import { useOperatingHours } from "@/composables/useOperatingHours";
import { Star, StarHalf } from "lucide-vue-next";
import StarsRating from "../Base/StarsRating.vue";

const { isOpen, statusText, statusColor, operatingHoursText } = useOperatingHours();

const whatsappNumber = "082298874835";
const whatsappMessage = "Hello Ruang Namu, I would like to order coffee!";
</script>

<template>
  <section id="home" class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background Image with Overlay -->
    <div class="absolute inset-0 z-0">
      <img src="/src/assets/hero-bg.jpg" alt="Coffee shop interior" class="w-full h-full object-cover" loading="eager" />
      <div class="absolute inset-0 bg-black/60"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <!-- Status Badge -->
      <div class="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 md:mb-8">
        <span :class="`w-2.5 h-2.5 rounded-full ${statusColor} animate-pulse`"></span>
        <span class="text-white text-sm md:text-base font-medium"> {{ statusText }} • {{ operatingHoursText }} </span>
      </div>

      <!-- Trust Indicator -->
      <div class="flex items-center justify-center gap-1 mb-4 md:mb-6">
        <!-- <Star v-for="i in 4.7" :key="i" class="w-4 h-4 md:w-5 md:h-5 text-amber-400 fill-amber-400" />-->
        <StarsRating :rating="4.7" class="animate-fade-in" />

        <span class="text-white/90 text-xs md:text-sm ml-2">Loved by 1200+ happy customers from Gmaps</span>
      </div>

      <!-- Heading -->
      <h1 class="font-playfair text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 leading-tight">
        Where Every Cup<br class="hidden sm:block" />
        Tells a Story
      </h1>

      <!-- Subheading -->
      <p class="text-stone-200 text-base sm:text-lg md:text-xl mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed">
        Experience artisan coffee crafted with passion in a warm, inviting space.
        <span class="text-amber-200 font-medium">Freshly roasted daily • Limited seasonal blends</span>
      </p>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center w-full">
        <a
          :href="`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`"
          target="_blank"
          rel="noopener noreferrer"
          class="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-900 to-amber-800 text-white px-10 py-4 rounded-full font-semibold hover:from-amber-800 hover:to-amber-700 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl text-center"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
            />
          </svg>
          Order via WhatsApp
        </a>
        <a href="#menu" class="w-full sm:w-auto border-2 border-white text-white px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-amber-900 transition-all duration-300 hover:scale-105 text-center"> View Menu </a>
      </div>

      <!-- Additional Trust Badges -->
      <div class="mt-10 md:mt-12 flex flex-wrap justify-center gap-4 md:gap-8">
        <div class="flex items-center gap-2 text-white/80 text-xs md:text-sm">
          <span class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Fresh Daily
        </div>
        <div class="flex items-center gap-2 text-white/80 text-xs md:text-sm">
          <span class="w-2 h-2 bg-amber-400 rounded-full"></span>
          Premium Beans
        </div>
        <div class="flex items-center gap-2 text-white/80 text-xs md:text-sm">
          <span class="w-2 h-2 bg-blue-400 rounded-full"></span>
          Free WiFi
        </div>
      </div>
    </div>
  </section>
</template>
_+!
