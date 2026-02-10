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
    return { fetchAllReports, reports, fetchAdminAnalytics, analytics };

})
export default adminStore;