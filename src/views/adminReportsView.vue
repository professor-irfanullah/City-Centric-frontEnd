<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- ERROR BOUNDARY -->
    <div v-if="hasError" class="bg-red-50 p-6 rounded-xl text-center">
      <h2 class="text-lg font-semibold text-red-800">Something went wrong</h2>
      <p class="text-red-600 mt-2">{{ errorMessage }}</p>
      <button @click="resetError" class="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg">
        Try Again
      </button>
    </div>

    <!-- LIST VIEW -->
    <div v-else-if="viewMode === 'list'">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900">Disaster Reports</h1>
            <p class="text-gray-600 mt-2">Manage and review all submitted reports</p>
          </div>
          <div class="flex items-center gap-3">
            <button
              @click="refreshReports"
              :disabled="loading || refreshing"
              :aria-label="loading ? 'Loading reports' : 'Refresh reports'"
              :aria-busy="loading.toString()"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg
                v-if="loading || refreshing"
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
              <svg
                v-else
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
            <div class="text-sm text-gray-500" aria-live="polite">
              Showing {{ filteredReports.length }} of {{ totalReports }} reports
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4" id="filters-heading">Filters</h2>

        <div
          class="grid grid-cols-1 md:grid-cols-4 gap-4"
          role="group"
          aria-labelledby="filters-heading"
        >
          <!-- District Filter -->
          <div>
            <label for="district-filter" class="block text-sm font-medium text-gray-700 mb-2"
              >District</label
            >
            <select
              id="district-filter"
              v-model="filters.district"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="debouncedFilter"
            >
              <option value="">All Districts</option>
              <option
                v-for="district in uniqueDistricts"
                :key="district"
                :value="district"
                class="capitalize"
              >
                {{ district }}
              </option>
            </select>
          </div>

          <!-- Tehsil Filter -->
          <div>
            <label for="tehsil-filter" class="block text-sm font-medium text-gray-700 mb-2"
              >Tehsil</label
            >
            <select
              id="tehsil-filter"
              v-model="filters.tehsil"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :disabled="!filters.district"
              @change="debouncedFilter"
            >
              <option value="">All Tehsils</option>
              <option
                class="capitalize"
                v-for="tehsil in filteredTehsils"
                :key="tehsil"
                :value="tehsil"
              >
                {{ tehsil }}
              </option>
            </select>
          </div>

          <!-- Disaster Type Filter -->
          <div>
            <label for="disaster-filter" class="block text-sm font-medium text-gray-700 mb-2">
              Disaster Type
            </label>
            <select
              id="disaster-filter"
              v-model="filters.disasterType"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="debouncedFilter"
            >
              <option value="">All Types</option>
              <option v-for="type in disasterTypes" :key="type.value" :value="type.value">
                {{ type.emoji }} {{ type.label }}
              </option>
            </select>
          </div>

          <!-- Verification Status Filter -->
          <div>
            <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-2"
              >Status</label
            >
            <select
              id="status-filter"
              v-model="filters.verificationStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="debouncedFilter"
            >
              <option value="">All Status</option>
              <option value="verified">✅ Verified</option>
              <option value="pending">⏳ Pending</option>
              <option value="rejected">❌ Rejected</option>
            </select>
          </div>
        </div>

        <!-- Date Range Filter -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label for="from-date" class="block text-sm font-medium text-gray-700 mb-2"
              >From Date</label
            >
            <input
              id="from-date"
              type="date"
              v-model="filters.fromDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="debouncedFilter"
            />
          </div>
          <div>
            <label for="to-date" class="block text-sm font-medium text-gray-700 mb-2"
              >To Date</label
            >
            <input
              id="to-date"
              type="date"
              v-model="filters.toDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              @change="debouncedFilter"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Clear all filters"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      <!-- Reports Table -->
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <!-- Table Header -->
        <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-800">All Reports</h3>
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-500" id="sort-label">Sort by:</span>
            <select
              v-model="sortBy"
              class="px-3 py-1 border border-gray-300 rounded-lg text-sm"
              aria-labelledby="sort-label"
              @change="currentPage = 1"
            >
              <option value="created_at">Date (Newest)</option>
              <option value="created_at_asc">Date (Oldest)</option>
              <option value="deaths_count">Deaths (High-Low)</option>
              <option value="district">District (A-Z)</option>
            </select>
          </div>
        </div>

        <!-- loading -->
        <div v-if="loading" class="space-y-4">
          <div v-for="n in 5" :key="n" class="animate-pulse">
            <div class="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredReports.length === 0" class="p-8 text-center">
          <svg
            class="w-16 h-16 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">No reports found</h3>
          <p class="mt-2 text-gray-500">Try adjusting your filters or check back later.</p>
          <button
            @click="clearFilters"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>

        <!-- Reports Table -->
        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Type
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Impact
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="report in paginatedReports"
                :key="report.report_id"
                class="hover:bg-gray-50 transition-colors"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">#{{ report.report_id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(report.created_at) }}</div>
                  <div class="text-sm text-gray-500 flex items-center mt-1">
                    <span class="mr-2" aria-hidden="true">{{
                      getDisasterEmoji(report.disaster_type)
                    }}</span>
                    {{ formatDisasterType(report.disaster_type) }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 capitalize">
                    {{ report.tehsil || 'N/A' }}
                  </div>
                  <div class="text-sm text-gray-500 capitalize">{{ report.district || 'N/A' }}</div>
                  <div class="text-xs text-gray-400 mt-1 capitalize">
                    {{ report.village || 'N/A' }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div v-if="report.deaths_count > 0" class="flex items-center text-sm">
                      <span class="text-red-600 mr-2" aria-hidden="true">💀</span>
                      <span class="font-medium">{{ report.deaths_count }} deaths</span>
                    </div>
                    <div v-if="report.injured_count > 0" class="flex items-center text-sm">
                      <span class="text-orange-600 mr-2" aria-hidden="true">🏥</span>
                      <span class="font-medium">{{ report.injured_count }} injured</span>
                    </div>
                    <div v-if="report.is_home_impacted" class="flex items-center text-sm">
                      <span class="text-red-500 mr-2" aria-hidden="true">🏠</span>
                      <span class="font-medium">{{
                        formatDamageLevel(report.home_damage_level)
                      }}</span>
                    </div>
                    <div v-if="report.is_shop_impacted" class="flex items-center text-sm">
                      <span class="text-blue-500 mr-2" aria-hidden="true">🏪</span>
                      <span class="font-medium">{{
                        formatDamageLevel(report.shop_damage_level)
                      }}</span>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClasses(report.verification_status)"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ formatStatus(report.verification_status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    @click="viewReport(report.report_id)"
                    class="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    View
                  </button>
                  <button
                    v-if="report.verification_status === 'pending'"
                    @click="verifyReport(report.report_id)"
                    :disabled="verifying[report.report_id]"
                    class="text-green-600 hover:text-green-900 mr-4 disabled:opacity-50"
                  >
                    <span v-if="verifying[report.report_id]">Verifying...</span>
                    <span v-else>Verify</span>
                  </button>
                  <button
                    v-if="report.verification_status === 'pending'"
                    @click="rejectReport(report.report_id)"
                    :disabled="rejecting[report.report_id]"
                    class="text-red-600 hover:text-red-900 disabled:opacity-50"
                  >
                    <span v-if="rejecting[report.report_id]">Rejecting...</span>
                    <span v-else>Reject</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          v-if="filteredReports.length > 0"
          class="px-6 py-4 border-t border-gray-200 flex items-center justify-between"
        >
          <div class="text-sm text-gray-700">
            Showing {{ paginationStart }} to {{ paginationEnd }} of
            {{ filteredReports.length }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700"> Page {{ currentPage }} of {{ totalPages }} </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- DETAIL VIEW -->
    <div v-else-if="viewMode === 'detail' && selectedReport">
      <!-- Header with Back Button -->
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
              <svg
                v-else
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
              <svg
                v-else
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import useAdminStore from '../store/adminStore.js'

// ============= STORE =============
const store = useAdminStore()

// ============= CONSTANTS (Static configs only) =============
const STATUS_CONFIG = Object.freeze({
  verified: { label: 'Verified', class: 'bg-green-100 text-green-800', emoji: '✅' },
  pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800', emoji: '⏳' },
  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-800', emoji: '❌' },
})

const DAMAGE_LEVELS = Object.freeze({
  minor: {
    label: 'Only water & silt',
    class: 'bg-yellow-100 text-yellow-800',
    description: 'Water & silt damage only',
  },
  major: {
    label: 'Minor Damage',
    class: 'bg-orange-100 text-orange-800',
    description: '1 room or boundary wall damaged',
  },
  fully_destroyed: {
    label: 'Complete Destruction',
    class: 'bg-red-100 text-red-800',
    description: '2 or more rooms completely destroyed',
  },
})

// ============= STATE =============
// Error Handling
const hasError = ref(false)
const errorMessage = ref('')

// View Mode
const viewMode = ref('list')
const selectedReport = ref(null)

// UI State
const loading = ref(false)
const refreshing = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const sortBy = ref('created_at')

// Action States - Using Set for O(1) performance
const verifying = ref(new Set())
const rejecting = ref(new Set())

// Debounce Timer
let filterTimeout = null

// Filters
const filters = ref({
  district: '',
  tehsil: '',
  disasterType: '',
  verificationStatus: '',
  fromDate: '',
  toDate: '',
})

// ============= COMPUTED =============

// Direct from store - NO NORMALIZATION NEEDED!
const reports = computed(() => store.reports || [])

const totalReports = computed(() => reports.value.length)

// ============= DYNAMIC DROPDOWN VALUES =============

// ✅ DYNAMIC: Unique districts from actual data
const uniqueDistricts = computed(() => {
  const districts = new Set()
  reports.value.forEach((report) => {
    if (report.district) districts.add(report.district)
  })
  return Array.from(districts).sort()
})

// ✅ DYNAMIC: Unique tehsils filtered by district
const filteredTehsils = computed(() => {
  if (!filters.value.district) {
    const tehsils = new Set()
    reports.value.forEach((report) => {
      if (report.tehsil) tehsils.add(report.tehsil)
    })
    return Array.from(tehsils).sort()
  }

  const tehsils = new Set()
  reports.value.forEach((report) => {
    if (report.district === filters.value.district && report.tehsil) {
      tehsils.add(report.tehsil)
    }
  })
  return Array.from(tehsils).sort()
})

// ✅ DYNAMIC: Unique disaster types from actual data with emojis
const disasterTypes = computed(() => {
  const types = new Set()
  reports.value.forEach((report) => {
    if (report.disaster_type) types.add(report.disaster_type)
  })

  // Convert to array with emojis
  return Array.from(types)
    .sort()
    .map((type) => ({
      value: type,
      label: formatDisasterType(type),
      emoji: getDisasterEmoji(type),
    }))
})

// Filter reports
const filteredReports = computed(() => {
  return reports.value.filter((report) => {
    // District filter
    if (filters.value.district && report.district !== filters.value.district) {
      return false
    }

    // Tehsil filter
    if (filters.value.tehsil && report.tehsil !== filters.value.tehsil) {
      return false
    }

    // ✅ DYNAMIC: Disaster type filter
    if (filters.value.disasterType && report.disaster_type !== filters.value.disasterType) {
      return false
    }

    // Status filter
    if (
      filters.value.verificationStatus &&
      report.verification_status !== filters.value.verificationStatus
    ) {
      return false
    }

    // Date range filter
    if (filters.value.fromDate || filters.value.toDate) {
      const reportTime = new Date(report.created_at).getTime()

      if (filters.value.fromDate) {
        const fromTime = new Date(filters.value.fromDate).setHours(0, 0, 0, 0)
        if (reportTime < fromTime) return false
      }

      if (filters.value.toDate) {
        const toTime = new Date(filters.value.toDate).setHours(23, 59, 59, 999)
        if (reportTime > toTime) return false
      }
    }

    return true
  })
})

// Sorted reports
const sortedReports = computed(() => {
  const sorted = [...filteredReports.value]

  switch (sortBy.value) {
    case 'created_at':
      return sorted.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
    case 'created_at_asc':
      return sorted.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      )
    case 'deaths_count':
      return sorted.sort((a, b) => (b.deaths_count || 0) - (a.deaths_count || 0))
    case 'district':
      return sorted.sort((a, b) => (a.district || '').localeCompare(b.district || ''))
    default:
      return sorted
  }
})

// Pagination
const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return sortedReports.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => Math.ceil(filteredReports.value.length / itemsPerPage.value) || 1)

const paginationStart = computed(() =>
  filteredReports.value.length ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0
)

const paginationEnd = computed(() =>
  Math.min(currentPage.value * itemsPerPage.value, filteredReports.value.length)
)

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

// ============= FORMATTING FUNCTIONS =============

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

// ✅ DYNAMIC: Format disaster type with proper capitalization
const formatDisasterType = (type) => {
  if (!type) return 'Unknown'

  // Convert snake_case to Title Case
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// ✅ DYNAMIC: Get emoji for disaster type
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

const formatDamageLevel = (level) => {
  return DAMAGE_LEVELS[level]?.label || level || 'Unknown'
}

const getDamageDescription = (level) => {
  return DAMAGE_LEVELS[level]?.description || 'Damage reported'
}

const getDamageLevelClasses = (level) => {
  return DAMAGE_LEVELS[level]?.class || 'bg-gray-100 text-gray-800'
}

const formatStatus = (status) => {
  return STATUS_CONFIG[status]?.label || status || 'Unknown'
}

const getStatusClasses = (status) => {
  return STATUS_CONFIG[status]?.class || 'bg-gray-100 text-gray-800'
}

// ============= METHODS =============

const debouncedFilter = () => {
  if (filterTimeout) clearTimeout(filterTimeout)
  filterTimeout = setTimeout(() => {
    currentPage.value = 1
  }, 300)
}

const fetchReports = async (showRefreshing = false) => {
  if (showRefreshing) {
    refreshing.value = true
  } else {
    loading.value = true
  }

  try {
    await store.fetchAllReports()
    currentPage.value = 1
    hasError.value = false
    errorMessage.value = ''
  } catch (error) {
    console.error('Fetch reports error:', error)
    hasError.value = true
    errorMessage.value = error.response?.data?.message || 'Failed to load reports'
  } finally {
    loading.value = false
    refreshing.value = false
  }
}

const refreshReports = () => fetchReports(true)

const clearFilters = () => {
  filters.value = {
    district: '',
    tehsil: '',
    disasterType: '',
    verificationStatus: '',
    fromDate: '',
    toDate: '',
  }
  currentPage.value = 1
}

const viewReport = (reportId) => {
  const report = reports.value.find((r) => r.report_id === reportId)
  if (report) {
    selectedReport.value = report
    viewMode.value = 'detail'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const backToList = () => {
  viewMode.value = 'list'
  selectedReport.value = null
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const verifyReport = async (reportId) => {
  if (!confirm('Are you sure you want to verify this report?')) return

  verifying.value.add(reportId)

  try {
    await store.verifyReport(reportId)

    const report = reports.value.find((r) => r.report_id === reportId)
    if (report) {
      report.verification_status = 'verified'
      if (selectedReport.value?.report_id === reportId) {
        selectedReport.value.verification_status = 'verified'
      }
    }
  } catch (error) {
    console.error('Verify error:', error)
    alert('Failed to verify report. Please try again.')
  } finally {
    verifying.value.delete(reportId)
  }
}

const rejectReport = async (reportId) => {
  if (!confirm('Are you sure you want to reject this report?')) return

  rejecting.value.add(reportId)

  try {
    await store.rejectReport(reportId)

    const report = reports.value.find((r) => r.report_id === reportId)
    if (report) {
      report.verification_status = 'rejected'
      if (selectedReport.value?.report_id === reportId) {
        selectedReport.value.verification_status = 'rejected'
      }
    }
  } catch (error) {
    console.error('Reject error:', error)
    alert('Failed to reject report. Please try again.')
  } finally {
    rejecting.value.delete(reportId)
  }
}

const openImage = (imageUrl) => {
  if (imageUrl) {
    try {
      const url = new URL(imageUrl, window.location.origin)
      window.open(url.href, '_blank', 'noopener,noreferrer')
    } catch {
      console.warn('Invalid image URL:', imageUrl)
    }
  }
}

const handleImageError = (e, reportId, type) => {
  console.warn(`Failed to load ${type} image for report ${reportId}`)
  e.target.src = '/placeholder-image.jpg'
  e.target.alt = 'Image unavailable'
  e.target.onerror = null
}

const resetError = () => {
  hasError.value = false
  errorMessage.value = ''
  fetchReports()
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// ============= WATCHERS =============
watch(currentPage, () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
})

// ============= LIFECYCLE =============
onMounted(async () => {
  await fetchReports()
})

onUnmounted(() => {
  if (filterTimeout) {
    clearTimeout(filterTimeout)
  }
})
</script>

<style scoped>
/* Custom scrollbar */
.overflow-x-auto::-webkit-scrollbar {
  height: 6px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Hover effects */
tbody tr {
  transition: background-color 0.2s ease;
}

tbody tr:hover {
  background-color: #f9fafb;
}

/* Aspect ratio for images */
.aspect-square {
  aspect-ratio: 1 / 1;
}

/* Smooth transitions */
.transition-colors {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

.transition-opacity {
  transition-property: opacity;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Focus styles for accessibility */
button:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Responsive design */
@media (max-width: 768px) {
  .overflow-x-auto {
    -webkit-overflow-scrolling: touch;
  }

  table {
    font-size: 0.875rem;
  }

  .px-6 {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .py-4 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }

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