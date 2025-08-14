"use client"

import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Tipos de datos
export interface TrainerProfile {
  id?: string
  uid: string // Firebase Auth UID - OBLIGATORIO
  alias: string // Nombre artístico (ej: "Coach Ana")
  name: string // Nombre completo (ej: "Ana García")
  dni: string // Documento Nacional de Identidad
  whatsapp: string // Número de WhatsApp
  address: string // Dirección exacta (ej: "Av. Larco 123, Miraflores")
  location: string // Ciudad/zona general (ej: "Lima, Perú")
  generalDescription: string // Descripción corta del entrenador
  bio: string // Historia completa del entrenador
  experience: string // Años de experiencia (ej: "8 años")
  specialties: string[] // Lista combinada de especialidades y certificaciones ["PILATES", "YOGA", "ACSM CERTIFIED"]
  profileImage: string // URL de foto de perfil
  referencePhotos: string[] // URLs de fotos adicionales
  rating: number // Calificación promedio
  reviewCount: number // Número de reseñas
  isActive: boolean // Estado activo/inactivo
  createdAt?: Date // Fecha de creación
  updatedAt?: Date // Fecha de última actualización
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

  // Obtener entrenadores por especialidad/certificación
  static async getTrainersBySpecialty(specialty: string): Promise<TrainerProfile[]> {
    try {
      const q = query(
        collection(db, this.trainersCollection),
        where('specialties', 'array-contains', specialty),
        where('isActive', '==', true),
        orderBy('rating', 'desc')
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
      console.error('Error obteniendo entrenadores por especialidad:', error)
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

  // Buscar entrenadores por nombre, alias, descripción o especialidades
  static async searchTrainers(searchTerm: string): Promise<TrainerProfile[]> {
    try {
      // Nota: Firestore no soporta búsqueda de texto completo nativamente
      // Esta es una implementación básica
      const trainers = await this.getAllTrainers()
      const searchLower = searchTerm.toLowerCase()
      
      return trainers.filter(trainer => 
        trainer.name.toLowerCase().includes(searchLower) ||
        trainer.alias.toLowerCase().includes(searchLower) ||
        trainer.generalDescription.toLowerCase().includes(searchLower) ||
        trainer.bio.toLowerCase().includes(searchLower) ||
        trainer.location.toLowerCase().includes(searchLower) ||
        trainer.specialties.some(specialty => specialty.toLowerCase().includes(searchLower))
      )
    } catch (error) {
      console.error('Error buscando entrenadores:', error)
      throw error
    }
  }

  // Obtener entrenadores por ubicación (búsqueda por texto)
  static async getTrainersByLocation(locationSearch: string): Promise<TrainerProfile[]> {
    try {
      const trainers = await this.getAllTrainers()
      const searchLower = locationSearch.toLowerCase()
      
      return trainers.filter(trainer => 
        trainer.location.toLowerCase().includes(searchLower) ||
        trainer.address.toLowerCase().includes(searchLower)
      )
    } catch (error) {
      console.error('Error obteniendo entrenadores por ubicación:', error)
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

}