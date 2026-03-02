<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useCartStore } from '@/composables/useCartStore'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'
import { Package, ClipboardList, BarChart3, LogOut, Settings, CheckCircle, AlertCircle, User, Coffee, MapPin, Pencil } from 'lucide-vue-next'
import ProductDetailModal from '@/components/ProductDetailModal.vue'
import ReceiptModal from '@/components/ReceiptModal.vue'

const router = useRouter()
const cart = useCartStore()
const products = ref([])
const categories = ref([])
const paymentMethod = ref('cash')
const cashAmount = ref(0)
const searchQuery = ref('')
const activeCategory = ref('all')
const toasts = ref([])
const showSettingsModal = ref(false)
const localTax = ref(10)
const localService = ref(5)
const selectedProduct = ref(null)
const showConfirm = ref(false)
const showReceipt = ref(false)
const receiptData = ref(null)

onMounted(async () => {
  await cart.loadSettings()
  localTax.value = cart.taxRate
  localService.value = cart.serviceChargeRate

  const { data: cats } = await supabase.from('categories').select('*').order('name')
  if (cats) categories.value = cats
  const { data } = await supabase.from('products').select('*, categories(name)')
  if (data) products.value = data

  const channel = supabase.channel('pos-orders')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
      if (payload.new.order_type === 'online' && payload.new.payment_status === 'paid') {
        addToast('success', `Online order from ${payload.new.customer_name || 'Customer'}!`)
      }
    })
    .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, payload => {
      if (payload.new.payment_status === 'paid' && payload.old?.payment_status !== 'paid' && payload.new.order_type === 'online') {
        addToast('success', `Payment confirmed #${payload.new.id.slice(0, 8)}`)
      }
    })
    .subscribe()
  onUnmounted(() => supabase.removeChannel(channel))
})

const filteredProducts = computed(() => {
  let list = products.value
  if (activeCategory.value !== 'all') list = list.filter(p => p.category_id === activeCategory.value)
  if (searchQuery.value) list = list.filter(p => p.name.toLowerCase().includes(searchQuery.value.toLowerCase()))
  return list
})

const addToast = (type, message) => {
  const id = Date.now()
  toasts.value.push({ id, type, message })
  setTimeout(() => { toasts.value = toasts.value.filter(t => t.id !== id) }, 4000)
}

const applyTaxInline = () => {
  cart.taxRate = localTax.value
  cart.serviceChargeRate = localService.value
}

const saveSettings = async () => {
  cart.taxRate = localTax.value
  cart.serviceChargeRate = localService.value
  const { data: existing } = await supabase.from('settings').select('id').limit(1).single()
  if (existing) await supabase.from('settings').update({ tax_rate: localTax.value, service_charge_rate: localService.value }).eq('id', existing.id)
  showSettingsModal.value = false
  addToast('success', 'Settings saved!')
}

const confirmCheckout = () => {
  if (cart.items.length === 0) return
  showConfirm.value = true
}

const checkout = async () => {
  showConfirm.value = false
  if (!cart.customerName.trim()) cart.customerName = 'Walk-in'

  const { data: order, error } = await supabase.from('orders').insert({
    order_type: 'pos',
    customer_name: cart.customerName,
    customer_email: cart.customerEmail || null,
    customer_whatsapp: cart.customerWhatsapp || null,
    order_mode: cart.orderMode,
    subtotal: cart.subtotal,
    tax: cart.tax,
    service_charge: cart.serviceCharge,
    grand_total: cart.grandTotal,
    payment_method: paymentMethod.value,
    payment_status: 'paid',
    order_status: 'new'
  }).select('*').single()

  if (order) {
    const orderItems = cart.items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_time: item.totalPrice,
      notes: item.notes || null
    }))
    const { data: insertedItems } = await supabase.from('order_items').insert(orderItems).select('*')

    // Save item options
    if (insertedItems) {
      const allOpts = []
      insertedItems.forEach((dbItem, idx) => {
        const cartItem = cart.items[idx]
        if (cartItem?.options) {
          cartItem.options.forEach(opt => {
            allOpts.push({ order_item_id: dbItem.id, option_category: opt.category, option_name: opt.name, price_modifier: opt.price_modifier })
          })
        }
      })
      if (allOpts.length > 0) await supabase.from('order_item_options').insert(allOpts)
    }

    receiptData.value = {
      orderId: order.id,
      customerName: cart.customerName,
      items: [...cart.items],
      subtotal: cart.subtotal,
      tax: cart.tax,
      serviceCharge: cart.serviceCharge,
      grandTotal: cart.grandTotal,
      orderMode: cart.orderMode,
      paymentMethod: paymentMethod.value,
      date: new Date().toLocaleString('id-ID')
    }
    showReceipt.value = true
    cart.clearCart()
    cashAmount.value = 0
    addToast('success', `Order #${order.id.slice(0, 8)} created!`)
  } else {
    addToast('error', 'Failed to create order.')
  }
}

