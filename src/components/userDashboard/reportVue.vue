<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Header with Back Button -->
    <div class="mb-8">
      <button @click="goBack" class="flex items-center text-gray-600 hover:text-gray-900 mb-4">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Report #{{ report?.id }}</h1>
          <div class="flex items-center gap-3 mt-2">
            <span
              :class="getStatusClasses(report?.verification_status)"
              class="px-3 py-1 rounded-full text-sm font-medium"
            >
              {{ formatStatus(report?.verification_status) }}
            </span>
            <span class="text-gray-600">{{ formatDate(report?.created_at) }}</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <button
            v-if="report?.verification_status === 'pending'"
            @click="verifyReport"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            v-if="report?.verification_status === 'pending'"
            @click="rejectReport"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading report details...</p>
    </div>

    <!-- Report Content -->
    <div v-else-if="report" class="space-y-6">
      <!-- Disaster Overview Card -->
      <div class="bg-white rounded-xl shadow-lg p-6">
        <div class="flex items-center mb-6">
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
            <span class="text-2xl">{{ getDisasterEmoji(report.disaster_type) }}</span>
          </div>
          <div>
            <h2 class="text-xl font-bold text-gray-900">
              {{ formatDisasterType(report.disaster_type) }} Incident
            </h2>
            <p class="text-gray-600">Reported by affected resident</p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Location Info -->
          <div class="space-y-3">
            <h3 class="font-semibold text-gray-700">📍 Location Details</h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="text-gray-500 w-24">District:</span>
                <span class="font-medium">{{ report.district }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-24">Tehsil:</span>
                <span class="font-medium">{{ report.tehsil }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-24">Village:</span>
                <span class="font-medium">{{ report.village }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-24">GPS:</span>
                <span class="font-medium text-sm">{{ report.location }}</span>
              </div>
            </div>
          </div>

          <!-- Report Info -->
          <div class="space-y-3">
            <h3 class="font-semibold text-gray-700">📋 Report Information</h3>
            <div class="space-y-2">
              <div class="flex items-center">
                <span class="text-gray-500 w-24">Report ID:</span>
                <span class="font-medium">#{{ report.id }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-24">Submitted:</span>
                <span class="font-medium">{{ formatDate(report.created_at) }}</span>
              </div>
              <div class="flex items-center">
                <span class="text-gray-500 w-24">Status:</span>
                <span
                  :class="getStatusClasses(report.verification_status)"
                  class="px-2 py-1 rounded-full text-xs font-medium"
                >
                  {{ formatStatus(report.verification_status) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Quick Impact -->
          <div class="space-y-3">
            <h3 class="font-semibold text-gray-700">⚡ Quick Impact</h3>
            <div class="space-y-2">
              <div v-if="report.deaths_count > 0" class="flex items-center">
                <span class="text-red-600 mr-2">💀</span>
                <span class="font-medium">{{ report.deaths_count }} deaths</span>
              </div>
              <div v-if="report.injured_count > 0" class="flex items-center">
                <span class="text-orange-600 mr-2">🏥</span>
                <span class="font-medium">{{ report.injured_count }} injured</span>
              </div>
              <div v-if="report.is_home_impacted" class="flex items-center">
                <span class="text-red-500 mr-2">🏠</span>
                <span class="font-medium"
                  >Home: {{ formatDamageLevel(report.home_damage_level) }}</span
                >
              </div>
              <div v-if="report.is_shop_impacted" class="flex items-center">
                <span class="text-blue-500 mr-2">🏪</span>
                <span class="font-medium"
                  >Shop: {{ formatDamageLevel(report.shop_damage_level) }}</span
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
                <div class="text-2xl font-bold text-red-600">{{ report.deaths_count || 0 }}</div>
              </div>
              <div class="bg-orange-50 p-4 rounded-lg">
                <div class="text-sm text-gray-500 mb-1">Injured</div>
                <div class="text-2xl font-bold text-orange-600">
                  {{ report.injured_count || 0 }}
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
                  {{ report.total_residents_count || 0 }}
                </div>
              </div>
              <div class="p-3 border rounded-lg">
                <div class="text-sm text-gray-500 mb-1">Pregnant Women</div>
                <div class="text-xl font-bold text-pink-600">
                  {{ report.pregnant_women_count || 0 }}
                </div>
              </div>
              <div class="p-3 border rounded-lg">
                <div class="text-sm text-gray-500 mb-1">Disabled</div>
                <div class="text-xl font-bold text-blue-600">
                  {{ report.disabled_persons_count || 0 }}
                </div>
              </div>
              <div class="p-3 border rounded-lg">
                <div class="text-sm text-gray-500 mb-1">School Children</div>
                <div class="text-xl font-bold text-green-600">
                  {{ report.school_going_children_count || 0 }}
                </div>
              </div>
              <div class="p-3 border rounded-lg">
                <div class="text-sm text-gray-500 mb-1">Married Couples</div>
                <div class="text-xl font-bold text-purple-600">
                  {{ report.married_couples_count || 0 }}
                </div>
              </div>
            </div>
          </div>

          <!-- Home Damage Details -->
          <div v-if="report.is_home_impacted" class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">🏠 Home Damage Assessment</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div class="font-medium text-gray-700">Damage Level</div>
                  <div class="text-sm text-gray-500">
                    {{ getDamageDescription(report.home_damage_level) }}
                  </div>
                </div>
                <span
                  :class="getDamageLevelClasses(report.home_damage_level)"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ formatDamageLevel(report.home_damage_level) }}
                </span>
              </div>

              <!-- Home Images -->
              <div v-if="report.home_images && report.home_images.length > 0">
                <h3 class="font-medium text-gray-700 mb-3">Home Damage Evidence</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div
                    v-for="(image, index) in report.home_images"
                    :key="index"
                    class="border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    @click="openImage(image)"
                  >
                    <div class="aspect-square bg-gray-100 flex items-center justify-center">
                      <div class="text-gray-400">Image {{ index + 1 }}</div>
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
          <div v-if="report.are_animals_impacted" class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">🐄 Animal Impact</h2>
            <div class="space-y-6">
              <!-- Large Animals -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-medium text-gray-700 mb-3">
                  Large Animals (Cows, Buffaloes, etc.)
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white p-3 border rounded-lg">
                    <div class="text-sm text-gray-500 mb-1">Deaths</div>
                    <div class="text-xl font-bold text-red-600">
                      {{ report.big_animals_death_count || 0 }}
                    </div>
                  </div>
                  <div class="bg-white p-3 border rounded-lg">
                    <div class="text-sm text-gray-500 mb-1">Injured</div>
                    <div class="text-xl font-bold text-orange-600">
                      {{ report.big_animals_injured_count || 0 }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Small Animals -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <h3 class="font-medium text-gray-700 mb-3">
                  Small Animals (Goats, Chickens, etc.)
                </h3>
                <div class="grid grid-cols-2 gap-4">
                  <div class="bg-white p-3 border rounded-lg">
                    <div class="text-sm text-gray-500 mb-1">Deaths</div>
                    <div class="text-xl font-bold text-red-600">
                      {{ report.small_animals_death_count || 0 }}
                    </div>
                  </div>
                  <div class="bg-white p-3 border rounded-lg">
                    <div class="text-sm text-gray-500 mb-1">Injured</div>
                    <div class="text-xl font-bold text-orange-600">
                      {{ report.small_animals_injured_count || 0 }}
                    </div>
                  </div>
                </div>
              </div>

              <!-- Animal Summary -->
              <div class="bg-green-50 p-4 rounded-lg">
                <div class="flex items-center justify-between">
                  <div>
                    <div class="font-medium text-gray-700">Total Animal Impact</div>
                    <div class="text-sm text-gray-600">
                      {{
                        (report.big_animals_death_count || 0) +
                        (report.small_animals_death_count || 0)
                      }}
                      deaths,
                      {{
                        (report.big_animals_injured_count || 0) +
                        (report.small_animals_injured_count || 0)
                      }}
                      injured
                    </div>
                  </div>
                  <div class="text-xl font-bold text-green-600">
                    {{ totalAnimalImpact }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Shop Damage -->
          <div v-if="report.is_shop_impacted" class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">🏪 Shop/Business Impact</h2>
            <div class="space-y-4">
              <div class="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <div class="font-medium text-gray-700">Damage Level</div>
                  <div class="text-sm text-gray-500">
                    {{ getDamageDescription(report.shop_damage_level) }}
                  </div>
                </div>
                <span
                  :class="getDamageLevelClasses(report.shop_damage_level)"
                  class="px-3 py-1 rounded-full text-sm font-medium"
                >
                  {{ formatDamageLevel(report.shop_damage_level) }}
                </span>
              </div>

              <!-- Shop Images -->
              <div v-if="report.shop_images && report.shop_images.length > 0">
                <h3 class="font-medium text-gray-700 mb-3">Shop Damage Evidence</h3>
                <div class="grid grid-cols-2 gap-4">
                  <div
                    v-for="(image, index) in report.shop_images"
                    :key="index"
                    class="border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    @click="openImage(image)"
                  >
                    <div class="aspect-square bg-gray-100 flex items-center justify-center">
                      <div class="text-gray-400">Image {{ index + 1 }}</div>
                    </div>
                    <div class="p-3 text-sm text-center text-gray-600">Shop Damage</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Verification Notes -->
          <div class="bg-white rounded-xl shadow-lg p-6">
            <h2 class="text-lg font-bold text-gray-900 mb-4">📝 Verification Notes</h2>
            <textarea
              v-model="verificationNotes"
              placeholder="Add verification notes here..."
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows="3"
            ></textarea>
            <div class="mt-4 flex justify-end">
              <button
                @click="saveNotes"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <svg
        class="w-16 h-16 text-red-500 mx-auto"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <h3 class="mt-4 text-lg font-medium text-gray-900">Report not found</h3>
      <p class="mt-2 text-gray-500">
        The report you're looking for doesn't exist or has been removed.
      </p>
      <button
        @click="goBack"
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Back to Reports
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
// import { useReportStore } from '../store/reportsStore'

const route = useRoute()
const router = useRouter()
// const store = useReportStore()

// State
const report = ref(null)
const loading = ref(true)
const error = ref(false)
const verificationNotes = ref('')

// Computed
const totalAnimalImpact = computed(() => {
  if (!report.value) return 0
  return (
    (report.value.big_animals_death_count || 0) +
    (report.value.small_animals_death_count || 0) +
    (report.value.big_animals_injured_count || 0) +
    (report.value.small_animals_injured_count || 0)
  )
})

// Methods
const fetchReport = async () => {
  loading.value = true
  error.value = false
  try {
    const reportId = route.params.id
    // In real app, this would be an API call
    // const response = await store.fetchReport(reportId)
    // report.value = response.data

    // Mock data - same as in ReportsList
    const mockReports = [
      {
        id: 1,
        disaster_type: 'flood',
        location: '34.123456, 72.654321',
        are_animals_impacted: true,
        is_home_impacted: true,
        is_shop_impacted: false,
        home_damage_level: 'fully_destroyed',
        shop_damage_level: null,
        big_animals_death_count: 1,
        big_animals_injured_count: 2,
        small_animals_death_count: 3,
        small_animals_injured_count: 5,
        total_residents_count: 7,
        deaths_count: 1,
        injured_count: 2,
        pregnant_women_count: 1,
        disabled_persons_count: 0,
        school_going_children_count: 3,
        married_couples_count: 2,
        district: 'Swat',
        tehsil: 'Matta',
        village: 'Khal',
        created_at: '2024-01-15T10:30:00Z',
        verification_status: 'verified',
        home_images: ['home1.jpg', 'home2.jpg'],
        shop_images: [],
      },
      // Add other mock reports as needed
    ]

    const foundReport = mockReports.find((r) => r.id === parseInt(reportId))
    if (foundReport) {
      report.value = foundReport
    } else {
      error.value = true
    }
  } catch (err) {
    console.error('Error fetching report:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.push('/admin/reports')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatDisasterType = (type) => {
  const types = {
    flood: 'Flood',
    fire: 'Fire',
    land_slide: 'Landslide',
    earthquake: 'Earthquake',
  }
  return types[type] || type
}

const getDisasterEmoji = (type) => {
  const emojis = {
    flood: '🌊',
    fire: '🔥',
    land_slide: '🏔️',
    earthquake: '🌋',
  }
  return emojis[type] || '🌪️'
}

const formatStatus = (status) => {
  const statuses = {
    verified: 'Verified',
    pending: 'Pending',
    rejected: 'Rejected',
  }
  return statuses[status] || status
}

const getStatusClasses = (status) => {
  const classes = {
    verified: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    rejected: 'bg-red-100 text-red-800',
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const formatDamageLevel = (level) => {
  const levels = {
    minor: 'Minor Damage',
    major: 'Medium Damage',
    fully_destroyed: 'Complete Destruction',
  }
  return levels[level] || level
}

const getDamageLevelClasses = (level) => {
  const classes = {
    minor: 'bg-yellow-100 text-yellow-800',
    major: 'bg-orange-100 text-orange-800',
    fully_destroyed: 'bg-red-100 text-red-800',
  }
  return classes[level] || 'bg-gray-100 text-gray-800'
}

const getDamageDescription = (level) => {
  const descriptions = {
    minor: 'Water & silk damage only',
    major: '1 room or boundary wall damaged',
    fully_destroyed: '2 or more rooms completely destroyed',
  }
  return descriptions[level] || 'Damage reported'
}

const openImage = (imageUrl) => {
  // In real app, open image in modal or new tab
  window.open(imageUrl, '_blank')
}

const verifyReport = async () => {
  if (confirm('Verify this report?')) {
    try {
      // await store.verifyReport(report.value.id)
      await fetchReport() // Refresh data
    } catch (error) {
      console.error('Error verifying report:', error)
    }
  }
}

const rejectReport = async () => {
  if (confirm('Reject this report?')) {
    try {
      // await store.rejectReport(report.value.id)
      await fetchReport() // Refresh data
    } catch (error) {
      console.error('Error rejecting report:', error)
    }
  }
}

const saveNotes = async () => {
  try {
    // await store.saveNotes(report.value.id, verificationNotes.value)
    alert('Notes saved successfully')
  } catch (error) {
    console.error('Error saving notes:', error)
  }
}

// Lifecycle
onMounted(() => {
  fetchReport()
})
</script>

<style scoped>
/* Custom styling */
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* Smooth transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Hover effects */
.border:hover {
  border-color: #9ca3af;
}

/* Responsive design */
@media (max-width: 768px) {
  .grid {
    gap: 1rem;
  }

  .p-6 {
    padding: 1rem;
  }

  .text-2xl {
    font-size: 1.5rem;
    line-height: 2rem;
  }

  .text-xl {
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
}
</style>