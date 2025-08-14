"use client"

import {
  Search,
  MapPin,
  Star,
  Clock,
  Users,
  Dumbbell,
  Heart,
  Zap,
  X,
  Calendar,
  DollarSign,
  Settings,
  Menu,
  Plus,
  Trash2,
  User,
  Camera,
  ChevronRight,
  ChevronLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import Link from "next/link"
import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { useAuth } from "@/hooks/useAuth"
import { TrainerService, TrainerProfile } from "@/lib/services/trainers"    

export default function HomePage() {
  const { user, loginWithGoogle, logout } = useAuth()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [userType, setUserType] = useState<"client" | "trainer" | null>(null)
  const [showTrainerPanel, setShowTrainerPanel] = useState(false)
  const [showClientPanel, setShowClientPanel] = useState(false)
  const [activeTrainerMenu, setActiveTrainerMenu] = useState<"profile" | "schedule" | "rates">("profile")
  const [favoriteTrainers, setFavoriteTrainers] = useState<number[]>([])
  const [rateType, setRateType] = useState<"weekly" | "monthly">("weekly")
  const [customPackages, setCustomPackages] = useState([
    { hours: 1, price: 40 },
    { hours: 3, price: 100 },
    { hours: 10, price: 200 },
  ])
  const [scheduleWeekOffset, setScheduleWeekOffset] = useState(0)
  const [showMapModal, setShowMapModal] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [filteredTrainers, setFilteredTrainers] = useState<any[]>([])

  const [trainerSchedule, setTrainerSchedule] = useState({
    monday: {
      active: true,
      slots: {
        "6-7": "available",
        "7-8": "available",
        "8-9": "unavailable",
        "9-10": "available",
        "10-11": "occupied",
        "11-12": "available",
        "12-13": "available",
        "13-14": "unavailable",
        "14-15": "available",
        "15-16": "occupied",
        "16-17": "available",
        "17-18": "available",
        "18-19": "unavailable",
        "19-20": "available",
        "20-21": "available",
        "21-22": "occupied",
        "22-23": "available",
        "23-24": "available",
      },
    },
    tuesday: {
      active: true,
      slots: {
        "6-7": "available",
        "7-8": "unavailable",
        "8-9": "available",
        "9-10": "occupied",
        "10-11": "available",
        "11-12": "available",
        "12-13": "unavailable",
        "13-14": "available",
        "14-15": "available",
        "15-16": "occupied",
        "16-17": "available",
        "17-18": "unavailable",
        "18-19": "available",
        "19-20": "available",
        "20-21": "occupied",
        "21-22": "available",
        "22-23": "available",
        "23-24": "available",
      },
    },
    wednesday: { active: false, slots: {} },
    thursday: {
      active: true,
      slots: {
        "6-7": "unavailable",
        "7-8": "available",
        "8-9": "available",
        "9-10": "occupied",
        "10-11": "available",
        "11-12": "available",
        "12-13": "unavailable",
        "13-14": "available",
        "14-15": "available",
        "15-16": "occupied",
        "16-17": "available",
        "17-18": "unavailable",
        "18-19": "available",
        "19-20": "available",
        "20-21": "unavailable",
        "21-22": "available",
        "22-23": "available",
        "23-24": "available",
      },
    },
    friday: {
      active: true,
      slots: {
        "6-7": "available",
        "7-8": "available",
        "8-9": "unavailable",
        "9-10": "available",
        "10-11": "occupied",
        "11-12": "available",
        "12-13": "available",
        "13-14": "unavailable",
        "14-15": "available",
        "15-16": "available",
        "16-17": "occupied",
        "17-18": "available",
        "19-20": "available",
        "20-21": "unavailable",
        "21-22": "available",
        "22-23": "occupied",
        "23-24": "available",
      },
    },
    saturday: {
      active: true,
      slots: {
        "6-7": "available",
        "7-8": "unavailable",
        "8-9": "available",
        "9-10": "available",
        "10-11": "occupied",
        "11-12": "available",
        "12-13": "available",
        "13-14": "unavailable",
        "14-15": "available",
        "15-16": "available",
        "16-17": "occupied",
        "17-18": "available",
        "18-19": "unavailable",
        "19-20": "available",
        "20-21": "available",
        "21-22": "available",
        "22-23": "occupied",
        "23-24": "available",
      },
    },
    sunday: { active: false, slots: {} },
  })

  const [trainerRates, setTrainerRates] = useState({
    hourly: 40,
    package3: 100,
    package10: 280,
  })

  const [trainerProfile, setTrainerProfile] = useState({
    alias: "Coach Carlos",
    firstName: "Carlos",
    lastName: "Mendoza",
    dni: "12345678",
    whatsapp: "+51987654321",
    address: "Av. Larco 123, Miraflores",
    location: "Lima, Perú",
    categories: ["ACSM CERTIFIED", "FUNCTIONAL TRAINING", "KARATE"],
    bio: "Entrenador certificado con más de 8 años de experiencia en entrenamiento funcional y artes marciales.",
    description: "Especialista en transformación física y bienestar integral",
    profilePhoto: "",
    referencePhotos: ["", "", "", ""],
  })

  const timeSlots = [
    "6-7",
    "7-8",
    "8-9",
    "9-10",
    "10-11",
    "11-12",
    "12-13",
    "13-14",
    "14-15",
    "15-16",
    "16-17",
    "17-18",
    "18-19",
    "19-20",
    "20-21",
    "21-22",
    "22-23",
    "23-24",
  ]
  const daysOfWeek = [
    { key: "monday", name: "Lunes" },
    { key: "tuesday", name: "Martes" },
    { key: "wednesday", name: "Miércoles" },
    { key: "thursday", name: "Jueves" },
    { key: "friday", name: "Viernes" },
    { key: "saturday", name: "Sábado" },
    { key: "sunday", name: "Domingo" },
  ]

  const handleLogin = async (type: "client" | "trainer") => {
    try {
      // Establecer el tipo de usuario antes de la autenticación
      setUserType(type)
      localStorage.setItem("userType", type)
      
      // Autenticar con Google y guardar en Firestore
      await loginWithGoogle()
      
      setShowLoginModal(false)
      if (type === "trainer") {
        setShowTrainerPanel(true)
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      // Limpiar el tipo de usuario si falla la autenticación
      setUserType(null)
      localStorage.removeItem("userType")
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUserType(null)
      localStorage.removeItem("userType")
      setShowTrainerPanel(false)
      setShowClientPanel(false)
      setFavoriteTrainers([])
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  useEffect(() => {
    const savedUserType = localStorage.getItem("userType") as "client" | "trainer" | null
    if (savedUserType) {
      setUserType(savedUserType)
    }
  }, [])

  const toggleFavorite = (trainerId: number) => {
    setFavoriteTrainers((prev) =>
      prev.includes(trainerId) ? prev.filter((id) => id !== trainerId) : [...prev, trainerId],
    )
  }

  const toggleDayActive = (day: string) => {
    setTrainerSchedule((prev) => ({
      ...prev,
      [day]: {
        ...prev[day as keyof typeof prev],
        active: !prev[day as keyof typeof prev].active,
      },
    }))
  }

  const toggleTimeSlot = (day: string, slot: string) => {
    setTrainerSchedule((prev) => {
      const currentStatus = prev[day as keyof typeof prev].slots[slot]
      let newStatus = "available"

      if (currentStatus === "available") {
        newStatus = "unavailable"
      } else if (currentStatus === "unavailable") {
        newStatus = "occupied"
      } else {
        newStatus = "available"
      }

      return {
        ...prev,
        [day]: {
          ...prev[day as keyof typeof prev],
          slots: {
            ...prev[day as keyof typeof prev].slots,
            [slot]: newStatus,
          },
        },
      }
    })
  }

  const updateTrainerProfile = (field: string, value: string | string[]) => {
    setTrainerProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addCategory = (newCategory: string) => {
    if (newCategory.trim() && !trainerProfile.categories.includes(newCategory.trim().toUpperCase())) {
      setTrainerProfile((prev) => ({
        ...prev,
        categories: [...prev.categories, newCategory.trim().toUpperCase()],
      }))
    }
  }

  const removeCategory = (categoryToRemove: string) => {
    setTrainerProfile((prev) => ({
      ...prev,
      categories: prev.categories.filter((cat) => cat !== categoryToRemove),
    }))
  }

  const categories = [
    { icon: Dumbbell, name: "Funcional", color: "bg-blue-500" },
    { icon: Heart, name: "Yoga", color: "bg-pink-500" },
    { icon: Zap, name: "Crossfit", color: "bg-yellow-500" },
    { icon: Users, name: "Grupal", color: "bg-green-500" },
  ]

  const featuredTrainers = [
    {
      id: 1,
      name: "Carlos Mendoza",
      specialty: "Entrenamiento funcional",
      rating: 4.9,
      reviews: 127,
      price: "S/ 40/hora",
      image: "/placeholder.svg?height=80&width=80",
      available: true,
      location: "San Isidro",
    },
    {
      id: 2,
      name: "Ana García",
      specialty: "Yoga y pilates",
      rating: 4.8,
      reviews: 89,
      price: "S/ 35/hora",
      image: "/placeholder.svg?height=80&width=80",
      available: true,
      location: "Miraflores",
    },
    {
      id: 3,
      name: "Miguel Torres",
      specialty: "Crossfit y fuerza",
      rating: 4.9,
      reviews: 156,
      price: "S/ 50/hora",
      image: "/placeholder.svg?height=80&width=80",
      available: false,
      location: "Surco",
    },
  ]

  const addCustomPackage = () => {
    setCustomPackages([...customPackages, { hours: 1, price: 0 }])
  }

  const removeCustomPackage = (index: number) => {
    if (customPackages.length > 1) {
      setCustomPackages(customPackages.filter((_, i) => i !== index))
    }
  }

  const updateCustomPackage = (index: number, field: "hours" | "price", value: number) => {
    const updated = customPackages.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg))
    setCustomPackages(updated)
  }

  const getCurrentWeekDates = () => {
    const today = new Date()
    const currentDay = today.getDay()
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay
    const monday = new Date(today)
    monday.setDate(today.getDate() + mondayOffset + scheduleWeekOffset * 7)

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const weekDates = getCurrentWeekDates()
  const monthNames = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ]

  const handleMapClick = () => {
    setShowMapModal(true)
  }

  // Funciones de filtrado y búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterTrainers(term, selectedCategory)
  }

  const handleCategoryFilter = (category: string) => {
    const newCategory = selectedCategory === category ? null : category
    setSelectedCategory(newCategory)
    filterTrainers(searchTerm, newCategory)
  }

  const filterTrainers = (term: string, category: string | null) => {
    let filtered = featuredTrainers

    // Filtrar por categoría seleccionada
    if (category) {
      filtered = filtered.filter(trainer => 
        trainer.specialty.toLowerCase().includes(category.toLowerCase())
      )
    }

    // Filtrar por término de búsqueda
    if (term.trim()) {
      filtered = filtered.filter(trainer =>
        trainer.name.toLowerCase().includes(term.toLowerCase()) ||
        trainer.specialty.toLowerCase().includes(term.toLowerCase()) ||
        trainer.location.toLowerCase().includes(term.toLowerCase())
      )
    }

    setFilteredTrainers(filtered)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSelectedCategory(null)
    setFilteredTrainers(featuredTrainers)
  }

  // Inicializar filteredTrainers cuando featuredTrainers cambie
  useEffect(() => {
    setFilteredTrainers(featuredTrainers)
  }, [])

  const trainers = filteredTrainers

  const mockTrainers = filteredTrainers

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              {userType === "trainer" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTrainerPanel(!showTrainerPanel)}
                  className="text-white hover:bg-white/20 p-2"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              )}
              <div className="flex items-center gap-2">
                <Dumbbell className="w-8 h-8 text-white" />
                <span className="text-2xl font-bold text-white">Entrena Perú</span>
              </div>
            </div>

            {userType ? (
              <div className="flex items-center gap-2">
                {userType === "trainer" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setShowTrainerPanel(!showTrainerPanel)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Panel
                  </Button>
                )}
                {userType === "client" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    onClick={() => setShowClientPanel(!showClientPanel)}
                  >
                    <Menu className="w-4 h-4 mr-2" />
                    Favoritos
                  </Button>
                )}
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/20" onClick={handleLogout}>
                  Cerrar sesión
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20"
                onClick={() => setShowLoginModal(true)}
              >
                <Users className="w-4 h-4 mr-2" />
                Iniciar sesión
              </Button>
            )}
          </div>
        </div>
      </header>

      {userType === "trainer" && showTrainerPanel && (
        <div className="fixed inset-0 z-50 flex">
          {/* Sidebar Navigation */}
          <div className="w-64 bg-white shadow-xl border-r">
            <div className="p-4 border-b bg-blue-600 text-white">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-lg">Panel de Entrenador</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTrainerPanel(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="p-4 space-y-2">
              <button
                onClick={() => setActiveTrainerMenu("profile")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeTrainerMenu === "profile"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Perfil</span>
              </button>
              <button
                onClick={() => setActiveTrainerMenu("schedule")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeTrainerMenu === "schedule"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Horarios</span>
              </button>
              <button
                onClick={() => setActiveTrainerMenu("rates")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                  activeTrainerMenu === "rates"
                    ? "bg-blue-50 text-blue-600 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <DollarSign className="w-5 h-5" />
                <span className="font-medium">Tarifas</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 bg-gray-50 overflow-y-auto">
            <div className="p-8">
              {activeTrainerMenu === "profile" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Configurar Perfil</h3>

                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Foto de Perfil</label>
                      <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                          {trainerProfile.profilePhoto ? (
                            <img
                              src={trainerProfile.profilePhoto || "/placeholder.svg"}
                              alt="Profile"
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <User className="w-8 h-8 text-gray-400" />
                          )}
                        </div>
                        <Button variant="outline" size="sm">
                          Subir Foto
                        </Button>
                      </div>
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Alias/Nombre Artístico</label>
                        <input
                          type="text"
                          value={trainerProfile.alias}
                          onChange={(e) => updateTrainerProfile("alias", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombres</label>
                        <input
                          type="text"
                          value={trainerProfile.firstName}
                          onChange={(e) => updateTrainerProfile("firstName", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
                        <input
                          type="text"
                          value={trainerProfile.dni}
                          onChange={(e) => updateTrainerProfile("dni", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp</label>
                        <input
                          type="text"
                          value={trainerProfile.whatsapp}
                          onChange={(e) => updateTrainerProfile("whatsapp", e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
                      <input
                        type="text"
                        value={trainerProfile.address}
                        onChange={(e) => updateTrainerProfile("address", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
                      <input
                        type="text"
                        value={trainerProfile.location}
                        onChange={(e) => updateTrainerProfile("location", e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descripción General ({trainerProfile.description.length}/100)
                      </label>
                      <input
                        type="text"
                        value={trainerProfile.description}
                        onChange={(e) => {
                          if (e.target.value.length <= 100) {
                            updateTrainerProfile("description", e.target.value)
                          }
                        }}
                        maxLength={100}
                        placeholder="Describe brevemente tu especialidad..."
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Biografía</label>
                      <textarea
                        value={trainerProfile.bio}
                        onChange={(e) => updateTrainerProfile("bio", e.target.value)}
                        rows={4}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Reference Photos */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fotos Referenciales (Opcional)
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {trainerProfile.referencePhotos.map((photo, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
                          >
                            {photo ? (
                              <img
                                src={photo || "/placeholder.svg"}
                                alt={`Reference ${index + 1}`}
                                className="w-full h-full rounded-lg object-cover"
                              />
                            ) : (
                              <div className="text-center">
                                <Camera className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <Button variant="outline" size="sm">
                                  Subir
                                </Button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Categories */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Categorías/Especialidades</label>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {trainerProfile.categories.map((category, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                          >
                            {category}
                            <button
                              onClick={() => removeCategory(category)}
                              className="ml-1 text-blue-600 hover:text-blue-800"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Agregar nueva categoría"
                          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              addCategory(e.currentTarget.value)
                              e.currentTarget.value = ""
                            }
                          }}
                        />
                        <Button
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement
                            addCategory(input.value)
                            input.value = ""
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="pt-4">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">Guardar Cambios</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeTrainerMenu === "schedule" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Configurar Disponibilidad</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">
                        {scheduleWeekOffset === 0 ? "Esta semana" : `Semana ${scheduleWeekOffset + 1}`}
                      </span>
                      {scheduleWeekOffset < 4 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setScheduleWeekOffset(scheduleWeekOffset + 1)}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                      {scheduleWeekOffset > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setScheduleWeekOffset(scheduleWeekOffset - 1)}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="mb-6 flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-200 border border-green-300 rounded"></div>
                      <span>Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 border border-red-600 rounded"></div>
                      <span>Ocupado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-400 border border-gray-500 rounded"></div>
                      <span>No Disponible</span>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {daysOfWeek.map((day, index) => (
                      <div key={day.key} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <span className="text-lg font-semibold text-gray-700">{day.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {weekDates[index].getDate()} de {monthNames[weekDates[index].getMonth()]}
                            </span>
                          </div>
                          <Switch
                            checked={trainerSchedule[day.key as keyof typeof trainerSchedule].active}
                            onCheckedChange={() => toggleDayActive(day.key)}
                          />
                        </div>

                        {trainerSchedule[day.key as keyof typeof trainerSchedule].active && (
                          <div className="grid grid-cols-6 gap-2">
                            {timeSlots.map((slot) => {
                              const status = trainerSchedule[day.key as keyof typeof trainerSchedule].slots[slot]
                              let buttonClass = ""

                              if (status === "available") {
                                buttonClass = "bg-green-200 text-green-800 border border-green-300 hover:bg-green-300"
                              } else if (status === "occupied") {
                                buttonClass = "bg-red-500 text-white border border-red-600 hover:bg-red-600"
                              } else if (status === "unavailable") {
                                buttonClass = "bg-gray-400 text-white border border-gray-500 hover:bg-gray-500"
                              }

                              return (
                                <button
                                  key={slot}
                                  onClick={() => toggleTimeSlot(day.key, slot)}
                                  className={`text-sm p-2 rounded-md font-medium transition-colors ${buttonClass}`}
                                >
                                  {slot}
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTrainerMenu === "rates" && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Configurar Tarifas</h3>

                  <div className="max-w-2xl space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Tarifa</label>
                      <div className="flex gap-4">
                        <button
                          onClick={() => setRateType("weekly")}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            rateType === "weekly"
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          Por Semana
                        </button>
                        <button
                          onClick={() => setRateType("monthly")}
                          className={`px-4 py-2 rounded-lg border transition-colors ${
                            rateType === "monthly"
                              ? "bg-blue-600 text-white border-blue-600"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                          }`}
                        >
                          Por Mes
                        </button>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Paquetes de Entrenamiento ({rateType === "weekly" ? "por semana" : "por mes"})
                        </label>
                        <Button
                          onClick={addCustomPackage}
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Agregar
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {customPackages.map((pkg, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">Horas</label>
                              <Input
                                type="number"
                                min="1"
                                max="40"
                                value={pkg.hours}
                                onChange={(e) => updateCustomPackage(index, "hours", Number(e.target.value))}
                                className="w-full"
                              />
                            </div>
                            <div className="flex-1">
                              <label className="block text-xs text-gray-500 mb-1">Precio (S/)</label>
                              <Input
                                type="number"
                                min="0"
                                value={pkg.price}
                                onChange={(e) => updateCustomPackage(index, "price", Number(e.target.value))}
                                className="w-full"
                              />
                            </div>
                            <div className="text-sm text-gray-600 min-w-0 flex-shrink-0">
                              {pkg.hours} {pkg.hours === 1 ? "hora" : "horas"} {rateType === "weekly" ? "/sem" : "/mes"}
                            </div>
                            {customPackages.length > 1 && (
                              <Button
                                onClick={() => removeCustomPackage(index)}
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 flex-shrink-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">Guardar Cambios</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {userType === "client" && showClientPanel && (
        <div className="fixed inset-0 z-50 flex">
          <div className="w-80 bg-white shadow-xl border-r border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Mis Favoritos</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20"
                  onClick={() => setShowClientPanel(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {favoriteTrainers.length === 0 ? (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No tienes entrenadores favoritos aún</p>
                  <p className="text-gray-400 text-xs mt-1">Haz clic en ❤️ para agregar favoritos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {mockTrainers
                    .filter((trainer) => favoriteTrainers.includes(trainer.id))
                    .map((trainer) => (
                      <div key={trainer.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-3">
                          <img
                            src={trainer.image || "/placeholder.svg"}
                            alt={trainer.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 text-sm truncate">{trainer.name}</h3>
                            <p className="text-xs text-gray-600 truncate">{trainer.specialty}</p>
                            <div className="flex items-center gap-1 mt-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs text-gray-600">{trainer.rating}</span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              className="h-7 px-2 text-xs bg-blue-600 hover:bg-blue-700"
                              onClick={() => (window.location.href = `/trainer/${trainer.id}`)}
                            >
                              Ver
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-red-500 hover:bg-red-50"
                              onClick={() => toggleFavorite(trainer.id)}
                            >
                              <Heart className="w-3 h-3 fill-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 bg-black/20" onClick={() => setShowClientPanel(false)} />
        </div>
      )}

      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-bold text-gray-900">¿Cómo quieres usar Entrena Perú?</h2>

            <div className="space-y-3">
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                onClick={() => handleLogin("client")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Quiero entrenar</h3>
                      <p className="text-sm text-gray-600">Buscar y contratar entrenadores</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-blue-500"
                onClick={() => handleLogin("trainer")}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <Dumbbell className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900">Soy entrenador</h3>
                      <p className="text-sm text-gray-600">Ofrecer mis servicios de entrenamiento</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <p className="text-xs text-gray-500">Al continuar, iniciarás sesión con Google</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Map Modal */}
      <Dialog open={showMapModal} onOpenChange={setShowMapModal}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-xl font-bold text-gray-900">Entrenadores cerca de ti</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowMapModal(false)} className="h-8 w-8 p-0">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 relative">
              <MapContainer
                center={[-12.0464, -77.0428]} // Lima, Peru coordinates
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                className="z-0"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Trainer markers */}
                {trainers.map((trainer, index) => (
                  <Marker
                    key={trainer.id}
                    position={[
                      -12.0464 + (Math.random() - 0.5) * 0.02, // Random positions around Lima
                      -77.0428 + (Math.random() - 0.5) * 0.02,
                    ]}
                    icon={
                      new L.Icon({
                        iconUrl:
                          "data:image/svg+xml;base64," +
                          btoa(`
                        <svg width="25" height="35" viewBox="0 0 25 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12.5 0C5.596 0 0 5.596 0 12.5C0 21.875 12.5 35 12.5 35C12.5 35 25 21.875 25 12.5C25 5.596 19.404 0 12.5 0Z" fill="#2563eb"/>
                          <circle cx="12.5" cy="12.5" r="6" fill="white"/>
                          <circle cx="12.5" cy="12.5" r="3" fill="#2563eb"/>
                        </svg>
                      `),
                        iconSize: [25, 35],
                        iconAnchor: [12, 35],
                        popupAnchor: [0, -35],
                      })
                    }
                  >
                    <Popup>
                      <div className="p-2 min-w-[200px]">
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={trainer.image || "/placeholder.svg"}
                            alt={trainer.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{trainer.name}</h3>
                            <p className="text-sm text-gray-600">{trainer.specialty}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-2">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium ml-1">{trainer.rating}</span>
                          </div>
                          <span className="text-sm text-gray-500">({trainer.reviews} reseñas)</span>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          Desde <span className="font-semibold text-blue-600">S/ {trainer.price}/hora</span>
                        </div>

                        <Button
                          size="sm"
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            setShowMapModal(false)
                            // Navigate to trainer profile
                          }}
                        >
                          Ver perfil
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* User location marker */}
                <Marker
                  position={[-12.0464, -77.0428]}
                  icon={
                    new L.Icon({
                      iconUrl:
                        "data:image/svg+xml;base64," +
                        btoa(`
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="10" cy="10" r="8" fill="#ef4444" stroke="white" strokeWidth="2"/>
                        <circle cx="10" cy="10" r="3" fill="white"/>
                      </svg>
                    `),
                      iconSize: [20, 20],
                      iconAnchor: [10, 10],
                    })
                  }
                >
                  <Popup>
                    <div className="text-center p-2">
                      <p className="font-semibold">Tu ubicación</p>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="p-4 border-t bg-gray-50">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <span>Entrenadores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Tu ubicación</span>
                  </div>
                </div>
                <span>{trainers.length} entrenadores encontrados</span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hero Section */}
      <section className="px-4 py-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Encuentra tu entrenador</h1>
        <p className="text-blue-100 mb-6">¡Transforma tu cuerpo con los mejores! 💪</p>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Buscar por especialidad, entrenador, ubicación"
            className="pl-10 pr-16 sm:pr-20 py-3 bg-white/95 backdrop-blur-sm border-0 rounded-xl text-gray-800 placeholder:text-gray-500"
          />
          {searchTerm && (
            <Button
              onClick={clearSearch}
              variant="ghost"
              size="sm"
              className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
          <Button
            onClick={handleMapClick}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-lg px-2 sm:px-4"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>

        {/* Indicador de resultados */}
        {(searchTerm || selectedCategory) && (
          <div className="text-center mb-4">
            <p className="text-blue-100 text-sm">
              {selectedCategory && searchTerm ? (
                `Mostrando ${filteredTrainers.length} entrenadores de "${selectedCategory}" que coinciden con "${searchTerm}"`
              ) : selectedCategory ? (
                `Mostrando ${filteredTrainers.length} entrenadores de "${selectedCategory}"`
              ) : (
                `Mostrando ${filteredTrainers.length} entrenadores que coinciden con "${searchTerm}"`
              )}
            </p>
          </div>
        )}

        {/* Categories */}
        <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">
          {categories.map((category, index) => {
            const isSelected = selectedCategory === category.name
            return (
              <button
                key={index}
                onClick={() => handleCategoryFilter(category.name)}
                className="text-center transition-all duration-200 hover:scale-105"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg transition-all ${
                    isSelected 
                      ? `${category.color} ring-2 ring-white ring-offset-2 ring-offset-blue-600 scale-110` 
                      : `${category.color} hover:scale-105`
                  }`}
                >
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <span className={`text-xs font-medium transition-colors ${
                  isSelected ? 'text-white' : 'text-blue-100'
                }`}>
                  {category.name}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-6">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">500+</div>
              <div className="text-xs text-blue-100">Entrenadores</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">2.5k+</div>
              <div className="text-xs text-blue-100">Clientes activos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">4.8★</div>
              <div className="text-xs text-blue-100">Calificación</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Trainers */}
      <section className="px-4 pb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Entrenadores destacados</h2>
          <Badge variant="secondary" className="bg-white/20 text-white border-0">
            <Clock className="w-3 h-3 mr-1" />
            Disponibles ahora
          </Badge>
        </div>

        <div className="space-y-3">
          {filteredTrainers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-white/80 mb-2">No se encontraron entrenadores</p>
              <Button 
                onClick={clearSearch}
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Limpiar filtros
              </Button>
            </div>
          ) : (
            filteredTrainers.map((trainer) => (
            <div key={trainer.id} className="relative">
              <Link href={`/trainer/${trainer.id}`}>
                <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={trainer.image || "/placeholder.svg"}
                          alt={trainer.name}
                          className="w-16 h-16 rounded-xl object-cover"
                        />
                        <div
                          className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                            trainer.available ? "bg-green-500" : "bg-gray-400"
                          }`}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">{trainer.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium text-gray-700">{trainer.rating}</span>
                            <span className="text-xs text-gray-500">({trainer.reviews})</span>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 mb-2">{trainer.specialty}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {trainer.location}
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-blue-600">{trainer.price}</div>
                            <div className="text-xs text-gray-500">desde</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {userType === "client" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 w-8 h-8 p-0 bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleFavorite(trainer.id)
                  }}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      favoriteTrainers.includes(trainer.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                    }`}
                  />
                </Button>
              )}
            </div>
          ))
        )}
        </div>

        <Button className="w-full mt-4 bg-white text-blue-600 hover:bg-blue-50 font-semibold py-3 rounded-xl">
          Ver todos los entrenadores
        </Button>
      </section>
    </div>
  )
}
