import { ref, computed, onMounted, onUnmounted } from "vue";

export function useOperatingHours() {
  const currentTime = ref(new Date());
  const openingHour = 8;
  const closingHour = 22;

  const updateCurrentTime = () => {
    currentTime.value = new Date();
  };

  onMounted(() => {
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    onUnmounted(() => clearInterval(interval));
  });

  const isOpen = computed(() => {
    const jakartaTime = new Date(currentTime.value.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const currentHour = jakartaTime.getHours();
    const currentMinutes = jakartaTime.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    const openingTimeInMinutes = openingHour * 60;
    const closingTimeInMinutes = closingHour * 60;

    return currentTimeInMinutes >= openingTimeInMinutes && currentTimeInMinutes < closingTimeInMinutes;
  });

  const statusText = computed(() => {
    return isOpen.value ? "Open" : "Closed";
  });

  const statusColor = computed(() => {
    return isOpen.value ? "bg-green-500" : "bg-red-500";
  });

  const operatingHoursText = computed(() => {
    if (isOpen.value) {
      return `${openingHour}:00 AM - ${closingHour}:00 PM WIB`;
    } else {
      return `Open again tomorrow at ${openingHour}:00 AM - ${closingHour}:00 PM WIB`;
    }
  });

  return {
    isOpen,
    statusText,
    statusColor,
    operatingHoursText,
    currentTime,
  };
}
