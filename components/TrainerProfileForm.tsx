"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Upload, User, MapPin, Phone, FileText, Camera } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { TrainerService } from "@/lib/services/trainers"
import { useAuth } from "@/hooks/useAuth"

interface TrainerProfileFormProps {
  onComplete: () => void
  onCancel?: () => void
}

const SPECIALTY_OPTIONS = [
  "PILATES",
  "YOGA",
  "ENTRENAMIENTO FUNCIONAL",
  "CROSSFIT",
  "ZUMBA",
  "NATACIÓN",
  "REHABILITACIÓN FÍSICA",
  "ENTRENAMIENTO DE FUERZA",
  "HIPERTROFIA",
  "CARDIO",
  "BAILE LATINO",
  "STRETCHING",
  "AQUA AERÓBICOS",
  "POWERLIFTING",
  "HIIT",
  "OLYMPIC LIFTING",
  "MOBILITY",
  "ACSM CERTIFIED",
  "NSCA CERTIFIED",
  "CROSSFIT LEVEL 1",
  "CROSSFIT LEVEL 2",
  "YOGA ALLIANCE RYT 200",
  "YOGA ALLIANCE RYT 500",
  "BASI PILATES CERTIFIED",
  "FUNCTIONAL TRAINER",
  "NUTRITION COACH",
  "NUTRICIÓN DEPORTIVA",
  "FISIOTERAPIA",
  "ENTRENADOR PERSONAL CERTIFICADO",
  "CROSSFIT KIDS",
  "TRX CERTIFIED",
  "KETTLEBELL CERTIFIED"
]

