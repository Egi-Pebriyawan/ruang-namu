<script setup>
import { Star, StarHalf } from "lucide-vue-next";
import { computed } from "vue";

const props = defineProps({
  rating: {
    type: Number,
    default: 5,
  },
  max: {
    type: Number,
    default: 5,
  },
});

const fullStars = computed(() => Math.floor(props.rating));
const hasHalf = computed(() => props.rating % 1 >= 0.5);
</script>

<template>
  <div class="flex items-center gap-1">
    <template v-for="i in max" :key="i">
      <!-- Full -->
      <Star v-if="i <= fullStars" class="w-4 h-4 text-amber-400 fill-amber-400" />

      <!-- Half -->
      <StarHalf v-else-if="i === fullStars + 1 && hasHalf" class="w-4 h-4 text-amber-400 fill-amber-400" />

      <!-- Empty -->
      <Star v-else class="w-4 h-4 text-amber-400" />
    </template>
  </div>
</template>
