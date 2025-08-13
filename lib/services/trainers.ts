"use client"

import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Tipos de datos
export interface TrainerProfile {
  id?: string
  uid?: string // Firebase Auth UID
  alias: string
  firstName: string
  lastName: string
  dni: string
  whatsapp: string
  email: string
  address: string
  location: {
    lat: number
    lng: number
    address: string
  }
  categories: string[]
  bio: string
  description: string
  profilePhoto: string
  referencePhotos: string[]
  rating: number
  reviews: number
  experience: string
  hourlyRate: number
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

export interface TrainerSchedule {
  id?: string
  trainerId: string
  schedule: Record<string, {
    active: boolean
    slots: Record<string, 'available' | 'occupied' | 'unavailable'>
  }>
  timezone: string
  createdAt?: Date
  updatedAt?: Date
}

export interface TrainerRates {
  id?: string
  trainerId: string
  hourly: number
  packages: Array<{
    hours: number
    price: number
    description?: string
  }>
  currency: string
  createdAt?: Date
  updatedAt?: Date
}

// Servicios para entrenadores
export class TrainerService {
  private static trainersCollection = 'trainers'
  private static schedulesCollection = 'trainer_schedules'
  private static ratesCollection = 'trainer_rates'

  // Obtener todos los entrenadores
  static async getAllTrainers(): Promise<TrainerProfile[]> {
    try {
      const q = query(
        collection(db, this.trainersCollection),
        where('isActive', '==', true),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as TrainerProfile
      })
    } catch (error) {
      console.error('Error obteniendo entrenadores:', error)
      throw error
    }
  }

  // Obtener un entrenador por ID
  static async getTrainerById(id: string): Promise<TrainerProfile | null> {
    try {
      const docRef = doc(db, this.trainersCollection, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as TrainerProfile
      }
      return null
    } catch (error) {
      console.error('Error obteniendo entrenador:', error)
      throw error
    }
  }

  // Crear un nuevo entrenador
  static async createTrainer(trainer: Omit<TrainerProfile, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.trainersCollection), {
        ...trainer,
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      })
      return docRef.id
    } catch (error) {
      console.error('Error creando entrenador:', error)
      throw error
    }
  }

  // Actualizar un entrenador
  static async updateTrainer(id: string, updates: Partial<TrainerProfile>): Promise<void> {
    try {
      const docRef = doc(db, this.trainersCollection, id)
      await updateDoc(docRef, {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      })
    } catch (error) {
      console.error('Error actualizando entrenador:', error)
      throw error
    }
  }

  // Eliminar un entrenador
  static async deleteTrainer(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, this.trainersCollection, id))
    } catch (error) {
      console.error('Error eliminando entrenador:', error)
      throw error
    }
  }

  // Buscar entrenadores por categoría
  static async getTrainersByCategory(category: string): Promise<TrainerProfile[]> {
    try {
      const q = query(
        collection(db, this.trainersCollection),
        where('categories', 'array-contains', category),
        where('isActive', '==', true)
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as TrainerProfile
      })
    } catch (error) {
      console.error('Error buscando entrenadores por categoría:', error)
      throw error
    }
  }

  // Obtener horario de un entrenador
  static async getTrainerSchedule(trainerId: string): Promise<TrainerSchedule | null> {
    try {
      const docRef = doc(db, this.schedulesCollection, trainerId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as TrainerSchedule
      }
      return null
    } catch (error) {
      console.error('Error obteniendo horario:', error)
      throw error
    }
  }

  // Actualizar horario de un entrenador
  static async updateTrainerSchedule(trainerId: string, scheduleData: Omit<TrainerSchedule, 'id' | 'trainerId'>): Promise<void> {
    try {
      const docRef = doc(db, this.schedulesCollection, trainerId)
      await setDoc(docRef, {
        trainerId,
        ...scheduleData,
        updatedAt: Timestamp.fromDate(new Date())
      }, { merge: true })
    } catch (error) {
      console.error('Error actualizando horario:', error)
      throw error
    }
  }

  // Obtener tarifas de un entrenador
  static async getTrainerRates(trainerId: string): Promise<TrainerRates | null> {
    try {
      const docRef = doc(db, this.ratesCollection, trainerId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as TrainerRates
      }
      return null
    } catch (error) {
      console.error('Error obteniendo tarifas:', error)
      throw error
    }
  }

  // Actualizar tarifas de un entrenador
  static async updateTrainerRates(trainerId: string, ratesData: Omit<TrainerRates, 'id' | 'trainerId'>): Promise<void> {
    try {
      const docRef = doc(db, this.ratesCollection, trainerId)
      await setDoc(docRef, {
        trainerId,
        ...ratesData,
        updatedAt: Timestamp.fromDate(new Date())
      }, { merge: true })
    } catch (error) {
      console.error('Error actualizando tarifas:', error)
      throw error
    }
  }

  // Buscar entrenadores por nombre
  static async searchTrainers(searchTerm: string): Promise<TrainerProfile[]> {
    try {
      // Nota: Firestore no soporta búsqueda de texto completo nativamente
      // Esta es una implementación básica
      const trainers = await this.getAllTrainers()
      const searchLower = searchTerm.toLowerCase()
      
      return trainers.filter(trainer => 
        trainer.firstName.toLowerCase().includes(searchLower) ||
        trainer.lastName.toLowerCase().includes(searchLower) ||
        trainer.alias.toLowerCase().includes(searchLower) ||
        trainer.categories.some(cat => cat.toLowerCase().includes(searchLower))
      )
    } catch (error) {
      console.error('Error buscando entrenadores:', error)
      throw error
    }
  }

  // Obtener entrenadores cercanos por ubicación
  static async getTrainersNearby(latitude: number, longitude: number, radiusKm: number = 10): Promise<TrainerProfile[]> {
    try {
      const trainers = await this.getAllTrainers()
      
      return trainers.filter(trainer => {
        if (!trainer.location?.lat || !trainer.location?.lng) return false
        
        const distance = this.calculateDistance(
          latitude, longitude,
          trainer.location.lat, trainer.location.lng
        )
        
        return distance <= radiusKm
      })
    } catch (error) {
      console.error('Error obteniendo entrenadores cercanos:', error)
      throw error
    }
  }

  // Obtener horarios disponibles para una fecha
  static async getAvailableTimeSlots(trainerId: string, date: Date): Promise<string[]> {
    try {
      const schedule = await this.getTrainerSchedule(trainerId)
      if (!schedule) return []
      
      const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
      const daySchedule = schedule.schedule[dayOfWeek]
      
      if (!daySchedule?.active) return []
      
      return Object.entries(daySchedule.slots)
        .filter(([_, status]) => status === 'available')
        .map(([time, _]) => time)
    } catch (error) {
      console.error('Error obteniendo horarios disponibles:', error)
      throw error
    }
  }

  // Calcular distancia entre dos puntos (fórmula de Haversine)
  private static calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Radio de la Tierra en km
    const dLat = this.deg2rad(lat2 - lat1)
    const dLon = this.deg2rad(lon2 - lon1)
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private static deg2rad(deg: number): number {
    return deg * (Math.PI/180)
  }
}