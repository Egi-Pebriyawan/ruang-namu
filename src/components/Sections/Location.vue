<script setup>
import { MapPin, Phone, Clock, Instagram, Mail } from 'lucide-vue-next'
import { useOperatingHours } from '@/composables/useOperatingHours'

const { operatingHoursText } = useOperatingHours()

const contactInfo = [
  {
    icon: MapPin,
    label: 'Address',
    value: 'Jl. Coffee Lane No. 123, Jakarta Selatan'
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+62 812-3456-7890'
  },
  {
    icon: Clock,
    label: 'Hours',
    value: operatingHoursText.value
  }
]

const whatsappNumber = '6281234567890'
const whatsappMessage = 'Hello Ruang Namu, I would like to make an order.'
</script>

<template>
  <section id="location" class="py-20 bg-white">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12 md:mb-16">
        <h2 class="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 mb-4">
          Visit Us
        </h2>
        <p class="text-stone-600 text-base md:text-lg max-w-2xl mx-auto">
          Find us in the heart of Jakarta. We can't wait to serve you.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        <!-- Map -->
        <div class="rounded-2xl overflow-hidden shadow-lg h-80 md:h-96 lg:h-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126920.26649151935!2d106.759487!3d-6.2297465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69f3e945e34b9d%3A0x5371bf5807c595!2sJakarta%20Selatan!5e0!3m2!1sen!2sid!4v1234567890"
            width="100%"
            height="100%"
            style="border:0;"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Ruang Namu Location"
            class="w-full h-full"
          ></iframe>
        </div>

        <!-- Contact Info -->
        <div class="flex flex-col justify-center">
          <div class="space-y-6 md:space-y-8">
            <div
              v-for="info in contactInfo"
              :key="info.label"
              class="flex items-start gap-4"
            >
              <div class="flex-shrink-0 w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center">
                <component :is="info.icon" class="w-5 h-5 text-amber-900" />
              </div>
              <div>
                <h4 class="font-playfair text-lg font-semibold text-amber-900 mb-1">
                  {{ info.label }}
                </h4>
                <p class="text-stone-600">{{ info.value }}</p>
              </div>
            </div>
          </div>

          <!-- WhatsApp CTA -->
          <div class="mt-8 md:mt-12">
            <a
              :href="`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-3 bg-green-600 text-white px-8 py-4 rounded-full font-medium hover:bg-green-700 transition-all duration-300 hover:scale-105"
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>

          <!-- Social Links -->
          <div class="mt-8 flex items-center gap-4">
            <a
              href="#"
              class="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-amber-900 hover:text-white transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram class="w-5 h-5" />
            </a>
            <a
              href="mailto:hello@ruangnamu.com"
              class="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center hover:bg-amber-900 hover:text-white transition-all duration-300"
              aria-label="Email"
            >
              <Mail class="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="bg-amber-900 text-white py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-center gap-6">
        <div class="text-center md:text-left">
          <h3 class="font-playfair text-2xl font-bold mb-2">Ruang Namu</h3>
          <p class="text-amber-200 text-sm">
            © {{ new Date().getFullYear() }} Ruang Namu. All rights reserved.
          </p>
        </div>
        <div class="flex gap-6 text-sm text-amber-200">
          <a href="#" class="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" class="hover:text-white transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>
