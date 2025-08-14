"use client"

import { useState, useEffect } from 'react'
import { TrainerService, TrainerProfile, TrainerSchedule, TrainerRates } from '@/lib/services/trainers'

export function useTrainers() {
  const [trainers, setTrainers] = useState<TrainerProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTrainers = async () => {
    try {
      setLoading(true)
      setError(null)
      const allTrainers = await TrainerService.getAllTrainers()
      setTrainers(allTrainers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo entrenadores'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const searchTrainers = async (searchTerm: string) => {
    try {
      setLoading(true)
      setError(null)
      const searchResults = await TrainerService.searchTrainers(searchTerm)
      setTrainers(searchResults)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error buscando entrenadores'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const getTrainersBySpecialty = async (specialty: string) => {
    try {
      setLoading(true)
      setError(null)
      const specialtyTrainers = await TrainerService.getTrainersBySpecialty(specialty)
      setTrainers(specialtyTrainers)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo entrenadores por especialidad'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const createTrainer = async (trainerData: Omit<TrainerProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      setLoading(true)
      setError(null)
      const trainerId = await TrainerService.createTrainer(trainerData)
      
      // Actualizar la lista local
      const newTrainer = await TrainerService.getTrainerById(trainerId)
      if (newTrainer) {
        setTrainers(prev => [newTrainer, ...prev])
      }
      
      return trainerId
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error creando entrenador'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTrainer = async (trainerId: string, updates: Partial<TrainerProfile>) => {
    try {
      setLoading(true)
      setError(null)
      await TrainerService.updateTrainer(trainerId, updates)
      
      // Actualizar la lista local
      setTrainers(prev => 
        prev.map(trainer => 
          trainer.id === trainerId 
            ? { ...trainer, ...updates, updatedAt: new Date() }
            : trainer
        )
      )
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando entrenador'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deactivateTrainer = async (trainerId: string) => {
    try {
      await updateTrainer(trainerId, { isActive: false })
    } catch (err) {
      throw err
    }
  }

  const activateTrainer = async (trainerId: string) => {
    try {
      await updateTrainer(trainerId, { isActive: true })
    } catch (err) {
      throw err
    }
  }

  useEffect(() => {
    fetchTrainers()
  }, [])

  return {
    trainers,
    loading,
    error,
    fetchTrainers,
    searchTrainers,
    getTrainersBySpecialty,
    createTrainer,
    updateTrainer,
    deactivateTrainer,
    activateTrainer,
    setTrainers,
    setError
  }
}

// Hook para obtener un entrenador específico
export function useTrainer(trainerId?: string) {
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTrainer = async () => {
    if (!trainerId) return
    
    try {
      setLoading(true)
      setError(null)
      const trainerData = await TrainerService.getTrainerById(trainerId)
      setTrainer(trainerData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo entrenador'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrainer()
  }, [trainerId])

  return {
    trainer,
    loading,
    error,
    refetch: fetchTrainer
  }
}

// Hook para manejar horarios de entrenador
export function useTrainerSchedule(trainerId?: string) {
  const [schedule, setSchedule] = useState<TrainerSchedule | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchSchedule = async () => {
    if (!trainerId) return
    
    try {
      setLoading(true)
      setError(null)
      const scheduleData = await TrainerService.getTrainerSchedule(trainerId)
      setSchedule(scheduleData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo horario'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateSchedule = async (scheduleData: Omit<TrainerSchedule, 'id' | 'trainerId'>) => {
    if (!trainerId) return
    
    try {
      setLoading(true)
      setError(null)
      await TrainerService.updateTrainerSchedule(trainerId, scheduleData)
      
      // Actualizar el horario local
      setSchedule(prev => prev ? { ...prev, ...scheduleData } : null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando horario'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getAvailableSlots = async (date: Date) => {
    if (!trainerId) return []
    
    try {
      setLoading(true)
      setError(null)
      const slots = await TrainerService.getAvailableTimeSlots(trainerId, date)
      return slots
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo horarios disponibles'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedule()
  }, [trainerId])

  return {
    schedule,
    loading,
    error,
    updateSchedule,
    getAvailableSlots,
    refetch: fetchSchedule
  }
}

// Hook para manejar tarifas de entrenador
export function useTrainerRates(trainerId?: string) {
  const [rates, setRates] = useState<TrainerRates | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRates = async () => {
    if (!trainerId) return
    
    try {
      setLoading(true)
      setError(null)
      const ratesData = await TrainerService.getTrainerRates(trainerId)
      setRates(ratesData)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo tarifas'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const updateRates = async (ratesData: Omit<TrainerRates, 'id' | 'trainerId'>) => {
    if (!trainerId) return
    
    try {
      setLoading(true)
      setError(null)
      await TrainerService.updateTrainerRates(trainerId, ratesData)
      
      // Actualizar las tarifas locales
      setRates(prev => prev ? { ...prev, ...ratesData } : null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error actualizando tarifas'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
  }, [trainerId])

  return {
    rates,
    loading,
    error,
    updateRates,
    refetch: fetchRates
  }
}

// Hook para obtener entrenadores por ubicación
export function useTrainersByLocation() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getTrainersByLocation = async (locationSearch: string) => {
    try {
      setLoading(true)
      setError(null)
      const locationTrainers = await TrainerService.getTrainersByLocation(locationSearch)
      return locationTrainers
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error obteniendo entrenadores por ubicación'
      setError(errorMessage)
      return []
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getTrainersByLocation
  }
}