export function TrainerProfileForm({ onComplete, onCancel }: TrainerProfileFormProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [newSpecialty, setNewSpecialty] = useState("")

  const [formData, setFormData] = useState({
    gmailDisplayName: user?.displayName || '',
    alias: '',
    dni: '',
    whatsapp: '',
    address: '',
    location: '',
    generalDescription: '',
    bio: '',
    specialties: [] as string[],
    experience: '',
    profileImage: user?.photoURL || '',
    referencePhotos: [] as string[]
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addSpecialty = (specialty: string) => {
    if (specialty && !formData.specialties.includes(specialty)) {
      setFormData(prev => ({
        ...prev,
        specialties: [...prev.specialties, specialty]
      }))
    }
  }

  const removeSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.filter(s => s !== specialty)
    }))
  }



  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "No hay usuario autenticado",
        variant: "destructive"
      })
      return
    }

    // Validaciones básicas
    if (!formData.alias.trim()) {
      toast({
        title: "Error",
        description: "El alias/nombre artístico es requerido",
        variant: "destructive"
      })
      return
    }

    if (!formData.dni.trim()) {
      toast({
        title: "Error",
        description: "El DNI es requerido",
        variant: "destructive"
      })
      return
    }

    if (!formData.whatsapp.trim()) {
      toast({
        title: "Error",
        description: "El número de WhatsApp es requerido",
        variant: "destructive"
      })
      return
    }

    if (formData.specialties.length === 0) {
      toast({
        title: "Error",
        description: "Debe seleccionar al menos una especialidad",
        variant: "destructive"
      })
      return
    }

    try {
      setLoading(true)
      
      // Actualizar el perfil del entrenador
      await TrainerService.updateTrainer(user.uid, {
        ...formData,
        isActive: true // Activar el entrenador una vez completado el perfil
      })

      toast({
        title: "¡Perfil completado!",
        description: "Tu perfil de entrenador ha sido configurado exitosamente"
      })

      onComplete()
    } catch (error) {
      console.error('Error al guardar el perfil:', error)
      toast({
        title: "Error",
        description: "No se pudo guardar el perfil. Inténtalo de nuevo.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="bg-white shadow-lg">
        <CardHeader className="text-center border-b">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <User className="w-6 h-6" />
            Configurar Perfil de Entrenador
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Completa tu información para activar tu perfil y comenzar a recibir clientes
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6 p-6">
          {/* Foto de Perfil */}
          <div className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {formData.profileImage ? (
                  <img 
                    src={formData.profileImage} 
                    alt="Foto de perfil" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      handleInputChange('profileImage', event.target?.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="absolute bottom-0 right-0 rounded-full w-8 h-8 p-0 pointer-events-none"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-sm text-gray-500">Subir Foto</p>
          </div>

          {/* Información Personal */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alias/Nombre Artístico *
              </label>
              <Input
                value={formData.alias}
                onChange={(e) => handleInputChange('alias', e.target.value)}
                placeholder="Coach Carlos"
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Gmail
              </label>
              <Input
                value={formData.gmailDisplayName}
                onChange={(e) => handleInputChange('gmailDisplayName', e.target.value)}
                placeholder="Carlos"
                className="w-full"
                disabled
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                DNI *
              </label>
              <Input
                value={formData.dni}
                onChange={(e) => handleInputChange('dni', e.target.value)}
                placeholder="12345678"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                WhatsApp *
              </label>
              <Input
                value={formData.whatsapp}
                onChange={(e) => handleInputChange('whatsapp', e.target.value)}
                placeholder="+51987654321"
                className="w-full"
              />
            </div>
          </div>

          {/* Dirección y Ubicación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dirección
              </label>
              <Input
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Av. Larco 123, Miraflores"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ubicación
              </label>
              <Input
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Lima, Perú"
                className="w-full"
              />
            </div>
          </div>

          {/* Descripción General */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción General (50/100)
            </label>
            <Textarea
              value={formData.generalDescription}
              onChange={(e) => handleInputChange('generalDescription', e.target.value)}
              placeholder="Especialista en transformación física y bienestar integral"
              className="w-full h-20"
              maxLength={100}
            />
          </div>

          {/* Biografía */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Biografía
            </label>
            <Textarea
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              placeholder="Entrenador certificado con más de 8 años de experiencia en entrenamiento funcional y artes marciales."
              className="w-full h-32"
            />
          </div>

          {/* Especialidades y Certificaciones */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Especialidades y Certificaciones *
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {formData.specialties.map((specialty) => (
                <Badge key={specialty} variant="secondary" className="flex items-center gap-1">
                  {specialty}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => removeSpecialty(specialty)}
                  />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <select 
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar especialidad o certificación</option>
                {SPECIALTY_OPTIONS.filter(opt => !formData.specialties.includes(opt)).map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <Button 
                type="button" 
                onClick={() => {
                  if (newSpecialty) {
                    addSpecialty(newSpecialty)
                    setNewSpecialty('')
                  }
                }}
                disabled={!newSpecialty}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4"
              >
                <Plus className="w-4 h-4 mr-1" />
                Agregar
              </Button>
            </div>
          </div>

          {/* Experiencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experiencia
            </label>
            <Textarea
              value={formData.experience}
              onChange={(e) => handleInputChange('experience', e.target.value)}
              placeholder="Describe tu experiencia profesional..."
              className="w-full h-24"
            />
          </div>



          {/* Fotos de Referencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fotos de Referencia (Opcional)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="relative aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 hover:border-blue-400 cursor-pointer transition-colors overflow-hidden">
                  {formData.referencePhotos[index] ? (
                    <>
                      <img 
                        src={formData.referencePhotos[index]} 
                        alt={`Referencia ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        className="absolute top-1 right-1 w-6 h-6 p-0"
                        onClick={() => {
                          const newPhotos = [...formData.referencePhotos]
                          newPhotos[index] = ''
                          setFormData(prev => ({ ...prev, referencePhotos: newPhotos }))
                        }}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="text-center">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <span className="text-xs text-gray-500">Subir</span>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (event) => {
                              const newPhotos = [...formData.referencePhotos]
                              newPhotos[index] = event.target?.result as string
                              setFormData(prev => ({ ...prev, referencePhotos: newPhotos }))
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-4 pt-6 border-t">
            {onCancel && (
              <Button 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
                disabled={loading}
              >
                Cancelar
              </Button>
            )}
            <Button 
              onClick={handleSubmit}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Guardando..." : "Completar Perfil"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}