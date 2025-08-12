"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface TrainerData {
  id: string
  name: string
  specialty: string
  rating: number
  reviews: number
  experience: string
  location: string
  image: string
  bio: string
  work: string
  certifications: string[]
  additionalPhotos: string[]
  userRatings: Array<{
    userId: string
    rating: number
    comment: string
  }>
  packages: Array<{
    id: number
    hours: number
    weekly: number
    price: number
    popular: boolean
    description: string
    name: string
  }>
  schedule: Record<string, Array<{ slot: string; status: "available" | "reserved" | "unavailable" }>>
  phone: string
  hourlyRate: number
}

interface Package {
  id: number
  hours: number
  weekly: number
  price: number
  popular: boolean
  description: string
  name: string
}

const getTrainerData = (id: string) => {
  const trainers = {
    "1": {
      id: "1",
      name: "Carlos Mendoza",
      specialty: "Entrenamiento funcional",
      rating: 4.9,
      reviews: 127,
      experience: "5 años",
      location: "San Isidro",
      image: "/placeholder.svg?height=120&width=120",
      bio: "Especialista en entrenamiento funcional con certificación internacional. Me enfoco en ayudar a mis clientes a alcanzar sus objetivos de forma segura y efectiva.",
      work: "Trabajo con atletas profesionales y personas que buscan mejorar su condición física. Mi metodología se basa en movimientos funcionales que mejoran la fuerza, resistencia y movilidad.",
      certifications: ["ACSM Certified", "Functional Training", "Nutrition Coach"],
      additionalPhotos: [
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
        "/placeholder.svg?height=200&width=200",
      ],
      userRatings: [
        { userId: "user1", rating: 5, comment: "Excelente entrenador, muy profesional" },
        { userId: "user2", rating: 4, comment: "Buenos resultados, recomendado" },
        { userId: "user3", rating: 5, comment: "Superó mis expectativas" },
      ],
      packages: [
        {
          id: 1,
          hours: 1,
          weekly: 1,
          price: 40,
          popular: false,
          description: "Perfecto para comenzar",
          name: "Paquete Básico",
        },
        {
          id: 2,
          hours: 3,
          weekly: 3,
          price: 100,
          popular: true,
          description: "Más popular - Resultados consistentes",
          name: "Paquete Popular",
        },
        {
          id: 3,
          hours: 10,
          weekly: 10,
          price: 200,
          popular: false,
          description: "Transformación completa",
          name: "Paquete Premium",
        },
      ],
      schedule: {
        Lunes: [
          { slot: "6-7", status: "available" },
          { slot: "7-8", status: "reserved" },
          { slot: "8-9", status: "available" },
          { slot: "9-10", status: "available" },
          { slot: "10-11", status: "unavailable" },
          { slot: "11-12", status: "available" },
          { slot: "12-13", status: "unavailable" },
          { slot: "13-14", status: "unavailable" },
          { slot: "14-15", status: "available" },
          { slot: "15-16", status: "available" },
          { slot: "16-17", status: "reserved" },
          { slot: "17-18", status: "unavailable" },
          { slot: "18-19", status: "available" },
          { slot: "19-20", status: "available" },
          { slot: "20-21", status: "reserved" },
          { slot: "21-22", status: "unavailable" },
          { slot: "22-23", status: "unavailable" },
          { slot: "23-24", status: "available" },
        ],
        Martes: [
          { slot: "6-7", status: "available" },
          { slot: "7-8", status: "available" },
          { slot: "8-9", status: "unavailable" },
          { slot: "9-10", status: "available" },
          { slot: "10-11", status: "reserved" },
          { slot: "11-12", status: "available" },
          { slot: "12-13", status: "unavailable" },
          { slot: "13-14", status: "unavailable" },
          { slot: "14-15", status: "available" },
          { slot: "15-16", status: "available" },
          { slot: "16-17", status: "reserved" },
          { slot: "17-18", status: "unavailable" },
          { slot: "18-19", status: "available" },
          { slot: "19-20", status: "available" },
          { slot: "20-21", status: "available" },
          { slot: "21-22", status: "unavailable" },
          { slot: "22-23", status: "unavailable" },
          { slot: "23-24", status: "reserved" },
        ],
        Miércoles: [
          { slot: "6-7", status: "unavailable" },
          { slot: "7-8", status: "available" },
          { slot: "8-9", status: "available" },
          { slot: "9-10", status: "reserved" },
          { slot: "10-11", status: "available" },
          { slot: "11-12", status: "available" },
          { slot: "12-13", status: "unavailable" },
          { slot: "13-14", status: "unavailable" },
          { slot: "14-15", status: "available" },
          { slot: "15-16", status: "available" },
          { slot: "16-17", status: "available" },
          { slot: "17-18", status: "reserved" },
          { slot: "18-19", status: "available" },
          { slot: "19-20", status: "unavailable" },
          { slot: "20-21", status: "available" },
          { slot: "21-22", status: "unavailable" },
          { slot: "22-23", status: "unavailable" },
          { slot: "23-24", status: "unavailable" },
        ],
        Jueves: [
          { slot: "6-7", status: "available" },
          { slot: "7-8", status: "available" },
          { slot: "8-9", status: "available" },
          { slot: "9-10", status: "available" },
          { slot: "10-11", status: "reserved" },
          { slot: "11-12", status: "available" },
          { slot: "12-13", status: "unavailable" },
          { slot: "13-14", status: "unavailable" },
          { slot: "14-15", status: "reserved" },
          { slot: "15-16", status: "available" },
          { slot: "16-17", status: "available" },
          { slot: "17-18", status: "unavailable" },
          { slot: "18-19", status: "available" },
          { slot: "19-20", status: "available" },
          { slot: "20-21", status: "available" },
          { slot: "21-22", status: "unavailable" },
          { slot: "22-23", status: "unavailable" },
          { slot: "23-24", status: "available" },
        ],
        Viernes: [
          { slot: "6-7", status: "available" },
          { slot: "7-8", status: "reserved" },
          { slot: "8-9", status: "available" },
          { slot: "9-10", status: "available" },
          { slot: "10-11", status: "available" },
          { slot: "11-12", status: "reserved" },
          { slot: "12-13", status: "unavailable" },
          { slot: "13-14", status: "unavailable" },
          { slot: "14-15", status: "available" },
          { slot: "15-16", status: "available" },
          { slot: "16-17", status: "available" },
          { slot: "17-18", status: "reserved" },
          { slot: "18-19", status: "available" },
          { slot: "19-20", status: "available" },
          { slot: "20-21", status: "available" },
          { slot: "21-22", status: "unavailable" },
          { slot: "22-23", status: "unavailable" },
          { slot: "23-24", status: "available" },
        ],
        Sábado: [
          { slot: "6-7", status: "unavailable" },
          { slot: "7-8", status: "available" },
          { slot: "8-9", status: "available" },
          { slot: "9-10", status: "reserved" },
          { slot: "10-11", status: "available" },
          { slot: "11-12", status: "available" },
          { slot: "12-13", status: "available" },
          { slot: "13-14", status: "unavailable" },
          { slot: "14-15", status: "available" },
          { slot: "15-16", status: "available" },
          { slot: "16-17", status: "available" },
          { slot: "17-18", status: "reserved" },
          { slot: "18-19", status: "available" },
          { slot: "19-20", status: "available" },
          { slot: "20-21", status: "available" },
          { slot: "21-22", status: "unavailable" },
          { slot: "22-23", status: "unavailable" },
          { slot: "23-24", status: "unavailable" },
        ],
        Domingo: [
          { slot: "6-7", status: "unavailable" },
          { slot: "7-8", status: "available" },
          { slot: "8-9", status: "available" },
          { slot: "9-10", status: "available" },
          { slot: "10-11", status: "reserved" },
          { slot: "11-12", status: "available" },
          { slot: "12-13", status: "available" },
          { slot: "13-14", status: "unavailable" },
          { slot: "14-15", status: "reserved" },
          { slot: "15-16", status: "available" },
          { slot: "16-17", status: "available" },
          { slot: "17-18", status: "unavailable" },
          { slot: "18-19", status: "available" },
          { slot: "19-20", status: "available" },
          { slot: "20-21", status: "available" },
          { slot: "21-22", status: "unavailable" },
          { slot: "22-23", status: "unavailable" },
          { slot: "23-24", status: "unavailable" },
        ],
      },
      phone: "51987654321",
      hourlyRate: 50,
    },
  }
  return trainers[id as keyof typeof trainers]
}

