<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCartStore } from '@/composables/useCartStore'
import { supabase } from '@/lib/supabase'
import { X, Flame, Snowflake, Plus, Minus, ShoppingBag, StickyNote } from 'lucide-vue-next'

const props = defineProps({
  product: { type: Object, required: true }
})
const emit = defineEmits(['close', 'added'])
const cart = useCartStore()

const allOptions = ref([])
const selectedTemp = ref('Hot')
const selectedSize = ref('Regular')
const selectedMilk = ref('Milk')
const selectedSugar = ref('Normal')
const selectedIce = ref('Normal Ice')
const selectedToppings = ref([])
const notes = ref('')
const quantity = ref(1)

onMounted(async () => {
  const { data } = await supabase.from('product_options').select('*').order('sort_order')
  if (data) allOptions.value = data
})

const isHot = computed(() => selectedTemp.value === 'Hot')

const tempOptions = computed(() => allOptions.value.filter(o => o.category === 'temperature'))
const sizeOptions = computed(() => {
  let opts = allOptions.value.filter(o => o.category === 'size')
  if (isHot.value) opts = opts.filter(o => o.name !== 'Jumbo')
  return opts
})
const milkOptions = computed(() => allOptions.value.filter(o => o.category === 'milk'))
const sugarOptions = computed(() => allOptions.value.filter(o => o.category === 'sugar'))
const iceOptions = computed(() => {
  if (isHot.value) return []
  return allOptions.value.filter(o => o.category === 'ice')
})
const toppingOptions = computed(() => allOptions.value.filter(o => o.category === 'topping'))

const selectedOptions = computed(() => {
  const opts = []
  const findOpt = (cat, name) => allOptions.value.find(o => o.category === cat && o.name === name)
  const t = findOpt('temperature', selectedTemp.value); if (t) opts.push(t)
  const s = findOpt('size', selectedSize.value); if (s) opts.push(s)
  const m = findOpt('milk', selectedMilk.value); if (m) opts.push(m)
  const sg = findOpt('sugar', selectedSugar.value); if (sg) opts.push(sg)
  if (!isHot.value) { const i = findOpt('ice', selectedIce.value); if (i) opts.push(i) }
  selectedToppings.value.forEach(tn => { const tp = findOpt('topping', tn); if (tp) opts.push(tp) })
  return opts
})

const computedPrice = computed(() => {
  let base = props.product.price
  let total = base
  selectedOptions.value.forEach(opt => {
    if (opt.is_percentage) total += Math.round(base * (opt.price_modifier / 100))
    else total += opt.price_modifier
  })
  return total
})

const toggleTopping = (name) => {
  const idx = selectedToppings.value.indexOf(name)
  if (idx >= 0) selectedToppings.value.splice(idx, 1)
  else selectedToppings.value.push(name)
}

