<!-- src/components/victim/Dashboard.vue -->
<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p class="mt-2 text-gray-600">Monitor your flood relief reports and status</p>
    </div>

    <!-- Welcome Card -->
    <div
      class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 mb-8 text-white"
    >
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div class="mb-4 md:mb-0">
          <div class="flex items-center">
            <div class="bg-white/20 p-3 rounded-full mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold">
                Welcome back, <span class="capitalize">{{ store?.userData?.name }}</span
                >!
              </h2>
              <p class="mt-1 text-blue-100">Here's your current relief status</p>
            </div>
          </div>
        </div>
        <div class="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <p class="text-sm font-medium text-blue-100">Victim ID</p>
          <p class="text-lg font-semibold mt-1">{{ userData.id }}</p>
          <p class="text-sm text-blue-200 mt-2">{{ userData.phone }}</p>
        </div>
      </div>
    </div>

    <!-- Stats Overview -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Report Overview</h3>
        <span class="text-sm text-gray-500">Last updated: {{ currentDate }}</span>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Total Reports -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Total Reports</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalReports }}</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs text-gray-500">All submitted reports</p>
          </div>
        </div>

        <!-- Verified Reports -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-green-50 text-green-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Verified</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalVerifedReports }}</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs text-gray-500">Approved for assistance</p>
          </div>
        </div>

        <!-- Pending Reports -->
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div class="flex items-center">
            <div class="p-3 rounded-lg bg-yellow-50 text-yellow-600 mr-4">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-600">Pending Review</p>
              <p class="text-3xl font-bold text-gray-900 mt-1">{{ totalPendingReports }}</p>
            </div>
          </div>
          <div class="mt-4 pt-4 border-t border-gray-100">
            <p class="text-xs text-gray-500">Awaiting verification</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          to="/report"
          class="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left"
        >
          <div class="flex flex-col items-center text-center">
            <div
              class="p-3 rounded-full bg-blue-50 text-blue-600 group-hover:bg-blue-100 transition-colors mb-3"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900">New Damage Report</h4>
            <p class="text-sm text-gray-500 mt-1">Submit new flood damage assessment</p>
          </div>
        </router-link>

        <button
          @click="refreshReports"
          class="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left"
        >
          <div class="flex flex-col items-center text-center">
            <div
              class="p-3 rounded-full bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors mb-3"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900">Refresh Status</h4>
            <p class="text-sm text-gray-500 mt-1">Update all report statuses</p>
          </div>
        </button>

        <button
          @click="downloadReport"
          class="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left"
        >
          <div class="flex flex-col items-center text-center">
            <div
              class="p-3 rounded-full bg-purple-50 text-purple-600 group-hover:bg-purple-100 transition-colors mb-3"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900">Export Reports</h4>
            <p class="text-sm text-gray-500 mt-1">Download all reports as PDF</p>
          </div>
        </button>

        <button
          @click="showHelp"
          class="group bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:border-blue-500 hover:shadow-md transition-all duration-200 text-left"
        >
          <div class="flex flex-col items-center text-center">
            <div
              class="p-3 rounded-full bg-gray-50 text-gray-600 group-hover:bg-gray-100 transition-colors mb-3"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h4 class="font-semibold text-gray-900">Help & Support</h4>
            <p class="text-sm text-gray-500 mt-1">Get assistance or FAQ</p>
          </div>
        </button>
      </div>
    </div>

    <!-- Recent Reports -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div
        class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Recent Reports</h3>
          <p class="text-sm text-gray-500 mt-1">Your latest flood damage assessments</p>
        </div>
        <router-link
          to="/report"
          class="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          New Report
        </router-link>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="p-8 text-center">
        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
        ></div>
        <p class="mt-4 text-gray-600 font-medium">Loading your reports...</p>
        <p class="text-sm text-gray-500 mt-1">Please wait a moment</p>
      </div>

      <!-- Empty State -->
      <div v-else-if="reports.length === 0" class="p-8 text-center">
        <div
          class="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4"
        >
          <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h4 class="text-lg font-semibold text-gray-900">No reports yet</h4>
        <p class="text-gray-600 mt-2">You haven't submitted any flood damage reports</p>
        <button
          @click="createNewReport"
          class="mt-6 inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Submit Your First Report
        </button>
      </div>

      <!-- Reports List -->
      <div v-else class="divide-y divide-gray-200">
        <div
          v-for="report in reportStore?.reports"
          :key="report.report_id"
          @click="viewReport(report.report_id)"
          class="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors group"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0">
                <div
                  :class="[
                    'w-10 h-10 rounded-lg flex items-center justify-center',
                    report.status === 'Verified'
                      ? 'bg-green-100 text-green-600'
                      : report.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-600'
                      : 'bg-gray-100 text-gray-600',
                  ]"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h4 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  Damage Report #{{ report.report_id }}
                </h4>
                <div class="flex items-center space-x-3 mt-1">
                  <span class="text-sm text-gray-500">
                    <svg
                      class="w-4 h-4 inline-block mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {{ formatDate(report.created_at) }}
                  </span>
                  <span class="text-sm text-gray-500">
                    <svg
                      class="w-4 h-4 inline-block mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {{ report.total_residents_count }} family members
                  </span>
                </div>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  report.status === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : report.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800',
                ]"
              >
                {{ report.report_status }}
              </span>
              <svg
                class="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- View All Reports Link -->
      <div v-if="reportStore?.reports?.length > 0" class="px-6 py-4 border-t border-gray-200">
        <button
          disabled="true"
          @click="viewAllReports"
          class="disabled:text-blue-500 disabled:cursor-not-allowed text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
        >
          View all reports
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Footer Stats -->
    <div class="mt-8 text-center">
      <p class="text-sm text-gray-500">
        Need immediate assistance? Call our support line:
        <a href="tel:+18001234567" class="text-blue-600 hover:text-blue-700 font-medium"
          >1234-567-89-1234</a
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authStore'
import { useReportStore } from '../store/reportsStore'
const store = useAuthStore()
const reportStore = useReportStore()
const router = useRouter()