export default function TrainerProfile({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isExpanded, setIsExpanded] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null)
  const [selectedSlots, setSelectedSlots] = useState<string[]>([])
  const [currentWeek, setCurrentWeek] = useState(0)
  const [showPhotos, setShowPhotos] = useState(false)
  const [userRating, setUserRating] = useState(0)
  const [ratingComment, setRatingComment] = useState("")
  const [showRatingModal, setShowRatingModal] = useState(false)
  const [userType, setUserType] = useState<"client" | "trainer" | null>(null)
  const [showRatingsModal, setShowRatingsModal] = useState(false)

  const getCurrentWeekDates = (offset = 0) => {
    const today = new Date()
    const currentDay = today.getDay()
    const monday = new Date(today)
    monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1) + offset * 7)

    const weekDates = []
    const months = [
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

    for (let i = 0; i < 7; i++) {
      const date = new Date(monday)
      date.setDate(monday.getDate() + i)
      weekDates.push({
        day: date.getDate(),
        month: months[date.getMonth()],
      })
    }

    return weekDates
  }

  const weekDates = getCurrentWeekDates(currentWeek)
  const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

  const handleNextWeek = () => {
    setCurrentWeek((prev) => prev + 1)
    setSelectedSlots([]) // Clear selected slots when changing week
  }

  const trainer = getTrainerData(params.id)

  if (!trainer) {
    return <div>Entrenador no encontrado</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500 hover:bg-green-600"
      case "reserved":
        return "bg-red-500"
      case "unavailable":
        return "bg-gray-400"
      default:
        return "bg-gray-300"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Check className="w-2.5 h-2.5 text-white" />
      case "reserved":
        return <X className="w-2.5 h-2.5 text-white" />
      case "unavailable":
        return <X className="w-2.5 h-2.5 text-white" />
      default:
        return null
    }
  }

  const getAvailableSlots = () => {
    const availableSlots: string[] = []
    Object.entries(trainer.schedule).forEach(([day, slots]) => {
      slots.forEach(({ slot, status }) => {
        if (status === "available") {
          availableSlots.push(`${day} ${slot}`)
        }
      })
    })
    return availableSlots
  }

  const handleSlotToggle = (slot: string) => {
    if (!selectedPackage) return

    const selectedPkg = trainer.packages.find((pkg) => pkg.id === selectedPackage.id)
    if (!selectedPkg) return

    if (selectedSlots.includes(slot)) {
      setSelectedSlots(selectedSlots.filter((s) => s !== slot))
    } else if (selectedSlots.length < selectedPkg.hours) {
      setSelectedSlots([...selectedSlots, slot])
    }
  }

  const handleWhatsAppBooking = () => {
    const selectedPkg = selectedPackage ? trainer.packages.find((pkg) => pkg.id === selectedPackage.id) : null

    let message = `🏋️‍♂️ ¡Hola ${trainer.name}! 👋\n\n`
    message += `Me interesa contratar tus servicios de ${trainer.specialty} 💪\n\n`

    if (selectedPkg && selectedSlots.length > 0) {
      message += `📦 *PAQUETE SELECCIONADO:*\n`
      message += `• ${selectedPkg.hours} hora${selectedPkg.hours > 1 ? "s" : ""} por semana\n`
      message += `• Precio: S/ ${selectedPkg.price} semanal 💰\n`
      message += `• ${selectedPkg.description}\n\n`

      message += `🗓️ *HORARIOS PREFERIDOS:*\n`

      // Group slots by day for better organization
      const slotsByDay: { [key: string]: string[] } = {}
      selectedSlots.forEach((slot) => {
        const [day, time] = slot.split(" ")
        if (!slotsByDay[day]) slotsByDay[day] = []
        slotsByDay[day].push(time)
      })

      Object.entries(slotsByDay).forEach(([day, times]) => {
        const dayEmoji =
          {
            Lunes: "📅",
            Martes: "📅",
            Miércoles: "📅",
            Jueves: "📅",
            Viernes: "📅",
            Sábado: "🏖️",
            Domingo: "🏖️",
          }[day] || "📅"

        message += `${dayEmoji} *${day}:* ${times.join(", ")}\n`
      })

      message += `\n✅ Total: ${selectedSlots.length} sesión${selectedSlots.length > 1 ? "es" : ""} seleccionada${selectedSlots.length > 1 ? "s" : ""}\n\n`
    }

    message += `❓ ¿Podrías confirmar disponibilidad y coordinar los detalles?\n\n`
    message += `¡Espero tu respuesta! 😊🔥`

    const whatsappUrl = `https://wa.me/${trainer.phone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
    setShowBookingModal(false)
  }

  const handleRatingSubmit = () => {
    if (userRating > 0 && userType === "client") {
      // Here you would typically send the rating to your backend
      console.log("Rating submitted:", { rating: userRating, comment: ratingComment })
      setShowRatingModal(false)
      setUserRating(0)
      setRatingComment("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      <div className="">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/90 to-blue-700/90 backdrop-blur-sm">
          <div className="max-w-md mx-auto px-4 py-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2"
                onClick={() => router.back()}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-semibold text-white">Perfil del entrenador</h1>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-6 space-y-4">
          {/* Trainer Info Card */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={trainer.image || "/placeholder.svg"}
                  alt={trainer.name}
                  className="w-20 h-20 rounded-xl object-cover"
                />
                <div className="flex-1">
                  <h1 className="text-xl font-bold text-gray-900 mb-1">{trainer.name}</h1>
                  <p className="text-blue-600 font-medium mb-2">{trainer.specialty}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div
                      className="flex items-center gap-1 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors"
                      onClick={() => setShowRatingsModal(true)}
                    >
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{trainer.rating}</span>
                      <span>({trainer.reviews} reseñas)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span>{trainer.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {isExpanded && (
                <div className="space-y-3 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Descripción</h4>
                    <p className="text-gray-700 text-sm">{trainer.bio}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Experiencia</h4>
                    <p className="text-gray-700 text-sm">{trainer.work}</p>
                  </div>

                  {/* Additional photos section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">Fotos adicionales</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPhotos(!showPhotos)}
                        className="text-blue-600 hover:bg-blue-50"
                      >
                        {showPhotos ? "Ocultar" : "Ver fotos"}
                      </Button>
                    </div>

                    {showPhotos && (
                      <div className="grid grid-cols-2 gap-2">
                        {trainer.additionalPhotos?.map((photo, index) => (
                          <img
                            key={index}
                            src={photo || "/placeholder.svg"}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full justify-center text-blue-600 hover:bg-blue-50 mb-4"
              >
                {isExpanded ? (
                  <>
                    Ver menos <ChevronUp className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Ver más <ChevronDown className="w-4 h-4 ml-1" />
                  </>
                )}
              </Button>

              <div className="flex flex-wrap gap-2">
                {trainer.certifications.map((cert, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-700 text-xs">
                    {cert}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Pricing Packages */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg text-gray-900">Paquetes de entrenamiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {trainer.packages.map((pkg, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedPackage?.id === pkg.id
                      ? "border-blue-500 bg-blue-50"
                      : pkg.popular
                        ? "border-blue-300 bg-blue-25"
                        : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedPackage(selectedPackage?.id === pkg.id ? null : pkg)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {pkg.hours} hora{pkg.hours > 1 ? "s" : ""}/semana
                        </span>
                        {pkg.popular && <Badge className="bg-blue-500 text-white text-xs">Más popular</Badge>}
                        {selectedPackage?.id === pkg.id && (
                          <Badge className="bg-green-500 text-white text-xs">Seleccionado</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{pkg.description}</p>
                      <p className="text-xs text-gray-500">
                        {pkg.weekly} sesión{pkg.weekly > 1 ? "es" : ""} por semana
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-blue-600">S/ {pkg.price}</div>
                      <div className="text-xs text-gray-500">por semana</div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Horarios disponibles
                </CardTitle>
                <button
                  onClick={handleNextWeek}
                  className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                >
                  <ChevronRight className="w-4 h-4 text-blue-600" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {currentWeek === 0 ? "Esta semana" : `Semana ${currentWeek + 1}`}
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(trainer.schedule).map(([day, slots], index) => (
                  <div key={day} className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                      {day}
                      <span className="text-xs text-gray-600 ml-2">
                        {weekDates[index]?.day} de {weekDates[index]?.month}
                      </span>
                    </h4>
                    <div className="grid grid-cols-6 gap-1 text-xs">
                      {slots.map(({ slot, status }) => {
                        const slotKey = `${day} ${slot}`
                        const isSelected = selectedSlots.includes(slotKey)

                        let slotClasses = "p-1 rounded text-center text-[9px] font-medium transition-all duration-200 "

                        if (status === "available") {
                          if (isSelected) {
                            slotClasses +=
                              "bg-blue-500 text-white border-2 border-blue-600 transform scale-105 shadow-md"
                          } else {
                            slotClasses +=
                              "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 cursor-pointer"
                          }
                        } else if (status === "reserved") {
                          slotClasses += "bg-red-100 text-red-600 border border-red-200 cursor-not-allowed opacity-75"
                        } else if (status === "unavailable") {
                          slotClasses +=
                            "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed opacity-60"
                        }

                        return (
                          <div
                            key={slot}
                            className={slotClasses}
                            onClick={() => status === "available" && selectedPackage && handleSlotToggle(slotKey)}
                          >
                            {slot}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-center gap-4 text-xs mt-4">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
                    <span className="text-gray-600">Disponible</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
                    <span className="text-gray-600">Ocupado</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-100 border border-gray-200 rounded"></div>
                    <span className="text-gray-600">No disponible</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span className="text-gray-600">Seleccionado</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Modal */}
          {showBookingModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
              <div className="bg-white rounded-t-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800">Reservar Entrenamiento</h3>
                    <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-gray-100 rounded-full">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Navigation in modal */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleNextWeek}
                        className="p-1 rounded-full bg-blue-50 hover:bg-blue-100 transition-colors"
                      >
                        <ChevronRight className="w-3 h-3 text-blue-600" />
                      </button>
                      <span className="text-xs text-gray-600">
                        {currentWeek === 0 ? "Esta semana" : `Semana ${currentWeek + 1}`}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-6 gap-2 mb-6">
                    {Object.entries(trainer.schedule).map(([day, slots], index) => (
                      <div key={day} className="space-y-2">
                        <div className="font-semibold text-center text-gray-700 py-2 bg-gray-50 rounded text-xs">
                          <div>{day.slice(0, 3)}</div>
                          <div className="text-[10px] text-gray-500">
                            {weekDates[index]?.day} {weekDates[index]?.month.slice(0, 3)}
                          </div>
                        </div>
                        {slots.map(({ slot, status }) => {
                          const slotKey = `${day} ${slot}`
                          const isSelected = selectedSlots.includes(slotKey)

                          let buttonClasses = "w-full p-2 rounded text-xs font-medium transition-all duration-200 "

                          if (status === "available") {
                            if (isSelected) {
                              buttonClasses +=
                                "bg-blue-500 text-white border-2 border-blue-600 transform scale-105 shadow-lg"
                            } else {
                              buttonClasses +=
                                "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 hover:scale-105"
                            }
                          } else if (status === "reserved") {
                            buttonClasses +=
                              "bg-red-100 text-red-600 border border-red-200 cursor-not-allowed opacity-75"
                          } else if (status === "unavailable") {
                            buttonClasses +=
                              "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed opacity-60"
                          }

                          return (
                            <button
                              key={slot}
                              className={buttonClasses}
                              onClick={() => status === "available" && handleSlotToggle(slotKey)}
                              disabled={status !== "available"}
                            >
                              {slot}
                            </button>
                          )
                        })}
                      </div>
                    ))}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${(selectedSlots.length / selectedPackage?.hours || 0) * 100}%`,
                      }}
                    ></div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setShowBookingModal(false)} className="flex-1">
                      Cancelar
                    </Button>
                    {selectedPackage && selectedSlots.length === selectedPackage.hours && (
                      <Button
                        onClick={handleWhatsAppBooking}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold"
                      >
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Reservar por WhatsApp
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rating Modal */}
          <Dialog open={showRatingModal} onOpenChange={setShowRatingModal}>
            <DialogContent className="sm:max-w-md">
              <div className="text-center space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Valorar entrenador</h2>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-2">¿Cómo calificarías a {trainer.name}?</p>
                    <div className="flex justify-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setUserRating(star)} className="p-1">
                          <Star
                            className={`w-8 h-8 ${
                              star <= userRating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 hover:text-yellow-300"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <textarea
                      placeholder="Comparte tu experiencia (opcional)"
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowRatingModal(false)} className="flex-1">
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleRatingSubmit}
                    disabled={userRating === 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold"
                  >
                    Enviar valoración
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Ratings Modal */}
          <Dialog open={showRatingsModal} onOpenChange={setShowRatingsModal}>
            <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Comentarios y valoraciones</h2>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{trainer.rating}</div>
                    <div className="flex justify-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= trainer.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{trainer.reviews} reseñas</div>
                  </div>
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {trainer.userRatings?.map((review, index) => (
                    <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">Usuario {index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Fixed WhatsApp button at bottom */}
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 pb-6">
          <Button
            onClick={() => setShowBookingModal(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 text-base font-semibold rounded-xl shadow-lg"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Reservar por WhatsApp
          </Button>
        </div>

        {/* Bottom padding to prevent content overlap */}
        <div className="pb-20"></div>
      </div>
    </div>
  )
}
