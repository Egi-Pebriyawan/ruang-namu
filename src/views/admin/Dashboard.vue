<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'vue-router'
import { Package, ClipboardList, BarChart3, LogOut, TrendingUp, ShoppingBag, DollarSign, Download } from 'lucide-vue-next'
import * as XLSX from 'xlsx'

const router = useRouter()
const orders = ref([])
const loading = ref(true)
const dateRange = ref('today') // today, week, month, all

onMounted(async () => { await fetchOrders() })

const fetchOrders = async () => {
  loading.value = true
  const { data } = await supabase.from('orders').select('*, order_items(*, products(name))').eq('payment_status', 'paid').order('created_at', { ascending: false })
  if (data) orders.value = data
  loading.value = false
}

const filteredOrders = computed(() => {
  const now = new Date()
  return orders.value.filter(o => {
    const d = new Date(o.created_at)
    if (dateRange.value === 'today') return d.toDateString() === now.toDateString()
    if (dateRange.value === 'week') { const w = new Date(now); w.setDate(w.getDate() - 7); return d >= w }
    if (dateRange.value === 'month') { const m = new Date(now); m.setMonth(m.getMonth() - 1); return d >= m }
    return true
  })
})

const totalRevenue = computed(() => filteredOrders.value.reduce((s, o) => s + (parseFloat(o.grand_total) || 0), 0))
const totalOrders = computed(() => filteredOrders.value.length)
const avgOrderValue = computed(() => totalOrders.value > 0 ? Math.round(totalRevenue.value / totalOrders.value) : 0)

// Simple daily revenue for chart
const dailyRevenue = computed(() => {
  const map = {}
  filteredOrders.value.forEach(o => {
    const day = new Date(o.created_at).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
    map[day] = (map[day] || 0) + (parseFloat(o.grand_total) || 0)
  })
  return Object.entries(map).slice(-7)
})

const maxRevenue = computed(() => Math.max(...dailyRevenue.value.map(d => d[1]), 1))

const exportToExcel = () => {
  const data = filteredOrders.value.map(o => ({
    'Order ID': o.id.slice(0, 8),
    'Customer': o.customer_name || 'Walk-in',
    'Type': o.order_type,
    'Subtotal': o.subtotal,
    'Tax': o.tax,
    'Service Charge': o.service_charge,
    'Grand Total': o.grand_total,
    'Payment Method': o.payment_method,
    'Status': o.order_status,
    'Date': new Date(o.created_at).toLocaleString('id-ID')
  }))
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sales Report')
  XLSX.writeFile(wb, `ruang-namu-report-${dateRange.value}.xlsx`)
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/admin/login')
}
</script>

