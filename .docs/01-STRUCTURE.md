# Folder Structure Standards

Please adhere strictly to this architecture:

- src/assets/ → Images, icons, global styles
- src/components/Base/ → Atomic reusable components (Button, Badge, Input)
- src/components/Sections/ → Page sections (Navbar, Hero, Menu, Footer)
- src/data/ → Static data (menuData.js)
- src/composables/ → Reusable logic (useOperatingHours.js)
- src/views/ → Main page (Home.vue)

## Naming Conventions

- Components: PascalCase (BaseButton.vue)
- Composables: camelCase with prefix "use" (useOperatingHours.js)
- Data files: camelCase (menuData.js)

## Rules

- Do NOT create new top-level folders without approval
- Keep components small and focused (single responsibility)
