<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'
import { Package, Tags, Plus, Edit2, Trash2, Upload, Link, ClipboardList, BarChart3, LogOut, Loader2, Sliders } from 'lucide-vue-next'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeTab = ref('products')
const categories = ref([])
const products = ref([])
const productOptions = ref([])
const loading = ref(true)

const showProductModal = ref(false)
const showCategoryModal = ref(false)
const showOptionModal = ref(false)
const currentProduct = ref({ id: null, name: '', description: '', price: 0, image_url: '', category_id: null })
const currentCategory = ref({ id: null, name: '', slug: '' })
const currentOption = ref({ id: null, category: 'temperature', name: '', price_modifier: 0, is_percentage: false, temp_restriction: null, sort_order: 0 })
const imageMode = ref('url')
const uploading = ref(false)

const optionCategories = ['temperature', 'size', 'milk', 'sugar', 'ice', 'topping']
const optionCategoryIcons = { temperature: '🌡️', size: '📏', milk: '🥛', sugar: '🍬', ice: '🧊', topping: '✨' }

onMounted(async () => { await fetchData() })

const fetchData = async () => {
  loading.value = true
  const { data: cats } = await supabase.from('categories').select('*').order('name')
  if (cats) categories.value = cats
  const { data: prods } = await supabase.from('products').select('*, categories(name)').order('name')
  if (prods) products.value = prods
  const { data: opts } = await supabase.from('product_options').select('*').order('category').order('sort_order')
  if (opts) productOptions.value = opts
  loading.value = false
}

// Category CRUD
const openCategoryModal = (cat = null) => { currentCategory.value = cat ? { ...cat } : { id: null, name: '', slug: '' }; showCategoryModal.value = true }
const saveCategory = async () => {
  if (currentCategory.value.id) await supabase.from('categories').update({ name: currentCategory.value.name, slug: currentCategory.value.slug }).eq('id', currentCategory.value.id)
  else await supabase.from('categories').insert({ name: currentCategory.value.name, slug: currentCategory.value.slug })
  showCategoryModal.value = false; fetchData()
}
const deleteCategory = async (id) => { if (confirm('Delete category?')) { await supabase.from('categories').delete().eq('id', id); fetchData() } }

// Product CRUD
const openProductModal = (prod = null) => {
  currentProduct.value = prod ? { ...prod } : { id: null, name: '', description: '', price: 0, image_url: '', category_id: null }
  imageMode.value = 'url'; showProductModal.value = true
}
const handleImageUpload = async (e) => {
  const file = e.target.files[0]; if (!file) return; uploading.value = true
  const ext = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
  const { error } = await supabase.storage.from('Foto-Products').upload(fileName, file, { cacheControl: '3600', upsert: false })
  if (error) { alert('Upload failed: ' + error.message); uploading.value = false; return }
  const { data: urlData } = supabase.storage.from('Foto-Products').getPublicUrl(fileName)
  currentProduct.value.image_url = urlData.publicUrl; uploading.value = false
}
const saveProduct = async () => {
  const p = { name: currentProduct.value.name, description: currentProduct.value.description, price: currentProduct.value.price, image_url: currentProduct.value.image_url, category_id: currentProduct.value.category_id }
  if (currentProduct.value.id) await supabase.from('products').update(p).eq('id', currentProduct.value.id)
  else await supabase.from('products').insert(p)
  showProductModal.value = false; fetchData()
}
const deleteProduct = async (id) => { if (confirm('Delete product?')) { await supabase.from('products').delete().eq('id', id); fetchData() } }

