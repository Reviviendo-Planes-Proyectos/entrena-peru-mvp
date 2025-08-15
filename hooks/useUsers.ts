"use client"

import { useState, useEffect } from 'react'
import { UserService, UserProfile, UserPreferences, UserStats } from '@/lib/services/users'
import { useAuth } from './useAuth'

export function useUsers() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      const activeUsers = await UserService.getActiveUsers()
      setUsers(activeUsers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo usuarios'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const searchUsers = async (searchTerm: string) => {
    try {
      setLoading(true)
      setError(null)
      const searchResults = await UserService.searchUsersByName(searchTerm)
      setUsers(searchResults)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error buscando usuarios'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true)
      setError(null)
      const userId = await UserService.createUserProfile(userData)
      
      // Actualizar la lista local
      const newUser = await UserService.getUserById(userId)
      if (newUser) {
        setUsers(prev => [newUser, ...prev])
      }
      
      return userId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creando usuario'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateUser = async (userId: string, updates: Partial<UserProfile>) => {
    try {
      setLoading(true)
      setError(null)
      await UserService.updateUserProfile(userId, updates)
      
      // Actualizar la lista local
      setUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, ...updates }
            : user
        )
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando usuario'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deactivateUser = async (userId: string) => {
    try {
      await UserService.deactivateUser(userId)
      // Remover de la lista local
      setUsers(prev => prev.filter(user => user.id !== userId))
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desactivando usuario'
      setError(errorMessage)
      throw err
    }
  }

  const activateUser = async (userId: string) => {
    try {
      await UserService.activateUser(userId)
      // Refrescar la lista
      await fetchUsers()
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error activando usuario'
      setError(errorMessage)
      throw err
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    fetchUsers,
    searchUsers,
    createUser,
    updateUser,
    deactivateUser,
    activateUser,
    setUsers,
    setError
  }
}

// Hook para obtener un usuario específico
export function useUser(userId?: string) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUser = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      setError(null)
      const userData = await UserService.getUserById(userId)
      setUser(userData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo usuario'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [userId])

  return {
    user,
    loading,
    error,
    refetch: fetchUser
  }
}

// Hook para el perfil del usuario actual
export function useCurrentUserProfile() {
  const { user: authUser } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!authUser?.uid) return
    
    try {
      setLoading(true)
      setError(null)
      const userProfile = await UserService.getUserByUID(authUser.uid)
      setProfile(userProfile)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo perfil'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile?.id) return
    
    try {
      setLoading(true)
      setError(null)
      await UserService.updateUserProfile(profile.id, updates)
      setProfile(prev => prev ? { ...prev, ...updates } : null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando perfil'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async (profileData: Omit<UserProfile, 'id' | 'uid' | 'createdAt' | 'updatedAt'>) => {
    if (!authUser?.uid || !authUser?.email) return
    
    try {
      setLoading(true)
      setError(null)
      const profileId = await UserService.createUserProfile({
        ...profileData,
        uid: authUser.uid,
        email: authUser.email
      })
      
      const newProfile = await UserService.getUserById(profileId)
      setProfile(newProfile)
      return profileId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creando perfil'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [authUser?.uid])

  return {
    profile,
    loading,
    error,
    updateProfile,
    createProfile,
    refetch: fetchProfile
  }
}

// Hook para manejar preferencias de usuario
export function useUserPreferences(userId?: string) {
  const [preferences, setPreferences] = useState<UserPreferences | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPreferences = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      setError(null)
      const userPreferences = await UserService.getUserPreferences(userId)
      setPreferences(userPreferences)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo preferencias'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updatePreferences = async (newPreferences: UserPreferences) => {
    if (!userId) return
    
    try {
      setLoading(true)
      setError(null)
      await UserService.saveUserPreferences(userId, newPreferences)
      setPreferences(newPreferences)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error guardando preferencias'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPreferences()
  }, [userId])

  return {
    preferences,
    loading,
    error,
    updatePreferences,
    refetch: fetchPreferences
  }
}

// Hook para estadísticas de usuario
export function useUserStats(userId?: string) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    if (!userId) return
    
    try {
      setLoading(true)
      setError(null)
      const userStats = await UserService.getUserStats(userId)
      setStats(userStats)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo estadísticas'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [userId])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

// Hook para buscar usuarios por email
export function useUserByEmail() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getUserByEmail = async (email: string) => {
    try {
      setLoading(true)
      setError(null)
      const user = await UserService.getUserByEmail(email)
      return user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error buscando usuario por email'
      setError(errorMessage)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getUserByEmail
  }
}