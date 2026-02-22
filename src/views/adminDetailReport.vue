<template>
  <section class="min-h-screen bg-gray-50">
    <!-- Header with Breadcrumb and Actions -->
    <div class="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <!-- Header Content -->
        <div class="flex flex-col gap-3 sm:gap-4">
          <!-- Title and Status Row -->
          <div class="flex flex-wrap items-start gap-2">
            <h1
              class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight flex-1 min-w-[200px]"
            >
              Disaster Impact Report
            </h1>
            <span
              :class="[
                'inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium shadow-sm whitespace-nowrap',
                getStatusClasses(selectedReport.verification_status).split(' ').slice(1).join(' '),
              ]"
            >
              <span
                class="w-1.5 h-1.5 rounded-full mr-1 sm:mr-1.5"
                :class="{
                  'bg-yellow-400': selectedReport.verification_status === 'pending',
                  'bg-green-400': selectedReport.verification_status === 'verified',
                  'bg-red-400': selectedReport.verification_status === 'rejected',
                }"
              ></span>
              {{ formatStatus(selectedReport.verification_status) }}
            </span>
          </div>

          <!-- Meta Info Row - Stack on mobile -->
          <div class="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
            <div class="flex items-center">
              <svg
                class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-400 flex-shrink-0"
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
              <span class="truncate">{{ formatDate(selectedReport.created_at) }}</span>
            </div>
            <div class="flex items-center">
              <svg
                class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="truncate"
                >{{ selectedReport.district }}, {{ selectedReport.tehsil }}</span
              >
            </div>
            <div class="flex items-center">
              <svg
                class="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-1.5 text-gray-400 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <span class="truncate">#{{ selectedReport.report_id }}</span>
            </div>
          </div>

          <!-- Action Button - Full width on mobile -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 mt-2">
            <button
              @click="saveAsPDF(selectedReport.report_id)"
              :disabled="generating[selectedReport.report_id]"
              class="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-medium rounded-xl shadow-sm hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <!-- Loading Spinner (shows when generating[id] is true) -->
              <svg
                v-if="generating[selectedReport.report_id]"
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

              <!-- PDF Icon (shows when NOT loading) -->
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
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 15h6M9 11h6"
                />
              </svg>

              <span>{{
                generating[selectedReport.report_id] ? 'Generating...' : 'Save as PDF'
              }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div
        v-if="selectedReport && Object.keys(selectedReport).length > 0"
        class="space-y-4 sm:space-y-6"
      >
        <!-- Overview Stats Cards - 2 columns on mobile -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Disaster</p>
                <p
                  class="text-sm sm:text-lg font-semibold text-gray-900 truncate max-w-[80px] sm:max-w-none"
                >
                  {{ formatDisasterType(selectedReport.disaster_type) }}
                </p>
              </div>
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-50 rounded-lg flex items-center justify-center text-lg sm:text-xl flex-shrink-0"
              >
                {{ getDisasterEmoji(selectedReport.disaster_type) }}
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Human</p>
                <p class="text-sm sm:text-lg font-semibold text-gray-900">{{ totalHumanImpact }}</p>
              </div>
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-600 text-lg sm:text-xl flex-shrink-0"
              >
                👥
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Family</p>
                <p class="text-sm sm:text-lg font-semibold text-gray-900">
                  {{ selectedReport.total_residents_count || 0 }}
                </p>
              </div>
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-50 rounded-lg flex items-center justify-center text-purple-600 text-lg sm:text-xl flex-shrink-0"
              >
                👪
              </div>
            </div>
          </div>

          <div
            class="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-xs sm:text-sm text-gray-500 mb-1">Property</p>
                <p
                  class="text-sm sm:text-lg font-semibold text-gray-900 truncate max-w-[80px] sm:max-w-none"
                >
                  {{ propertyImpact }}
                </p>
              </div>
              <div
                class="w-8 h-8 sm:w-10 sm:h-10 bg-amber-50 rounded-lg flex items-center justify-center text-amber-600 text-lg sm:text-xl flex-shrink-0"
              >
                🏠
              </div>
            </div>
          </div>
        </div>

        <!-- Main Information Card -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <!-- Card Header with Tabs - Scrollable on mobile -->
          <div class="border-b border-gray-100 bg-gray-50/50 px-3 sm:px-6 py-3 sm:py-4">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 class="text-base sm:text-lg font-semibold text-gray-900">Report Details</h2>
              <div class="flex gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0 -mb-1 sm:mb-0">
                <button
                  v-for="section in sections"
                  :key="section.id"
                  @click="activeSection = section.id"
                  :class="[
                    'px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap',
                    activeSection === section.id
                      ? 'bg-white text-blue-600 shadow-sm border border-gray-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/50',
                  ]"
                >
                  {{ section.name }}
                </button>
              </div>
            </div>
          </div>

          <!-- Card Content -->
          <div class="p-4 sm:p-6">
            <!-- Personal Information Section -->
            <div v-show="activeSection === 'personal'" class="space-y-4 sm:space-y-6">
              <!-- Mobile: Stack vertically, Desktop: Grid -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <!-- Personal Info -->
                <div class="space-y-2 sm:space-y-3">
                  <h3 class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Personal Info
                  </h3>
                  <div class="space-y-1.5 sm:space-y-2">
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Name</span>
                      <span class="font-medium text-gray-900 capitalize truncate ml-2">{{
                        selectedReport.name || 'N/A'
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Father</span>
                      <span class="font-medium text-gray-900 capitalize truncate ml-2">{{
                        selectedReport.father_name || 'N/A'
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">CNIC</span>
                      <span class="font-medium text-gray-900 truncate ml-2">{{
                        selectedReport.cnic || 'N/A'
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Phone</span>
                      <span class="font-medium text-gray-900 truncate ml-2">{{
                        selectedReport.phone_number || 'N/A'
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Email</span>
                      <span class="font-medium text-gray-900 truncate ml-2">{{
                        selectedReport.email || 'N/A'
                      }}</span>
                    </div>
                  </div>
                </div>

                <!-- Location -->
                <div class="space-y-2 sm:space-y-3">
                  <h3 class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </h3>
                  <div class="space-y-1.5 sm:space-y-2">
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">District</span>
                      <span class="font-medium text-gray-900 capitalize truncate ml-2">{{
                        selectedReport.district || 'N/A'
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Tehsil</span>
                      <span class="font-medium text-gray-900 capitalize truncate ml-2">{{
                        selectedReport.tehsil || 'N/A'
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Village</span>
                      <span class="font-medium text-gray-900 capitalize truncate ml-2">{{
                        selectedReport.village || 'N/A'
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Muhalla</span>
                      <span class="font-medium text-gray-900 capitalize truncate ml-2">{{
                        selectedReport.muhalla || 'N/A'
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">GPS</span>
                      <span class="font-medium text-gray-900 truncate ml-2">{{
                        selectedReport.location || 'N/A'
                      }}</span>
                    </div>
                  </div>
                  <button
                    v-if="selectedReport.location"
                    @click="openInMaps(selectedReport)"
                    class="mt-2 w-full inline-flex items-center justify-center px-2 sm:px-3 py-1.5 sm:py-2 bg-blue-50 text-blue-700 text-xs sm:text-sm rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <svg
                      class="w-3 h-3 sm:w-4 sm:h-4 mr-1.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span class="hidden xs:inline">View on Maps</span>
                    <span class="xs:hidden">Maps</span>
                  </button>
                </div>

                <!-- Report Info -->
                <div class="space-y-2 sm:space-y-3">
                  <h3 class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Report Info
                  </h3>
                  <div class="space-y-1.5 sm:space-y-2">
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Report ID</span>
                      <span class="font-medium text-gray-900 truncate ml-2"
                        >#{{ selectedReport.report_id }}</span
                      >
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Submitted</span>
                      <span class="font-medium text-gray-900 truncate ml-2">{{
                        formatDate(selectedReport.created_at)
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Status</span>
                      <span
                        :class="getStatusClasses(selectedReport.verification_status)"
                        class="px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2"
                      >
                        {{ formatStatus(selectedReport.verification_status) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Quick Impact -->
                <div class="space-y-2 sm:space-y-3">
                  <h3 class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Quick Impact
                  </h3>
                  <div class="space-y-1.5 sm:space-y-2">
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Deaths</span>
                      <span class="font-medium text-red-600">{{
                        selectedReport.deaths_count || 0
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Injured</span>
                      <span class="font-medium text-orange-600">{{
                        selectedReport.injured_count || 0
                      }}</span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Home</span>
                      <span class="font-medium text-gray-900 truncate ml-2">
                        {{
                          selectedReport.is_home_impacted
                            ? formatDamageLevel(selectedReport.home_damage_level)
                            : 'Not affected'
                        }}
                      </span>
                    </div>
                    <div
                      class="flex items-center justify-between p-2 bg-gray-50 rounded-lg text-xs sm:text-sm"
                    >
                      <span class="text-gray-500">Shop</span>
                      <span class="font-medium text-gray-900 truncate ml-2">
                        {{
                          selectedReport.is_shop_impacted
                            ? formatDamageLevel(selectedReport.shop_damage_level)
                            : 'Not affected'
                        }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Human Impact Section -->
            <div v-show="activeSection === 'human'" class="space-y-4 sm:space-y-6">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h3
                    class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3"
                  >
                    Casualties
                  </h3>
                  <div class="grid grid-cols-2 gap-2 sm:gap-3">
                    <div class="bg-red-50 rounded-xl p-3 sm:p-4">
                      <p class="text-xs text-gray-500 mb-1">Deaths</p>
                      <p class="text-xl sm:text-2xl font-bold text-red-600">
                        {{ selectedReport.deaths_count || 0 }}
                      </p>
                    </div>
                    <div class="bg-orange-50 rounded-xl p-3 sm:p-4">
                      <p class="text-xs text-gray-500 mb-1">Injured</p>
                      <p class="text-xl sm:text-2xl font-bold text-orange-600">
                        {{ selectedReport.injured_count || 0 }}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3
                    class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 sm:mb-3"
                  >
                    Family Demographics
                  </h3>
                  <div class="grid grid-cols-2 gap-2 sm:gap-3">
                    <div class="bg-white border rounded-xl p-2 sm:p-3">
                      <p class="text-xs text-gray-500">Residents</p>
                      <p class="text-base sm:text-lg font-semibold text-gray-900">
                        {{ selectedReport.total_residents_count || 0 }}
                      </p>
                    </div>
                    <div class="bg-white border rounded-xl p-2 sm:p-3">
                      <p class="text-xs text-gray-500">Pregnant</p>
                      <p class="text-base sm:text-lg font-semibold text-pink-600">
                        {{ selectedReport.pregnant_women_count || 0 }}
                      </p>
                    </div>
                    <div class="bg-white border rounded-xl p-2 sm:p-3">
                      <p class="text-xs text-gray-500">Disabled</p>
                      <p class="text-base sm:text-lg font-semibold text-blue-600">
                        {{ selectedReport.disabled_persons_count || 0 }}
                      </p>
                    </div>
                    <div class="bg-white border rounded-xl p-2 sm:p-3">
                      <p class="text-xs text-gray-500">School</p>
                      <p class="text-base sm:text-lg font-semibold text-green-600">
                        {{ selectedReport.school_going_children_count || 0 }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Property Impact Section -->
            <div v-show="activeSection === 'property'" class="space-y-4 sm:space-y-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <!-- Home Damage -->
                <div v-if="selectedReport.is_home_impacted" class="space-y-3 sm:space-y-4">
                  <h3 class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Home Damage
                  </h3>
                  <div class="bg-white border rounded-xl p-3 sm:p-4">
                    <div
                      class="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3 sm:mb-4"
                    >
                      <span class="text-base sm:text-lg font-semibold text-gray-900"
                        >Damage Level</span
                      >
                      <span
                        :class="getDamageLevelClasses(selectedReport.home_damage_level)"
                        class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start xs:self-auto"
                      >
                        {{ formatDamageLevel(selectedReport.home_damage_level) }}
                      </span>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      {{ getDamageDescription(selectedReport.home_damage_level) }}
                    </p>

                    <div v-if="selectedReport.home_image_url" class="mt-3 sm:mt-4">
                      <p class="text-xs sm:text-sm font-medium text-gray-700 mb-2">Evidence</p>
                      <div @click="openImage(selectedReport.home_image_url)" class="relative group">
                        <img
                          :src="selectedReport.home_image_url"
                          alt="Home damage"
                          class="w-full h-40 sm:h-48 object-cover rounded-lg cursor-pointer"
                          @error="(e) => handleImageError(e, selectedReport.report_id, 'home')"
                        />
                        <div
                          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Shop Damage -->
                <div v-if="selectedReport.is_shop_impacted" class="space-y-3 sm:space-y-4">
                  <h3 class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Shop/Business Damage
                  </h3>
                  <div class="bg-white border rounded-xl p-3 sm:p-4">
                    <div
                      class="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3 sm:mb-4"
                    >
                      <span class="text-base sm:text-lg font-semibold text-gray-900"
                        >Damage Level</span
                      >
                      <span
                        :class="getDamageLevelClasses(selectedReport.shop_damage_level)"
                        class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start xs:self-auto"
                      >
                        {{ formatDamageLevel(selectedReport.shop_damage_level) }}
                      </span>
                    </div>
                    <p class="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                      {{ getDamageDescription(selectedReport.shop_damage_level) }}
                    </p>

                    <div
                      v-if="
                        selectedReport.shop_image_url ||
                        (selectedReport.shop_images && selectedReport.shop_images.length > 0)
                      "
                      class="mt-3 sm:mt-4"
                    >
                      <p class="text-xs sm:text-sm font-medium text-gray-700 mb-2">Evidence</p>
                      <div
                        @click="
                          openImage(selectedReport.shop_image_url || selectedReport.shop_images[0])
                        "
                        class="relative group"
                      >
                        <img
                          :src="selectedReport.shop_image_url || selectedReport.shop_images[0]"
                          alt="Shop damage"
                          class="w-full h-40 sm:h-48 object-cover rounded-lg cursor-pointer"
                          @error="(e) => handleImageError(e, selectedReport.report_id, 'shop')"
                        />
                        <div
                          class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg"
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Animal Impact -->
                <div v-if="selectedReport.are_animals_impacted" class="lg:col-span-2">
                  <h3
                    class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 sm:mb-4"
                  >
                    Animal Impact
                  </h3>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div class="bg-white border rounded-xl p-3 sm:p-4">
                      <h4 class="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">
                        Large Animals
                      </h4>
                      <div class="grid grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <p class="text-xs text-gray-500">Deaths</p>
                          <p class="text-base sm:text-lg font-semibold text-red-600">
                            {{ selectedReport.big_animals_death_count || 0 }}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500">Injured</p>
                          <p class="text-base sm:text-lg font-semibold text-orange-600">
                            {{ selectedReport.big_animals_injured_count || 0 }}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div class="bg-white border rounded-xl p-3 sm:p-4">
                      <h4 class="font-medium text-gray-700 mb-2 sm:mb-3 text-sm sm:text-base">
                        Small Animals
                      </h4>
                      <div class="grid grid-cols-2 gap-2 sm:gap-3">
                        <div>
                          <p class="text-xs text-gray-500">Deaths</p>
                          <p class="text-base sm:text-lg font-semibold text-red-600">
                            {{ selectedReport.small_animals_death_count || 0 }}
                          </p>
                        </div>
                        <div>
                          <p class="text-xs text-gray-500">Injured</p>
                          <p class="text-base sm:text-lg font-semibold text-orange-600">
                            {{ selectedReport.small_animals_injured_count || 0 }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="mt-3 sm:mt-4 bg-green-50 border border-green-100 rounded-xl p-3 sm:p-4"
                  >
                    <div class="flex items-center justify-between">
                      <div>
                        <p class="text-xs sm:text-sm font-medium text-gray-700">
                          Total Animal Impact
                        </p>
                        <p class="text-xs text-gray-500">
                          {{ totalAnimalDeaths }} deaths, {{ totalAnimalInjuries }} injured
                        </p>
                      </div>
                      <p class="text-lg sm:text-xl font-bold text-green-600">
                        {{ totalAnimalImpact }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Timeline Section - Simplified on mobile -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <h3
            class="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 sm:mb-4"
          >
            Report Timeline
          </h3>
          <div class="flex flex-col xs:flex-row items-start xs:items-center gap-2 xs:gap-4">
            <div class="flex items-center gap-2">
              <div class="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
              <span class="text-xs text-gray-500"
                >Created: {{ formatDate(selectedReport.created_at) }}</span
              >
            </div>
            <div class="flex items-center gap-2">
              <div
                class="w-2 h-2 rounded-full flex-shrink-0"
                :class="
                  selectedReport.verification_status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                "
              ></div>
              <span class="text-xs text-gray-500"
                >Updated:
                {{ formatDate(selectedReport.updated_at || selectedReport.created_at) }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else class="flex justify-center items-center py-12 sm:py-20">
        <div class="text-center">
          <div
            class="inline-block animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-3 border-gray-200 border-t-blue-600 mb-3 sm:mb-4"
          ></div>
          <p class="text-sm sm:text-base text-gray-500">Loading report details...</p>
        </div>
      </div>
    </div>

    <!-- Image Modal - Mobile optimized -->
    <div
      v-if="showImageModal"
      class="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-90 flex items-center justify-center p-2 sm:p-4"
      @click="closeImageModal"
    >
      <div class="relative max-w-4xl w-full" @click.stop>
        <button
          @click="closeImageModal"
          class="absolute text-black top-2 right-2 sm:top-4 sm:right-4 hover:text-gray-300 z-10"
        >
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img :src="selectedImage" alt="Damage evidence" class="w-full h-auto rounded-lg" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import useAdminStore from '../store/adminStore'
import { onMounted, ref, computed } from 'vue'

const store = useAdminStore()
const route = useRoute()
const selectedReport = ref({})
const loading = ref(true)
const activeSection = ref('personal')
const showImageModal = ref(false)
const selectedImage = ref('')

const generating = ref({})

const sections = [
  { id: 'personal', name: 'Personal' },
  { id: 'human', name: 'Human Impact' },
  { id: 'property', name: 'Property' },
]

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
  return emojiMap[type?.toLowerCase()] || '🌪️'
}

const formatDisasterType = (type) => {
  if (!type) return 'Unknown'
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const formatStatus = (status) => {
  if (!status) return 'Unknown'
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

const getStatusClasses = (status) => {
  const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium'
  switch (status?.toLowerCase()) {
    case 'verified':
      return `${baseClasses} bg-green-100 text-green-800`
    case 'pending':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'rejected':
      return `${baseClasses} bg-red-100 text-red-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const formatDamageLevel = (level) => {
  if (!level) return 'None'

  const damageLevelMap = {
    minor: 'Only water and silt',
    major: 'Minor',
    fully_destroyed: 'Fully Destroyed',
  }

  return (
    damageLevelMap[level?.toLowerCase()] ||
    level.charAt(0).toUpperCase() + level.slice(1).toLowerCase()
  )
}

const getDamageDescription = (level) => {
  const descriptions = {
    minor: 'Minor flooding - Water and silt accumulation only',
    major: 'Minor structural damage requiring repairs',
    fully_destroyed: 'Complete destruction - Structure uninhabitable',
  }
  return descriptions[level?.toLowerCase()] || 'Damage level unknown'
}

const getDamageLevelClasses = (level) => {
  const baseClasses = 'px-3 py-1 rounded-full text-sm font-medium'
  switch (level?.toLowerCase()) {
    case 'minor':
      return `${baseClasses} bg-yellow-100 text-yellow-800`
    case 'major':
      return `${baseClasses} bg-orange-100 text-orange-800`
    case 'fully_destroyed':
      return `${baseClasses} bg-red-100 text-red-800`
    default:
      return `${baseClasses} bg-gray-100 text-gray-800`
  }
}

const totalHumanImpact = computed(() => {
  return (selectedReport.value?.deaths_count || 0) + (selectedReport.value?.injured_count || 0)
})

const totalAnimalDeaths = computed(() => {
  return (
    (selectedReport.value?.big_animals_death_count || 0) +
    (selectedReport.value?.small_animals_death_count || 0)
  )
})

const totalAnimalInjuries = computed(() => {
  return (
    (selectedReport.value?.big_animals_injured_count || 0) +
    (selectedReport.value?.small_animals_injured_count || 0)
  )
})

const totalAnimalImpact = computed(() => {
  return totalAnimalDeaths.value + totalAnimalInjuries.value
})

const propertyImpact = computed(() => {
  const impacted = []
  if (selectedReport.value?.is_home_impacted) impacted.push('Home')
  if (selectedReport.value?.is_shop_impacted) impacted.push('Shop')
  if (selectedReport.value?.are_animals_impacted) impacted.push('Livestock')
  return impacted.length ? impacted.join(' + ') : 'None'
})

const openImage = (imageUrl) => {
  if (imageUrl) {
    selectedImage.value = imageUrl
    showImageModal.value = true
  }
}

const closeImageModal = () => {
  showImageModal.value = false
  selectedImage.value = ''
}

const handleImageError = (event, reportId, type) => {
  console.error(`Failed to load ${type} image for report ${reportId}`)
  event.target.src = '/placeholder-image.jpg' // Add a placeholder image
  event.target.onerror = null
}

const loadReportData = async () => {
  loading.value = true
  const reportId = Number(route.params.id)

  try {
    const response = await store.fetchSingleReport(reportId)
    selectedReport.value = response
    loading.value = false
  } catch (error) {
    console.error('Error loading report:', error)
    loading.value = false
  }
}

// open in maps
const openInMaps = (report) => {
  if (!report.location) return

  const coords = report.location.split(',').map((coord) => coord.trim())
  if (coords.length !== 2) return

  const lat = parseFloat(coords[0])
  const lng = parseFloat(coords[1])

  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    console.error('Invalid coordinates')
    return
  }

  const encodedUrl = encodeURI(`https://www.google.com/maps?q=${lat},${lng}`)
  window.open(encodedUrl, '_blank', 'noopener,noreferrer')
}
const saveAsPDF = async (reportId) => {
  // console.log('download report:', reportId)
  generating.value[reportId] = true
  try {
    await store.downloadReportInPDF(reportId)
  } catch (error) {
    console.log(error)
  } finally {
    generating.value[reportId] = false
  }
}

// Load data on mount
onMounted(() => {
  loadReportData()
})
</script>

<style scoped>
/* Add any custom styles here if needed */
</style>