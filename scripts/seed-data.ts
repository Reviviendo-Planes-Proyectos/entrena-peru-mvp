// Este archivo usa servicios del lado del cliente que requieren autenticación
// Para poblar la base de datos, usa seed-admin.ts en su lugar

// Imports condicionales para evitar errores de Firebase
let TrainerService: any;
let UserService: any;
let BookingService: any;
let Timestamp: any;

// Solo importar si no se ejecuta directamente
if (require.main !== module) {
  const trainersModule = require('../lib/services/trainers');
  const usersModule = require('../lib/services/users');
  const bookingsModule = require('../lib/services/bookings');
  const firestoreModule = require('firebase/firestore');
  
  TrainerService = trainersModule.TrainerService;
  UserService = usersModule.UserService;
  BookingService = bookingsModule.BookingService;
  Timestamp = firestoreModule.Timestamp;
}

// Datos de ejemplo para entrenadores
const trainersData = [
  {
    uid: 'trainer-001',
    email: 'ana.garcia@entrenaperu.com',
    name: 'Ana García',
    specialties: ['Pilates', 'Yoga', 'Stretching'],
    bio: 'Instructora certificada de Pilates y Yoga con más de 8 años de experiencia. Especializada en rehabilitación y bienestar integral.',
    location: {
      lat: -12.0464,
      lng: -77.0428,
      address: 'Miraflores, Lima, Perú'
    },
    phone: '+51987654321',
    profileImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400',
    rating: 4.9,
    reviewCount: 47,
    isActive: true,
    experience: '8 años',
    certifications: ['Certificación Internacional de Pilates', 'Instructor de Yoga RYT-200']
  },
  {
    uid: 'trainer-002',
    email: 'carlos.lopez@entrenaperu.com',
    name: 'Carlos López',
    specialties: ['CrossFit', 'Funcional', 'HIIT'],
    bio: 'Entrenador personal especializado en CrossFit y entrenamiento funcional. Ayudo a mis clientes a alcanzar sus objetivos de fuerza y resistencia.',
    location: {
      lat: -12.1000,
      lng: -77.0500,
      address: 'San Isidro, Lima, Perú'
    },
    phone: '+51987654322',
    profileImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    rating: 4.7,
    reviewCount: 32,
    isActive: true,
    experience: '6 años',
    certifications: ['CrossFit Level 2 Trainer', 'Certificación en Entrenamiento Funcional']
  },
  {
    uid: 'trainer-003',
    email: 'maria.rodriguez@entrenaperu.com',
    name: 'María Rodríguez',
    specialties: ['Zumba', 'Baile', 'Cardio'],
    bio: 'Instructora de Zumba y bailes latinos. Mis clases son divertidas y llenas de energía para quemar calorías mientras te diviertes.',
    location: {
      lat: -12.0800,
      lng: -77.0300,
      address: 'Surco, Lima, Perú'
    },
    phone: '+51987654323',
    profileImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
    rating: 4.8,
    reviewCount: 28,
    isActive: true,
    experience: '5 años',
    certifications: ['Instructor Certificado de Zumba', 'Especialización en Bailes Latinos']
  },
  {
    uid: 'trainer-004',
    email: 'diego.martinez@entrenaperu.com',
    name: 'Diego Martínez',
    specialties: ['Musculación', 'Powerlifting', 'Nutrición'],
    bio: 'Entrenador especializado en musculación y powerlifting. También brindo asesoría nutricional para complementar el entrenamiento.',
    location: {
      lat: -12.0600,
      lng: -77.0350,
      address: 'La Molina, Lima, Perú'
    },
    phone: '+51987654324',
    profileImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
    rating: 4.6,
    reviewCount: 41,
    isActive: true,
    experience: '7 años',
    certifications: ['Certificación en Musculación Avanzada', 'Nutricionista Deportivo']
  },
  {
    uid: 'trainer-005',
    email: 'lucia.torres@entrenaperu.com',
    name: 'Lucía Torres',
    specialties: ['Natación', 'Aqua Aeróbicos', 'Rehabilitación'],
    bio: 'Instructora de natación y aqua aeróbicos. Especializada en rehabilitación acuática y entrenamiento para todas las edades.',
    location: {
      lat: -12.1200,
      lng: -77.0200,
      address: 'San Borja, Lima, Perú'
    },
    phone: '+51987654325',
    profileImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    rating: 4.9,
    reviewCount: 35,
    isActive: true,
    experience: '9 años',
    certifications: ['Instructor de Natación Certificado', 'Especialización en Rehabilitación Acuática']
  }
];

