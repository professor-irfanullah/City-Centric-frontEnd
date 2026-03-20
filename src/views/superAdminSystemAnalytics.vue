<!-- SuperAdminOverview.vue -->
<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Back to Dashboard Link -->
      <div class="mb-6">
        <router-link
          to="/admin-dashboard"
          class="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
        >
          <svg
            class="w-4 h-4 mr-1 transform group-hover:-translate-x-0.5 transition-transform duration-200"
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
          Back to Dashboard
        </router-link>
      </div>
      <!-- Header with Invite Button -->
      <div class="mb-8 flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Admin Overview</h1>
          <p class="mt-2 text-sm text-gray-600">System administrators and invitation statistics</p>
        </div>

        <!-- Invite Button -->
        <button
          @click="goToInvitePage"
          class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <svg class="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Invite New Admin
        </button>
      </div>

      <!-- Stats Cards (same as before) -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <p class="text-sm font-medium text-gray-600">Total Admins</p>
          <p class="text-2xl font-semibold text-gray-900">{{ stats.total_admins || 0 }}</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <p class="text-sm font-medium text-gray-600">Pending Invites</p>
          <p class="text-2xl font-semibold text-yellow-600">{{ stats.pending_invites || 0 }}</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <p class="text-sm font-medium text-gray-600">Accepted</p>
          <p class="text-2xl font-semibold text-green-600">{{ stats.accepted_invites || 0 }}</p>
        </div>

        <div class="bg-white rounded-lg shadow-sm p-6">
          <p class="text-sm font-medium text-gray-600">Expired</p>
          <p class="text-2xl font-semibold text-red-600">{{ stats.expired_invites || 0 }}</p>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="mb-6 rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-red-800">{{ error }}</p>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center py-12">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>

      <!-- Admins Table -->
      <div v-else class="bg-white shadow-sm rounded-lg overflow-x-auto">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-medium text-gray-900">Administrators</h2>
        </div>

        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                created
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Joined
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="admin in admins" :key="admin.email" class="hover:bg-gray-50">
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ admin.name }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ admin.email }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    admin.role === 'super_admin'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-blue-100 text-blue-800',
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  ]"
                >
                  {{ admin.role === 'super_admin' ? 'Super Admin' : 'Admin' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(admin.created_at) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{
                  admin.created_at < admin.joined_at
                    ? formatDate(admin.joined_at)
                    : 'Not yet joined'
                }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    admin.created_at > admin.joined_at
                      ? 'bg-red-100 text-red-800'
                      : admin.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800',
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                  ]"
                >
                  {{
                    admin.status === 'used'
                      ? 'Active'
                      : formatDate(admin.created_at) < formatDate(admin.joined_at)
                      ? 'Pending'
                      : 'Expired'
                  }}
                </span>
              </td>
            </tr>
            <tr v-if="!admins.length">
              <td colspan="5" class="px-6 py-8 text-center text-sm text-gray-500">
                No administrators found
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import adminStore from '../store/adminStore'
import { useRouter } from 'vue-router'

const store = adminStore()
const router = useRouter()

// State
const loading = ref(false)
const error = ref(null)
const stats = ref({})
const admins = ref([])

// Navigation
const goToInvitePage = () => {
  // Navigate to the invite admin page
  // Update this path to match your route
  router.push('/super-admin/invite-system-admin')
  // or if using named route
  // router.push({ name: 'InviteAdmin' })
}

// Mock API call matching your SQL query structure
const fetchData = async () => {
  loading.value = true
  error.value = null

  try {
    // Simulate API response based on your SQL query
    const response = await store.getAllAdminsInfo()

    stats.value = response
    admins.value = response.admins
  } catch (err) {
    error.value = 'Failed to load admin data'
    console.error(err.response.data.msg)
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Not joined yet'
  return new Date(dateString).toLocaleTimeString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// Load data on mount
onMounted(() => {
  fetchData()
})
</script>