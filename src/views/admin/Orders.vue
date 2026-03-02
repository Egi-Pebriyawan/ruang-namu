<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'
import { Package, ClipboardList, BarChart3, LogOut, Clock, Settings, Printer } from 'lucide-vue-next'
import ReceiptModal from '@/components/ReceiptModal.vue'

const router = useRouter()
const orders = ref([])
const activeTab = ref('active')
const loading = ref(true)
const now = ref(Date.now())
const showTimerSettings = ref(false)
const yellowMin = ref(3)
const redMin = ref(5)
const showReceipt = ref(false)
const receiptData = ref(null)
let timerInterval = null

onMounted(async () => {
  await fetchOrders()
  await loadTimerSettings()
  timerInterval = setInterval(() => { now.value = Date.now() }, 1000)
  const channel = supabase.channel('orders-rt')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => fetchOrders())
    .subscribe()
  onUnmounted(() => { supabase.removeChannel(channel); if (timerInterval) clearInterval(timerInterval) })
})

const fetchOrders = async () => {
  loading.value = true
  const { data } = await supabase.from('orders').select('*, order_items(*, products(name))').order('created_at', { ascending: false })
  if (data) orders.value = data
  loading.value = false
}

const loadTimerSettings = async () => {
  const { data } = await supabase.from('settings').select('timer_yellow_min, timer_red_min').limit(1).single()
  if (data) { yellowMin.value = data.timer_yellow_min; redMin.value = data.timer_red_min }
}

const saveTimerSettings = async () => {
  const { data: existing } = await supabase.from('settings').select('id').limit(1).single()
  if (existing) await supabase.from('settings').update({ timer_yellow_min: yellowMin.value, timer_red_min: redMin.value }).eq('id', existing.id)
  showTimerSettings.value = false
}

const activeOrders = computed(() => orders.value.filter(o => ['new', 'processing', 'ready'].includes(o.order_status)))
const historyOrders = computed(() => orders.value.filter(o => o.order_status === 'served'))

