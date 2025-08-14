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

// Datos de ejemplo para entrenadores (nueva estructura)
const trainersData = [
  {
    uid: 'trainer_001_uid',
    alias: 'Coach Ana',
    name: 'Ana García',
    dni: '72345678',
    whatsapp: '+51987654321',
    address: 'Av. Larco 456, Miraflores, Lima',
    location: 'Lima, Perú',
    generalDescription: 'Especialista en bienestar integral y rehabilitación física',
    bio: 'Entrenadora certificada con más de 8 años de experiencia en fitness funcional, rehabilitación deportiva y bienestar integral. Me especializo en crear programas personalizados que ayuden a mis clientes a alcanzar sus objetivos de salud de manera segura y efectiva.',
    experience: '8 años',
    specialties: [
      'PILATES',
      'YOGA',
      'ENTRENAMIENTO FUNCIONAL',
      'REHABILITACIÓN FÍSICA',
      'ACSM CERTIFIED',
      'CROSSFIT LEVEL 1'
    ],
    profileImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba2f65c?w=400',
    referencePhotos: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'
    ],
    rating: 4.9,
    reviewCount: 47,
    isActive: true
  },
  {
    uid: 'trainer_002_uid',
    alias: 'Coach Carlos',
    name: 'Carlos Mendoza',
    dni: '45678912',
    whatsapp: '+51912345678',
    address: 'Av. Pardo 789, San Isidro, Lima',
    location: 'Lima, Perú',
    generalDescription: 'Especialista en entrenamiento de fuerza y acondicionamiento físico',
    bio: 'Entrenador personal con 6 años de experiencia en desarrollo de fuerza, hipertrofia muscular y preparación física deportiva. Trabajo con atletas de alto rendimiento y personas que buscan transformar su físico de manera efectiva.',
    experience: '6 años',
    specialties: [
      'ENTRENAMIENTO DE FUERZA',
      'HIPERTROFIA',
      'POWERLIFTING',
      'PREPARACIÓN FÍSICA',
      'NSCA CERTIFIED',
      'NUTRICIÓN DEPORTIVA'
    ],
    profileImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    referencePhotos: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'
    ],
    rating: 4.7,
    reviewCount: 32,
    isActive: true
  },
  {
    uid: 'trainer_003_uid',
    alias: 'Coach María',
    name: 'María Rodríguez',
    dni: '78912345',
    whatsapp: '+51945678123',
    address: 'Av. Brasil 321, Magdalena, Lima',
    location: 'Lima, Perú',
    generalDescription: 'Especialista en yoga terapéutico y mindfulness',
    bio: 'Instructora certificada de yoga con 10 años de experiencia en yoga terapéutico, meditación y mindfulness. Me enfoco en ayudar a las personas a encontrar equilibrio entre cuerpo y mente a través de prácticas conscientes.',
    experience: '10 años',
    specialties: [
      'YOGA TERAPÉUTICO',
      'HATHA YOGA',
      'VINYASA YOGA',
      'MEDITACIÓN',
      'MINDFULNESS',
      'YOGA ALLIANCE RYT 500'
    ],
    profileImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
    referencePhotos: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      'https://images.unsplash.com/photo-1506629905607-c52b1b8e8d19?w=400'
    ],
    rating: 4.8,
    reviewCount: 65,
    isActive: true
  },
  {
    uid: 'trainer_004_uid',
    alias: 'Coach Roberto',
    name: 'Roberto Silva',
    dni: '12378945',
    whatsapp: '+51978123456',
    address: 'Av. Universitaria 654, Los Olivos, Lima',
    location: 'Lima, Perú',
    generalDescription: 'Especialista en CrossFit y entrenamiento funcional de alta intensidad',
    bio: 'Coach de CrossFit Level 2 con 5 años de experiencia en entrenamiento funcional de alta intensidad. Me especializo en mejorar la condición física general, fuerza y resistencia cardiovascular de mis atletas.',
    experience: '5 años',
    specialties: [
      'CROSSFIT',
      'ENTRENAMIENTO FUNCIONAL',
      'HIIT',
      'OLYMPIC LIFTING',
      'CROSSFIT LEVEL 2',
      'MOBILITY'
    ],
    profileImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
    referencePhotos: [
      'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    ],
    rating: 4.6,
    reviewCount: 28,
    isActive: true
  },
  {
    uid: 'trainer_005_uid',
    alias: 'Coach Lucía',
    name: 'Lucía Fernández',
    dni: '56789123',
    whatsapp: '+51923456789',
    address: 'Av. Salaverry 987, Jesús María, Lima',
    location: 'Lima, Perú',
    generalDescription: 'Especialista en Pilates clínico y rehabilitación postural',
    bio: 'Fisioterapeuta y instructora de Pilates con 7 años de experiencia en rehabilitación postural y Pilates clínico. Trabajo con personas que buscan mejorar su postura, aliviar dolores crónicos y fortalecer su core de manera terapéutica.',
    experience: '7 años',
    specialties: [
      'PILATES CLÍNICO',
      'REHABILITACIÓN POSTURAL',
      'PILATES MAT',
      'PILATES REFORMER',
      'FISIOTERAPIA',
      'BASI PILATES CERTIFIED'
    ],
    profileImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    referencePhotos: [
      'https://images.unsplash.com/photo-1506629905607-c52b1b8e8d19?w=400',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2f65c?w=400'
    ],
    rating: 4.9,
    reviewCount: 41,
    isActive: true
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
    trainerId: 'trainer_001_uid',
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
  },
  {
    trainerId: 'trainer_002_uid',
    schedule: {
      monday: {
        '06:00': 'available',
        '07:00': 'available',
        '18:00': 'available',
        '19:00': 'available',
        '20:00': 'available'
      },
      tuesday: {
        '06:00': 'available',
        '07:00': 'available',
        '18:00': 'available',
        '19:00': 'available',
        '20:00': 'available'
      },
      wednesday: {
        '06:00': 'available',
        '07:00': 'available',
        '18:00': 'available',
        '19:00': 'available',
        '20:00': 'available'
      },
      thursday: {
        '06:00': 'available',
        '07:00': 'available',
        '18:00': 'available',
        '19:00': 'available',
        '20:00': 'available'
      },
      friday: {
        '06:00': 'available',
        '07:00': 'available',
        '18:00': 'available',
        '19:00': 'available',
        '20:00': 'available'
      },
      saturday: {
        '08:00': 'available',
        '09:00': 'available',
        '10:00': 'available'
      }
    },
    timezone: 'America/Lima'
  }
];

// Datos de ejemplo para tarifas
const ratesData = [
  {
    trainerId: 'trainer_001_uid',
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
    trainerId: 'trainer_002_uid',
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
    trainerId: 'trainer_001_uid',
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
    trainerId: 'trainer_001_uid',
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
    trainerId: 'trainer_002_uid',
    trainerName: 'Carlos Mendoza',
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