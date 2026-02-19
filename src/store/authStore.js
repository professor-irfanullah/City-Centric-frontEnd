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
        try {
            const response = await api.get('/api/auth/protected')
            userData.value = response.data
            return true
        } catch (error) {
            return false
        }
    }
    return { login, registerUser, userAuthStatus, userData, verifyEmailRegistration }
})