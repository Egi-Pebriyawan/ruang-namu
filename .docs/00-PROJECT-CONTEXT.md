# Project: "Ruang Namu" Coffee Shop Landing Page

## 1. Vision

Build a premium, minimalist, and high-converting one-page landing page for a local coffee shop.
The design must feel warm, inviting, and professional, with strong focus on conversion (CTA clicks).

## 2. Tech Stack

- Framework: Vue.js 3 (Vite)
- API Style: Composition API (<script setup>)
- Styling: Tailwind CSS
- Icons: Lucide-Vue-Next or Heroicons
- Deployment: Vercel/Netlify

## 3. Key Features

- Hero Section:
  - Full-width background image with dark overlay
  - Clear CTA buttons: "View Menu" and "Find Us"
- Dynamic Menu:
  - Render categories: Espresso, Non-Coffee, Pastries
  - Data source from `/src/data/menuData.js`
- Operational Status:
  - Show "Open" or "Closed"
  - Based on local time (Asia/Jakarta timezone)
  - Operating hours: 08:00 - 22:00
- Location & Contact:
  - Embedded Google Maps
  - WhatsApp CTA button (floating or section-based)
- Responsive:
  - Mobile-first design is mandatory

## 4. Performance & SEO

- Use semantic HTML structure
- Optimize images (lazy loading)
- Use meaningful meta tags (title, description)

## 5. AI Rules

- Use Single File Components (.vue)
- Use Composition API only
- Prioritize Tailwind utility classes (avoid custom CSS unless necessary)
- Use descriptive variable names in English
- Keep components modular and reusable
