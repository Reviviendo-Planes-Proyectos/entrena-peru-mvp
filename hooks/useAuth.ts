"use client"

import { useState, useEffect } from 'react'
import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      console.error('Error al registrarse:', error)
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      // Obtener el tipo de usuario del localStorage
      const userType = localStorage.getItem('userType') as 'client' | 'trainer' | null
      let isNewTrainer = false
      
      if (userType === 'trainer') {
        // Si es entrenador, verificar si ya existe
        const trainerDocRef = doc(db, 'trainers', user.uid)
        const trainerDoc = await getDoc(trainerDocRef)
        
        if (!trainerDoc.exists()) {
          isNewTrainer = true
          // Crear documento básico para entrenador nuevo
          await setDoc(trainerDocRef, {
            uid: user.uid,
            email: user.email,
            gmailDisplayName: user.displayName || '',
            alias: '',
            dni: '',
            whatsapp: '',
            address: '',
            location: '',
            generalDescription: '',
            bio: '',
            specialties: [],
            profileImage: user.photoURL || '',
            referencePhotos: [],
            rating: 0,
            reviewCount: 0,
            isActive: false, // Inactivo hasta completar el perfil
            experience: '',
            certifications: [],
            createdAt: Timestamp.now()
          })
        }
      } else if (userType === 'client') {
        // Si es cliente, crear documento solo en la colección users
        const userDocRef = doc(db, 'users', user.uid)
        const userDoc = await getDoc(userDocRef)
        
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            gmailDisplayName: user.displayName || '',
            photoURL: user.photoURL || '',
            phone: '',
            age: null,
            fitnessGoals: [],
            fitnessLevel: 'Principiante',
            isActive: true,
            createdAt: Timestamp.now()
          })
        }
      }
      
      return { user, isNewTrainer }
    } catch (error) {
      console.error('Error al iniciar sesión con Google:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
      throw error
    }
  }

  return {
    user,
    loading,
    login,
    register,
    loginWithGoogle,
    logout
  }
}