<script setup>
const facilities = [
  {
    name: "Parking Area",
    icon: "🚗",
    description: "Spacious & secure parking for your convenience",
  },
  {
    name: "Open Space",
    icon: "🌿",
    description: "Breathe in the fresh air in our garden seating",
  },
  {
    name: "Free WiFi",
    icon: "📶",
    description: "Stay connected with high-speed internet",
  },
  {
    name: "Toilet",
    icon: "🚻",
    description: "Clean & well-maintained restrooms",
  },
  {
    name: "Mushola",
    icon: "🕌",
    description: "Peaceful prayer space for your comfort",
  },
];
</script>

<template>
  <section id="facilities" class="py-20 bg-gradient-to-b from-stone-50 to-white relative overflow-hidden">
    <!-- Decorative Elements -->
    <div class="absolute top-0 left-0 w-64 h-64 bg-amber-200/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-amber-300/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <!-- Section Header -->
      <div class="text-center mb-16 md:mb-20">
        <span class="inline-block text-amber-700 font-medium text-sm md:text-base mb-3 tracking-wider uppercase"> Comfort First </span>
        <h2 class="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-amber-900 mb-6">Our Facilities</h2>
        <div class="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6 rounded-full"></div>
        <p class="text-stone-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">Everything you need for a comfortable and memorable experience at Ruang Namu.</p>
      </div>

      <!-- Facilities Grid -->
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
        <div
          v-for="facility in facilities"
          :key="facility.name"
          class="group bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 text-center hover:bg-white transition-all duration-500 hover:shadow-2xl hover:shadow-amber-900/10 hover:-translate-y-2 border border-stone-100 hover:border-amber-300"
        >
          <div class="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-md">
            <span class="text-3xl md:text-4xl">{{ facility.icon }}</span>
          </div>
          <h3 class="font-playfair text-amber-900 text-base md:text-lg font-semibold mb-2">
            {{ facility.name }}
          </h3>
          <p class="text-stone-500 text-xs md:text-sm leading-relaxed">
            {{ facility.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