// Datos de ejemplo para usuarios
const usersData = [
  {
    uid: 'user-001',
    email: 'juan.perez@gmail.com',
    name: 'Juan Pérez',
    phone: '+51987111111',
    age: 28,
    fitnessGoals: ['Pérdida de peso', 'Tonificación'],
    fitnessLevel: 'Intermedio',
    isActive: true
  },
  {
    uid: 'user-002',
    email: 'sofia.mendez@gmail.com',
    name: 'Sofía Méndez',
    phone: '+51987222222',
    age: 32,
    fitnessGoals: ['Flexibilidad', 'Relajación'],
    fitnessLevel: 'Principiante',
    isActive: true
  },
  {
    uid: 'user-003',
    email: 'ricardo.silva@gmail.com',
    name: 'Ricardo Silva',
    phone: '+51987333333',
    age: 25,
    fitnessGoals: ['Ganancia muscular', 'Fuerza'],
    fitnessLevel: 'Avanzado',
    isActive: true
  },
  {
    uid: 'user-004',
    email: 'carmen.flores@gmail.com',
    name: 'Carmen Flores',
    phone: '+51987444444',
    age: 29,
    fitnessGoals: ['Cardio', 'Diversión'],
    fitnessLevel: 'Intermedio',
    isActive: true
  },
  {
    uid: 'user-005',
    email: 'miguel.castro@gmail.com',
    name: 'Miguel Castro',
    phone: '+51987555555',
    age: 35,
    fitnessGoals: ['Rehabilitación', 'Natación'],
    fitnessLevel: 'Principiante',
    isActive: true
  }
];

// Datos de ejemplo para horarios de entrenadores
const schedulesData = [
  {
    trainerId: 'trainer-001',
    schedule: {
      monday: {
        '08:00': 'available',
        '09:00': 'available',
        '10:00': 'available',
        '16:00': 'available',
        '17:00': 'available',
        '18:00': 'available'
      },
      tuesday: {
        '08:00': 'available',
        '09:00': 'available',
        '10:00': 'available',
        '16:00': 'available',
        '17:00': 'available',
        '18:00': 'available'
      },
      wednesday: {
        '08:00': 'available',
        '09:00': 'available',
        '10:00': 'available',
        '16:00': 'available',
        '17:00': 'available',
        '18:00': 'available'
      },
      thursday: {
        '08:00': 'available',
        '09:00': 'available',
        '10:00': 'available',
        '16:00': 'available',
        '17:00': 'available',
        '18:00': 'available'
      },
      friday: {
        '08:00': 'available',
        '09:00': 'available',
        '10:00': 'available',
        '16:00': 'available',
        '17:00': 'available',
        '18:00': 'available'
      },
      saturday: {
        '09:00': 'available',
        '10:00': 'available',
        '11:00': 'available'
      },
      sunday: {
        '09:00': 'available',
        '10:00': 'available',
        '11:00': 'available'
      }
    },
    timezone: 'America/Lima'
  }
];

// Datos de ejemplo para tarifas
const ratesData = [
  {
    trainerId: 'trainer-001',
    rates: {
      individual: {
        single: 80,
        package4: 300,
        package8: 560
      },
      group: {
        single: 50,
        package4: 180,
        package8: 320
      }
    },
    currency: 'PEN'
  },
  {
    trainerId: 'trainer-002',
    rates: {
      individual: {
        single: 90,
        package4: 340,
        package8: 640
      },
      group: {
        single: 60,
        package4: 220,
        package8: 400
      }
    },
    currency: 'PEN'
  }
];

