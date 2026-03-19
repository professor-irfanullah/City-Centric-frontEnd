<template>
  <div class="min-h-screen bg-gray-50 py-4 sm:py-8">
    <div class="max-w-3xl mx-auto px-3 sm:px-4 lg:px-8">
      <!-- Navigation Bar - Mobile Optimized -->
      <div class="mb-4 sm:mb-6">
        <nav class="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-gray-600">
          <button
            @click="handleBack"
            class="inline-flex items-center px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg
              class="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span class="hidden xs:inline">Back</span>
          </button>

          <!-- Breadcrumb - Hidden on very small screens -->
          <div class="hidden xs:flex items-center space-x-2">
            <span class="text-gray-400">/</span>
            <span class="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-[200px]">
              Invite Administrator
            </span>
          </div>

          <!-- Mobile Status Badge -->
          <span
            class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 sm:hidden"
          >
            Super Admin
          </span>
        </nav>
      </div>

      <!-- Professional Card -->
      <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <!-- Card Header - Mobile Optimized -->
        <div class="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-3 sm:py-4">
          <div class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <h2 class="text-base sm:text-lg font-semibold text-gray-900 truncate">
                Invite New Administrator
              </h2>
              <p class="text-xs sm:text-sm text-gray-600 mt-0.5 sm:mt-1 hidden xs:block">
                Send an invitation to register as an administrator
              </p>
              <!-- Mobile Subtitle -->
              <p class="text-xs text-gray-600 mt-0.5 xs:hidden">Send admin invitation</p>
            </div>
            <!-- Desktop Status Badge - Hidden on mobile -->
            <span
              class="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
            >
              Super Admin
            </span>
          </div>
        </div>

        <!-- Card Body -->
        <div class="p-4 sm:p-6">
          <form @submit.prevent="handleInvite" class="space-y-4 sm:space-y-6">
            <!-- CNIC Input Field - Mobile Optimized -->
            <div>
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                CNIC Number
                <span class="text-red-500 ml-1">*</span>
              </label>

              <div class="relative">
                <input
                  type="text"
                  v-model="cnicInput"
                  @input="formatCNIC"
                  @keydown="handleKeyDown"
                  placeholder="XXXXX-XXXXXXX-X"
                  class="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono tracking-wider"
                  :class="inputClasses"
                  :disabled="isSubmitting"
                  aria-describedby="cnic-error cnic-helper"
                  inputmode="numeric"
                />

                <!-- Validation Icons - Adjusted for mobile -->
                <div class="absolute right-2 sm:right-3 top-2.5 sm:top-3">
                  <!-- Loading Spinner -->
                  <svg
                    v-if="isValidating"
                    class="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    role="status"
                    aria-label="Validating"
                  >
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

                  <!-- Success Icon -->
                  <svg
                    v-else-if="isValidCNIC"
                    class="h-4 w-4 sm:h-5 sm:w-5 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    role="status"
                    aria-label="Valid CNIC format"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>

                  <!-- Error Icon -->
                  <svg
                    v-else-if="errors.cnic"
                    class="h-4 w-4 sm:h-5 sm:w-5 text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    role="status"
                    aria-label="Error"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
              </div>

              <!-- Error Message - Mobile Optimized -->
              <transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="transform -translate-y-2 opacity-0"
                enter-to-class="transform translate-y-0 opacity-100"
                leave-active-class="transition duration-150 ease-in"
                leave-from-class="transform translate-y-0 opacity-100"
                leave-to-class="transform -translate-y-2 opacity-0"
              >
                <p
                  v-if="errors.cnic"
                  id="cnic-error"
                  class="mt-1.5 sm:mt-2 text-xs sm:text-sm text-red-600 flex items-start"
                >
                  <svg
                    class="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span class="flex-1">{{ errors.cnic }}</span>
                </p>
              </transition>

              <!-- Helper Text - Mobile Optimized -->
              <p
                v-if="!errors.cnic && !isValidCNIC"
                id="cnic-helper"
                class="mt-1.5 sm:mt-2 text-xs text-gray-500 flex items-start"
              >
                <svg
                  class="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1 text-gray-400 flex-shrink-0 mt-0.5"
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
                <span class="flex-1">Format: 5-7-1 digits (e.g., 12345-1234567-1)</span>
              </p>
            </div>

            <!-- Action Buttons - Stack on mobile -->
            <div
              class="flex flex-col-reverse xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3"
            >
              <button
                type="button"
                @click="resetForm"
                class="w-full xs:w-auto px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 bg-white text-gray-700 text-sm sm:text-base font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Reset
              </button>

              <button
                type="submit"
                :disabled="!isFormValid || isSubmitting"
                class="flex-1 inline-flex items-center justify-center px-3 sm:px-4 py-2.5 sm:py-3 bg-blue-600 text-white text-sm sm:text-base font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  v-if="!isSubmitting"
                  class="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <svg
                  v-else
                  class="animate-spin -ml-1 mr-2 h-4 w-4 sm:h-5 sm:w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
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
                <span class="truncate">{{ isSubmitting ? 'Sending...' : 'Send Invitation' }}</span>
              </button>
            </div>
          </form>

          <!-- Response Message Banner - Mobile Optimized -->
          <transition
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="transform scale-95 opacity-0"
            enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-200 ease-in"
            leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0"
          >
            <div v-if="responseMessage" class="mt-4 sm:mt-6">
              <div
                class="rounded-lg p-3 sm:p-4 flex items-start"
                :class="responseBannerClasses"
                role="alert"
              >
                <!-- Icon - Smaller on mobile -->
                <div class="flex-shrink-0">
                  <svg
                    v-if="responseType === 'success'"
                    class="h-4 w-4 sm:h-5 sm:w-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    v-else-if="responseType === 'error'"
                    class="h-4 w-4 sm:h-5 sm:w-5 text-red-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <svg
                    v-else
                    class="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>

                <!-- Message - Adjust text size for mobile -->
                <div class="ml-2 sm:ml-3 flex-1 min-w-0">
                  <p
                    class="text-xs sm:text-sm font-medium break-words"
                    :class="responseTextClasses"
                  >
                    {{ responseMessage }}
                  </p>
                </div>

                <!-- Close Button - Larger touch target on mobile -->
                <button @click="clearResponse" class="ml-2 sm:ml-3 p-1.5 -mr-1.5 sm:-mr-1">
                  <svg
                    class="h-3.5 w-3.5 sm:h-4 sm:w-4"
                    :class="responseIconClasses"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </transition>
        </div>

        <!-- Card Footer - Mobile Optimized -->
        <div class="border-t border-gray-200 bg-gray-50 px-4 sm:px-6 py-2.5 sm:py-3">
          <p class="text-xs text-gray-500 flex items-start">
            <svg
              class="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5 text-gray-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <span class="flex-1">Invitations sent via email to registered users</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import adminStore from '../store/adminStore'
