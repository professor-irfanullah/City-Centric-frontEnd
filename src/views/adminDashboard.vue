<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Header with Navigation Tabs -->
    <div class="mb-8">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
        <div class="flex flex-col xs:flex-row xs:items-center gap-3">
          <h1 class="text-xl md:text-2xl lg:text-4xl font-bold text-gray-900">
            Disaster Response Dashboard
          </h1>
          <router-link
            to="/admin/reports"
            class="inline-flex items-center justify-center xs:justify-start px-4 py-2.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105 w-full xs:w-auto"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>View All Reports</span>
          </router-link>
        </div>

        <!-- Time - aligned right on mobile -->
        <div class="text-sm text-gray-500 text-right">
          {{ currentTime }}
        </div>
      </div>

      <!-- Description paragraph - responsive text -->
      <p class="text-sm sm:text-base text-gray-600 mt-1 mb-4">
        Comprehensive disaster impact analysis across all districts
      </p>

      <!-- Navigation Tabs - scrollable on mobile -->
      <div class="overflow-x-auto pb-1 -mx-2 px-2">
        <div class="flex space-x-1 border-b min-w-max">
          <button
            @click="activeTab = 'global'"
            :class="[
              'px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm rounded-t-lg transition-colors whitespace-nowrap',
              activeTab === 'global'
                ? 'bg-white border border-gray-300 border-b-0 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            ]"
          >
            🌍 Global Overview
          </button>
          <button
            @click="activeTab = 'districts'"
            :class="[
              'px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm rounded-t-lg transition-colors whitespace-nowrap',
              activeTab === 'districts'
                ? 'bg-white border border-gray-300 border-b-0 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            ]"
          >
            🏙️ Districts
          </button>
          <button
            @click="activeTab = 'tehsils'"
            :class="[
              'px-3 sm:px-4 py-2 font-medium text-xs sm:text-sm rounded-t-lg transition-colors whitespace-nowrap',
              activeTab === 'tehsils'
                ? 'bg-white border border-gray-300 border-b-0 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100',
            ]"
          >
            🏘️ Tehsils
          </button>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Loading disaster data...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-lg p-6">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading data</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Global Overview Tab -->
    <div v-else-if="activeTab === 'global' && dashboardData.length > 0">
      <!-- Global Stats -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">🌍 Global Disaster Overview</h2>
        <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div class="bg-white rounded-lg shadow p-5">
            <div class="text-sm text-gray-500 mb-1">Total Reports</div>
            <div class="text-3xl font-bold text-gray-900">
              {{ globalStats.totalReports.toLocaleString() }}
            </div>
            <div class="text-sm text-gray-500 mt-1">
              Across {{ dashboardData.length }} districts
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-5">
            <div class="text-sm text-gray-500 mb-1">Total Deaths</div>
            <div class="text-3xl font-bold text-red-600">
              {{ globalStats.totalDeaths.toLocaleString() }}
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-5">
            <div class="text-sm text-gray-500 mb-1">Total Injuries</div>
            <div class="text-3xl font-bold text-orange-600">
              {{ globalStats.totalInjuries.toLocaleString() }}
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-5">
            <div class="text-sm text-gray-500 mb-1">Total Residents</div>
            <div class="text-3xl font-bold text-purple-600">
              {{ globalStats.totalResidents.toLocaleString() }}
            </div>
          </div>
          <div class="bg-white rounded-lg shadow p-5">
            <div class="text-sm text-gray-500 mb-1">Total Animals</div>
            <div class="text-3xl font-bold text-green-600">
              {{ globalStats.totalAnimals.toLocaleString() }}
            </div>
            <div class="text-sm text-gray-500 mt-1">
              {{ globalStats.totalAnimalDeaths.toLocaleString() }}D •
              {{ globalStats.totalAnimalInjuries }}I
            </div>
          </div>
        </div>
      </div>

      <!-- Global Disaster Distribution -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">📊 Global Disaster Distribution</h2>
        <div class="bg-white rounded-lg shadow p-6">
          <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div v-for="type in disasterTypes" :key="type.key" class="text-center">
              <div class="text-2xl font-bold" :class="type.colorClass">
                {{ globalDisasterDistribution[type.key].toFixed(1) }}%
              </div>
              <div class="text-sm text-gray-600 mt-1">{{ type.label }}</div>
              <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full"
                  :class="type.bgColorClass"
                  :style="{ width: globalDisasterDistribution[type.key] + '%' }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Worst Affected District -->
      <div class="mb-8" v-if="worstAffectedDistrict">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">⚠️ Worst Affected District</h2>
        <div class="bg-red-50 border border-red-200 rounded-xl p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  class="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.768 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4">
              <h3 class="text-lg font-bold text-red-900">
                {{ worstAffectedDistrict.district_name }}
                <span class="text-sm font-normal text-red-700 ml-2">
                  Impact Score:
                  {{ parseInt(worstAffectedDistrict.district_weighted_impact).toLocaleString() }}
                </span>
              </h3>
              <p class="text-red-800 mt-1">
                {{ parseInt(worstAffectedDistrict.district_total_reports).toLocaleString() }}
                reports •
                {{ parseInt(worstAffectedDistrict.district_total_deaths).toLocaleString() }} deaths
                •
                {{ parseInt(worstAffectedDistrict.district_total_injuries).toLocaleString() }}
                injuries
              </p>
              <div class="flex flex-wrap gap-3 mt-2">
                <span
                  v-for="type in disasterTypes"
                  :key="type.key"
                  class="text-sm"
                  :class="type.colorClass"
                >
                  {{ type.icon }} {{ worstAffectedDistrict['pct_' + type.key] }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- District Comparison Table -->
      <div class="mb-8">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">📈 District Comparison</h2>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    District
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reports
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Disaster Distribution
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Human Impact
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Animal Impact
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Impact Score
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="district in dashboardData" :key="district.district_name">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">
                      {{ district.district_name }}
                    </div>
                    <div class="text-xs text-gray-500">
                      {{ district.tehsil_breakdown?.length || 0 }} tehsils
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 font-bold">
                      {{ parseInt(district.district_total_reports).toLocaleString() }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="type in disasterTypes"
                        :key="type.key"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        :class="[type.bgColorClass, type.textColorClass]"
                        :title="type.label + ': ' + district['pct_' + type.key] + '%'"
                      >
                        {{ type.icon }} {{ district['pct_' + type.key] }}%
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <div class="text-red-600 font-bold">
                        {{ parseInt(district.district_total_deaths).toLocaleString() }} deaths
                      </div>
                      <div class="text-orange-600">
                        {{ parseInt(district.district_total_injuries).toLocaleString() }} injuries
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <div class="text-gray-900 font-bold">
                        {{ parseInt(district.district_total_animal_deaths).toLocaleString() }}
                        deaths
                      </div>
                      <div class="text-gray-600">
                        {{ parseInt(district.district_total_animal_injuries).toLocaleString() }}
                        injuries
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 font-bold">
                      {{ parseInt(district.district_weighted_impact).toLocaleString() }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      @click="viewDistrictDetails(district)"
                      class="text-blue-600 hover:text-blue-900"
                    >
                      View Details →
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Districts Tab -->
    <div v-else-if="activeTab === 'districts' && dashboardData.length > 0">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">🏙️ District-Level Analysis</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="district in dashboardData"
            :key="district.district_name"
            class="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            :class="{
              'ring-2 ring-blue-500': selectedDistrict?.district_name === district.district_name,
            }"
          >
            <div class="p-6">
              <!-- District Header -->
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h3 class="text-xl font-bold text-gray-900">{{ district.district_name }}</h3>
                  <div class="flex items-center mt-1">
                    <span class="text-sm text-gray-500">
                      {{ district.tehsil_breakdown?.length || 0 }} tehsils
                    </span>
                  </div>
                </div>
                <div class="text-right">
                  <div class="text-2xl font-bold text-gray-900">
                    {{ parseInt(district.district_total_reports).toLocaleString() }}
                  </div>
                  <div class="text-sm text-gray-500">reports</div>
                </div>
              </div>

              <!-- Disaster Type Distribution -->
              <div class="mb-4">
                <div class="text-sm font-medium text-gray-700 mb-2">Disaster Distribution</div>
                <div class="flex h-2 rounded-full overflow-hidden mb-1">
                  <div
                    v-for="type in disasterTypes"
                    :key="type.key"
                    :class="type.bgColorClass"
                    :style="{ width: district['pct_' + type.key] + '%' }"
                    :title="type.label + ': ' + district['pct_' + type.key] + '%'"
                  ></div>
                </div>
                <div class="flex justify-between text-xs text-gray-600">
                  <span v-for="type in disasterTypes" :key="type.key">
                    {{ type.icon }} {{ district['pct_' + type.key] }}%
                  </span>
                </div>
              </div>

              <!-- Key Metrics -->
              <div class="grid grid-cols-2 gap-3 mb-4">
                <div class="text-center">
                  <div class="text-lg font-bold text-red-600">
                    {{ parseInt(district.district_total_deaths).toLocaleString() }}
                  </div>
                  <div class="text-xs text-gray-500">Deaths</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-orange-600">
                    {{ parseInt(district.district_total_injuries).toLocaleString() }}
                  </div>
                  <div class="text-xs text-gray-500">Injuries</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-purple-600">
                    {{ parseInt(district.district_total_residents).toLocaleString() }}
                  </div>
                  <div class="text-xs text-gray-500">Residents</div>
                </div>
                <div class="text-center">
                  <div class="text-lg font-bold text-green-600">
                    {{
                      (
                        parseInt(district.district_total_animal_deaths) +
                        parseInt(district.district_total_animal_injuries)
                      ).toLocaleString()
                    }}
                  </div>
                  <div class="text-xs text-gray-500">Animals</div>
                </div>
              </div>

              <!-- Action Button -->
              <button
                @click="viewDistrictDetails(district)"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                View Detailed Analysis
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- District Details View -->
      <div v-if="selectedDistrict" class="mt-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-lg font-semibold text-gray-800">
            📊 {{ selectedDistrict.district_name }} District Details
          </h2>
          <button @click="selectedDistrict = null" class="text-gray-500 hover:text-gray-700">
            ← Back to all districts
          </button>
        </div>

        <!-- District Summary -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div class="bg-blue-50 rounded-lg p-5">
            <div class="text-sm text-blue-700 mb-1">Human Impact</div>
            <div class="text-2xl font-bold text-blue-900">
              {{ parseInt(selectedDistrict.district_total_deaths).toLocaleString() }} deaths
            </div>
            <div class="text-sm text-blue-600">
              {{ parseInt(selectedDistrict.district_total_injuries).toLocaleString() }} injuries
            </div>
            <div class="text-xs text-blue-500 mt-2">
              {{ parseInt(selectedDistrict.district_total_residents).toLocaleString() }} residents
              affected
            </div>
          </div>
          <div class="bg-green-50 rounded-lg p-5">
            <div class="text-sm text-green-700 mb-1">Animal Impact</div>
            <div class="text-2xl font-bold text-green-900">
              {{ parseInt(selectedDistrict.district_total_animal_deaths).toLocaleString() }} deaths
            </div>
            <div class="text-sm text-green-600">
              {{ parseInt(selectedDistrict.district_total_animal_injuries).toLocaleString() }}
              injuries
            </div>
          </div>
          <div class="bg-purple-50 rounded-lg p-5">
            <div class="text-sm text-purple-700 mb-1">Vulnerable Groups</div>
            <div class="text-lg font-bold text-purple-900">
              {{ parseInt(selectedDistrict.district_total_pregnant).toLocaleString() }} pregnant
            </div>
            <div class="text-sm text-purple-600">
              {{ parseInt(selectedDistrict.district_total_school_kids).toLocaleString() }} children
            </div>
          </div>
        </div>

        <!-- Tehsil Breakdown -->
        <h3 class="text-md font-semibold text-gray-800 mb-4">🏘️ Tehsil Breakdown</h3>
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tehsil
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reports
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Disaster Mix
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Homes (F/M/W)
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Shops (F/M/W)
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Human Impact
                  </th>
                  <th
                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Animal Impact
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="tehsil in selectedDistrict.tehsil_breakdown" :key="tehsil.tehsil_name">
                  <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ tehsil.tehsil_name }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900 font-bold">
                    {{ tehsil.total_reports.toLocaleString() }}
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="flex flex-col space-y-1">
                      <div class="flex items-center" v-for="type in disasterTypes" :key="type.key">
                        <div class="w-16 text-xs" :class="type.colorClass">
                          {{ type.icon }} {{ tehsil.disaster_mix[type.key] }}
                        </div>
                        <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            class="h-full rounded-full"
                            :class="type.bgColorClass"
                            :style="{
                              width:
                                (tehsil.disaster_mix[type.key] / tehsil.total_reports) * 100 + '%',
                            }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {{ tehsil.homes_impacted.toLocaleString() }}
                    <div class="text-xs text-gray-500">
                      ({{ tehsil.homes_fully_destroyed }}F/{{ tehsil.homes_major }}M/{{
                        tehsil.homes_minor
                      }}m)
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {{ tehsil.shops_impacted.toLocaleString() }}
                    <div class="text-xs text-gray-500">
                      ({{ tehsil.shops_fully_destroyed }}F/{{ tehsil.shops_major }}M/{{
                        tehsil.shops_minor
                      }}m)
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="text-sm">
                      <div class="text-red-600 font-bold">
                        {{ tehsil.human_deaths.toLocaleString() }} deaths
                      </div>
                      <div class="text-orange-600">
                        {{ tehsil.human_injuries.toLocaleString() }} injuries
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 whitespace-nowrap">
                    <div class="text-sm">
                      <div class="text-gray-900 font-bold">
                        {{ tehsil.animal_deaths_total.toLocaleString() }} deaths
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ tehsil.animal_deaths_big }}B • {{ tehsil.animal_deaths_small }}S
                      </div>
                      <div class="text-gray-600 mt-1">
                        {{ tehsil.animal_injuries_total.toLocaleString() }} injuries
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ tehsil.animal_injuries_big }}B • {{ tehsil.animal_injuries_small }}S
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Tehsils Tab -->
    <div v-else-if="activeTab === 'tehsils' && dashboardData.length > 0">
      <div class="mb-6">
        <h2 class="text-lg font-semibold text-gray-800 mb-4">🏘️ Tehsil-Level Details</h2>

        <!-- Filters -->
        <div class="bg-white rounded-lg shadow p-4 mb-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Filter by District</label>
              <select
                v-model="selectedDistrictFilter"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Districts</option>
                <option
                  v-for="district in dashboardData"
                  :key="district.district_name"
                  :value="district.district_name"
                >
                  {{ district.district_name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                v-model="tehsilSortBy"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="reports">Total Reports</option>
                <option value="deaths">Human Deaths</option>
                <option value="homes">Homes Impacted</option>
                <option value="animal_deaths">Animal Deaths</option>
                <option value="disaster_mix">Disaster Incidents</option>
              </select>
            </div>
            <div class="flex items-end">
              <div class="text-sm text-gray-600">
                Showing {{ filteredTehsils.length }} tehsils
                <span v-if="selectedDistrictFilter"> in {{ selectedDistrictFilter }} </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tehsils Table -->
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Tehsil
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    District
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reports
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Disaster Types
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Human Impact
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Property Damage
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Animal Impact
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="tehsil in filteredTehsils"
                  :key="tehsil.district_name + '-' + tehsil.tehsil_name"
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ tehsil.tehsil_name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">{{ tehsil.district_name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 font-bold">
                      {{ tehsil.total_reports.toLocaleString() }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex flex-col space-y-1">
                      <div v-for="type in disasterTypes" :key="type.key" class="flex items-center">
                        <div class="w-16 text-xs" :class="type.colorClass">
                          {{ type.icon }} {{ tehsil.disaster_mix[type.key] }}
                        </div>
                        <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            class="h-full rounded-full"
                            :class="type.bgColorClass"
                            :style="{
                              width:
                                (tehsil.disaster_mix[type.key] / tehsil.total_reports) * 100 + '%',
                            }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <div class="text-red-600 font-bold">
                        {{ tehsil.human_deaths.toLocaleString() }} deaths
                      </div>
                      <div class="text-orange-600">
                        {{ tehsil.human_injuries.toLocaleString() }} injuries
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <div class="font-bold text-gray-900">
                        {{ tehsil.homes_impacted.toLocaleString() }} homes
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ tehsil.homes_fully_destroyed }}F • {{ tehsil.homes_major }}M •
                        {{ tehsil.homes_minor }}W
                      </div>
                      <div class="font-bold text-gray-900 mt-1">
                        {{ tehsil.shops_impacted.toLocaleString() }} shops
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ tehsil.shops_fully_destroyed }}F • {{ tehsil.shops_major }}M •
                        {{ tehsil.shops_minor }}W
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm">
                      <div class="font-bold text-gray-900">
                        {{ tehsil.animal_deaths_total.toLocaleString() }} deaths
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ tehsil.animal_deaths_big }}B • {{ tehsil.animal_deaths_small }}S
                      </div>
                      <div class="font-bold text-gray-900 mt-1">
                        {{ tehsil.animal_injuries_total.toLocaleString() }} injuries
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ tehsil.animal_injuries_big }}B • {{ tehsil.animal_injuries_small }}S
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Empty State -->
        <div
          v-if="filteredTehsils.length === 0"
          class="text-center py-12 bg-white rounded-lg shadow"
        >
          <div class="text-gray-400">
            <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No tehsils found</h3>
            <p class="mt-1 text-sm text-gray-500">Try changing your filters</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="text-gray-400">
        <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No data available</h3>
        <p class="mt-1 text-sm text-gray-500">Try refreshing the page or check your connection.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import adminStore from '@/store/adminStore'