<template>
  <div class="min-h-screen bg-stone-100 flex">
    <!-- Sidebar -->
    <div class="w-20 bg-white border-r border-stone-200 flex flex-col items-center py-5 gap-2 shrink-0 z-10 shadow-md">
      <div class="font-playfair font-bold text-amber-900 text-xs text-center mb-4">RN<br>POS</div>
      <div class="w-full px-2 flex flex-col gap-1.5 flex-1">
        <router-link to="/admin/pos" class="p-3 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="POS">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
        </router-link>
        <router-link to="/admin/orders" class="p-3 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="Orders">
          <ClipboardList class="w-5 h-5" />
        </router-link>
        <router-link to="/admin/dashboard" class="p-3 bg-amber-900 text-white rounded-xl shadow-sm flex justify-center" title="Dashboard">
          <BarChart3 class="w-5 h-5" />
        </router-link>
        <router-link to="/admin/products" class="p-3 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="Inventory">
          <Package class="w-5 h-5" />
        </router-link>
      </div>
      <div class="w-full px-2 border-t border-stone-100 pt-3">
        <button @click="handleLogout" class="w-full p-3 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all flex justify-center" title="Logout">
          <LogOut class="w-5 h-5" />
        </button>
      </div>
    </div>

    <!-- Main -->
    <div class="flex-1 p-6 overflow-y-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold text-stone-900">Dashboard</h1>
        <div class="flex items-center gap-3">
          <div class="flex bg-white rounded-xl border border-stone-200 overflow-hidden">
            <button v-for="r in [{v:'today',l:'Today'},{v:'week',l:'Week'},{v:'month',l:'Month'},{v:'all',l:'All'}]" :key="r.v" @click="dateRange = r.v" :class="['px-4 py-2 text-xs font-medium transition-all', dateRange === r.v ? 'bg-amber-900 text-white' : 'text-stone-600 hover:bg-stone-50']">{{ r.l }}</button>
          </div>
          <button @click="exportToExcel" class="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
            <Download class="w-4 h-4" /> Export Excel
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center"><DollarSign class="w-5 h-5 text-emerald-600" /></div>
            <span class="text-stone-500 text-sm font-medium">Revenue</span>
          </div>
          <p class="text-2xl font-bold text-stone-900">Rp {{ totalRevenue.toLocaleString() }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><ShoppingBag class="w-5 h-5 text-blue-600" /></div>
            <span class="text-stone-500 text-sm font-medium">Total Orders</span>
          </div>
          <p class="text-2xl font-bold text-stone-900">{{ totalOrders }}</p>
        </div>
        <div class="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center"><TrendingUp class="w-5 h-5 text-amber-600" /></div>
            <span class="text-stone-500 text-sm font-medium">Avg Order</span>
          </div>
          <p class="text-2xl font-bold text-stone-900">Rp {{ avgOrderValue.toLocaleString() }}</p>
        </div>
      </div>

      <!-- Revenue Chart -->
      <div class="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm mb-6">
        <h3 class="text-sm font-semibold text-stone-700 mb-4">Revenue Chart</h3>
        <div v-if="dailyRevenue.length === 0" class="text-stone-400 text-center py-8 text-sm">No data for this period</div>
        <div v-else class="flex items-end gap-3 h-48">
          <div v-for="[day, rev] in dailyRevenue" :key="day" class="flex-1 flex flex-col items-center gap-2">
            <span class="text-[10px] text-stone-500 font-medium">Rp {{ (rev / 1000).toFixed(0) }}K</span>
            <div class="w-full bg-gradient-to-t from-amber-500 to-amber-300 rounded-t-lg transition-all" :style="{ height: `${(rev / maxRevenue) * 100}%`, minHeight: '8px' }"></div>
            <span class="text-[10px] text-stone-400 font-medium">{{ day }}</span>
          </div>
        </div>
      </div>

      <!-- Recent Orders -->
      <div class="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
        <div class="p-5 border-b border-stone-100">
          <h3 class="text-sm font-semibold text-stone-700">Recent Orders</h3>
        </div>
        <table class="w-full text-left">
          <thead>
            <tr class="border-b border-stone-200 bg-stone-50/50">
              <th class="py-3 px-5 text-xs font-semibold text-stone-500">Order</th>
              <th class="py-3 px-5 text-xs font-semibold text-stone-500">Customer</th>
              <th class="py-3 px-5 text-xs font-semibold text-stone-500">Total</th>
              <th class="py-3 px-5 text-xs font-semibold text-stone-500">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in filteredOrders.slice(0, 10)" :key="order.id" class="border-b border-stone-100 hover:bg-stone-50 transition-colors">
              <td class="py-3 px-5 font-mono text-xs text-stone-700">#{{ order.id.slice(0, 8) }}</td>
              <td class="py-3 px-5 text-sm text-stone-800">{{ order.customer_name || 'Walk-in' }}</td>
              <td class="py-3 px-5 font-medium text-sm text-stone-900">Rp {{ (parseFloat(order.grand_total) || 0).toLocaleString() }}</td>
              <td class="py-3 px-5 text-xs text-stone-500">{{ new Date(order.created_at).toLocaleString('id-ID') }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
