<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/composables/useCartStore'
import { supabase } from '@/lib/supabase'
import { X, ShoppingBag, User, Mail, Phone, Loader2, Minus, Plus, StickyNote, MapPin, Coffee } from 'lucide-vue-next'

const emit = defineEmits(['close', 'paymentSuccess'])
const cart = useCartStore()
const isProcessing = ref(false)

const handleProceedToPayment = async () => {
  if (!cart.customerName.trim()) { alert('Please enter your name'); return }
  if (!cart.customerEmail.trim() && !cart.customerWhatsapp.trim()) { alert('Please enter your email or WhatsApp number'); return }

  isProcessing.value = true
  try {
    const orderData = {
      items: cart.items.map(i => ({ product_id: i.product_id, name: i.name, quantity: i.quantity, price: i.totalPrice, options: i.options, notes: i.notes })),
      subtotal: cart.subtotal,
      tax: cart.tax,
      serviceCharge: cart.serviceCharge,
      grandTotal: cart.grandTotal,
      customerName: cart.customerName,
      customerEmail: cart.customerEmail,
      customerWhatsapp: cart.customerWhatsapp,
      orderMode: cart.orderMode
    }

    const { data, error } = await supabase.functions.invoke('midtrans-checkout', { body: orderData })
    if (error) throw error
    if (data && data.token) {
      window.snap.pay(data.token, {
        onSuccess: (result) => {
          emit('paymentSuccess', {
            orderId: result.order_id,
            customerName: cart.customerName,
            customerEmail: cart.customerEmail,
            customerWhatsapp: cart.customerWhatsapp,
            items: [...cart.items],
            subtotal: cart.subtotal,
            tax: cart.tax,
            serviceCharge: cart.serviceCharge,
            grandTotal: cart.grandTotal,
            orderMode: cart.orderMode,
            paymentMethod: result.payment_type,
            date: new Date().toLocaleString('id-ID')
          })
        },
        onPending: () => alert('Pembayaran sedang diproses.'),
        onError: () => alert('Pembayaran gagal.'),
        onClose: () => {}
      })
    }
  } catch (err) {
    console.error(err)
    alert('Checkout error.')
  } finally {
    isProcessing.value = false
  }
}
</script>

<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="p-5 border-b border-stone-100 flex items-center justify-between shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><ShoppingBag class="w-5 h-5 text-amber-900" /></div>
          <div><h2 class="text-lg font-bold text-stone-900">Order Summary</h2><p class="text-stone-500 text-[11px]">Review your order</p></div>
        </div>
        <button @click="emit('close')" class="p-2 hover:bg-stone-100 rounded-lg"><X class="w-5 h-5 text-stone-500" /></button>
      </div>

      <!-- Body -->
      <div class="flex-1 overflow-y-auto p-5 space-y-5">
        <!-- Customer Info -->
        <div class="space-y-3">
          <div class="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
            <User class="w-4 h-4 text-stone-400 shrink-0" />
            <input v-model="cart.customerName" type="text" placeholder="Your name *" class="flex-1 bg-transparent outline-none text-sm" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
              <Mail class="w-4 h-4 text-stone-400 shrink-0" />
              <input v-model="cart.customerEmail" type="email" placeholder="Email" class="flex-1 bg-transparent outline-none text-sm min-w-0" />
            </div>
            <div class="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2.5">
              <Phone class="w-4 h-4 text-stone-400 shrink-0" />
              <input v-model="cart.customerWhatsapp" type="tel" placeholder="WhatsApp" class="flex-1 bg-transparent outline-none text-sm min-w-0" />
            </div>
          </div>
        </div>

        <!-- Order Mode -->
        <div class="flex bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
          <button @click="cart.orderMode = 'dine-in'" :class="['flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-all', cart.orderMode === 'dine-in' ? 'bg-amber-900 text-white' : 'text-stone-600']">
            <Coffee class="w-4 h-4" /> Dine-in
          </button>
          <button @click="cart.orderMode = 'pickup'" :class="['flex-1 flex items-center justify-center gap-1.5 py-2.5 text-sm font-semibold transition-all', cart.orderMode === 'pickup' ? 'bg-amber-900 text-white' : 'text-stone-600']">
            <MapPin class="w-4 h-4" /> Pickup
          </button>
        </div>

        <!-- Items (editable) -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold text-stone-600 uppercase tracking-wide">Items ({{ cart.items.length }})</h3>
          <div v-for="item in cart.items" :key="item.cartKey" class="bg-stone-50 rounded-xl p-3 space-y-2">
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <p class="font-semibold text-stone-800 text-sm">{{ item.name }}</p>
                <p class="text-stone-500 text-xs">Rp {{ item.totalPrice?.toLocaleString() }} ea</p>
                <div v-if="item.options && item.options.length" class="flex flex-wrap gap-1 mt-1">
                  <span v-for="opt in item.options" :key="opt.name" class="px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-medium rounded">{{ opt.name }}</span>
                </div>
              </div>
              <div class="flex items-center gap-1 shrink-0 ml-2">
                <button @click="cart.updateQuantity(item.cartKey, item.quantity - 1)" class="w-7 h-7 bg-white border border-stone-200 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors"><Minus class="w-3.5 h-3.5" /></button>
                <span class="w-7 text-center font-bold text-sm">{{ item.quantity }}</span>
                <button @click="cart.updateQuantity(item.cartKey, item.quantity + 1)" class="w-7 h-7 bg-white border border-stone-200 rounded-lg flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-colors"><Plus class="w-3.5 h-3.5" /></button>
              </div>
            </div>
            <!-- Item Note -->
            <div class="flex items-center gap-1.5 bg-white border border-stone-200 rounded-lg px-2 py-1.5">
              <StickyNote class="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <input v-model="item.notes" type="text" placeholder="Add note..." class="flex-1 bg-transparent outline-none text-xs" />
            </div>
          </div>
        </div>

        <!-- Totals -->
        <div class="bg-amber-50 rounded-xl p-4 border border-amber-100 space-y-1.5">
          <div class="flex justify-between text-stone-600 text-sm"><span>Subtotal</span><span>Rp {{ cart.subtotal.toLocaleString() }}</span></div>
          <div class="flex justify-between text-stone-600 text-sm"><span>Tax ({{ cart.taxRate }}%)</span><span>Rp {{ cart.tax.toLocaleString() }}</span></div>
          <div class="flex justify-between text-stone-600 text-sm"><span>Service ({{ cart.serviceChargeRate }}%)</span><span>Rp {{ cart.serviceCharge.toLocaleString() }}</span></div>
          <div class="flex justify-between text-amber-900 font-bold text-lg pt-2 border-t border-amber-200"><span>Total</span><span>Rp {{ cart.grandTotal.toLocaleString() }}</span></div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-5 border-t border-stone-100 bg-stone-50 shrink-0">
        <button @click="handleProceedToPayment" :disabled="isProcessing || cart.items.length === 0" class="w-full py-3.5 bg-amber-900 hover:bg-amber-800 text-white rounded-xl font-bold shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
          <Loader2 v-if="isProcessing" class="w-5 h-5 animate-spin" />
          <span>{{ isProcessing ? 'Processing...' : `Proceed to Payment — Rp ${cart.grandTotal.toLocaleString()}` }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