// State
const isLoading = ref(true)

// Data
const userData = ref({
  id: 'V-2023-001245',
  fullName: 'Jane Doe',
  phone: '+1 (555) 123-4567',
})

const stats = ref({
  totalReports: 5,
  verifiedReports: 3,
  pendingReports: 2,
})

const reports = ref([
  { id: 103, date: '2025-12-01', status: 'Verified', familyMembers: 3 },
  { id: 102, date: '2025-11-28', status: 'Pending', familyMembers: 4 },
  { id: 101, date: '2025-11-25', status: 'Verified', familyMembers: 2 },
  { id: 100, date: '2025-11-20', status: 'Verified', familyMembers: 5 },
  { id: 99, date: '2025-11-18', status: 'Pending', familyMembers: 3 },
])

// Computed
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
})
// get total reports
const totalReports = computed(() => {
  return reportStore?.reports?.length
})
// get verified reports
const totalVerifedReports = computed(() => {
  return reportStore?.reports?.filter((report) => report.report_status === 'varified').length
})
// get pending reports
const totalPendingReports = computed(() => {
  return reportStore?.reports?.filter((report) => report.report_status === 'pending').length
})
// Methods
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const refreshReports = () => {
  isLoading.value = true
  console.log('Refreshing reports...')

  // Simulate API call
  setTimeout(async () => {
    isLoading.value = false
    // In a real app, you would update the data here
    await reportStore?.fetchReports()
  }, 1000)
}

const downloadReport = () => {
  // Simulate download
  console.log('Downloading reports...')
  // In a real app, this would trigger a file download
  setTimeout(() => {
    alert('Report download initiated. You will receive the PDF via email shortly.')
  }, 500)
}

const showHelp = () => {
  router.push('/help')
}

const createNewReport = () => {
  router.push('/victim/reports/new')
}

const viewReport = (id) => {
  router.push(`/victim/reports/${id}`)
}

const viewAllReports = () => {
  router.push('/victim/reports')
}

// Lifecycle
onMounted(async () => {
  await store.userAuthStatus()
  await reportStore.fetchReports()
  console.log(reportStore?.reports)

  // Simulate API call delay
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>

<style scoped>
/* Custom animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

/* Custom scrollbar for the reports list */
.divide-y > div {
  animation: fadeIn 0.3s ease-out;
  animation-fill-mode: both;
}

.divide-y > div:nth-child(1) {
  animation-delay: 0.1s;
}
.divide-y > div:nth-child(2) {
  animation-delay: 0.2s;
}
.divide-y > div:nth-child(3) {
  animation-delay: 0.3s;
}
.divide-y > div:nth-child(4) {
  animation-delay: 0.4s;
}
.divide-y > div:nth-child(5) {
  animation-delay: 0.5s;
}

/* Enhanced hover effects */
.group:hover .group-hover\:text-blue-600 {
  color: #2563eb;
}
</style>