<template>
  <div
    class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4"
  >
    <!-- Main Verification Card -->
    <div class="w-full max-w-md">
      <!-- Success State -->
      <div v-if="verificationComplete" class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div
          class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Verification Complete</h2>
        <p class="text-gray-600 mb-6">
          Your identity has been verified successfully. You can now access the admin portal.
        </p>
        <button
          @click="redirectToDashboard"
          class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Proceed to Admin Portal
        </button>
      </div>

      <!-- Expired State -->
      <div v-else-if="verificationExpired" class="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div
          class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Link Expired</h2>
        <p class="text-gray-600">
          This verification link has expired. Please contact your administrator for a new
          invitation.
        </p>
      </div>

      <!-- Verification Form -->
      <div v-else class="bg-white rounded-2xl shadow-xl p-8">
        <!-- Loading Overlay -->
        <div
          v-if="loading"
          class="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center z-10"
        >
          <div
            class="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"
          ></div>
        </div>

        <!-- Header -->
        <div class="text-center mb-8">
          <div
            class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4"
          >
            <svg
              class="w-6 h-6 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 mb-2">Identity Verification</h1>
          <p class="text-gray-600">
            Enter your CNIC to verify your identity and complete admin setup
          </p>
        </div>

        <!-- CNIC Input Form -->
        <form @submit.prevent="submitVerification" class="space-y-6">
          <!-- CNIC Field -->
          <div>
            <label for="cnic" class="block text-sm font-medium text-gray-700 mb-2">
              CNIC Number <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <div
                class="flex items-center border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition duration-200"
                :class="errors.cnic ? 'border-red-500' : 'border-gray-300'"
              >
                <input
                  id="cnic"
                  v-model="cnic"
                  type="text"
                  placeholder="12345-1234567-1"
                  class="w-full px-4 py-3 bg-transparent border-none focus:outline-none"
                  @input="formatCNIC"
                  maxlength="15"
                  :disabled="isVerifying"
                />
                <div class="px-3 py-2 bg-gray-50 border-l">
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                    />
                  </svg>
                </div>
              </div>

              <!-- Error Message -->
              <div v-if="errors.cnic" class="mt-2 flex items-center text-sm text-red-600">
                <svg
                  class="w-4 h-4 mr-1 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{{ errors.cnic }}</span>
              </div>

              <!-- Format Hint -->
              <div class="mt-1">
                <p class="text-xs text-gray-500">Format: XXXXX-XXXXXXX-X (13 digits with dashes)</p>
              </div>
            </div>
          </div>

          <!-- Global Error Message -->
          <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-lg p-4">
            <div class="flex items-start">
              <svg
                class="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p class="text-sm text-red-700">{{ errorMessage }}</p>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="!isFormValid || isVerifying"
            :class="[
              'w-full py-3 font-medium rounded-lg transition-all duration-200 flex items-center justify-center',
              isFormValid && !isVerifying
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed',
            ]"
          >
            <span v-if="isVerifying" class="flex items-center">
              <svg class="w-5 h-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                />
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Verifying...
            </span>
            <span v-else>Verify Identity</span>
          </button>

          <!-- Information Note -->
          <div class="pt-4 border-t">
            <p class="text-xs text-gray-500 text-center">
              This is the final step to activate your administrator privileges. All verification
              details were sent to your email.
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import api from '@/api/axios'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
const route = useRoute()
const router = useRouter()

// State
const loading = ref(false)
const isVerifying = ref(false)
const verificationComplete = ref(false)
const verificationExpired = ref(false)

// Form data
const cnic = ref('')

// Error handling
const errors = ref({ cnic: '' })
const errorMessage = ref('')

// Computed properties
const isFormValid = computed(() => {
  return cnic.value && validateCNIC(cnic.value)
})

// CNIC formatting
const formatCNIC = () => {
  let value = cnic.value.replace(/\D/g, '')

  if (value.length > 5) {
    value = value.slice(0, 5) + '-' + value.slice(5)
  }
  if (value.length > 13) {
    value = value.slice(0, 13) + '-' + value.slice(13)
  }

  cnic.value = value.slice(0, 15)
  errors.value.cnic = validateCNIC(cnic.value) ? '' : 'Invalid CNIC format'
}

const validateCNIC = (cnic) => {
  const pattern = /^\d{5}-\d{7}-\d{1}$/
  return pattern.test(cnic)
}

// Initialize component
onMounted(() => {
  // Extract verification token from URL
  const token = route.query.token
  if (!token) {
    errorMessage.value = 'Invalid verification link. Please use the link from your email.'
    return
  }

  // Check if token is expired (mock - replace with actual API call)
  const isExpired = Math.random() < 0.1 // 10% chance for demo
  if (isExpired) {
    verificationExpired.value = true
  }
})

// Main verification function
const submitVerification = async () => {
  // Reset errors
  errors.value = { cnic: '' }
  errorMessage.value = ''

  // Validate CNIC
  if (!validateCNIC(cnic.value)) {
    errors.value.cnic = 'Please enter a valid CNIC number in format: 12345-1234567-1'
    return
  }

  isVerifying.value = true

  try {
    // Simulate API call
    // await new Promise((resolve) => setTimeout(resolve, 1500))
    const response = await api.post('/api/admin/verify/admin-role', {
      cnic: cnic.value,
      token: route.query.token,
    })
    verificationComplete.value = true
    cnic.value = null
    console.log(response)
  } catch (error) {
    // errorMessage.value = 'Network error. Please check your connection and try again.'
    errorMessage.value = error.response?.data?.message ?? 'An error occurred during verification.'
    console.error('Verification error:', error)
  } finally {
    isVerifying.value = false
  }
}

const redirectToDashboard = () => {
  router.replace('/admin/dashboard')
}
</script>