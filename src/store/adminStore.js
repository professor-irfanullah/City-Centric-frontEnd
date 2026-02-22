// const { defineStore } = require("pinia");
import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/axios";

const adminStore = defineStore("adminReports", () => {
    const reports = ref([]);
    const analytics = ref({});
    const fetchAllReports = async () => {
        try {
            const response = await api.get('/api/admin/get/reports');

            reports.value = response.data.reports;
            return response.data.reports;
        } catch (error) {
            throw error;
        }
    };

    const fetchAdminAnalytics = async () => {
        try {
            const response = await api.get('/api/admin/get/analytics');
            analytics.value = response.data;
            return response.data;
        } catch (error) {
            throw error;
        }
    }
    const fetchSingleReport = async (reportId) => {
        try {
            const response = await api.get(`/api/admin/get/report?reportId=${reportId}`)
            return response.data;
        } catch (error) {
            throw error
        }
    }
    const downloadReportInPDF = async (reportId) => {
        try {
            const response = await api.get(`/api/admin/download-pdf?report_id=${reportId}`, {
                responseType: 'blob',
            })
            const blob = await response.data
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Report-${reportId}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            throw error
        }
    }
    return { fetchAllReports, reports, fetchAdminAnalytics, analytics, fetchSingleReport, downloadReportInPDF };

})
export default adminStore;