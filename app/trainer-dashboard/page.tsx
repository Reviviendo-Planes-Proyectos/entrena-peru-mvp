"use client"

import { useState } from "react"
import { Calendar, Settings, User, Clock, Edit3, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock trainer data
const initialTrainerData = {
  name: "Carlos Mendoza",
  specialty: "Entrenamiento funcional",
  bio: "Especialista en entrenamiento funcional con certificación internacional.",
  location: "San Isidro",
  phone: "51987654321",
  packages: [
    { hours: 1, weekly: 1, price: 40 },
    { hours: 3, weekly: 3, price: 100 },
    { hours: 10, weekly: 10, price: 200 },
  ],
  schedule: {
    Lunes: {
      "08:00": "available",
      "09:00": "available",
      "10:00": "reserved",
      "11:00": "available",
      "16:00": "available",
      "17:00": "not-available",
      "18:00": "available",
    },
    Martes: {
      "08:00": "available",
      "09:00": "reserved",
      "10:00": "available",
      "11:00": "available",
      "16:00": "not-available",
      "17:00": "available",
      "18:00": "available",
    },
    Miércoles: {
      "08:00": "available",
      "09:00": "available",
      "10:00": "available",
      "11:00": "reserved",
      "16:00": "available",
      "17:00": "available",
      "18:00": "not-available",
    },
    Jueves: {
      "08:00": "reserved",
      "09:00": "available",
      "10:00": "available",
      "11:00": "available",
      "16:00": "available",
      "17:00": "available",
      "18:00": "available",
    },
    Viernes: {
      "08:00": "available",
      "09:00": "available",
      "10:00": "not-available",
      "11:00": "available",
      "16:00": "reserved",
      "17:00": "available",
      "18:00": "available",
    },
    Sábado: {
      "08:00": "available",
      "09:00": "available",
      "10:00": "available",
      "11:00": "available",
      "16:00": "not-available",
      "17:00": "not-available",
      "18:00": "not-available",
    },
    Domingo: {
      "08:00": "not-available",
      "09:00": "not-available",
      "10:00": "available",
      "11:00": "available",
      "16:00": "available",
      "17:00": "available",
      "18:00": "not-available",
    },
  },
}

export default function TrainerDashboard() {
  const [trainerData, setTrainerData] = useState(initialTrainerData)
  const [editingProfile, setEditingProfile] = useState(false)
  const [editingPackages, setEditingPackages] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500 hover:bg-green-600"
      case "reserved":
        return "bg-red-500 cursor-not-allowed"
      case "not-available":
        return "bg-gray-400 hover:bg-gray-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "available":
        return "Disponible"
      case "reserved":
        return "Reservado"
      case "not-available":
        return "No disponible"
      default:
        return "No disponible"
    }
  }

  const toggleTimeSlot = (day: string, time: string) => {
    const currentStatus = trainerData.schedule[day as keyof typeof trainerData.schedule][time]
    if (currentStatus === "reserved") return // Can't change reserved slots

    const newStatus = currentStatus === "available" ? "not-available" : "available"

    setTrainerData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...prev.schedule[day as keyof typeof prev.schedule],
          [time]: newStatus,
        },
      },
    }))
  }

  const updateProfile = (field: string, value: string) => {
    setTrainerData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updatePackage = (index: number, field: string, value: number) => {
    setTrainerData((prev) => ({
      ...prev,
      packages: prev.packages.map((pkg, i) => (i === index ? { ...pkg, [field]: value } : pkg)),
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="px-4 py-3">
          <h1 className="text-white font-bold text-lg">Panel de Entrenador</h1>
          <p className="text-blue-100 text-sm">Gestiona tu perfil y horarios</p>
        </div>
      </header>

      <div className="px-4 py-6">
        <Tabs defaultValue="schedule" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md">
            <TabsTrigger
              value="schedule"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Horarios
            </TabsTrigger>
            <TabsTrigger
              value="profile"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger
              value="packages"
              className="text-white data-[state=active]:bg-white data-[state=active]:text-blue-600"
            >
              <Settings className="w-4 h-4 mr-2" />
              Paquetes
            </TabsTrigger>
          </TabsList>

          {/* Schedule Management */}
          <TabsContent value="schedule">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg text-gray-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Gestionar Horarios
                </CardTitle>
                <p className="text-sm text-gray-600">Toca los horarios para cambiar entre disponible y no disponible</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(trainerData.schedule).map(([day, hours]) => (
                    <div key={day}>
                      <h4 className="font-medium text-gray-900 mb-2">{day}</h4>
                      <div className="grid grid-cols-4 gap-2">
                        {Object.entries(hours).map(([time, status]) => (
                          <button
                            key={time}
                            onClick={() => toggleTimeSlot(day, time)}
                            disabled={status === "reserved"}
                            className={`p-2 rounded-lg text-center text-xs font-medium text-white transition-colors ${getStatusColor(status)}`}
                          >
                            <div>{time}</div>
                            <div className="text-[10px] opacity-80">{getStatusText(status)}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-medium text-blue-900 mb-2">Leyenda:</h5>
                  <div className="flex flex-wrap gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Disponible (toca para cambiar)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Reservado (no editable)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-gray-400 rounded"></div>
                      <span>No disponible (toca para cambiar)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Profile Management */}
          <TabsContent value="profile">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">Información del Perfil</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setEditingProfile(!editingProfile)}>
                    {editingProfile ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Nombre</label>
                  {editingProfile ? (
                    <Input
                      value={trainerData.name}
                      onChange={(e) => updateProfile("name", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{trainerData.name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Especialidad</label>
                  {editingProfile ? (
                    <Input
                      value={trainerData.specialty}
                      onChange={(e) => updateProfile("specialty", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{trainerData.specialty}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Ubicación</label>
                  {editingProfile ? (
                    <Input
                      value={trainerData.location}
                      onChange={(e) => updateProfile("location", e.target.value)}
                      className="mt-1"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{trainerData.location}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Biografía</label>
                  {editingProfile ? (
                    <Textarea
                      value={trainerData.bio}
                      onChange={(e) => updateProfile("bio", e.target.value)}
                      className="mt-1"
                      rows={3}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{trainerData.bio}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">Teléfono WhatsApp</label>
                  {editingProfile ? (
                    <Input
                      value={trainerData.phone}
                      onChange={(e) => updateProfile("phone", e.target.value)}
                      className="mt-1"
                      placeholder="51987654321"
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{trainerData.phone}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Package Management */}
          <TabsContent value="packages">
            <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-gray-900">Paquetes de Entrenamiento</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setEditingPackages(!editingPackages)}>
                    {editingPackages ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {trainerData.packages.map((pkg, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Horas/semana</label>
                        {editingPackages ? (
                          <Input
                            type="number"
                            value={pkg.hours}
                            onChange={(e) => updatePackage(index, "hours", Number.parseInt(e.target.value))}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{pkg.hours}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Sesiones/semana</label>
                        {editingPackages ? (
                          <Input
                            type="number"
                            value={pkg.weekly}
                            onChange={(e) => updatePackage(index, "weekly", Number.parseInt(e.target.value))}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">{pkg.weekly}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Precio (S/)</label>
                        {editingPackages ? (
                          <Input
                            type="number"
                            value={pkg.price}
                            onChange={(e) => updatePackage(index, "price", Number.parseInt(e.target.value))}
                            className="mt-1"
                          />
                        ) : (
                          <p className="mt-1 text-gray-900">S/ {pkg.price}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