const handleLogout = async () => { await supabase.auth.signOut(); router.push('/admin/login') }
</script>

<template>
  <div class="min-h-screen bg-stone-100 flex">
    <!-- Sidebar -->
    <div class="w-[72px] bg-white border-r border-stone-200 flex flex-col items-center py-5 gap-1.5 shrink-0 z-10 shadow-md">
      <div class="font-playfair font-bold text-amber-900 text-[10px] text-center mb-3 px-1">RUANG<br>NAMU</div>
      <div class="w-full px-2 flex flex-col gap-1 flex-1">
        <router-link to="/admin/pos" class="p-2.5 bg-amber-900 text-white rounded-xl shadow-sm flex justify-center" title="POS">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
        </router-link>
        <router-link to="/admin/orders" class="p-2.5 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="Orders"><ClipboardList class="w-5 h-5" /></router-link>
        <router-link to="/admin/dashboard" class="p-2.5 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="Dashboard"><BarChart3 class="w-5 h-5" /></router-link>
        <router-link to="/admin/products" class="p-2.5 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="Inventory"><Package class="w-5 h-5" /></router-link>
      </div>
      <div class="w-full px-2 border-t border-stone-100 pt-2 flex flex-col gap-1">
        <button @click="showSettingsModal = true" class="p-2.5 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="Settings"><Settings class="w-5 h-5" /></button>
        <button @click="handleLogout" class="p-2.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all flex justify-center" title="Logout"><LogOut class="w-5 h-5" /></button>
      </div>
    </div>

    <!-- Products Grid -->
    <div class="flex-1 p-5 overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-xl font-bold text-stone-900">Point of Sale</h1>
        <input v-model="searchQuery" type="search" placeholder="Search..." class="px-3 py-2 border border-stone-200 rounded-xl text-sm outline-none w-52 bg-white focus:border-amber-400" />
      </div>
      <div class="flex gap-2 mb-4 flex-wrap">
        <button @click="activeCategory = 'all'" :class="['px-3 py-1.5 rounded-full text-xs font-semibold transition-all border', activeCategory === 'all' ? 'bg-amber-900 text-white border-amber-900' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400']">All</button>
        <button v-for="cat in categories" :key="cat.id" @click="activeCategory = cat.id" :class="['px-3 py-1.5 rounded-full text-xs font-semibold transition-all border', activeCategory === cat.id ? 'bg-amber-900 text-white border-amber-900' : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400']">{{ cat.name }}</button>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        <div v-for="product in filteredProducts" :key="product.id" class="bg-white p-3 rounded-xl shadow-sm border border-stone-100 hover:shadow-lg hover:border-amber-200 hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col group" @click="selectedProduct = product">
          <div class="aspect-square bg-stone-100 rounded-lg mb-2 flex items-center justify-center overflow-hidden">
            <img v-if="product.image_url" :src="product.image_url" class="object-cover w-full h-full group-hover:scale-105 transition-transform" />
            <span v-else class="text-stone-400 text-[10px]">No img</span>
          </div>
          <h3 class="font-medium text-stone-800 text-xs flex-1 leading-tight">{{ product.name }}</h3>
          <p class="text-amber-800 font-bold text-sm mt-1">Rp {{ product.price?.toLocaleString() }}</p>
        </div>
      </div>
    </div>

    <!-- Cart Sidebar -->
    <div class="w-[360px] bg-white border-l border-stone-200 shadow-md flex flex-col h-screen shrink-0">
      <div class="p-4 border-b border-stone-100 shrink-0">
        <h2 class="text-lg font-bold text-stone-900">Current Order</h2>
      </div>
      <!-- Customer + Mode -->
      <div class="px-4 pt-3 space-y-2 shrink-0">
        <div class="flex items-center gap-2 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2">
          <User class="w-4 h-4 text-stone-400 shrink-0" />
          <input v-model="cart.customerName" type="text" placeholder="Customer name" class="flex-1 bg-transparent outline-none text-sm" />
        </div>
        <div class="flex bg-stone-100 rounded-lg overflow-hidden border border-stone-200">
          <button @click="cart.orderMode = 'dine-in'" :class="['flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold transition-all', cart.orderMode === 'dine-in' ? 'bg-amber-900 text-white' : 'text-stone-600']"><Coffee class="w-3.5 h-3.5" /> Dine-in</button>
          <button @click="cart.orderMode = 'pickup'" :class="['flex-1 flex items-center justify-center gap-1 py-2 text-xs font-semibold transition-all', cart.orderMode === 'pickup' ? 'bg-amber-900 text-white' : 'text-stone-600']"><MapPin class="w-3.5 h-3.5" /> Pickup</button>
        </div>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-2">
        <div v-if="cart.items.length === 0" class="text-stone-400 text-center py-8 text-sm">Cart is empty</div>
        <div v-for="item in cart.items" :key="item.cartKey" class="bg-stone-50 rounded-lg px-3 py-2 space-y-1.5">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <p class="font-medium text-stone-800 text-sm truncate">{{ item.name }}</p>
              <p class="text-stone-500 text-[11px]">Rp {{ item.totalPrice?.toLocaleString() }}</p>
              <div v-if="item.options?.length" class="flex flex-wrap gap-0.5 mt-0.5">
                <span v-for="o in item.options" :key="o.name" class="px-1 py-px bg-amber-100 text-amber-800 text-[9px] font-medium rounded">{{ o.name }}</span>
              </div>
            </div>
            <div class="flex items-center gap-1 shrink-0 ml-2">
              <button class="w-6 h-6 bg-white border border-stone-200 rounded flex items-center justify-center hover:bg-red-50 hover:text-red-600 transition-colors text-xs font-bold" @click.stop="cart.updateQuantity(item.cartKey, item.quantity - 1)">−</button>
              <span class="text-xs font-bold w-5 text-center">{{ item.quantity }}</span>
              <button class="w-6 h-6 bg-white border border-stone-200 rounded flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-600 transition-colors text-xs font-bold" @click.stop="cart.updateQuantity(item.cartKey, item.quantity + 1)">+</button>
            </div>
          </div>
          <div v-if="item.notes" class="text-[10px] text-stone-500 italic">📝 {{ item.notes }}</div>
        </div>
      </div>

      <div class="p-4 border-t border-stone-100 bg-stone-50 shrink-0 space-y-3">
        <div class="space-y-1">
          <div class="flex justify-between text-stone-500 text-sm"><span>Subtotal</span><span>Rp {{ cart.subtotal.toLocaleString() }}</span></div>
          <!-- Editable Tax -->
          <div class="flex justify-between items-center text-stone-500 text-sm">
            <div class="flex items-center gap-1">
              <span>Tax</span>
              <span class="text-[10px] bg-white border border-stone-200 rounded px-1">(
                <input v-model.number="localTax" type="number" min="0" max="100" step="0.5" class="w-8 text-center bg-transparent outline-none text-[10px]" @change="applyTaxInline" />%)</span>
            </div>
            <span>Rp {{ cart.tax.toLocaleString() }}</span>
          </div>
          <!-- Editable Service -->
          <div class="flex justify-between items-center text-stone-500 text-sm">
            <div class="flex items-center gap-1">
              <span>Service</span>
              <span class="text-[10px] bg-white border border-stone-200 rounded px-1">(
                <input v-model.number="localService" type="number" min="0" max="100" step="0.5" class="w-8 text-center bg-transparent outline-none text-[10px]" @change="applyTaxInline" />%)</span>
            </div>
            <span>Rp {{ cart.serviceCharge.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-stone-900 font-bold text-base pt-1.5 border-t border-stone-200"><span>Total</span><span>Rp {{ cart.grandTotal.toLocaleString() }}</span></div>
        </div>

        <div class="space-y-2">
          <label class="block text-[10px] font-bold text-stone-500 uppercase">Payment</label>
          <div class="grid grid-cols-2 gap-2">
            <button :class="['py-2 rounded-lg border text-sm font-medium transition-all', paymentMethod === 'cash' ? 'bg-amber-900 border-amber-900 text-white' : 'bg-white border-stone-200 text-stone-600 hover:border-amber-400']" @click="paymentMethod = 'cash'">💵 Cash</button>
            <button :class="['py-2 rounded-lg border text-sm font-medium transition-all', paymentMethod === 'cashless' ? 'bg-amber-900 border-amber-900 text-white' : 'bg-white border-stone-200 text-stone-600 hover:border-amber-400']" @click="paymentMethod = 'cashless'">💳 Cashless</button>
          </div>
          <div v-if="paymentMethod === 'cash'" class="space-y-1">
            <input v-model.number="cashAmount" type="number" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" placeholder="Cash received" />
            <div v-if="cashAmount >= cart.grandTotal && cashAmount > 0" class="flex justify-between text-sm">
              <span class="text-stone-500">Change</span><span class="font-bold text-emerald-600">Rp {{ (cashAmount - cart.grandTotal).toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <button class="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all disabled:opacity-40 active:scale-[0.98]" :disabled="cart.items.length === 0 || (paymentMethod === 'cash' && cashAmount < cart.grandTotal)" @click="confirmCheckout">
          ✓ Complete Order
        </button>
      </div>
    </div>

    <!-- Toasts -->
    <div class="fixed top-4 right-4 space-y-2 z-[200] max-w-sm">
      <transition-group enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-x-8" enter-to-class="opacity-100 translate-x-0" leave-active-class="transition duration-200" leave-from-class="opacity-100" leave-to-class="opacity-0 translate-x-8">
        <div v-for="t in toasts" :key="t.id" :class="['flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border text-sm font-medium', t.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800']">
          <CheckCircle v-if="t.type === 'success'" class="w-5 h-5 text-emerald-500 shrink-0" />
          <AlertCircle v-else class="w-5 h-5 text-red-500 shrink-0" />
          {{ t.message }}
        </div>
      </transition-group>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirm" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 text-center space-y-4">
        <div class="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto"><CheckCircle class="w-8 h-8 text-amber-700" /></div>
        <h3 class="text-lg font-bold text-stone-900">Confirm Order?</h3>
        <p class="text-stone-500 text-sm">Total: <strong class="text-stone-900">Rp {{ cart.grandTotal.toLocaleString() }}</strong></p>
        <div class="flex gap-3">
          <button @click="showConfirm = false" class="flex-1 py-2.5 border border-stone-200 text-stone-600 rounded-xl font-medium hover:bg-stone-50 text-sm">Cancel</button>
          <button @click="checkout" class="flex-1 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 text-sm shadow-sm">Confirm</button>
        </div>
      </div>
    </div>

    <!-- Settings Modal -->
    <div v-if="showSettingsModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" @click.self="showSettingsModal = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
        <div class="p-5 border-b border-stone-100"><h3 class="text-lg font-bold text-stone-900">⚙️ POS Settings</h3></div>
        <div class="p-5 space-y-4">
          <div><label class="block text-sm font-medium text-stone-700 mb-1">Tax Rate (%)</label><input v-model.number="localTax" type="number" min="0" max="100" step="0.5" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" /></div>
          <div><label class="block text-sm font-medium text-stone-700 mb-1">Service Charge (%)</label><input v-model.number="localService" type="number" min="0" max="100" step="0.5" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" /></div>
        </div>
        <div class="p-5 border-t border-stone-100 bg-stone-50 flex justify-end gap-3">
          <button @click="showSettingsModal = false" class="px-4 py-2 text-stone-600 font-medium hover:bg-stone-200 rounded-lg text-sm">Cancel</button>
          <button @click="saveSettings" class="px-4 py-2 bg-amber-900 text-white font-medium hover:bg-amber-800 rounded-lg text-sm shadow-sm">Save</button>
        </div>
      </div>
    </div>

    <!-- Product Detail Modal -->
    <ProductDetailModal v-if="selectedProduct" :product="selectedProduct" @close="selectedProduct = null" @added="selectedProduct = null" />
    <!-- Receipt Modal -->
    <ReceiptModal v-if="showReceipt && receiptData" :receipt="receiptData" @close="showReceipt = false" />
  </div>
</template>
