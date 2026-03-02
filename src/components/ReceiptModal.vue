<script setup>
import { X, MessageCircle, Mail, Printer } from 'lucide-vue-next'

const props = defineProps({ receipt: { type: Object, required: true } })
const emit = defineEmits(['close'])

const receiptText = () => {
  let t = `🧾 *RUANG NAMU - ORDER RECEIPT*\n\n`
  t += `📋 Order: #${props.receipt.orderId?.slice(0, 8) || 'N/A'}\n`
  t += `👤 Customer: ${props.receipt.customerName}\n`
  t += `📅 Date: ${props.receipt.date}\n`
  t += `🍽️ ${props.receipt.orderMode || 'dine-in'}\n\n`
  t += `--- Items ---\n`
  props.receipt.items.forEach(item => {
    const price = item.totalPrice || item.price || 0
    t += `• ${item.name} x${item.quantity} = Rp ${(price * item.quantity).toLocaleString()}\n`
    if (item.options?.length) t += `  (${item.options.map(o => o.name).join(', ')})\n`
    if (item.notes) t += `  📝 ${item.notes}\n`
  })
  t += `\n--- Totals ---\n`
  t += `Subtotal: Rp ${props.receipt.subtotal.toLocaleString()}\nTax: Rp ${props.receipt.tax.toLocaleString()}\nService: Rp ${props.receipt.serviceCharge.toLocaleString()}\n*TOTAL: Rp ${props.receipt.grandTotal.toLocaleString()}*\n\nPayment: ${props.receipt.paymentMethod || 'Midtrans'}\nThank you for visiting Ruang Namu! ☕`
  return t
}

const sendWhatsApp = () => window.open(`https://wa.me/?text=${encodeURIComponent(receiptText())}`, '_blank')
const sendEmail = () => window.open(`mailto:?subject=${encodeURIComponent(`Receipt - Ruang Namu #${props.receipt.orderId?.slice(0, 8) || ''}`)}&body=${encodeURIComponent(receiptText())}`, '_blank')
const printReceipt = () => window.print()
</script>

<template>
  <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4" @click.self="emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
      <div class="p-5 border-b border-stone-100 flex items-center justify-between shrink-0 bg-emerald-50">
        <div><h2 class="text-lg font-bold text-emerald-800">✅ Payment Successful!</h2><p class="text-emerald-600 text-xs">Order placed</p></div>
        <button @click="emit('close')" class="p-2 hover:bg-emerald-100 rounded-lg"><X class="w-5 h-5 text-emerald-700" /></button>
      </div>
      <div class="flex-1 overflow-y-auto p-6" id="receipt-print">
        <div class="text-center mb-5"><h3 class="font-playfair text-2xl font-bold text-stone-900">Ruang Namu</h3><p class="text-stone-500 text-[11px] mt-1">Order Receipt</p></div>
        <div class="border-t border-dashed border-stone-300 pt-3 space-y-1.5 text-sm">
          <div class="flex justify-between"><span class="text-stone-500">Order ID</span><span class="font-mono text-stone-800">#{{ receipt.orderId?.slice(0, 8) }}</span></div>
          <div class="flex justify-between"><span class="text-stone-500">Customer</span><span class="font-medium text-stone-800">{{ receipt.customerName }}</span></div>
          <div class="flex justify-between"><span class="text-stone-500">Date</span><span class="text-stone-800">{{ receipt.date }}</span></div>
          <div class="flex justify-between"><span class="text-stone-500">Mode</span><span class="text-stone-800 capitalize">{{ receipt.orderMode || 'dine-in' }}</span></div>
        </div>
        <div class="border-t border-dashed border-stone-300 mt-3 pt-3">
          <div v-for="item in receipt.items" :key="item.product_id || item.cartKey" class="py-1.5">
            <div class="flex justify-between text-sm">
              <div><span class="text-stone-800">{{ item.name }}</span><span class="text-stone-400 ml-1">x{{ item.quantity }}</span></div>
              <span class="text-stone-700 font-medium">Rp {{ ((item.totalPrice || item.price || 0) * item.quantity).toLocaleString() }}</span>
            </div>
            <div v-if="item.options?.length" class="text-[10px] text-stone-400 mt-0.5">{{ item.options.map(o => o.name).join(' · ') }}</div>
            <div v-if="item.notes" class="text-[10px] text-stone-400 italic">📝 {{ item.notes }}</div>
          </div>
        </div>
        <div class="border-t border-dashed border-stone-300 mt-3 pt-3 space-y-1 text-sm">
          <div class="flex justify-between text-stone-500"><span>Subtotal</span><span>Rp {{ receipt.subtotal.toLocaleString() }}</span></div>
          <div class="flex justify-between text-stone-500"><span>Tax</span><span>Rp {{ receipt.tax.toLocaleString() }}</span></div>
          <div class="flex justify-between text-stone-500"><span>Service</span><span>Rp {{ receipt.serviceCharge.toLocaleString() }}</span></div>
          <div class="flex justify-between font-bold text-lg text-stone-900 pt-2 border-t border-stone-200"><span>TOTAL</span><span>Rp {{ receipt.grandTotal.toLocaleString() }}</span></div>
        </div>
        <div class="text-center mt-5 text-stone-400 text-[11px]">Thank you for visiting Ruang Namu! ☕</div>
      </div>
      <div class="p-4 border-t border-stone-100 bg-stone-50 shrink-0 grid grid-cols-3 gap-2">
        <button @click="sendWhatsApp" class="flex flex-col items-center gap-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-medium transition-colors shadow-sm"><MessageCircle class="w-4 h-4" />WhatsApp</button>
        <button @click="sendEmail" class="flex flex-col items-center gap-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-medium transition-colors shadow-sm"><Mail class="w-4 h-4" />Email</button>
        <button @click="printReceipt" class="flex flex-col items-center gap-1 py-2.5 bg-stone-700 hover:bg-stone-800 text-white rounded-xl text-[11px] font-medium transition-colors shadow-sm"><Printer class="w-4 h-4" />Print</button>
      </div>
    </div>
  </div>
</template>
