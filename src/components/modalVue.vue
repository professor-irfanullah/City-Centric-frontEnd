<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-2xl max-w-md w-full p-8 text-center">
      <!-- Icon Slot -->
      <div class="mb-6">
        <slot name="icon">
          <!-- Default icon if none provided -->
          <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              class="w-10 h-10 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </slot>
      </div>

      <!-- Title Slot -->
      <h3 class="text-2xl font-bold text-gray-800 mb-3">
        <slot name="title">Modal Title</slot>
      </h3>

      <!-- Content Slot -->
      <div class="text-gray-600 mb-6">
        <slot name="content">
          <p>Modal content goes here</p>
        </slot>
      </div>

      <!-- Actions Slot -->
      <div class="flex flex-col sm:flex-row gap-3">
        <slot name="actions">
          <!-- Default action if none provided -->
          <button
            @click="closeModal"
            class="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits(['close'])

const closeModal = () => {
  emit('close')
}
</script>