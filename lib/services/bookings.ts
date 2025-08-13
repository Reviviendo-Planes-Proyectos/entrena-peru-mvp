"use client"

import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Tipos de datos para reservas
export interface Booking {
  id?: string
  clientId: string
  trainerId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  trainerName: string
  date: Date
  timeSlot: string
  duration: number // en horas
  totalPrice: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  packageType?: 'hourly' | 'package'
  packageDetails?: {
    totalHours: number
    usedHours: number
    remainingHours: number
  }
  notes?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface BookingStats {
  totalBookings: number
  pendingBookings: number
  confirmedBookings: number
  completedBookings: number
  cancelledBookings: number
  totalRevenue: number
}

// Servicios para reservas
export class BookingService {
  private static bookingsCollection = 'bookings'

  // Crear una nueva reserva
  static async createBooking(booking: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.bookingsCollection), {
        ...booking,
        date: Timestamp.fromDate(booking.date),
        createdAt: Timestamp.fromDate(new Date()),
        updatedAt: Timestamp.fromDate(new Date())
      })
      return docRef.id
    } catch (error) {
      console.error('Error creando reserva:', error)
      throw error
    }
  }

  // Obtener todas las reservas de un cliente
  static async getBookingsByClient(clientId: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, this.bookingsCollection),
        where('clientId', '==', clientId),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Booking
      })
    } catch (error) {
      console.error('Error obteniendo reservas del cliente:', error)
      throw error
    }
  }

  // Obtener todas las reservas de un entrenador
  static async getBookingsByTrainer(trainerId: string): Promise<Booking[]> {
    try {
      const q = query(
        collection(db, this.bookingsCollection),
        where('trainerId', '==', trainerId),
        orderBy('date', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Booking
      })
    } catch (error) {
      console.error('Error obteniendo reservas del entrenador:', error)
      throw error
    }
  }

  // Obtener una reserva por ID
  static async getBookingById(id: string): Promise<Booking | null> {
    try {
      const docRef = doc(db, this.bookingsCollection, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Booking
      }
      return null
    } catch (error) {
      console.error('Error obteniendo reserva:', error)
      throw error
    }
  }

  // Actualizar el estado de una reserva
  static async updateBookingStatus(id: string, status: Booking['status'], notes?: string): Promise<void> {
    try {
      const docRef = doc(db, this.bookingsCollection, id)
      const updates: any = {
        status,
        updatedAt: Timestamp.fromDate(new Date())
      }
      
      if (notes) {
        updates.notes = notes
      }
      
      await updateDoc(docRef, updates)
    } catch (error) {
      console.error('Error actualizando estado de reserva:', error)
      throw error
    }
  }

  // Actualizar una reserva completa
  static async updateBooking(id: string, updates: Partial<Booking>): Promise<void> {
    try {
      const docRef = doc(db, this.bookingsCollection, id)
      const updateData: any = {
        ...updates,
        updatedAt: Timestamp.fromDate(new Date())
      }
      
      // Convertir fecha si está presente
      if (updates.date) {
        updateData.date = Timestamp.fromDate(updates.date)
      }
      
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error actualizando reserva:', error)
      throw error
    }
  }

  // Cancelar una reserva
  static async cancelBooking(id: string, reason?: string): Promise<void> {
    try {
      await this.updateBookingStatus(id, 'cancelled', reason)
    } catch (error) {
      console.error('Error cancelando reserva:', error)
      throw error
    }
  }

  // Confirmar una reserva
  static async confirmBooking(id: string): Promise<void> {
    try {
      await this.updateBookingStatus(id, 'confirmed')
    } catch (error) {
      console.error('Error confirmando reserva:', error)
      throw error
    }
  }

  // Marcar una reserva como completada
  static async completeBooking(id: string, notes?: string): Promise<void> {
    try {
      await this.updateBookingStatus(id, 'completed', notes)
    } catch (error) {
      console.error('Error completando reserva:', error)
      throw error
    }
  }

  // Obtener reservas por fecha para un entrenador
  static async getBookingsByTrainerAndDate(trainerId: string, date: Date): Promise<Booking[]> {
    try {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)
      
      const q = query(
        collection(db, this.bookingsCollection),
        where('trainerId', '==', trainerId),
        where('date', '>=', Timestamp.fromDate(startOfDay)),
        where('date', '<=', Timestamp.fromDate(endOfDay))
      )
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          date: data.date.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        } as Booking
      })
    } catch (error) {
      console.error('Error obteniendo reservas por fecha:', error)
      throw error
    }
  }

  // Obtener estadísticas de reservas para un entrenador
  static async getBookingStats(trainerId: string): Promise<BookingStats> {
    try {
      const bookings = await this.getBookingsByTrainer(trainerId)
      
      const stats: BookingStats = {
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
        completedBookings: bookings.filter(b => b.status === 'completed').length,
        cancelledBookings: bookings.filter(b => b.status === 'cancelled').length,
        totalRevenue: bookings
          .filter(b => b.status === 'completed')
          .reduce((total, booking) => total + booking.totalPrice, 0)
      }
      
      return stats
    } catch (error) {
      console.error('Error obteniendo estadísticas:', error)
      throw error
    }
  }
}