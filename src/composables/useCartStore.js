import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'

export const useCartStore = defineStore('cart', () => {
  const items = ref([])
  const customerName = ref('')
  const customerEmail = ref('')
  const customerWhatsapp = ref('')
  const taxRate = ref(10)
  const serviceChargeRate = ref(5)
  const orderMode = ref('dine-in') // 'dine-in' or 'pickup'

  const loadSettings = async () => {
    const { data } = await supabase.from('settings').select('*').limit(1).single()
    if (data) {
      taxRate.value = data.tax_rate
      serviceChargeRate.value = data.service_charge_rate
    }
  }

  const subtotal = computed(() => {
    return items.value.reduce((total, item) => total + (item.totalPrice * item.quantity), 0)
  })

  const tax = computed(() => Math.round(subtotal.value * (taxRate.value / 100)))
  const serviceCharge = computed(() => Math.round(subtotal.value * (serviceChargeRate.value / 100)))
  const grandTotal = computed(() => subtotal.value + tax.value + serviceCharge.value)

  const addToCart = (product, options = [], notes = '') => {
    // Calculate price with option modifiers
    let basePrice = product.price
    let totalPrice = basePrice
    options.forEach(opt => {
      if (opt.is_percentage) {
        totalPrice += Math.round(basePrice * (opt.price_modifier / 100))
      } else {
        totalPrice += opt.price_modifier
      }
    })

    // Build a unique key from product + options combo
    const optionKey = options.map(o => `${o.category}:${o.name}`).sort().join('|')
    const cartKey = `${product.id}_${optionKey}`

    const existing = items.value.find(item => item.cartKey === cartKey && item.notes === notes)
    if (existing) {
      existing.quantity++
    } else {
      items.value.push({
        cartKey,
        product_id: product.id,
        name: product.name,
        basePrice,
        totalPrice,
        quantity: 1,
        image_url: product.image_url,
        options: [...options],
        notes
      })
    }
  }

  const removeFromCart = (cartKey) => {
    const idx = items.value.findIndex(item => item.cartKey === cartKey)
    if (idx !== -1) items.value.splice(idx, 1)
  }

  const updateQuantity = (cartKey, quantity) => {
    const item = items.value.find(item => item.cartKey === cartKey)
    if (item && quantity > 0) {
      item.quantity = quantity
    } else if (quantity === 0) {
      removeFromCart(cartKey)
    }
  }

  const updateNotes = (cartKey, notes) => {
    const item = items.value.find(item => item.cartKey === cartKey)
    if (item) item.notes = notes
  }

  const clearCart = () => {
    items.value = []
    customerName.value = ''
    customerEmail.value = ''
    customerWhatsapp.value = ''
    orderMode.value = 'dine-in'
  }

  return {
    items,
    customerName,
    customerEmail,
    customerWhatsapp,
    taxRate,
    serviceChargeRate,
    orderMode,
    subtotal,
    tax,
    serviceCharge,
    grandTotal,
    loadSettings,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateNotes,
    clearCart
  }
})