import { ref, computed, onMounted } from 'vue'
const store = adminStore()
// State
const dashboardData = ref([])
const loading = ref(true)
const error = ref(null)
const activeTab = ref('global')
const selectedDistrict = ref(null)
const selectedDistrictFilter = ref('')
const tehsilSortBy = ref('reports')
const currentTime = ref('')

// Disaster Types Configuration
const disasterTypes = [
  {
    key: 'floods',
    label: 'Floods',
    icon: '🌊',
    colorClass: 'text-blue-600',
    bgColorClass: 'bg-blue-500',
    textColorClass: 'text-blue-800',
  },
  {
    key: 'fires',
    label: 'Fires',
    icon: '🔥',
    colorClass: 'text-orange-600',
    bgColorClass: 'bg-orange-500',
    textColorClass: 'text-orange-800',
  },
  {
    key: 'landslides',
    label: 'Landslides',
    icon: '⛰️',
    colorClass: 'text-gray-700',
    bgColorClass: 'bg-gray-600',
    textColorClass: 'text-gray-800',
  },
  {
    key: 'earthquakes',
    label: 'Earthquakes',
    icon: '🌍',
    colorClass: 'text-purple-600',
    bgColorClass: 'bg-purple-500',
    textColorClass: 'text-purple-800',
  },
  {
    key: 'others',
    label: 'Others',
    icon: '📦',
    colorClass: 'text-gray-500',
    bgColorClass: 'bg-gray-400',
    textColorClass: 'text-gray-700',
  },
]

