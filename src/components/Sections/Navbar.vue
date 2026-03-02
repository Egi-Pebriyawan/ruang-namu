<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Menu, X, ShoppingCart } from "lucide-vue-next";
import { useCartStore } from "@/composables/useCartStore";
import CheckoutModal from "@/components/CheckoutModal.vue";
import ReceiptModal from "@/components/ReceiptModal.vue";

const isMenuOpen = ref(false);
const isScrolled = ref(false);
const cart = useCartStore();
const showCheckout = ref(false);
const showReceipt = ref(false);
const receiptData = ref(null);

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "Menu", href: "#menu" },
  { name: "Facilities", href: "#facilities" },
  { name: "Location", href: "#location" },
];

const toggleMenu = () => { isMenuOpen.value = !isMenuOpen.value; };
const closeMenu = () => { isMenuOpen.value = false; };
const handleScroll = () => { isScrolled.value = window.scrollY > 20; };

onMounted(async () => {
  window.addEventListener("scroll", handleScroll);
  await cart.loadSettings();
  const script = document.createElement("script");
  script.src = "https://app.sandbox.midtrans.com/snap/snap.js";
  script.setAttribute("data-client-key", import.meta.env.VITE_MIDTRANS_CLIENT_KEY || "");
  document.head.appendChild(script);
});

onUnmounted(() => { window.removeEventListener("scroll", handleScroll); });

const openCheckout = () => {
  if (cart.items.length === 0) return;
  showCheckout.value = true;
};

const onPaymentSuccess = (data) => {
  showCheckout.value = false;
  receiptData.value = data;
  showReceipt.value = true;
  cart.clearCart();
};

const closeReceipt = () => {
  showReceipt.value = false;
  receiptData.value = null;
};
</script>

<template>
  <nav class="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b transition-all duration-300" :class="isScrolled ? 'border-stone-200 shadow-lg' : 'border-stone-200/50 shadow-sm'">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16 md:h-20">
        <div class="flex-shrink-0">
          <a href="#home" class="font-playfair text-2xl md:text-3xl font-bold text-amber-900 hover:text-amber-700 transition-colors duration-300">Ruang Namu</a>
        </div>

        <div class="hidden md:flex items-center space-x-1">
          <a v-for="link in navLinks" :key="link.name" :href="link.href" @click="closeMenu" class="relative text-stone-700 hover:text-amber-900 font-medium px-4 py-2 transition-all duration-300 group">
            {{ link.name }}
            <span class="absolute bottom-0 left-1/2 w-0 h-0.5 bg-amber-900 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
          </a>

          <button @click="openCheckout" :disabled="cart.items.length === 0" class="ml-4 inline-flex items-center gap-2 bg-gradient-to-r from-amber-900 to-amber-800 text-white px-7 py-2.5 rounded-full font-semibold hover:from-amber-800 hover:to-amber-700 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:hover:scale-100">
            <ShoppingCart class="w-4 h-4" />
            <span v-if="cart.items.length > 0">Checkout ({{ cart.items.length }}) — Rp {{ cart.grandTotal.toLocaleString() }}</span>
            <span v-else>Cart Empty</span>
          </button>
        </div>

        <div class="md:hidden flex items-center gap-3">
          <button @click="openCheckout" class="text-amber-900 relative p-1">
            <ShoppingCart class="w-6 h-6" />
            <span v-if="cart.items.length > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{{ cart.items.length }}</span>
          </button>
          <button @click="toggleMenu" class="text-stone-700 hover:text-amber-900 p-2 transition-colors" aria-label="Toggle menu">
            <Menu v-if="!isMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-4" enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in" leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-4">
      <div v-if="isMenuOpen" class="md:hidden bg-white/95 backdrop-blur-md border-t border-stone-200 shadow-lg">
        <div class="px-4 py-5 space-y-2">
          <a v-for="link in navLinks" :key="link.name" :href="link.href" @click="closeMenu" class="block text-stone-700 hover:text-amber-900 font-medium py-3 px-3 rounded-lg hover:bg-amber-50 transition-all duration-300">{{ link.name }}</a>
          <button @click="openCheckout" :disabled="cart.items.length === 0" class="w-full bg-gradient-to-r from-amber-900 to-amber-800 text-white text-center px-6 py-3 rounded-full font-semibold hover:from-amber-800 hover:to-amber-700 transition-all duration-300 shadow-md mt-4 disabled:opacity-50">
            Checkout ({{ cart.items.length }})
          </button>
        </div>
      </div>
    </transition>
  </nav>

  <!-- Modals -->
  <CheckoutModal v-if="showCheckout" @close="showCheckout = false" @payment-success="onPaymentSuccess" />
  <ReceiptModal v-if="showReceipt && receiptData" :receipt="receiptData" @close="closeReceipt" />
</template>
