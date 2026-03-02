import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase credentials. Make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const menuCategories = [
  {
    id: "espresso",
    name: "Espresso",
    items: [
      { name: "Espresso", description: "Rich and bold single shot of espresso", price: 25000, image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&h=400&fit=crop" },
      { name: "Americano", description: "Espresso with hot water for a smoother taste", price: 30000, image: "./americano.jpg?w=400&h=400&fit=crop" },
      { name: "Cappuccino", description: "Espresso with steamed milk and foam", price: 38000, image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop" },
      { name: "Latte", description: "Creamy espresso with steamed milk", price: 40000, image: "./latte.jpg?w=400&h=400&fit=crop" },
      { name: "Mocha", description: "Espresso with chocolate and steamed milk", price: 45000, image: "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=400&fit=crop" },
      { name: "Macchiato", description: "Espresso with a dollop of foamed milk", price: 35000, image: "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=400&h=400&fit=crop" }
    ]
  },
  {
    id: "signatures",
    name: "Signatures",
    items: [
      { name: "Strawberry Smoothie", description: "Fresh strawberries blended with yogurt", price: 45000, image: "./strawbery-smothies.jpg?w=400&h=400&fit=crop" }
    ]
  },
  {
    id: "non-coffee",
    name: "Non-Coffee",
    items: [
      { name: "Matcha Latte", description: "Premium Japanese matcha with steamed milk", price: 42000, image: "https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400&h=400&fit=crop" },
      { name: "Chai Latte", description: "Spiced tea with steamed milk", price: 38000, image: "./chai-latte.jpg?w=400&h=400&fit=crop" },
      { name: "Hot Chocolate", description: "Rich Belgian chocolate with steamed milk", price: 40000, image: "https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400&h=400&fit=crop" },
      { name: "Strawberry Smoothie", description: "Fresh strawberries blended with yogurt", price: 45000, image: "./strawbery-smothies.jpg?w=400&h=400&fit=crop" },
      { name: "Mango Tango", description: "Tropical mango smoothie with a hint of lime", price: 45000, image: "https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=400&fit=crop" }
    ]
  },
  {
    id: "pastries",
    name: "Pastries",
    items: [
      { name: "Butter Croissant", description: "Flaky, buttery French pastry", price: 28000, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&h=400&fit=crop" },
      { name: "Chocolate Croissant", description: "Croissant filled with dark chocolate", price: 32000, image: "./chocolate-croisant.jpg?w=400&h=400&fit=crop" },
      { name: "Blueberry Muffin", description: "Freshly baked muffin with blueberries", price: 25000, image: "https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=400&h=400&fit=crop" },
      { name: "Cinnamon Roll", description: "Warm cinnamon roll with cream cheese frosting", price: 30000, image: "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=400&h=400&fit=crop" },
      { name: "Cheesecake", description: "Classic New York style cheesecake", price: 45000, image: "./cheescake.jpg?w=400&h=400&fit=crop" }
    ]
  }
]

async function seed() {
  console.log("Seeding Database...")
  
  for (const cat of menuCategories) {
    const { data: category, error: catError } = await supabase
      .from('categories')
      .upsert({ slug: cat.id, name: cat.name }, { onConflict: 'slug' })
      .select()
      .single()

    if (catError) {
      console.error("Error creating category:", cat.name, catError)
      continue
    }

    console.log(`Created Category: ${category.name}`)

    const productsToInsert = cat.items.map(item => ({
      name: item.name,
      description: item.description,
      price: item.price,
      image_url: item.image,
      category_id: category.id
    }))

    const { error: prodError } = await supabase
      .from('products')
      .upsert(productsToInsert, { onConflict: 'name' }) // Assuming name might be unique enough for seeding context, otherwise it just inserts
      // Note: for upsert to work properly, products table would need a UNIQUE constraint. If it doesn't, this will just append. We'll use insert.
    
    // Fallback to simple insert if upsert fails due to missing constraint
    if (prodError && prodError.code === '42P10') {
      const { error: insError } = await supabase.from('products').insert(productsToInsert)
      if (insError) console.error("Error inserting products for", cat.name, insError)
    } else if (prodError) {
       console.error("Error with products:", prodError)
    }

    console.log(`Inserted ${cat.items.length} products for ${category.name}`)
  }
  
  console.log("Seeding Complete!")
}

seed()
