<script setup>
import { ref, computed, onMounted } from "vue";
import { useCartStore } from "@/composables/useCartStore";
import { supabase } from "@/lib/supabase";
import ProductDetailModal from "@/components/ProductDetailModal.vue";
import { ShoppingBag } from "lucide-vue-next";

const categories = ref([]);
const products = ref([]);
const activeCategory = ref(null);
const cart = useCartStore();
const selectedProduct = ref(null);

onMounted(async () => {
  await cart.loadSettings();
  const { data: cats } = await supabase.from('categories').select('*').order('name');
  if (cats && cats.length > 0) {
    categories.value = cats;
    activeCategory.value = cats[0].id;
  }
  const { data: prods } = await supabase.from('products').select('*');
  if (prods) products.value = prods;
});

const currentItems = computed(() => {
  if (!activeCategory.value) return [];
  return products.value.filter(p => p.category_id === activeCategory.value);
});

const showButton = computed(() => currentItems.value.length > 2);
const scrollToTopMenu = () => {
  const el = document.getElementById("menu");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};
</script>

<template>
  <section id="menu" class="py-20 bg-white min-h-[600px]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-12 md:mb-16">
        <span class="inline-block text-amber-700 font-medium text-sm md:text-base mb-3 tracking-wider uppercase">Discover Our Flavors</span>
        <h2 class="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-amber-900 mb-4">Our Menu</h2>
        <div class="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mx-auto mb-6 rounded-full"></div>
        <p class="text-stone-600 text-base md:text-lg max-w-2xl mx-auto">Discover our carefully crafted selection of coffee, non-coffee beverages, and freshly baked pastries.</p>
      </div>

      <div v-if="categories.length === 0" class="text-center text-stone-500 py-12">Loading menu...</div>
      <div v-else>
        <div class="flex flex-wrap justify-center gap-3 md:gap-4 mb-10 md:mb-12">
          <button v-for="category in categories" :key="category.id" @click="activeCategory = category.id" :class="['px-5 md:px-7 py-2.5 md:py-3 rounded-full font-medium transition-all duration-300 border-2', activeCategory === category.id ? 'bg-amber-900 text-white border-amber-900 shadow-lg scale-105' : 'bg-white text-stone-700 border-stone-200 hover:border-amber-400 hover:bg-amber-50']">
            {{ category.name }}
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div v-for="item in currentItems" :key="item.id" class="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] border border-stone-100 flex flex-col cursor-pointer" @click="selectedProduct = item">
            <div class="relative h-48 md:h-56 overflow-hidden bg-stone-100 shrink-0">
              <img v-if="item.image_url" :src="item.image_url" :alt="item.name" loading="lazy" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div v-else class="w-full h-full flex items-center justify-center text-stone-400">No Image</div>
              <div class="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-amber-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg border border-amber-100">
                Rp {{ item.price?.toLocaleString() }}
              </div>
            </div>
            <div class="p-5 md:p-6 flex-1 flex flex-col">
              <h3 class="font-playfair text-xl md:text-2xl font-semibold text-amber-900 mb-2">{{ item.name }}</h3>
              <p class="text-stone-600 text-sm md:text-base leading-relaxed mb-6 flex-1">{{ item.description }}</p>
              <button class="w-full py-3 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-bold transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                <ShoppingBag class="w-4 h-4" /> Customize & Add
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showButton && categories.length > 0" class="mt-10 flex justify-center md:hidden">
        <button @click="scrollToTopMenu" class="bg-amber-900 text-white px-6 py-3 rounded-full shadow-lg hover:bg-amber-800 transition-all duration-300">Back to Categories ↑</button>
      </div>
    </div>
  </section>

  <ProductDetailModal v-if="selectedProduct" :product="selectedProduct" @close="selectedProduct = null" @added="selectedProduct = null" />
</template>
