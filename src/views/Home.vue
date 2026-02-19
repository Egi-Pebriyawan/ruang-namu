<script setup>
import Navbar from '@/components/Sections/Navbar.vue'
import Hero from '@/components/Sections/Hero.vue'
import Menu from '@/components/Sections/Menu.vue'
import Facilities from '@/components/Sections/Facilities.vue'
import Location from '@/components/Sections/Location.vue'
</script>

<template>
  <div class="min-h-screen bg-stone-50">
    <Navbar />
    <main>
      <Hero />
      <Menu />
      <Facilities />
      <Location />
    </main>
  </div>
</template>