// Fetch data
const fetchDashboardData = async () => {
  try {
    loading.value = true
    // In production, replace with your actual API call
    // const response = await fetch('/api/analytics')
    // dashboardData.value = await response.json()

    // Using the provided data structure
    dashboardData.value = store?.analytics ?? []

    // Update current time
    const now = new Date()
    currentTime.value =
      now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }) +
      ' • ' +
      now.toLocaleDateString()
  } catch (err) {
    error.value = err.message || 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
}

// Computed: Global Stats
const globalStats = computed(() => {
  if (dashboardData.value.length === 0) {
    return {
      totalReports: 0,
      totalDeaths: 0,
      totalInjuries: 0,
      totalResidents: 0,
      totalAnimals: 0,
      totalAnimalDeaths: 0,
      totalAnimalInjuries: 0,
    }
  }

  // Take global stats from first district
  const firstDistrict = dashboardData.value[0]
  return {
    totalReports: parseInt(firstDistrict.global_total_reports),
    totalDeaths: parseInt(firstDistrict.global_total_deaths),
    totalInjuries: parseInt(firstDistrict.global_total_injuries),
    totalResidents: parseInt(firstDistrict.global_total_residents),
    totalAnimals:
      parseInt(firstDistrict.global_total_animals_death_count) +
      parseInt(firstDistrict.global_total_animals_injured_count),
    totalAnimalDeaths: parseInt(firstDistrict.global_total_animals_death_count),
    totalAnimalInjuries: parseInt(firstDistrict.global_total_animals_injured_count),
  }
})

