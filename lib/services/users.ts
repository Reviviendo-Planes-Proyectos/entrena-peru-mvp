"use client"

import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Tipos de datos para usuarios/clientes
export interface UserProfile {
  id?: string
  uid: string // Firebase Auth UID
  email: string
  firstName: string
  lastName: string
  gmailDisplayName?: string
  photoURL?: string
  phone?: string
  age?: number
  dateOfBirth?: Date
  gender?: 'male' | 'female' | 'other'
  address?: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  fitnessGoals?: string[]
  medicalConditions?: string[]
  preferredTrainingTime?: 'morning' | 'afternoon' | 'evening'
  fitnessLevel?: string
  avatar?: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface UserPreferences {
  notifications: {
    email: boolean
    sms: boolean
    push: boolean
  }
  privacy: {
    showProfile: boolean
    showProgress: boolean
  }
  language: string
  timezone: string
}

export interface UserStats {
  totalBookings: number
  completedSessions: number
  totalHoursTrained: number
  favoriteTrainers: string[]
  joinDate: Date
  lastActivity: Date
}

// Servicios para usuarios
export class UserService {
  private static usersCollection = 'users'
  private static preferencesCollection = 'userPreferences'

  // Crear perfil de usuario
  static async createUserProfile(profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      // Verificar si ya existe un usuario con este UID
      const existingUser = await this.getUserByUID(profile.uid)
      if (existingUser) {
        console.log('Usuario ya existe, actualizando información:', existingUser.id)
        // Actualizar el usuario existente con la nueva información
        await this.updateUserProfile(existingUser.id!, profile)
        return existingUser.id!
      }

      // Si no existe, crear nuevo usuario
      const docRef = await addDoc(collection(db, this.usersCollection), {
        ...profile,
        dateOfBirth: profile.dateOfBirth ? Timestamp.fromDate(profile.dateOfBirth) : null,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      })
      return docRef.id
    } catch (error) {
      console.error('Error creando perfil de usuario:', error)
      throw error
    }
  }

  // Obtener perfil de usuario por UID de Firebase Auth
  static async getUserByUID(uid: string): Promise<UserProfile | null> {
    try {
      const q = query(
        collection(db, this.usersCollection),
        where('uid', '==', uid)
      )
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as UserProfile
      }
      return null
    } catch (error) {
      console.error('Error obteniendo usuario por UID:', error)
      throw error
    }
  }

  // Obtener perfil de usuario por ID
  static async getUserById(id: string): Promise<UserProfile | null> {
    try {
      const docRef = doc(db, this.usersCollection, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          dateOfBirth: data.dateOfBirth?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as UserProfile
      }
      return null
    } catch (error) {
      console.error('Error obteniendo usuario:', error)
      throw error
    }
  }

  // Obtener perfil de usuario por email
  static async getUserByEmail(email: string): Promise<UserProfile | null> {
    try {
      const q = query(
        collection(db, this.usersCollection),
        where('email', '==', email)
      )
      const querySnapshot = await getDocs(q)
      
      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as UserProfile
      }
      return null
    } catch (error) {
      console.error('Error obteniendo usuario por email:', error)
      throw error
    }
  }

  // Actualizar perfil de usuario
  static async updateUserProfile(id: string, updates: Partial<UserProfile>): Promise<void> {
    try {
      const docRef = doc(db, this.usersCollection, id)
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      }
      
      // Convertir fecha de nacimiento si está presente
      if (updates.dateOfBirth) {
        updateData.dateOfBirth = Timestamp.fromDate(updates.dateOfBirth)
      }
      
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error actualizando perfil de usuario:', error)
      throw error
    }
  }

  // Desactivar usuario
  static async deactivateUser(id: string): Promise<void> {
    try {
      await this.updateUserProfile(id, { isActive: false })
    } catch (error) {
      console.error('Error desactivando usuario:', error)
      throw error
    }
  }

  // Activar usuario
  static async activateUser(id: string): Promise<void> {
    try {
      await this.updateUserProfile(id, { isActive: true })
    } catch (error) {
      console.error('Error activando usuario:', error)
      throw error
    }
  }

  // Obtener todos los usuarios activos
  static async getActiveUsers(): Promise<UserProfile[]> {
    try {
      const q = query(
        collection(db, this.usersCollection),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          dateOfBirth: data.dateOfBirth?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as UserProfile
      })
    } catch (error) {
      console.error('Error obteniendo usuarios activos:', error)
      throw error
    }
  }

  // Buscar usuarios por nombre
  static async searchUsersByName(searchTerm: string): Promise<UserProfile[]> {
    try {
      // Nota: Firestore no soporta búsqueda de texto completo nativamente
      // Esta es una implementación básica que busca por firstName y lastName
      const users = await this.getActiveUsers()
      const searchLower = searchTerm.toLowerCase()
      
      return users.filter(user => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower)
      )
    } catch (error) {
      console.error('Error buscando usuarios:', error)
      throw error
    }
  }

  // Guardar preferencias de usuario
  static async saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
    try {
      const docRef = doc(db, this.preferencesCollection, userId)
      await updateDoc(docRef, {
        ...preferences,
        updatedAt: Timestamp.fromDate(new Date())
      })
    } catch (error) {
      // Si el documento no existe, lo creamos
      try {
        await addDoc(collection(db, this.preferencesCollection), {
          userId,
          ...preferences,
          createdAt: Timestamp.fromDate(new Date()),
          updatedAt: Timestamp.fromDate(new Date())
        })
      } catch (createError) {
        console.error('Error guardando preferencias de usuario:', createError)
        throw createError
      }
    }
  }

  // Obtener preferencias de usuario
  static async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const docRef = doc(db, this.preferencesCollection, userId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          notifications: data.notifications,
          privacy: data.privacy,
          language: data.language,
          timezone: data.timezone
        } as UserPreferences
      }
      
      // Retornar preferencias por defecto si no existen
      return {
        notifications: {
          email: true,
          sms: false,
          push: true
        },
        privacy: {
          showProfile: true,
          showProgress: false
        },
        language: 'es',
        timezone: 'America/Lima'
      }
    } catch (error) {
      console.error('Error obteniendo preferencias de usuario:', error)
      throw error
    }
  }

  // Obtener estadísticas de usuario
  static async getUserStats(userId: string): Promise<UserStats> {
    try {
      // Importar BookingService para obtener estadísticas
      const { BookingService } = await import('./bookings')
      
      const user = await this.getUserById(userId)
      if (!user) {
        throw new Error('Usuario no encontrado')
      }
      
      const bookings = await BookingService.getBookingsByClient(userId)
      const completedBookings = bookings.filter(b => b.status === 'completed')
      
      const stats: UserStats = {
        totalBookings: bookings.length,
        completedSessions: completedBookings.length,
        totalHoursTrained: completedBookings.reduce((total, booking) => total + booking.duration, 0),
        favoriteTrainers: [...new Set(completedBookings.map(b => b.trainerId))],
        joinDate: user.createdAt || new Date(),
        lastActivity: bookings.length > 0 ? 
          new Date(Math.max(...bookings.map(b => b.date.getTime()))) : 
          user.createdAt || new Date()
      }
      
      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas de usuario:', error)
      throw error
    }
  }
}