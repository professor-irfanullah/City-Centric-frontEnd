<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6"
  >
    <!-- Decorative background elements -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div
        class="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full opacity-50 blur-3xl"
      ></div>
      <div
        class="absolute top-60 -left-20 w-60 h-60 bg-purple-100 rounded-full opacity-50 blur-3xl"
      ></div>
      <div
        class="absolute bottom-40 right-1/3 w-40 h-40 bg-indigo-100 rounded-full opacity-50 blur-3xl"
      ></div>
    </div>

    <!-- Main content -->
    <div class="relative z-10 max-w-2xl w-full text-center space-y-8">
      <!-- 404 Number Display -->
      <div class="space-y-4">
        <div class="flex justify-center items-center space-x-4">
          <span class="text-9xl font-bold text-blue-600 opacity-90">4</span>
          <div class="relative">
            <div
              class="w-32 h-32 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center"
            >
              <span class="text-7xl font-bold text-white">0</span>
            </div>
            <div
              class="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-pulse"
            ></div>
          </div>
          <span class="text-9xl font-bold text-blue-600 opacity-90">4</span>
        </div>
      </div>

      <!-- Message -->
      <div class="space-y-4">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-900">Page Not Found</h1>
        <p class="text-gray-600 text-lg max-w-lg mx-auto">
          The page you are looking for might have been moved, deleted, or doesn't exist.
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <button
          @click="goBack"
          class="px-8 py-3 bg-white text-gray-800 font-medium rounded-xl border border-gray-300 hover:bg-gray-50 transition-all shadow hover:shadow-md flex items-center justify-center gap-2"
        >
          <i class="fas fa-arrow-left"></i>
          Go Back
        </button>
      </div>

      <!-- Additional links -->
      <div class="pt-8 border-t border-gray-200 mt-8">
        <p class="text-gray-500 mb-4">You might be looking for:</p>
        <div class="flex flex-wrap justify-center gap-4">
          <a href="#" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
            <i class="fas fa-book mr-2"></i>Documentation
          </a>
          <a href="#" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
            <i class="fas fa-question-circle mr-2"></i>Help Center
          </a>
          <a href="#" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
            <i class="fas fa-envelope mr-2"></i>Contact Support
          </a>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="absolute bottom-6 left-0 right-0 text-center text-gray-500 text-sm">
      <p>© {{ currentYear }} Your Company. All rights reserved.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const currentYear = computed(() => new Date().getFullYear())

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
/* Custom animations */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 5s ease-in-out infinite;
}
</style>