const getElapsedMinutes = (ca) => Math.floor((now.value - new Date(ca).getTime()) / 60000)
const getTimerColor = (ca) => {
  const m = getElapsedMinutes(ca)
  if (m >= redMin.value) return 'bg-red-100 text-red-700 border-red-200'
  if (m >= yellowMin.value) return 'bg-yellow-100 text-yellow-700 border-yellow-200'
  return 'bg-emerald-100 text-emerald-700 border-emerald-200'
}
const getTimerText = (ca) => {
  const ms = now.value - new Date(ca).getTime()
  const m = Math.floor(ms / 60000); const s = Math.floor((ms / 1000) % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

const statusFlow = ['new', 'processing', 'ready', 'served']
const statusLabels = { new: '🆕 New', processing: '👨‍🍳 Processing', ready: '✅ Ready', served: '🍽️ Served' }
const statusColors = { new: 'bg-blue-100 text-blue-700', processing: 'bg-amber-100 text-amber-700', ready: 'bg-emerald-100 text-emerald-700', served: 'bg-stone-100 text-stone-600' }

const getAvailableStatuses = (currentStatus) => {
  const idx = statusFlow.indexOf(currentStatus)
  if (idx < 0 || idx >= statusFlow.length - 1) return []
  return [statusFlow[idx + 1]] // Only next status allowed (sequential)
}

const updateStatus = async (orderId, newStatus) => {
  await supabase.from('orders').update({ order_status: newStatus }).eq('id', orderId)
  fetchOrders()
}

const reprintReceipt = (order) => {
  receiptData.value = {
    orderId: order.id,
    customerName: order.customer_name || 'Walk-in',
    items: (order.order_items || []).map(i => ({
      product_id: i.product_id,
      name: i.products?.name || 'Item',
      totalPrice: i.price_at_time,
      quantity: i.quantity,
      notes: i.notes
    })),
    subtotal: parseFloat(order.subtotal) || 0,
    tax: parseFloat(order.tax) || 0,
    serviceCharge: parseFloat(order.service_charge) || 0,
    grandTotal: parseFloat(order.grand_total) || 0,
    orderMode: order.order_mode,
    paymentMethod: order.payment_method,
    date: new Date(order.created_at).toLocaleString('id-ID')
  }
  showReceipt.value = true
}

const handleLogout = async () => { await supabase.auth.signOut(); router.push('/admin/login') }
</script>

<template>
  <div class="min-h-screen bg-stone-100 flex">
    <!-- Sidebar -->
    <div class="w-[72px] bg-white border-r border-stone-200 flex flex-col items-center py-5 gap-1.5 shrink-0 z-10 shadow-md">
      <div class="font-playfair font-bold text-amber-900 text-[10px] text-center mb-3">RUANG<br>NAMU</div>
      <div class="w-full px-2 flex flex-col gap-1 flex-1">
        <router-link to="/admin/pos" class="p-2.5 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="POS">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
        </router-link>
        <router-link to="/admin/orders" class="p-2.5 bg-amber-900 text-white rounded-xl shadow-sm flex justify-center" title="Orders"><ClipboardList class="w-5 h-5" /></router-link>
        <router-link to="/admin/dashboard" class="p-2.5 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="Dashboard"><BarChart3 class="w-5 h-5" /></router-link>
        <router-link to="/admin/products" class="p-2.5 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="Inventory"><Package class="w-5 h-5" /></router-link>
      </div>
      <div class="w-full px-2 border-t border-stone-100 pt-2">
        <button @click="handleLogout" class="w-full p-2.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all flex justify-center" title="Logout"><LogOut class="w-5 h-5" /></button>
      </div>
    </div>

    <!-- Main -->
    <div class="flex-1 p-5 overflow-y-auto">
      <div class="flex items-center justify-between mb-5">
        <h1 class="text-xl font-bold text-stone-900">📋 Order Management</h1>
        <div class="flex items-center gap-2">
          <button @click="showTimerSettings = true" class="flex items-center gap-1.5 px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-600 hover:border-amber-400 transition-colors"><Settings class="w-3.5 h-3.5" /> Timer</button>
          <div class="flex bg-white rounded-xl border border-stone-200 overflow-hidden">
            <button @click="activeTab = 'active'" :class="['px-4 py-2 text-xs font-medium transition-all', activeTab === 'active' ? 'bg-amber-900 text-white' : 'text-stone-600 hover:bg-stone-50']">Active</button>
            <button @click="activeTab = 'history'" :class="['px-4 py-2 text-xs font-medium transition-all', activeTab === 'history' ? 'bg-amber-900 text-white' : 'text-stone-600 hover:bg-stone-50']">History</button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center text-stone-400 py-12 text-sm">Loading orders...</div>

      <!-- Active Orders -->
      <div v-else-if="activeTab === 'active'">
        <div v-if="activeOrders.length === 0" class="text-center text-stone-400 py-12 text-sm">No active orders</div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div v-for="order in activeOrders" :key="order.id" class="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow">
            <div class="p-4 border-b border-stone-100 flex items-center justify-between">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-bold text-stone-900 text-sm">#{{ order.id.slice(0, 8) }}</span>
                  <span :class="['px-2 py-0.5 rounded-full text-[10px] font-semibold', statusColors[order.order_status]]">{{ statusLabels[order.order_status] }}</span>
                  <span class="px-1.5 py-0.5 bg-stone-100 text-stone-500 text-[9px] rounded font-medium">{{ order.order_mode || 'dine-in' }}</span>
                </div>
                <p class="text-stone-500 text-xs mt-0.5">{{ order.customer_name || 'Walk-in' }} · {{ order.order_type }}</p>
              </div>
              <div :class="['px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold border flex items-center gap-1', getTimerColor(order.created_at)]">
                <Clock class="w-3 h-3" />{{ getTimerText(order.created_at) }}
              </div>
            </div>
            <div class="p-4 space-y-1">
              <div v-for="item in order.order_items" :key="item.id" class="flex justify-between text-sm">
                <span class="text-stone-700"><span class="font-semibold">{{ item.quantity }}x</span> {{ item.products?.name || 'Item' }}</span>
                <span class="text-stone-500 text-xs">Rp {{ (item.price_at_time * item.quantity).toLocaleString() }}</span>
              </div>
            </div>
            <div class="p-4 border-t border-stone-100 bg-stone-50 flex items-center justify-between gap-2">
              <span class="font-bold text-stone-900 text-sm">Rp {{ order.grand_total?.toLocaleString() }}</span>
              <div class="flex items-center gap-2">
                <button @click="reprintReceipt(order)" class="p-2 text-stone-500 hover:bg-stone-200 rounded-lg transition-colors" title="Reprint Receipt"><Printer class="w-4 h-4" /></button>
                <!-- Sequential Dropdown Status -->
                <select v-if="getAvailableStatuses(order.order_status).length > 0" @change="updateStatus(order.id, $event.target.value)" class="px-3 py-1.5 bg-amber-900 text-white text-xs font-semibold rounded-lg cursor-pointer outline-none">
                  <option disabled selected>→ Next</option>
                  <option v-for="s in getAvailableStatuses(order.order_status)" :key="s" :value="s">{{ statusLabels[s] }}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- History -->
      <div v-else>
        <div v-if="historyOrders.length === 0" class="text-center text-stone-400 py-12 text-sm">No history</div>
        <div class="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <table class="w-full text-left">
            <thead><tr class="border-b border-stone-200 bg-stone-50/50">
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500">Order</th>
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500">Customer</th>
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500">Total</th>
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500">Date</th>
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500"></th>
            </tr></thead>
            <tbody>
              <tr v-for="order in historyOrders" :key="order.id" class="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                <td class="py-3 px-4 font-mono text-xs text-stone-700">#{{ order.id.slice(0, 8) }}</td>
                <td class="py-3 px-4 text-sm text-stone-800">{{ order.customer_name || 'Walk-in' }}</td>
                <td class="py-3 px-4 font-medium text-sm text-stone-900">Rp {{ order.grand_total?.toLocaleString() }}</td>
                <td class="py-3 px-4 text-xs text-stone-500">{{ new Date(order.created_at).toLocaleString('id-ID') }}</td>
                <td class="py-3 px-4"><button @click="reprintReceipt(order)" class="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors" title="Reprint"><Printer class="w-4 h-4" /></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Timer Settings Modal -->
    <div v-if="showTimerSettings" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" @click.self="showTimerSettings = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-xs overflow-hidden">
        <div class="p-5 border-b border-stone-100"><h3 class="text-lg font-bold text-stone-900">⏱️ Timer Settings</h3><p class="text-stone-500 text-xs mt-1">Configure warning thresholds</p></div>
        <div class="p-5 space-y-4">
          <div><label class="block text-sm font-medium text-stone-700 mb-1">🟡 Yellow after (min)</label><input v-model.number="yellowMin" type="number" min="1" max="60" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" /></div>
          <div><label class="block text-sm font-medium text-stone-700 mb-1">🔴 Red after (min)</label><input v-model.number="redMin" type="number" min="1" max="60" class="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm" /></div>
        </div>
        <div class="p-5 border-t border-stone-100 bg-stone-50 flex justify-end gap-3">
          <button @click="showTimerSettings = false" class="px-4 py-2 text-stone-600 font-medium hover:bg-stone-200 rounded-lg text-sm">Cancel</button>
          <button @click="saveTimerSettings" class="px-4 py-2 bg-amber-900 text-white font-medium hover:bg-amber-800 rounded-lg text-sm shadow-sm">Save</button>
        </div>
      </div>
    </div>

    <!-- Receipt Reprint Modal -->
    <ReceiptModal v-if="showReceipt && receiptData" :receipt="receiptData" @close="showReceipt = false" />
  </div>
</template>