import router from '@/router'

// Store
const store = adminStore()

// State
const cnicInput = ref('')
const isSubmitting = ref(false)
const isValidating = ref(false)
const responseMessage = ref('')
const responseType = ref('') // 'success', 'error', 'warning'

// Errors
const errors = ref({
  cnic: '',
})

// Computed properties
const isValidCNIC = computed(() => {
  const cnicRegex = /^\d{5}-\d{7}-\d{1}$/
  return cnicRegex.test(cnicInput.value)
})

const isFormValid = computed(() => {
  return isValidCNIC.value && !isSubmitting.value
})

const inputClasses = computed(() => {
  if (errors.value.cnic) {
    return 'border-red-300 bg-red-50 pr-8 sm:pr-10'
  }
  if (isValidating.value) {
    return 'border-blue-300 bg-blue-50 pr-8 sm:pr-10'
  }
  if (isValidCNIC.value) {
    return 'border-green-300 bg-green-50 pr-8 sm:pr-10'
  }
  return 'border-gray-300'
})

const responseBannerClasses = computed(() => {
  return {
    'bg-green-50 border border-green-200': responseType.value === 'success',
    'bg-red-50 border border-red-200': responseType.value === 'error',
    'bg-yellow-50 border border-yellow-200': responseType.value === 'warning',
  }
})

