import api from '@/api/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAuthStore = defineStore('auth', () => {
    let userData = ref(null)
    const registerUser = async (name, father_name, email, cnic, contact, muhalla, village, tehsil, district, password) => {
        try {
            const response = await api.post('/api/auth/register', {
                name: name,
                father_name: father_name,
                email: email || null, // Send null if email is empty
                cnic: cnic,
                contact: contact,
                muhalla: muhalla,
                village: village, // Using muhalla as village
                tehsil: tehsil,
                district: district,
                password: password,
            })
            return response
        } catch (error) {
            throw error
        }
    }
    const verifyEmailRegistration = async (password, token) => {
        if (!password) throw new Error('Password is required for email verrification');
        if (!token) throw new Error('Token is required for email verrification');


        try {
            const response = await api.post('/api/auth/verify', {
                password: password,
                token: token
            })
            return response.data;
        } catch (error) {
            throw error
        }
    }
    const login = async (email, password) => {
        try {
            const response = await api.post('/api/auth/login', {
                email: email,
                password: password
            })
            return response
        } catch (error) {
            throw error
        }
    }
    const userAuthStatus = async () => {
        // 1. If we already have a user, don't call the API again
        if (userData.value) return true

        try {
            const response = await api.get('/api/auth/protected')
            userData.value = response.data
            return true
        } catch (error) {
            userData.value = null // Clear on failure
            return false
        }
    }
    const forgotPassword = async (email) => {
        try {
            const response = await api.post('/api/auth/forgot-password', {
                email: email
            })
            return response.data
        } catch (error) {
            throw error
        }
    }
    const reset_password = async (payload) => {
        try {
            const response = await api.post('/api/auth/reset-password', {
                token: payload.token,
                reset_password: payload.reset_password,
                email: payload.email
            })
            return response.data
        } catch (error) {
            throw error;
        }
    }
    return { login, registerUser, userAuthStatus, userData, verifyEmailRegistration, forgotPassword, reset_password }
})