// Computed: Global Disaster Distribution
const globalDisasterDistribution = computed(() => {
  const distribution = {
    floods: 0,
    fires: 0,
    landslides: 0,
    earthquakes: 0,
    others: 0,
  }

  if (dashboardData.value.length === 0) return distribution

  // Calculate weighted average based on district reports
  let totalWeight = 0
  dashboardData.value.forEach((district) => {
    const weight = parseInt(district.district_total_reports)
    totalWeight += weight

    disasterTypes.forEach((type) => {
      distribution[type.key] += (parseFloat(district['pct_' + type.key]) || 0) * weight
    })
  })

  // Convert to percentages
  disasterTypes.forEach((type) => {
    distribution[type.key] = totalWeight > 0 ? distribution[type.key] / totalWeight : 0
  })

  return distribution
})

// Computed: Worst Affected District
const worstAffectedDistrict = computed(() => {
  if (dashboardData.value.length === 0) return null

  return dashboardData.value.reduce((worst, current) => {
    const currentImpact = parseInt(current.district_weighted_impact)
    const worstImpact = parseInt(worst.district_weighted_impact)
    return currentImpact > worstImpact ? current : worst
  }, dashboardData.value[0])
})

// Computed: All Tehsils (flattened)
const allTehsils = computed(() => {
  const tehsils = []
  dashboardData.value.forEach((district) => {
    district.tehsil_breakdown?.forEach((tehsil) => {
      tehsils.push({
        ...tehsil,
        district_name: district.district_name,
      })
    })
  })
  return tehsils
})

