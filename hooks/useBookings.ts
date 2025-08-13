"use client"

import { useState, useEffect } from 'react'
import { BookingService, Booking, BookingStats } from '@/lib/services/bookings'
import { useAuth } from './useAuth'

export function useBookings() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Crear una nueva reserva
  const createBooking = async (bookingData: Omit<Booking, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true)
      setError(null)
      const bookingId = await BookingService.createBooking(bookingData)
      
      // Actualizar la lista local de reservas
      const newBooking = await BookingService.getBookingById(bookingId)
      if (newBooking) {
        setBookings(prev => [newBooking, ...prev])
      }
      
      return bookingId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creando reserva'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Actualizar el estado de una reserva
  const updateBookingStatus = async (bookingId: string, status: Booking['status'], notes?: string) => {
    try {
      setLoading(true)
      setError(null)
      await BookingService.updateBookingStatus(bookingId, status, notes)
      
      // Actualizar la lista local
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status, notes, updatedAt: new Date() }
            : booking
        )
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando reserva'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Cancelar una reserva
  const cancelBooking = async (bookingId: string, reason?: string) => {
    try {
      await updateBookingStatus(bookingId, 'cancelled', reason)
    } catch (err) {
      throw err
    }
  }

  // Confirmar una reserva
  const confirmBooking = async (bookingId: string) => {
    try {
      await updateBookingStatus(bookingId, 'confirmed')
    } catch (err) {
      throw err
    }
  }

  // Completar una reserva
  const completeBooking = async (bookingId: string, notes?: string) => {
    try {
      await updateBookingStatus(bookingId, 'completed', notes)
    } catch (err) {
      throw err
    }
  }

  // Actualizar una reserva completa
  const updateBooking = async (bookingId: string, updates: Partial<Booking>) => {
    try {
      setLoading(true)
      setError(null)
      await BookingService.updateBooking(bookingId, updates)
      
      // Actualizar la lista local
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId 
            ? { ...booking, ...updates, updatedAt: new Date() }
            : booking
        )
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando reserva'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return {
    bookings,
    loading,
    error,
    createBooking,
    updateBookingStatus,
    cancelBooking,
    confirmBooking,
    completeBooking,
    updateBooking,
    setBookings,
    setError
  }
}

// Hook específico para reservas de cliente
export function useClientBookings(clientId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    if (!clientId) return
    
    try {
      setLoading(true)
      setError(null)
      const clientBookings = await BookingService.getBookingsByClient(clientId)
      setBookings(clientBookings)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo reservas'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [clientId])

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings
  }
}

// Hook específico para reservas de entrenador
export function useTrainerBookings(trainerId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [stats, setStats] = useState<BookingStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBookings = async () => {
    if (!trainerId) return
    
    try {
      setLoading(true)
      setError(null)
      const [trainerBookings, bookingStats] = await Promise.all([
        BookingService.getBookingsByTrainer(trainerId),
        BookingService.getBookingStats(trainerId)
      ])
      setBookings(trainerBookings)
      setStats(bookingStats)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo reservas del entrenador'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getBookingsByDate = async (date: Date) => {
    if (!trainerId) return []
    
    try {
      setLoading(true)
      setError(null)
      const dayBookings = await BookingService.getBookingsByTrainerAndDate(trainerId, date)
      return dayBookings
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo reservas por fecha'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [trainerId])

  return {
    bookings,
    stats,
    loading,
    error,
    refetch: fetchBookings,
    getBookingsByDate
  }
}

// Hook para obtener una reserva específica
export function useBooking(bookingId?: string) {
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBooking = async () => {
    if (!bookingId) return
    
    try {
      setLoading(true)
      setError(null)
      const bookingData = await BookingService.getBookingById(bookingId)
      setBooking(bookingData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo reserva'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooking()
  }, [bookingId])

  return {
    booking,
    loading,
    error,
    refetch: fetchBooking
  }
}