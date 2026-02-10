<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- LIST VIEW -->
    <div v-if="viewMode === 'list'">
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
              :disabled="loading"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
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
            <div class="text-sm text-gray-500">
              Showing {{ filteredReports.length }} of {{ reports.length }} reports
            </div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Filters</h2>

        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <!-- District Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">District</label>
            <select
              v-model="filters.district"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Districts</option>
              <option
                v-for="(district, index) in uniqueDistricts"
                :key="index"
                :value="district"
                class="capitalize"
              >
                {{ district }}
              </option>
            </select>
          </div>

          <!-- Tehsil Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tehsil</label>
            <select
              v-model="filters.tehsil"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              :disabled="!filters.district"
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
            <label class="block text-sm font-medium text-gray-700 mb-2">Disaster Type</label>
            <select
              v-model="filters.disasterType"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="flood">🌊 Flood</option>
              <option value="fire">🔥 Fire</option>
              <option value="land_slide">🏔️ Landslide</option>
              <option value="earthquake">🌋 Earthquake</option>
            </select>
          </div>

          <!-- Verification Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="filters.verificationStatus"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <label class="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              v-model="filters.fromDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              v-model="filters.toDate"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div class="flex items-end">
            <button
              @click="clearFilters"
              class="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
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
            <span class="text-sm text-gray-500">Sort by:</span>
            <select v-model="sortBy" class="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option value="created_at">Date (Newest)</option>
              <option value="created_at_asc">Date (Oldest)</option>
              <option value="deaths_count">Deaths (High-Low)</option>
              <option value="district">District (A-Z)</option>
            </select>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="p-8 text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Loading reports...</p>
        </div>

        <!-- Empty State can be in a component-->
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
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date & Type
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Impact
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
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
                <!-- ID -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">#{{ report.report_id }}</div>
                </td>

                <!-- Date & Type -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{{ formatDate(report.created_at) }}</div>
                  <div class="text-sm text-gray-500 flex items-center mt-1">
                    <span class="mr-2">{{ getDisasterEmoji(report.disaster_type) }}</span>
                    {{ formatDisasterType(report.disaster_type) }}
                  </div>
                </td>

                <!-- Location -->
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-gray-900 capitalize">
                    {{ report.tehsil }}
                  </div>
                  <div class="text-sm text-gray-500 capitalize">{{ report.district }}</div>
                  <div class="text-xs text-gray-400 mt-1 capitalize">{{ report.village }}</div>
                </td>

                <!-- Impact Summary -->
                <td class="px-6 py-4">
                  <div class="space-y-1">
                    <div v-if="report.deaths_count > 0" class="flex items-center text-sm">
                      <span class="text-red-600 mr-2">💀</span>
                      <span class="font-medium">{{ report.deaths_count }} deaths</span>
                    </div>
                    <div v-if="report.injured_count > 0" class="flex items-center text-sm">
                      <span class="text-orange-600 mr-2">🏥</span>
                      <span class="font-medium">{{ report.injured_count }} injured</span>
                    </div>
                    <div v-if="report.is_home_impacted" class="flex items-center text-sm">
                      <span class="text-red-500 mr-2">🏠</span>
                      <span class="font-medium">{{
                        formatDamageLevel(report.home_damage_level)
                      }}</span>
                    </div>
                    <div v-if="report.is_shop_impacted" class="flex items-center text-sm">
                      <span class="text-blue-500 mr-2">🏪</span>
                      <span class="font-medium">{{
                        formatDamageLevel(report.shop_damage_level)
                      }}</span>
                    </div>
                  </div>
                </td>

                <!-- Status -->
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="getStatusClasses(report.verification_status)"
                    class="px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {{ formatStatus(report.report_status) }}
                  </span>
                </td>

                <!-- Actions -->
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
                    class="text-green-600 hover:text-green-900 mr-4"
                  >
                    Verify
                  </button>
                  <button
                    v-if="report.verification_status === 'pending'"
                    @click="rejectReport(report.report_id)"
                    class="text-red-600 hover:text-red-900"
                  >
                    Reject
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
            Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
            {{ Math.min(currentPage * itemsPerPage, filteredReports.length) }} of
            {{ filteredReports.length }} results
          </div>
          <div class="flex items-center space-x-2">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span class="text-sm text-gray-700"> Page {{ currentPage }} of {{ totalPages }} </span>
            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
        >
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
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
              Report #{{ selectedReport.id }}
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
              @click="verifyReport(selectedReport.id)"
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
              v-if="selectedReport.verification_status === 'pending'"
              @click="rejectReport(selectedReport.id)"
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

      <!-- Report Content -->
      <div class="space-y-6">
        <!-- Disaster Overview Card -->
        <div class="bg-white rounded-xl shadow-lg p-6">
          <div class="flex items-center mb-6">
            <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <span class="text-2xl">{{ getDisasterEmoji(selectedReport.disaster_type) }}</span>
            </div>
            <div>
              <h2 class="text-xl font-bold text-gray-900">
                {{ formatDisasterType(selectedReport.disaster_type) }} Incident
              </h2>
              <p class="text-gray-600">Reported by affected resident</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <!-- 👤 Personal Information -->
            <div class="space-y-3">
              <h3 class="font-semibold text-gray-700">👤 Personal Information</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <span class="text-gray-500 w-32 capitalize">Name:</span>
                  <span class="font-medium capitalize">{{ selectedReport.name }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-32">Father Name:</span>
                  <span class="font-medium capitalize">{{ selectedReport.father_name }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-32">CNIC:</span>
                  <span class="font-medium">{{ selectedReport.cnic }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-32">Phone:</span>
                  <span class="font-medium">{{ selectedReport.phone_number }}</span>
                </div>
              </div>
            </div>
            <!-- Location Info -->
            <div class="space-y-3">
              <h3 class="font-semibold text-gray-700">📍 Location Details</h3>
              <div class="space-y-2">
                <div class="flex items-center">
                  <span class="text-gray-500 w-24">District:</span>
                  <span class="font-medium capitalize">{{ selectedReport.district }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-24">Tehsil:</span>
                  <span class="font-medium capitalize">{{ selectedReport.tehsil }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-24 capitalize">Village:</span>
                  <span class="font-medium capitalize">{{ selectedReport.village }}</span>
                </div>
                <div class="flex items-center">
                  <span class="text-gray-500 w-24">GPS:</span>
                  <span class="font-medium text-sm">{{ selectedReport.location }}</span>
                </div>
              </div>
            </div>

            <!-- Report Info -->
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
                    {{ formatStatus(selectedReport.report_status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Quick Impact -->
            <div class="space-y-3">
              <h3 class="font-semibold text-gray-700">⚡ Quick Impact</h3>
              <div class="space-y-2">
                <div v-if="selectedReport.deaths_count > 0" class="flex items-center">
                  <span class="text-red-600 mr-2">💀</span>
                  <span class="font-medium">{{ selectedReport.deaths_count }} deaths</span>
                </div>
                <div v-if="selectedReport.injured_count > 0" class="flex items-center">
                  <span class="text-orange-600 mr-2">🏥</span>
                  <span class="font-medium">{{ selectedReport.injured_count }} injured</span>
                </div>
                <div v-if="selectedReport.is_home_impacted" class="flex items-center">
                  <span class="text-red-500 mr-2">🏠</span>
                  <span class="font-medium"
                    >Home: {{ formatDamageLevel(selectedReport.home_damage_level) }}</span
                  >
                </div>
                <div v-if="selectedReport.is_shop_impacted" class="flex items-center">
                  <span class="text-blue-500 mr-2">🏪</span>
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

            <!-- Home Damage Details -->
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
                      <!-- Replaced the placeholder div with an img tag -->
                      <div class="aspect-square bg-gray-100 flex items-center justify-center">
                        <img
                          :src="selectedReport.home_image_url"
                          alt="Home Damage"
                          class="w-full h-full object-cover"
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
                <!-- Large Animals -->
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

                <!-- Small Animals -->
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

                <!-- Animal Summary -->
                <div class="bg-green-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="font-medium text-gray-700">Total Animal Impact</div>
                      <div class="text-sm text-gray-600">
                        {{
                          (selectedReport.big_animals_death_count || 0) +
                          (selectedReport.small_animals_death_count || 0)
                        }}
                        deaths,
                        {{
                          (selectedReport.big_animals_injured_count || 0) +
                          (selectedReport.small_animals_injured_count || 0)
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

                <!-- Shop Images -->
                <div v-if="selectedReport.home_image_url">
                  <h3 class="font-medium text-gray-700 mb-3">Home Damage Evidence</h3>
                  <div class="grid grid-cols-1 gap-4">
                    <div
                      class="border rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      @click="openImage(selectedReport.shop_image_url)"
                    >
                      <!-- Replaced the placeholder div with an img tag -->
                      <div class="aspect-square bg-gray-100 flex items-center justify-center">
                        <img
                          :src="selectedReport.shop_image_url"
                          alt="Home Damage"
                          class="w-full h-full object-cover"
                        />
                      </div>
                      <div class="p-3 text-sm text-center text-gray-600">Shop Damage</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Verification Notes -->
            <!-- <div class="bg-white rounded-xl shadow-lg p-6">
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
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import adminStore from '../store/adminStore.js'
// store
const store = adminStore()
// View Mode: 'list' or 'detail'
const viewMode = ref('list')
const selectedReport = ref(null)

// State
const reports = ref([])
const loading = ref(false)
const currentPage = ref(1)
const itemsPerPage = 10
const sortBy = ref('created_at')
const verificationNotes = ref('')

// Filters
const filters = ref({
  district: '',
  tehsil: '',
  disasterType: '',
  verificationStatus: '',
  fromDate: '',
  toDate: '',
})

// Fetch reports
const fetchReports = async () => {
  loading.value = true
  try {
    // Mock data - same structure as your database
    reports.value = [
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
      {
        id: 2,
        disaster_type: 'flood',
        location: '34.223456, 72.754321',
        are_animals_impacted: true,
        is_home_impacted: true,
        is_shop_impacted: true,
        home_damage_level: 'major',
        shop_damage_level: 'minor',
        big_animals_death_count: 0,
        big_animals_injured_count: 1,
        small_animals_death_count: 2,
        small_animals_injured_count: 4,
        total_residents_count: 5,
        deaths_count: 0,
        injured_count: 1,
        pregnant_women_count: 0,
        disabled_persons_count: 1,
        school_going_children_count: 2,
        married_couples_count: 1,
        district: 'Swat',
        tehsil: 'Kabal',
        village: 'Bar Aba',
        created_at: '2024-01-15T11:45:00Z',
        verification_status: 'pending',
        home_images: ['home3.jpg'],
        shop_images: ['shop1.jpg'],
      },
      {
        id: 3,
        disaster_type: 'land_slide',
        location: '34.323456, 72.854321',
        are_animals_impacted: false,
        is_home_impacted: true,
        is_shop_impacted: false,
        home_damage_level: 'minor',
        shop_damage_level: null,
        big_animals_death_count: 0,
        big_animals_injured_count: 0,
        small_animals_death_count: 0,
        small_animals_injured_count: 0,
        total_residents_count: 4,
        deaths_count: 0,
        injured_count: 0,
        pregnant_women_count: 0,
        disabled_persons_count: 0,
        school_going_children_count: 1,
        married_couples_count: 1,
        district: 'Swat',
        tehsil: 'Khwazakhela',
        village: 'Thana',
        created_at: '2024-01-15T12:15:00Z',
        verification_status: 'pending',
        home_images: ['home4.jpg'],
        shop_images: [],
      },
      {
        id: 4,
        disaster_type: 'fire',
        location: '34.523456, 73.054321',
        are_animals_impacted: true,
        is_home_impacted: true,
        is_shop_impacted: true,
        home_damage_level: 'fully_destroyed',
        shop_damage_level: 'major',
        big_animals_death_count: 1,
        big_animals_injured_count: 0,
        small_animals_death_count: 5,
        small_animals_injured_count: 2,
        total_residents_count: 8,
        deaths_count: 1,
        injured_count: 2,
        pregnant_women_count: 1,
        disabled_persons_count: 1,
        school_going_children_count: 4,
        married_couples_count: 2,
        district: 'Swat',
        tehsil: 'Kabal',
        village: 'Fiza Gut',
        created_at: '2024-01-14T14:30:00Z',
        verification_status: 'verified',
        home_images: ['home5.jpg', 'home6.jpg'],
        shop_images: ['shop2.jpg', 'shop3.jpg'],
      },
      {
        id: 5,
        disaster_type: 'flood',
        location: '34.623456, 73.154321',
        are_animals_impacted: false,
        is_home_impacted: true,
        is_shop_impacted: false,
        home_damage_level: 'major',
        shop_damage_level: null,
        big_animals_death_count: 0,
        big_animals_injured_count: 0,
        small_animals_death_count: 0,
        small_animals_injured_count: 0,
        total_residents_count: 6,
        deaths_count: 0,
        injured_count: 3,
        pregnant_women_count: 1,
        disabled_persons_count: 0,
        school_going_children_count: 2,
        married_couples_count: 2,
        district: 'Swat',
        tehsil: 'Matta',
        village: 'Aman Kot',
        created_at: '2024-01-13T16:45:00Z',
        verification_status: 'rejected',
        home_images: ['home7.jpg'],
        shop_images: [],
      },
    ]
  } catch (error) {
    console.error('Error fetching reports:', error)
  } finally {
    loading.value = false
  }
}

// Computed properties
const uniqueDistricts = computed(() => {
  const districts = new Set()
  reports.value.forEach((report) => {
    if (report.district) districts.add(report.district.toLowerCase())
  })
  return Array.from(districts).sort()
})

const filteredTehsils = computed(() => {
  if (!filters.value.district) {
    const tehsils = new Set()
    reports.value.forEach((report) => {
      if (report.tehsil) tehsils.add(report.tehsil.toLowerCase())
    })

    return Array.from(tehsils).sort()
  }

  const tehsils = new Set()
  reports.value.forEach((report) => {
    if (
      report.district.toLowerCase() === filters.value.district.toLowerCase() &&
      report.tehsil.toLowerCase()
    ) {
      tehsils.add(report.tehsil.toLowerCase())
    }
  })
  return Array.from(tehsils).sort()
})

const filteredReports = computed(() => {
  return reports.value.filter((report) => {
    // District filter
    if (filters.value.district && report.district.toLowerCase() !== filters.value.district) {
      return false
    }

    // Tehsil filter
    if (filters.value.tehsil && report.tehsil.toLowerCase() !== filters.value.tehsil) {
      return false
    }

    // Disaster type filter
    if (filters.value.disasterType && report.disaster_type !== filters.value.disasterType) {
      return false
    }

    // Verification status filter
    if (
      filters.value.verificationStatus &&
      report.report_status !== filters.value.verificationStatus
    ) {
      return false
    }

    // Date range filter
    const reportDate = new Date(report.created_at)
    if (filters.value.fromDate) {
      const fromDate = new Date(filters.value.fromDate)
      if (reportDate < fromDate) return false
    }
    if (filters.value.toDate) {
      const toDate = new Date(filters.value.toDate)
      toDate.setHours(23, 59, 59, 999) // End of day
      if (reportDate > toDate) return false
    }

    return true
  })
})

const sortedReports = computed(() => {
  const sorted = [...filteredReports.value]

  switch (sortBy.value) {
    case 'created_at':
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    case 'created_at_asc':
      return sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    case 'deaths_count':
      return sorted.sort((a, b) => (b.deaths_count || 0) - (a.deaths_count || 0))
    case 'district':
      return sorted.sort((a, b) => (a.district || '').localeCompare(b.district || ''))
    default:
      return sorted
  }
})

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sortedReports.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredReports.value.length / itemsPerPage)
})

const totalAnimalImpact = computed(() => {
  if (!selectedReport.value) return 0
  return (
    (selectedReport.value.big_animals_death_count || 0) +
    (selectedReport.value.small_animals_death_count || 0) +
    (selectedReport.value.big_animals_injured_count || 0) +
    (selectedReport.value.small_animals_injured_count || 0)
  )
})

// Methods
const refreshReports = async () => {
  await store.fetchAllReports()
  currentPage.value = 1
}

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

const formatDate = (dateString) => {
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

const formatDamageLevel = (level) => {
  const levels = {
    minor: 'Only water & silt',
    major: 'Minor Damage',
    fully_destroyed: 'Complete Destruction',
  }
  return levels[level] || level
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
  verificationNotes.value = ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const verifyReport = async (reportId) => {
  if (confirm('Are you sure you want to verify this report?')) {
    try {
      // Update the report status
      const report = reports.value.find((r) => r.report_id === reportId)
      if (report) {
        report.verification_status = 'verified'
        if (reportId === selectedReport.value?.id) {
          selectedReport.value.verification_status = 'verified'
        }
      }
    } catch (error) {
      console.error('Error verifying report:', error)
    }
  }
}

const rejectReport = async (reportId) => {
  if (confirm('Are you sure you want to reject this report?')) {
    try {
      // Update the report status
      const report = reports.value.find((r) => r.report_id === reportId)
      if (report) {
        report.verification_status = 'rejected'
        if (reportId === selectedReport.value?.id) {
          selectedReport.value.verification_status = 'rejected'
        }
      }
    } catch (error) {
      console.error('Error rejecting report:', error)
    }
  }
}

const openImage = (imageUrl) => {
  // In real app, open image in modal or new tab
  window.open(imageUrl, '_blank')
}

const saveNotes = async () => {
  try {
    // Save notes to the selected report
    if (selectedReport.value) {
      // In real app, make API call to save notes
      // await api.saveNotes(selectedReport.value.id, verificationNotes.value)
      alert('Notes saved successfully')
    }
  } catch (error) {
    console.error('Error saving notes:', error)
  }
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

// Lifecycle
onMounted(async () => {
  try {
    loading.value = true
    await store.fetchAllReports()
    reports.value = store?.reports ?? []
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
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