const responseTextClasses = computed(() => {
  return {
    'text-green-800': responseType.value === 'success',
    'text-red-800': responseType.value === 'error',
    'text-yellow-800': responseType.value === 'warning',
  }
})

const responseIconClasses = computed(() => {
  return {
    'text-green-600 hover:text-green-800': responseType.value === 'success',
    'text-red-600 hover:text-red-800': responseType.value === 'error',
    'text-yellow-600 hover:text-yellow-800': responseType.value === 'warning',
  }
})

// Methods
const formatCNIC = () => {
  // Remove all non-digits
  let value = cnicInput.value.replace(/\D/g, '')

  // Apply formatting
  if (value.length > 0) {
    if (value.length <= 5) {
      value = value
    } else if (value.length <= 12) {
      value = value.slice(0, 5) + '-' + value.slice(5)
    } else {
      value = value.slice(0, 5) + '-' + value.slice(5, 12) + '-' + value.slice(12, 13)
    }
  }

  cnicInput.value = value
  validateCNIC()
}

const handleKeyDown = (e) => {
  const cursorPos = e.target.selectionStart
  const value = cnicInput.value

  // Handle backspace when cursor is right after a hyphen
  if (e.key === 'Backspace' && value[cursorPos - 1] === '-') {
    e.preventDefault()
    const newValue = value.slice(0, cursorPos - 2) + value.slice(cursorPos)
    cnicInput.value = newValue
    setTimeout(() => formatCNIC(), 0)
  }
}

const validateCNIC = () => {
  isValidating.value = true

  setTimeout(() => {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/

    if (!cnicInput.value) {
      errors.value.cnic = ''
    } else if (!cnicRegex.test(cnicInput.value)) {
      if (cnicInput.value.replace(/\D/g, '').length < 13) {
        errors.value.cnic = 'CNIC must be 13 digits'
      } else {
        errors.value.cnic = 'Invalid CNIC format'
      }
    } else {
      errors.value.cnic = ''
    }

    isValidating.value = false
  }, 300)
}

const handleInvite = async () => {
  if (!isFormValid.value) return

  isSubmitting.value = true
  clearResponse()

  try {
    const response = await store.inviteAdminToTheSystem(cnicInput.value)

    responseMessage.value = response.msg
    responseType.value = 'success'

    // Clear input on success
    setTimeout(() => {
      cnicInput.value = ''
      errors.value.cnic = ''
    }, 2000)
  } catch (error) {
    responseMessage.value = error.response?.data?.message || 'An unexpected error occurred'
    responseType.value = 'error'
    console.error('Invitation error:', error.response?.data?.message)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  cnicInput.value = ''
  errors.value.cnic = ''
  clearResponse()
}

const clearResponse = () => {
  responseMessage.value = ''
  responseType.value = ''
}

const handleBack = () => {
  router.push('/super-admin/system-analytics')
}
</script>

<style scoped>
/* Custom breakpoint for extra small devices */
@media (min-width: 375px) {
  .xs\:inline {
    display: inline;
  }
  .xs\:hidden {
    display: none;
  }
  .xs\:flex {
    display: flex;
  }
  .xs\:flex-row {
    flex-direction: row;
  }
  .xs\:w-auto {
    width: auto;
  }
  .xs\:block {
    display: block;
  }
}

/* Smooth transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom animations */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.slide-down-enter-active {
  animation: slideDown 0.3s ease;
}

/* Focus styles for better accessibility */
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

button:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Improve touch targets on mobile */
@media (max-width: 640px) {
  button,
  [type='button'],
  [type='submit'] {
    min-height: 44px;
  }

  input {
    font-size: 16px; /* Prevents zoom on iOS */
  }
}

/* Prevent text overflow */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.break-words {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>