// Option CRUD
const openOptionModal = (opt = null) => {
  currentOption.value = opt ? { ...opt } : { id: null, category: 'temperature', name: '', price_modifier: 0, is_percentage: false, temp_restriction: null, sort_order: 0 }
  showOptionModal.value = true
}
const saveOption = async () => {
  const o = { category: currentOption.value.category, name: currentOption.value.name, price_modifier: currentOption.value.price_modifier, is_percentage: currentOption.value.is_percentage, temp_restriction: currentOption.value.temp_restriction || null, sort_order: currentOption.value.sort_order }
  if (currentOption.value.id) await supabase.from('product_options').update(o).eq('id', currentOption.value.id)
  else await supabase.from('product_options').insert(o)
  showOptionModal.value = false; fetchData()
}
const deleteOption = async (id) => { if (confirm('Delete option?')) { await supabase.from('product_options').delete().eq('id', id); fetchData() } }

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
        <router-link to="/admin/orders" class="p-2.5 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="Orders"><ClipboardList class="w-5 h-5" /></router-link>
        <router-link to="/admin/dashboard" class="p-2.5 text-stone-400 hover:bg-amber-50 hover:text-amber-900 rounded-xl transition-all flex justify-center" title="Dashboard"><BarChart3 class="w-5 h-5" /></router-link>
        <router-link to="/admin/products" class="p-2.5 bg-amber-900 text-white rounded-xl shadow-sm flex justify-center" title="Inventory"><Package class="w-5 h-5" /></router-link>
      </div>
      <div class="w-full px-2 border-t border-stone-100 pt-2">
        <button @click="handleLogout" class="w-full p-2.5 text-red-400 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all flex justify-center" title="Logout"><LogOut class="w-5 h-5" /></button>
      </div>
    </div>

    <!-- Main -->
    <div class="flex-1 p-5 overflow-y-auto">
      <div v-if="loading" class="text-center text-stone-400 py-12 text-sm">Loading...</div>
      <div v-else class="max-w-5xl mx-auto space-y-5">
        <div class="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-stone-100">
          <div class="flex bg-stone-100 rounded-xl overflow-hidden border border-stone-200">
            <button @click="activeTab = 'products'" :class="['px-4 py-2 text-xs font-semibold transition-all', activeTab === 'products' ? 'bg-amber-900 text-white' : 'text-stone-600']">📦 Products</button>
            <button @click="activeTab = 'categories'" :class="['px-4 py-2 text-xs font-semibold transition-all', activeTab === 'categories' ? 'bg-amber-900 text-white' : 'text-stone-600']">🏷️ Categories</button>
            <button @click="activeTab = 'options'" :class="['px-4 py-2 text-xs font-semibold transition-all', activeTab === 'options' ? 'bg-amber-900 text-white' : 'text-stone-600']">⚙️ Options</button>
          </div>
          <button v-if="activeTab === 'products'" @click="openProductModal()" class="flex items-center gap-1.5 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800 transition-colors text-xs font-semibold shadow-sm"><Plus class="w-4 h-4" /> Add Product</button>
          <button v-else-if="activeTab === 'categories'" @click="openCategoryModal()" class="flex items-center gap-1.5 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800 transition-colors text-xs font-semibold shadow-sm"><Plus class="w-4 h-4" /> Add Category</button>
          <button v-else @click="openOptionModal()" class="flex items-center gap-1.5 bg-amber-900 text-white px-4 py-2 rounded-xl hover:bg-amber-800 transition-colors text-xs font-semibold shadow-sm"><Plus class="w-4 h-4" /> Add Option</button>
        </div>

        <!-- Products -->
        <div v-if="activeTab === 'products'" class="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <table class="w-full text-left">
            <thead><tr class="border-b border-stone-200 bg-stone-50/50">
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500">Product</th>
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500">Category</th>
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500">Price</th>
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500 text-right">Actions</th>
            </tr></thead>
            <tbody>
              <tr v-for="p in products" :key="p.id" class="border-b border-stone-100 hover:bg-stone-50 transition-colors group">
                <td class="py-2.5 px-4"><div class="flex items-center gap-3"><div class="w-9 h-9 rounded-lg bg-stone-100 overflow-hidden shrink-0"><img v-if="p.image_url" :src="p.image_url" class="w-full h-full object-cover" /></div><div><div class="font-medium text-stone-900 text-sm">{{ p.name }}</div><div class="text-[10px] text-stone-500 max-w-xs truncate">{{ p.description }}</div></div></div></td>
                <td class="py-2.5 px-4"><span class="px-2 py-0.5 text-[10px] font-medium bg-stone-100 text-stone-600 rounded">{{ p.categories?.name || 'N/A' }}</span></td>
                <td class="py-2.5 px-4 font-medium text-sm text-stone-900">Rp {{ p.price?.toLocaleString() }}</td>
                <td class="py-2.5 px-4"><div class="flex justify-end gap-1"><button @click="openProductModal(p)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 class="w-3.5 h-3.5" /></button><button @click="deleteProduct(p.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 class="w-3.5 h-3.5" /></button></div></td>
              </tr>
              <tr v-if="products.length === 0"><td colspan="4" class="py-12 text-center text-stone-400 text-sm">No products</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Categories -->
        <div v-if="activeTab === 'categories'" class="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
          <table class="w-full text-left">
            <thead><tr class="border-b border-stone-200 bg-stone-50/50">
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500">Name</th>
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500">Slug</th>
              <th class="py-3 px-4 text-[11px] font-semibold text-stone-500 text-right">Actions</th>
            </tr></thead>
            <tbody>
              <tr v-for="cat in categories" :key="cat.id" class="border-b border-stone-100 hover:bg-stone-50 transition-colors group">
                <td class="py-3 px-4 font-medium text-sm text-stone-900">{{ cat.name }}</td>
                <td class="py-3 px-4 text-stone-500 font-mono text-xs">{{ cat.slug }}</td>
                <td class="py-3 px-4"><div class="flex justify-end gap-1"><button @click="openCategoryModal(cat)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 class="w-3.5 h-3.5" /></button><button @click="deleteCategory(cat.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 class="w-3.5 h-3.5" /></button></div></td>
              </tr>
              <tr v-if="categories.length === 0"><td colspan="3" class="py-12 text-center text-stone-400 text-sm">No categories</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Options CRUD -->
        <div v-if="activeTab === 'options'" class="space-y-4">
          <div v-for="cat in optionCategories" :key="cat">
            <h3 class="text-sm font-bold text-stone-700 mb-2 flex items-center gap-1.5">{{ optionCategoryIcons[cat] }} {{ cat.charAt(0).toUpperCase() + cat.slice(1) }}</h3>
            <div class="bg-white rounded-xl border border-stone-100 overflow-hidden">
              <div v-for="opt in productOptions.filter(o => o.category === cat)" :key="opt.id" class="flex items-center justify-between px-4 py-2.5 border-b border-stone-100 last:border-0 hover:bg-stone-50 transition-colors">
                <div>
                  <span class="font-medium text-stone-800 text-sm">{{ opt.name }}</span>
                  <span v-if="opt.price_modifier > 0" class="ml-2 text-xs text-amber-700 font-medium">+{{ opt.is_percentage ? `${opt.price_modifier}%` : `Rp ${opt.price_modifier.toLocaleString()}` }}</span>
                  <span v-if="opt.temp_restriction" class="ml-2 text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">{{ opt.temp_restriction }} only</span>
                </div>
                <div class="flex gap-1"><button @click="openOptionModal(opt)" class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"><Edit2 class="w-3.5 h-3.5" /></button><button @click="deleteOption(opt.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"><Trash2 class="w-3.5 h-3.5" /></button></div>
              </div>
              <div v-if="productOptions.filter(o => o.category === cat).length === 0" class="px-4 py-3 text-stone-400 text-xs">No options</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showCategoryModal = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="p-5 border-b border-stone-100"><h3 class="text-lg font-bold text-stone-900">{{ currentCategory.id ? 'Edit Category' : 'New Category' }}</h3></div>
        <div class="p-5 space-y-4">
          <div><label class="block text-sm font-medium text-stone-700 mb-1">Name</label><input v-model="currentCategory.name" type="text" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none focus:border-amber-500 text-sm" /></div>
          <div><label class="block text-sm font-medium text-stone-700 mb-1">Slug</label><input v-model="currentCategory.slug" type="text" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none font-mono text-sm" /></div>
        </div>
        <div class="p-5 border-t border-stone-100 bg-stone-50 flex justify-end gap-3"><button @click="showCategoryModal = false" class="px-4 py-2 text-stone-600 font-medium hover:bg-stone-200 rounded-lg text-sm">Cancel</button><button @click="saveCategory" class="px-4 py-2 bg-amber-900 text-white font-medium hover:bg-amber-800 rounded-lg text-sm shadow-sm">Save</button></div>
      </div>
    </div>

    <!-- Product Modal -->
    <div v-if="showProductModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showProductModal = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
        <div class="p-5 border-b border-stone-100 shrink-0"><h3 class="text-lg font-bold text-stone-900">{{ currentProduct.id ? 'Edit Product' : 'New Product' }}</h3></div>
        <div class="p-5 space-y-4 overflow-y-auto flex-1">
          <div><label class="block text-sm font-medium text-stone-700 mb-1">Name</label><input v-model="currentProduct.name" type="text" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-sm" /></div>
          <div><label class="block text-sm font-medium text-stone-700 mb-1">Category</label><select v-model="currentProduct.category_id" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none bg-white text-sm"><option :value="null">Uncategorized</option><option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option></select></div>
          <div><label class="block text-sm font-medium text-stone-700 mb-1">Price (Rp)</label><input v-model.number="currentProduct.price" type="number" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-sm" /></div>
          <div><label class="block text-sm font-medium text-stone-700 mb-1">Description</label><textarea v-model="currentProduct.description" rows="2" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none resize-none text-sm"></textarea></div>
          <div>
            <label class="block text-sm font-medium text-stone-700 mb-2">Image</label>
            <div class="flex bg-stone-100 rounded-lg overflow-hidden border border-stone-200 mb-3">
              <button @click="imageMode = 'url'" :class="['flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium transition-all', imageMode === 'url' ? 'bg-amber-900 text-white' : 'text-stone-600']"><Link class="w-3.5 h-3.5" /> URL</button>
              <button @click="imageMode = 'upload'" :class="['flex-1 flex items-center justify-center gap-1 py-2 text-xs font-medium transition-all', imageMode === 'upload' ? 'bg-amber-900 text-white' : 'text-stone-600']"><Upload class="w-3.5 h-3.5" /> Upload</button>
            </div>
            <input v-if="imageMode === 'url'" v-model="currentProduct.image_url" type="text" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-sm" placeholder="https://..." />
            <label v-else class="flex flex-col items-center justify-center border-2 border-dashed border-stone-300 rounded-xl py-5 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all">
              <Loader2 v-if="uploading" class="w-7 h-7 text-amber-600 animate-spin mb-1" /><Upload v-else class="w-7 h-7 text-stone-400 mb-1" />
              <span class="text-xs text-stone-500 font-medium">{{ uploading ? 'Uploading...' : 'Click to upload' }}</span>
              <input type="file" accept="image/*" class="hidden" @change="handleImageUpload" :disabled="uploading" />
            </label>
            <div v-if="currentProduct.image_url" class="mt-3 aspect-video bg-stone-100 rounded-lg overflow-hidden border border-stone-200"><img :src="currentProduct.image_url" class="w-full h-full object-cover" /></div>
          </div>
        </div>
        <div class="p-5 border-t border-stone-100 bg-stone-50 shrink-0 flex justify-end gap-3"><button @click="showProductModal = false" class="px-4 py-2 text-stone-600 font-medium hover:bg-stone-200 rounded-lg text-sm">Cancel</button><button @click="saveProduct" class="px-4 py-2 bg-amber-900 text-white font-medium hover:bg-amber-800 rounded-lg text-sm shadow-sm">Save</button></div>
      </div>
    </div>

    <!-- Option Modal -->
    <div v-if="showOptionModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" @click.self="showOptionModal = false">
      <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div class="p-5 border-b border-stone-100"><h3 class="text-lg font-bold text-stone-900">{{ currentOption.id ? 'Edit Option' : 'New Option' }}</h3></div>
        <div class="p-5 space-y-4">
          <div><label class="block text-sm font-medium text-stone-700 mb-1">Category</label><select v-model="currentOption.category" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none bg-white text-sm"><option v-for="c in optionCategories" :key="c" :value="c">{{ optionCategoryIcons[c] }} {{ c.charAt(0).toUpperCase() + c.slice(1) }}</option></select></div>
          <div><label class="block text-sm font-medium text-stone-700 mb-1">Name</label><input v-model="currentOption.name" type="text" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-sm" placeholder="e.g. Large" /></div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-sm font-medium text-stone-700 mb-1">Price Modifier</label><input v-model.number="currentOption.price_modifier" type="number" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-sm" /></div>
            <div><label class="block text-sm font-medium text-stone-700 mb-1">Type</label><select v-model="currentOption.is_percentage" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none bg-white text-sm"><option :value="false">Fixed (Rp)</option><option :value="true">Percentage (%)</option></select></div>
          </div>
          <div class="grid grid-cols-2 gap-3">
            <div><label class="block text-sm font-medium text-stone-700 mb-1">Temp Restriction</label><select v-model="currentOption.temp_restriction" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none bg-white text-sm"><option :value="null">Both</option><option value="hot">Hot only</option><option value="cold">Cold only</option></select></div>
            <div><label class="block text-sm font-medium text-stone-700 mb-1">Sort Order</label><input v-model.number="currentOption.sort_order" type="number" class="w-full px-3 py-2 border border-stone-200 rounded-lg outline-none text-sm" /></div>
          </div>
        </div>
        <div class="p-5 border-t border-stone-100 bg-stone-50 flex justify-end gap-3"><button @click="showOptionModal = false" class="px-4 py-2 text-stone-600 font-medium hover:bg-stone-200 rounded-lg text-sm">Cancel</button><button @click="saveOption" class="px-4 py-2 bg-amber-900 text-white font-medium hover:bg-amber-800 rounded-lg text-sm shadow-sm">Save</button></div>
      </div>
    </div>
  </div>
</template>