// Datos de ejemplo para reservas
const bookingsData = [
  {
    id: 'booking-001',
    clientId: 'user-001',
    clientName: 'Juan Pérez',
    clientEmail: 'juan.perez@gmail.com',
    trainerId: 'trainer-001',
    trainerName: 'Ana García',
    sessionType: 'individual',
    specialty: 'Pilates',
    date: Timestamp?.fromDate(new Date('2024-01-20')) || new Date('2024-01-20'),
    time: '09:00',
    duration: 60,
    price: 80,
    currency: 'PEN',
    status: 'confirmed',
    location: 'Miraflores, Lima, Perú',
    notes: 'Primera sesión de Pilates'
  },
  {
    id: 'booking-002',
    clientId: 'user-002',
    clientName: 'Sofía Méndez',
    clientEmail: 'sofia.mendez@gmail.com',
    trainerId: 'trainer-001',
    trainerName: 'Ana García',
    sessionType: 'individual',
    specialty: 'Yoga',
    date: Timestamp?.fromDate(new Date('2024-01-22')) || new Date('2024-01-22'),
    time: '17:00',
    duration: 60,
    price: 80,
    currency: 'PEN',
    status: 'pending',
    location: 'Miraflores, Lima, Perú',
    notes: 'Sesión de Yoga para principiantes'
  },
  {
    id: 'booking-003',
    clientId: 'user-003',
    clientName: 'Ricardo Silva',
    clientEmail: 'ricardo.silva@gmail.com',
    trainerId: 'trainer-002',
    trainerName: 'Carlos López',
    sessionType: 'individual',
    specialty: 'CrossFit',
    date: Timestamp?.fromDate(new Date('2024-01-25')) || new Date('2024-01-25'),
    time: '18:00',
    duration: 60,
    price: 90,
    currency: 'PEN',
    status: 'confirmed',
    location: 'San Isidro, Lima, Perú',
    notes: 'Entrenamiento de CrossFit avanzado'
  }
];

export const seedDatabase = async () => {
  if (require.main === module) {
    console.log('⚠️  ADVERTENCIA: Este script requiere autenticación del lado del cliente.');
    console.log('🔄 Para poblar la base de datos, ejecuta: npm run seed-admin');
    console.log('📝 El script seed-admin.ts usa Firebase Admin SDK y no requiere autenticación.');
    return;
  }
  
  try {
    console.log('🌱 Iniciando la siembra de datos...');

    // Crear entrenadores
    console.log('👨‍💼 Creando entrenadores...');
    for (const trainer of trainersData) {
      await TrainerService.createTrainer(trainer.uid, trainer);
      console.log(`✅ Entrenador creado: ${trainer.name}`);
    }

    // Crear usuarios
    console.log('👥 Creando usuarios...');
    for (const user of usersData) {
      await UserService.createUser(user.uid, user);
      console.log(`✅ Usuario creado: ${user.name}`);
    }

    // Crear horarios
    console.log('📅 Creando horarios...');
    for (const scheduleData of schedulesData) {
      await TrainerService.updateTrainerSchedule(scheduleData.trainerId, {
        id: `schedule-${scheduleData.trainerId}`,
        trainerId: scheduleData.trainerId,
        schedule: scheduleData.schedule,
        timezone: scheduleData.timezone,
        createdAt: Timestamp?.now() || new Date(),
        updatedAt: Timestamp?.now() || new Date()
      });
      console.log(`✅ Horario creado para: ${scheduleData.trainerId}`);
    }

    // Crear tarifas
    console.log('💰 Creando tarifas...');
    for (const rateData of ratesData) {
      await TrainerService.updateTrainerRates(rateData.trainerId, {
        id: `rates-${rateData.trainerId}`,
        trainerId: rateData.trainerId,
        rates: rateData.rates,
        currency: rateData.currency,
        createdAt: Timestamp?.now() || new Date(),
        updatedAt: Timestamp?.now() || new Date()
      });
      console.log(`✅ Tarifas creadas para: ${rateData.trainerId}`);
    }

    // Crear reservas
    console.log('📋 Creando reservas...');
    for (const booking of bookingsData) {
      await BookingService.createBooking(booking.id, booking);
      console.log(`✅ Reserva creada: ${booking.id}`);
    }

    console.log('🎉 ¡Datos de ejemplo creados exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - ${trainersData.length} entrenadores`);
    console.log(`   - ${usersData.length} usuarios`);
    console.log(`   - ${schedulesData.length} horarios`);
    console.log(`   - ${ratesData.length} tarifas`);
    console.log(`   - ${bookingsData.length} reservas`);
    console.log('\n🔥 Puedes ver los datos en tu consola de Firebase!');

  } catch (error) {
    console.error('❌ Error al crear datos de ejemplo:', error);
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  console.log('⚠️  Este script no puede ejecutarse directamente.');
  console.log('🔄 Usa en su lugar: npm run seed-admin');
  console.log('📁 Archivo: scripts/seed-admin.ts');
  process.exit(1);
}