const addToCart = () => {
  for (let i = 0; i < quantity.value; i++) {
    cart.addToCart(props.product, selectedOptions.value, notes.value)
  }
  emit('added')
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col overflow-hidden">
      <!-- Product Header -->
      <div class="relative shrink-0">
        <div class="aspect-[16/9] bg-stone-100 overflow-hidden">
          <img v-if="product.image_url" :src="product.image_url" :alt="product.name" class="w-full h-full object-cover" />
          <div v-else class="w-full h-full flex items-center justify-center text-stone-400">No Image</div>
        </div>
        <button @click="emit('close')" class="absolute top-3 right-3 p-2 bg-black/40 hover:bg-black/60 rounded-full text-white transition-colors">
          <X class="w-5 h-5" />
        </button>
        <div class="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-amber-900 font-bold text-sm shadow-lg">
          Rp {{ product.price?.toLocaleString() }}
        </div>
      </div>

      <!-- Product Info + Options -->
      <div class="flex-1 overflow-y-auto p-5 space-y-5">
        <div>
          <h2 class="text-xl font-bold text-stone-900">{{ product.name }}</h2>
          <p v-if="product.description" class="text-stone-500 text-sm mt-1 leading-relaxed">{{ product.description }}</p>
        </div>

        <!-- Temperature -->
        <div v-if="tempOptions.length > 0">
          <label class="text-xs font-bold text-stone-600 uppercase tracking-wide mb-2 block">Temperature</label>
          <div class="grid grid-cols-2 gap-2">
            <button v-for="opt in tempOptions" :key="opt.id" @click="selectedTemp = opt.name; if(opt.name === 'Hot' && selectedSize === 'Jumbo') selectedSize = 'Large'" :class="['flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all', selectedTemp === opt.name ? (opt.name === 'Hot' ? 'bg-red-50 border-red-400 text-red-700' : 'bg-blue-50 border-blue-400 text-blue-700') : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300']">
              <Flame v-if="opt.name === 'Hot'" class="w-4 h-4" />
              <Snowflake v-else class="w-4 h-4" />
              {{ opt.name }}
            </button>
          </div>
        </div>

        <!-- Size -->
        <div v-if="sizeOptions.length > 0">
          <label class="text-xs font-bold text-stone-600 uppercase tracking-wide mb-2 block">Size</label>
          <div class="flex gap-2">
            <button v-for="opt in sizeOptions" :key="opt.id" @click="selectedSize = opt.name" :class="['flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all text-center', selectedSize === opt.name ? 'bg-amber-50 border-amber-400 text-amber-800' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300']">
              {{ opt.name }}
              <span v-if="opt.price_modifier > 0" class="block text-[10px] font-normal mt-0.5 opacity-70">+{{ opt.price_modifier }}%</span>
            </button>
          </div>
        </div>

        <!-- Milk -->
        <div v-if="milkOptions.length > 0">
          <label class="text-xs font-bold text-stone-600 uppercase tracking-wide mb-2 block">Milk Option</label>
          <div class="flex gap-2">
            <button v-for="opt in milkOptions" :key="opt.id" @click="selectedMilk = opt.name" :class="['flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all', selectedMilk === opt.name ? 'bg-amber-50 border-amber-400 text-amber-800' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300']">
              {{ opt.name }}
            </button>
          </div>
        </div>

        <!-- Sugar -->
        <div v-if="sugarOptions.length > 0">
          <label class="text-xs font-bold text-stone-600 uppercase tracking-wide mb-2 block">Sugar Level</label>
          <div class="flex gap-2">
            <button v-for="opt in sugarOptions" :key="opt.id" @click="selectedSugar = opt.name" :class="['flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all', selectedSugar === opt.name ? 'bg-amber-50 border-amber-400 text-amber-800' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300']">
              {{ opt.name }}
            </button>
          </div>
        </div>

        <!-- Ice (cold only) -->
        <div v-if="iceOptions.length > 0">
          <label class="text-xs font-bold text-stone-600 uppercase tracking-wide mb-2 block">Ice Level</label>
          <div class="flex gap-2">
            <button v-for="opt in iceOptions" :key="opt.id" @click="selectedIce = opt.name" :class="['flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all', selectedIce === opt.name ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300']">
              {{ opt.name }}
            </button>
          </div>
        </div>

        <!-- Toppings -->
        <div v-if="toppingOptions.length > 0">
          <label class="text-xs font-bold text-stone-600 uppercase tracking-wide mb-2 block">Toppings</label>
          <div class="space-y-2">
            <button v-for="opt in toppingOptions" :key="opt.id" @click="toggleTopping(opt.name)" :class="['w-full flex items-center justify-between py-2.5 px-4 rounded-xl border-2 text-sm font-medium transition-all', selectedToppings.includes(opt.name) ? 'bg-emerald-50 border-emerald-400 text-emerald-700' : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300']">
              <span>{{ opt.name }}</span>
              <span v-if="opt.price_modifier > 0" class="text-xs opacity-70">+Rp {{ opt.price_modifier.toLocaleString() }}</span>
            </button>
          </div>
        </div>

        <!-- Notes -->
        <div>
          <label class="text-xs font-bold text-stone-600 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <StickyNote class="w-3.5 h-3.5" /> Additional Notes
          </label>
          <textarea v-model="notes" rows="2" class="w-full px-3 py-2 border-2 border-stone-200 rounded-xl text-sm outline-none focus:border-amber-400 resize-none" placeholder="Extra instructions..."></textarea>
        </div>
      </div>

      <!-- Footer: Qty + Add to Cart -->
      <div class="p-4 border-t border-stone-100 bg-stone-50 shrink-0 flex items-center gap-3">
        <div class="flex items-center bg-white border border-stone-200 rounded-xl overflow-hidden shrink-0">
          <button @click="quantity = Math.max(1, quantity - 1)" class="p-2.5 hover:bg-stone-100 transition-colors"><Minus class="w-4 h-4 text-stone-600" /></button>
          <span class="w-8 text-center font-bold text-sm">{{ quantity }}</span>
          <button @click="quantity++" class="p-2.5 hover:bg-stone-100 transition-colors"><Plus class="w-4 h-4 text-stone-600" /></button>
        </div>
        <button @click="addToCart" class="flex-1 py-3 bg-amber-900 hover:bg-amber-800 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]">
          <ShoppingBag class="w-4 h-4" />
          + Keranjang — Rp {{ (computedPrice * quantity).toLocaleString() }}
        </button>
      </div>
    </div>
  </div>
</template>