// Computed: Filtered Tehsils
const filteredTehsils = computed(() => {
  let tehsils = [...allTehsils.value]

  // Filter by district
  if (selectedDistrictFilter.value) {
    tehsils = tehsils.filter((t) => t.district_name === selectedDistrictFilter.value)
  }

  // Sort tehsils
  tehsils.sort((a, b) => {
    switch (tehsilSortBy.value) {
      case 'reports':
        return b.total_reports - a.total_reports
      case 'deaths':
        return b.human_deaths - a.human_deaths
      case 'homes':
        return b.homes_impacted - a.homes_impacted
      case 'animal_deaths':
        return b.animal_deaths_total - a.animal_deaths_total
      case 'disaster_mix':
        const aDisasters = disasterTypes.reduce((sum, type) => sum + a.disaster_mix[type.key], 0)
        const bDisasters = disasterTypes.reduce((sum, type) => sum + b.disaster_mix[type.key], 0)
        return bDisasters - aDisasters
      default:
        return b.total_reports - a.total_reports
    }
  })

  return tehsils
})

// Methods
const viewDistrictDetails = (district) => {
  selectedDistrict.value = district
  activeTab.value = 'districts'
}

// Initialize
onMounted(async () => {
  await store.fetchAdminAnalytics()
  fetchDashboardData()
  // Update time every minute
  setInterval(() => {
    const now = new Date()
    currentTime.value =
      now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }) +
      ' • ' +
      now.toLocaleDateString()
  }, 60000)
})
</script>

<style scoped>
/* Card hover effects */
.bg-white {
  transition: all 0.2s ease;
}

.bg-white:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Table styling */
table {
  border-collapse: separate;
  border-spacing: 0;
}

thead th {
  position: sticky;
  top: 0;
  background-color: #f9fafb;
  z-index: 10;
}

tbody tr:hover {
  background-color: #f9fafb;
}

/* Responsive design */
@media (max-width: 768px) {
  .grid {
    gap: 1rem;
  }

  .p-5,
  .p-6 {
    padding: 1rem;
  }

  .text-3xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }

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
}

/* Animation for tab switching */
.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

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

/* Progress bar animations */
.bg-blue-500,
.bg-orange-500,
.bg-gray-600,
.bg-purple-500,
.bg-gray-400 {
  transition: width 0.5s ease-in-out;
}
</style>