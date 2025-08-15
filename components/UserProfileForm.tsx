"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X, Plus, User, Phone, Target, Calendar, ChevronRight, ChevronLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UserService } from "@/lib/services/users"
import { useAuth } from "@/hooks/useAuth"

interface UserProfileFormProps {
  onComplete: () => void
  onCancel?: () => void
}

const FITNESS_GOALS = [
  "Pérdida de peso",
  "Ganancia muscular",
  "Tonificación",
  "Resistencia cardiovascular",
  "Flexibilidad",
  "Fuerza",
  "Rehabilitación",
  "Bienestar general"
]

const FITNESS_LEVELS = [
  "Principiante",
  "Intermedio",
  "Avanzado"
]

export function UserProfileForm({ onComplete, onCancel }: UserProfileFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    age: '',
    fitnessGoals: [] as string[],
    fitnessLevel: '' as string
  })

  // Precargar datos del usuario de Google cuando esté disponible
  useEffect(() => {
    if (user) {
      const nameParts = user.displayName?.split(' ') || []
      setFormData(prev => ({
        ...prev,
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: user.email || ''
      }))
    }
  }, [user])

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addGoal = (goal: string) => {
    if (!formData.fitnessGoals.includes(goal)) {
      const newGoals = [...formData.fitnessGoals, goal]
      setFormData(prev => ({ ...prev, fitnessGoals: newGoals }))
    }
  }

  const removeGoal = (goal: string) => {
    const newGoals = formData.fitnessGoals.filter(g => g !== goal)
    setFormData(prev => ({ ...prev, fitnessGoals: newGoals }))
  }

  const handleSubmit = async (skipOptional = false) => {
    if (!user) {
      toast({
        title: "Error",
        description: "No hay usuario autenticado",
        variant: "destructive"
      })
      return
    }

    // Validaciones mínimas
    if (!formData.firstName.trim()) {
      toast({
        title: "Error",
        description: "El nombre es requerido",
        variant: "destructive"
      })
      return
    }

    if (!formData.email.trim()) {
      toast({
        title: "Error",
        description: "El email es requerido",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      console.log('Iniciando guardado de perfil...', { formData, user: user.uid })
      
      const profileData = {
        uid: user.uid,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
        age: formData.age ? parseInt(formData.age) : undefined,
        fitnessGoals: formData.fitnessGoals.length > 0 ? formData.fitnessGoals : undefined,
        fitnessLevel: formData.fitnessLevel || undefined,
        isActive: true
      }
      
      console.log('Datos del perfil a guardar:', profileData)
      
      // Crear perfil de usuario
      const userId = await UserService.createUserProfile(profileData)
      console.log('Perfil guardado exitosamente con ID:', userId)

      toast({
        title: "¡Perfil creado!",
        description: skipOptional ? "Puedes completar más información después" : "Tu perfil ha sido configurado exitosamente"
      })

      onComplete()
    } catch (error) {
      console.error('Error detallado al crear el perfil:', error)
      toast({
        title: "Error",
        description: `No se pudo crear el perfil: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1)
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const getStepProgress = () => {
    return (currentStep / 3) * 100
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-t-3xl md:rounded-2xl max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-full md:slide-in-from-bottom-0 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User className="w-6 h-6 text-blue-600" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Configurar Perfil</h2>
                <p className="text-sm text-gray-500">Paso {currentStep} de 3</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="w-8 h-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStepProgress()}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 pb-24 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Paso 1: Información Básica */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Información Básica</h3>
                <p className="text-gray-600">Solo necesitamos lo esencial para empezar</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre *
                  </label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    placeholder="Tu nombre"
                    className="w-full h-12 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apellido
                  </label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    placeholder="Tu apellido"
                    className="w-full h-12 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full h-12 text-base"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Paso 2: Información Fitness */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Información Fitness</h3>
                <p className="text-gray-600">Ayúdanos a personalizar tu experiencia</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad
                  </label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="25"
                    className="w-full h-12 text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Nivel de Experiencia
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {FITNESS_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleInputChange('fitnessLevel', level)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          formData.fitnessLevel === level
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className="font-medium">{level}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Objetivos Fitness
                  </label>
                  
                  {formData.fitnessGoals.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.fitnessGoals.map((goal) => (
                        <Badge
                          key={goal}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer"
                          onClick={() => removeGoal(goal)}
                        >
                          {goal}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 gap-2">
                    {FITNESS_GOALS.filter(goal => !formData.fitnessGoals.includes(goal)).map((goal) => (
                      <button
                        key={goal}
                        type="button"
                        onClick={() => addGoal(goal)}
                        className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-left transition-all flex items-center justify-between"
                      >
                        <span>{goal}</span>
                        <Plus className="w-4 h-4 text-gray-400" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Paso 3: Contacto */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Información de Contacto</h3>
                <p className="text-gray-600">Para que los entrenadores puedan contactarte</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-1" />
                    Teléfono / WhatsApp
                  </label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+51 999 999 999"
                    className="w-full h-12 text-base"
                  />
                </div>
              </div>

              {/* Resumen */}
              <div className="bg-gray-50 rounded-lg p-4 mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Resumen de tu perfil:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Nombre:</strong> {formData.firstName} {formData.lastName}</p>
                  <p><strong>Email:</strong> {formData.email}</p>
                  {formData.age && <p><strong>Edad:</strong> {formData.age} años</p>}
                  {formData.fitnessLevel && (
                <p><strong>Nivel:</strong> {formData.fitnessLevel}</p>
              )}
                  {formData.fitnessGoals.length > 0 && (
                    <p><strong>Objetivos:</strong> {formData.fitnessGoals.join(', ')}</p>
                  )}
                  {formData.phone && <p><strong>Teléfono:</strong> {formData.phone}</p>}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t px-4 sm:px-6 py-4">
          <div className="flex gap-2 sm:gap-3 justify-center">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={prevStep}
                className="flex-1 h-12"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>
            )}
            
            {currentStep < 3 ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="flex-1 h-12"
                >
                  Omitir y Guardar
                </Button>
                <Button
                  onClick={nextStep}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                  className="flex-1 h-12"
                >
                  Guardar Básico
                </Button>
                <Button
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Guardando...' : 'Completar Perfil'}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}