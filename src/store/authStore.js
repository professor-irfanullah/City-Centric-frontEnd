import api from '@/api/axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'
export const useAuthStore = defineStore('auth', () => {
    let userData = ref(null)
    const registerUser = async (name, father_name, email, cnic, contact, muhalla, tehsil, district, password) => {
        try {
            const response = await api.post('/api/auth/register', {
                name: name,
                father_name: father_name,
                email: email || null, // Send null if email is empty
                cnic: cnic,
                contact: contact,
                muhalla: muhalla,
                village: muhalla, // Using muhalla as village
                tehsil: tehsil,
                district: district,
                password: password,
            })
            return response
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
    return { login, registerUser, userAuthStatus, userData }
})