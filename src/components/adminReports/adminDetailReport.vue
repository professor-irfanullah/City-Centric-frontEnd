<template>
  <section>
    <div class="mb-8">
      <button
        @click="backToList"
        class="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        aria-label="Back to reports list"
      >
        <svg
          class="w-5 h-5 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back to Reports
      </button>
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
            Report #{{ selectedReport.report_id }}
          </h1>
          <div class="flex items-center gap-3 mt-2">
            <span
              :class="getStatusClasses(selectedReport.verification_status)"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ formatStatus(selectedReport.verification_status) }}
            </span>
            <span class="text-gray-600">{{ formatDate(selectedReport.created_at) }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="selectedReport.verification_status === 'pending'"
            @click="verifyReport(selectedReport.report_id)"
            :disabled="verifying[selectedReport.report_id]"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
          >
            <svg
              v-if="verifying[selectedReport.report_id]"
              class="animate-spin h-5 w-5 mr-2"
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
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Verify Report
          </button>
          <button
            v-if="selectedReport.verification_status === 'pending'"
            @click="rejectReport(selectedReport.report_id)"
            :disabled="rejecting[selectedReport.report_id]"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
          >
            <svg
              v-if="rejecting[selectedReport.report_id]"
              class="animate-spin h-5 w-5 mr-2"
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
            <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Reject Report
          </button>
        </div>
      </div>
      <!-- Report Content -->
      <div class="space-y-6">
        <!-- Disaster Overview Card -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-2xl" aria-hidden="true">{{
                getDisasterEmoji(selectedReport.disaster_type)
              }}</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">
                {{ formatDisasterType(selectedReport.disaster_type) }} Incident
              </h2>
              <p class="text-gray-600">Reported by affected resident</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-3">
              <h3 class="font-semibold text-gray-700">👤 Personal Information</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <span class="text-gray-500 w-32 capitalize">Name:</span>
                  <span class="font-medium capitalize">{{ selectedReport.name || 'N/A' }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-32">Father Name:</span>
                  <span class="font-medium capitalize">{{
                    selectedReport.father_name || 'N/A'
                  }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-32">CNIC:</span>
                  <span class="font-medium">{{ selectedReport.cnic || 'N/A' }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-32">Phone:</span>
                  <span class="font-medium">{{ selectedReport.phone_number || 'N/A' }}</span>
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <h3 class="font-semibold text-gray-700">📍 Location Details</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <span class="text-gray-500 w-24">District:</span>
                  <span class="font-medium capitalize">{{ selectedReport.district || 'N/A' }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-24">Tehsil:</span>
                  <span class="font-medium capitalize">{{ selectedReport.tehsil || 'N/A' }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-24 capitalize">Village:</span>
                  <span class="font-medium capitalize">{{ selectedReport.village || 'N/A' }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-24">GPS:</span>
                  <span class="font-medium text-sm">{{ selectedReport.location || 'N/A' }}</span>
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <h3 class="font-semibold text-gray-700">📋 Report Information</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <span class="text-gray-500 w-24">Report ID:</span>
                  <span class="font-medium">#{{ selectedReport.report_id }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-24">Submitted:</span>
                  <span class="font-medium">{{ formatDate(selectedReport.created_at) }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-24">Status:</span>
                  <span
                    :class="getStatusClasses(selectedReport.verification_status)"
                    class="px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {{ formatStatus(selectedReport.verification_status) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="space-y-3">
              <h3 class="font-semibold text-gray-700">⚡ Quick Impact</h3>
              <div class="space-y-2">
                <div v-if="selectedReport.deaths_count > 0" class="flex items-center">
                  <span class="text-red-600 mr-2" aria-hidden="true">💀</span>
                  <span class="font-medium">{{ selectedReport.deaths_count }} deaths</span>
                </div>
                <div v-if="selectedReport.injured_count > 0" class="flex items-center">
                  <span class="text-orange-600 mr-2" aria-hidden="true">🏥</span>
                  <span class="font-medium">{{ selectedReport.injured_count }} injured</span>
                </div>
                <div v-if="selectedReport.is_home_impacted" class="flex items-center">
                  <span class="text-red-500 mr-2" aria-hidden="true">🏠</span>
                  <span class="font-medium"
                    >Home: {{ formatDamageLevel(selectedReport.home_damage_level) }}</span
                  >
                </div>
                <div v-if="selectedReport.is_shop_impacted" class="flex items-center">
                  <span class="text-blue-500 mr-2" aria-hidden="true">🏪</span>
                  <span class="font-medium"
                    >Shop: {{ formatDamageLevel(selectedReport.shop_damage_level) }}</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Left Column: Human & Family Impact -->
          <div class="space-y-6">
            <!-- Human Casualties -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">👥 Human Impact</h2>
              <div class="grid grid-cols-2 gap-4">
                <div class="bg-red-50 p-4 rounded-lg">
                  <div class="text-sm text-gray-500 mb-1">Deaths</div>
                  <div class="text-2xl font-bold text-red-600">
                    {{ selectedReport.deaths_count || 0 }}
                  </div>
                </div>
                <div class="bg-orange-50 p-4 rounded-lg">
                  <div class="text-sm text-gray-500 mb-1">Injured</div>
                  <div class="text-2xl font-bold text-orange-600">
                    {{ selectedReport.injured_count || 0 }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Family Information -->
            <div class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">👨‍👩‍👧‍👦 Family Information</h2>
              <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div class="p-3 border rounded-lg">
                  <div class="text-sm text-gray-500 mb-1">Total Residents</div>
                  <div class="text-xl font-bold text-gray-900">
                    {{ selectedReport.total_residents_count || 0 }}
                  </div>
                </div>
                <div class="p-3 border rounded-lg">
                  <div class="text-sm text-gray-500 mb-1">Pregnant Women</div>
                  <div class="text-xl font-bold text-pink-600">
                    {{ selectedReport.pregnant_women_count || 0 }}
                  </div>
                </div>
                <div class="p-3 border rounded-lg">
                  <div class="text-sm text-gray-500 mb-1">Disabled</div>
                  <div class="text-xl font-bold text-blue-600">
                    {{ selectedReport.disabled_persons_count || 0 }}
                  </div>
                </div>
                <div class="p-3 border rounded-lg">
                  <div class="text-sm text-gray-500 mb-1">School Children</div>
                  <div class="text-xl font-bold text-green-600">
                    {{ selectedReport.school_going_children_count || 0 }}
                  </div>
                </div>
                <div class="p-3 border rounded-lg">
                  <div class="text-sm text-gray-500 mb-1">Married Couples</div>
                  <div class="text-xl font-bold text-purple-600">
                    {{ selectedReport.married_couples_count || 0 }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Home Damage Details - FIXED -->
            <div v-if="selectedReport.is_home_impacted" class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">🏠 Home Damage Assessment</h2>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div class="font-medium text-gray-700">Damage Level</div>
                    <div class="text-sm text-gray-500">
                      {{ getDamageDescription(selectedReport.home_damage_level) }}
                    </div>
                  </div>
                  <span
                    :class="getDamageLevelClasses(selectedReport.home_damage_level)"
                    class="px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ formatDamageLevel(selectedReport.home_damage_level) }}
                  </span>
                </div>

                <!-- Home Images -->
                <div v-if="selectedReport.home_image_url">
                  <h3 class="font-medium text-gray-700 mb-3">Home Damage Evidence</h3>
                  <div class="grid grid-cols-1 gap-4">
                    <div
                      class="border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      @click="openImage(selectedReport.home_image_url)"
                    >
                      <div class="aspect-square bg-gray-100 flex items-center justify-center">
                        <img
                          :src="selectedReport.home_image_url"
                          :alt="
                            'Home damage - ' + formatDamageLevel(selectedReport.home_damage_level)
                          "
                          class="w-full h-full object-cover"
                          @error="handleImageError($event, selectedReport.report_id, 'home')"
                          loading="lazy"
                        />
                      </div>
                      <div class="p-3 text-sm text-center text-gray-600">Home Damage</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Animals & Shops -->
          <div class="space-y-6">
            <!-- Animal Impact -->
            <div
              v-if="selectedReport.are_animals_impacted"
              class="bg-white rounded-xl shadow-lg p-6"
            >
              <h2 class="text-lg font-bold text-gray-900 mb-4">🐄 Animal Impact</h2>
              <div class="space-y-6">
                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-medium text-gray-700 mb-3">
                    Large Animals (Cows, Buffaloes, etc.)
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white p-3 border rounded-lg">
                      <div class="text-sm text-gray-500 mb-1">Deaths</div>
                      <div class="text-xl font-bold text-red-600">
                        {{ selectedReport.big_animals_death_count || 0 }}
                      </div>
                    </div>
                    <div class="bg-white p-3 border rounded-lg">
                      <div class="text-sm text-gray-500 mb-1">Injured</div>
                      <div class="text-xl font-bold text-orange-600">
                        {{ selectedReport.big_animals_injured_count || 0 }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-gray-50 p-4 rounded-lg">
                  <h3 class="font-medium text-gray-700 mb-3">
                    Small Animals (Goats, Chickens, etc.)
                  </h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="bg-white p-3 border rounded-lg">
                      <div class="text-sm text-gray-500 mb-1">Deaths</div>
                      <div class="text-xl font-bold text-red-600">
                        {{ selectedReport.small_animals_death_count || 0 }}
                      </div>
                    </div>
                    <div class="bg-white p-3 border rounded-lg">
                      <div class="text-sm text-gray-500 mb-1">Injured</div>
                      <div class="text-xl font-bold text-orange-600">
                        {{ selectedReport.small_animals_injured_count || 0 }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-green-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-gray-700">Total Animal Impact</div>
                      <div class="text-sm text-gray-600">
                        {{ totalAnimalDeaths }} deaths, {{ totalAnimalInjuries }} injured
                      </div>
                    </div>
                    <div class="text-xl font-bold text-green-600">
                      {{ totalAnimalImpact }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Shop Damage - FIXED with Custom Logic -->
            <div v-if="selectedReport.is_shop_impacted" class="bg-white rounded-xl shadow-lg p-6">
              <h2 class="text-lg font-bold text-gray-900 mb-4">🏪 Shop/Business Impact</h2>
              <div class="space-y-4">
                <div class="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div class="font-medium text-gray-700">Damage Level</div>
                    <div class="text-sm text-gray-500">
                      {{ getDamageDescription(selectedReport.shop_damage_level) }}
                    </div>
                  </div>
                  <span
                    :class="getDamageLevelClasses(selectedReport.shop_damage_level)"
                    class="px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {{ formatDamageLevel(selectedReport.shop_damage_level) }}
                  </span>
                </div>

                <!-- Shop Images - FIXED: Correct v-if and labels -->
                <div v-if="selectedReport.shop_image_url">
                  <h3 class="font-medium text-gray-700 mb-3">Shop Damage Evidence</h3>
                  <div class="grid grid-cols-1 gap-4">
                    <div
                      class="border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      @click="openImage(selectedReport.shop_image_url)"
                    >
                      <div class="aspect-square bg-gray-100 flex items-center justify-center">
                        <img
                          :src="selectedReport.shop_image_url"
                          :alt="
                            'Shop damage - ' + formatDamageLevel(selectedReport.shop_damage_level)
                          "
                          class="w-full h-full object-cover"
                          @error="handleImageError($event, selectedReport.report_id, 'shop')"
                          loading="lazy"
                        />
                      </div>
                      <div class="p-3 text-sm text-center text-gray-600">Shop Damage</div>
                    </div>
                  </div>
                </div>
                <!-- Fallback if no image URL but shop_images array exists -->
                <div
                  v-else-if="selectedReport.shop_images && selectedReport.shop_images.length > 0"
                >
                  <h3 class="font-medium text-gray-700 mb-3">Shop Damage Evidence</h3>
                  <div class="grid grid-cols-1 gap-4">
                    <div
                      class="border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      @click="openImage(selectedReport.shop_images[0])"
                    >
                      <div class="aspect-square bg-gray-100 flex items-center justify-center">
                        <img
                          :src="selectedReport.shop_images[0]"
                          :alt="
                            'Shop damage - ' + formatDamageLevel(selectedReport.shop_damage_level)
                          "
                          class="w-full h-full object-cover"
                          @error="handleImageError($event, selectedReport.report_id, 'shop')"
                          loading="lazy"
                        />
                      </div>
                      <div class="p-3 text-sm text-center text-gray-600">Shop Damage</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script setup>
import { computed, ref } from 'vue'

const emit = defineEmits(['close'])
const backToList = () => {
  emit('close')
}
const props = defineProps({
  selectedReport: {
    type: Object,
    required: true,
  },
})
const selectedReport = props.selectedReport
const STATUS_CONFIG = Object.freeze({
  verified: { label: 'Verified', class: 'bg-green-100 text-green-800', emoji: '✅' },
  pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800', emoji: '⏳' },
  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-800', emoji: '❌' },
})
const getDisasterEmoji = (type) => {
  const emojiMap = {
    flood: '🌊',
    fire: '🔥',
    land_slide: '🏔️',
    landslide: '🏔️',
    earthquake: '🌋',
    storm: '🌪️',
    drought: '🏜️',
    cyclone: '🌀',
    tornado: '🌪️',
    tsunami: '🌊',
    volcano: '🌋',
    epidemic: '🦠',
    famine: '🍽️',
    accident: '🚗',
    industrial: '🏭',
    war: '💥',
    terror: '💣',
    other: '⚠️',
  }

  return emojiMap[type] || '🌪️'
}
const formatDisasterType = (type) => {
  if (!type) return 'Unknown'

  // Convert snake_case to Title Case
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Invalid Date'
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'Invalid Date'
  }
}
const formatStatus = (status) => {
  return STATUS_CONFIG[status]?.label || status || 'Unknown'
}
const getStatusClasses = (status) => {
  return STATUS_CONFIG[status]?.class || 'bg-gray-100 text-gray-800'
}
// Animal impact totals
const totalAnimalDeaths = computed(() => {
  if (!selectedReport.value) return 0
  return (
    (selectedReport.value.big_animals_death_count || 0) +
    (selectedReport.value.small_animals_death_count || 0)
  )
})

const totalAnimalInjuries = computed(() => {
  if (!selectedReport.value) return 0
  return (
    (selectedReport.value.big_animals_injured_count || 0) +
    (selectedReport.value.small_animals_injured_count || 0)
  )
})
const totalAnimalImpact = computed(() => totalAnimalDeaths.value + totalAnimalInjuries.value)
const verifying = ref(new Set())
const rejecting = ref(new Set())
</script>