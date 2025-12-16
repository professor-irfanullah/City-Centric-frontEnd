import api from '@/api/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useReportStore = defineStore("report", () => {
    const reports = ref([])
    const addReport = async (payload) => {
        try {
            const response = await api.post('/api/user/post/report', payload)
            return response.data
        } catch (error) {
            throw error
        }
    }
    const fetchReports = async () => {
        try {
            const response = await api.get('/api/user/get/reports')
            reports.value = response.data
            return response.data
        } catch (error) {
            throw error
        }
    }
    return { addReport, fetchReports, reports }
})