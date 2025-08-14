import { adminDb } from '../lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

// Datos de ejemplo para entrenadores
const trainersData = [
  {
    uid: 'trainer-001',
    alias: 'Coach Ana',
    name: 'Ana García',
    dni: '12345678',
    whatsapp: '+51 987 654 321',
    address: 'Av. Larco 123, Miraflores',
    location: 'Lima, Perú',
    generalDescription: 'Especialista en bienestar integral y rehabilitación física',
    bio: 'Instructora certificada de Pilates y Yoga con más de 8 años de experiencia. Especializada en rehabilitación y bienestar integral.',
    specialties: ['PILATES', 'YOGA', 'STRETCHING', 'Certificación Internacional de Pilates', 'Instructor de Yoga RYT-200'],
    profileImage: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400',
    referencePhotos: [
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'
    ],
    rating: 4.9,
    reviewCount: 47,
    isActive: true,
    experience: '8 años',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    uid: 'trainer-002',
    alias: 'Coach Carlos',
    name: 'Carlos López',
    dni: '23456789',
    whatsapp: '+51 987 654 322',
    address: 'Av. Javier Prado 456, San Isidro',
    location: 'Lima, Perú',
    generalDescription: 'Especialista en transformación física y bienestar integral',
    bio: 'Entrenador certificado con más de 8 años de experiencia en entrenamiento funcional y artes marciales.',
    specialties: ['ACSM CERTIFIED', 'FUNCTIONAL TRAINING', 'KARATE'],
    profileImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    referencePhotos: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400'
    ],
    rating: 4.7,
    reviewCount: 32,
    isActive: true,
    experience: '8 años',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    uid: 'trainer-003',
    alias: 'Coach María',
    name: 'María Rodríguez',
    dni: '34567890',
    whatsapp: '+51 987 654 323',
    address: 'Av. Primavera 789, Surco',
    location: 'Lima, Perú',
    generalDescription: 'Especialista en bailes latinos y cardio divertido',
    bio: 'Instructora de Zumba y bailes latinos. Mis clases son divertidas y llenas de energía para quemar calorías mientras te diviertes.',
    specialties: ['ZUMBA', 'BAILE LATINO', 'CARDIO', 'Instructor Certificado de Zumba', 'Especialización en Bailes Latinos'],
    profileImage: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
    referencePhotos: [
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
    ],
    rating: 4.8,
    reviewCount: 28,
    isActive: true,
    experience: '5 años',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    uid: 'trainer-004',
    alias: 'Coach Diego',
    name: 'Diego Martínez',
    dni: '45678901',
    whatsapp: '+51 987 654 324',
    address: 'Av. La Molina 321, La Molina',
    location: 'Lima, Perú',
    generalDescription: 'Especialista en musculación y powerlifting avanzado',
    bio: 'Entrenador especializado en musculación y powerlifting. También brindo asesoría nutricional para complementar el entrenamiento.',
    specialties: ['MUSCULACIÓN', 'POWERLIFTING', 'NUTRICIÓN', 'Certificación en Musculación Avanzada', 'Nutricionista Deportivo'],
    profileImage: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
    referencePhotos: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400',
      'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400'
    ],
    rating: 4.6,
    reviewCount: 41,
    isActive: true,
    experience: '7 años',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    uid: 'trainer-005',
    alias: 'Coach Lucía',
    name: 'Lucía Torres',
    dni: '56789012',
    whatsapp: '+51 987 654 325',
    address: 'Av. San Borja Norte 654, San Borja',
    location: 'Lima, Perú',
    generalDescription: 'Especialista en natación y rehabilitación acuática',
    bio: 'Instructora de natación y aqua aeróbicos. Especializada en rehabilitación acuática y entrenamiento para todas las edades.',
    specialties: ['NATACIÓN', 'AQUA AERÓBICOS', 'REHABILITACIÓN', 'Instructor de Natación Certificado', 'Especialización en Rehabilitación Acuática'],
    profileImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
    referencePhotos: [
      'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'
    ],
    rating: 4.9,
    reviewCount: 35,
    isActive: true,
    experience: '9 años',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
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
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    uid: 'user-002',
    email: 'sofia.mendez@gmail.com',
    name: 'Sofía Méndez',
    phone: '+51987222222',
    age: 32,
    fitnessGoals: ['Flexibilidad', 'Relajación'],
    fitnessLevel: 'Principiante',
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    uid: 'user-003',
    email: 'ricardo.silva@gmail.com',
    name: 'Ricardo Silva',
    phone: '+51987333333',
    age: 25,
    fitnessGoals: ['Ganancia muscular', 'Fuerza'],
    fitnessLevel: 'Avanzado',
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    uid: 'user-004',
    email: 'carmen.flores@gmail.com',
    name: 'Carmen Flores',
    phone: '+51987444444',
    age: 29,
    fitnessGoals: ['Cardio', 'Diversión'],
    fitnessLevel: 'Intermedio',
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    uid: 'user-005',
    email: 'miguel.castro@gmail.com',
    name: 'Miguel Castro',
    phone: '+51987555555',
    age: 35,
    fitnessGoals: ['Rehabilitación', 'Natación'],
    fitnessLevel: 'Principiante',
    isActive: true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

// Datos de ejemplo para horarios
const schedulesData = [
  {
    id: 'schedule-trainer-001',
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
    timezone: 'America/Lima',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'schedule-trainer-002',
    trainerId: 'trainer-002',
    schedule: {
      monday: {
        '07:00': 'available',
        '08:00': 'available',
        '18:00': 'available',
        '19:00': 'available',
        '20:00': 'available'
      },
      tuesday: {
        '07:00': 'available',
        '08:00': 'available',
        '18:00': 'available',
        '19:00': 'available',
        '20:00': 'available'
      },
      wednesday: {
        '07:00': 'available',
        '08:00': 'available',
        '18:00': 'available',
        '19:00': 'available',
        '20:00': 'available'
      },
      thursday: {
        '07:00': 'available',
        '08:00': 'available',
        '18:00': 'available',
        '19:00': 'available',
        '20:00': 'available'
      },
      friday: {
        '07:00': 'available',
        '08:00': 'available',
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
    timezone: 'America/Lima',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

// Datos de ejemplo para tarifas
const ratesData = [
  {
    id: 'rates-trainer-001',
    trainerId: 'trainer-001',
    rates: {
      weekly: {
        '1_hour': 40,
        '3_hours': 100,
        '10_hours': 200
      },
      monthly: {
        '4_hours': 150,
        '12_hours': 380,
        '40_hours': 750
      }
    },
    currency: 'PEN',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'rates-trainer-002',
    trainerId: 'trainer-002',
    rates: {
      weekly: {
        '1_hour': 45,
        '3_hours': 120,
        '10_hours': 250
      },
      monthly: {
        '4_hours': 170,
        '12_hours': 450,
        '40_hours': 900
      }
    },
    currency: 'PEN',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'rates-trainer-003',
    trainerId: 'trainer-003',
    rates: {
      weekly: {
        '1_hour': 35,
        '3_hours': 90,
        '10_hours': 180
      },
      monthly: {
        '4_hours': 130,
        '12_hours': 340,
        '40_hours': 650
      }
    },
    currency: 'PEN',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'rates-trainer-004',
    trainerId: 'trainer-004',
    rates: {
      weekly: {
        '1_hour': 50,
        '3_hours': 130,
        '10_hours': 280
      },
      monthly: {
        '4_hours': 190,
        '12_hours': 480,
        '40_hours': 1000
      }
    },
    currency: 'PEN',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'rates-trainer-005',
    trainerId: 'trainer-005',
    rates: {
      weekly: {
        '1_hour': 42,
        '3_hours': 110,
        '10_hours': 220
      },
      monthly: {
        '4_hours': 160,
        '12_hours': 400,
        '40_hours': 800
      }
    },
    currency: 'PEN',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
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
    date: Timestamp.fromDate(new Date('2024-01-20')),
    time: '09:00',
    duration: 60,
    price: 80,
    currency: 'PEN',
    status: 'confirmed',
    location: 'Miraflores, Lima, Perú',
    notes: 'Primera sesión de Pilates',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
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
    date: Timestamp.fromDate(new Date('2024-01-22')),
    time: '17:00',
    duration: 60,
    price: 80,
    currency: 'PEN',
    status: 'pending',
    location: 'Miraflores, Lima, Perú',
    notes: 'Sesión de Yoga para principiantes',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
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
    date: Timestamp.fromDate(new Date('2024-01-25')),
    time: '18:00',
    duration: 60,
    price: 90,
    currency: 'PEN',
    status: 'confirmed',
    location: 'San Isidro, Lima, Perú',
    notes: 'Entrenamiento de CrossFit avanzado',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  },
  {
    id: 'booking-004',
    clientId: 'user-004',
    clientName: 'Carmen Flores',
    clientEmail: 'carmen.flores@gmail.com',
    trainerId: 'trainer-003',
    trainerName: 'María Rodríguez',
    sessionType: 'group',
    specialty: 'Zumba',
    date: Timestamp.fromDate(new Date('2024-01-28')),
    time: '19:00',
    duration: 60,
    price: 45,
    currency: 'PEN',
    status: 'confirmed',
    location: 'Surco, Lima, Perú',
    notes: 'Clase grupal de Zumba',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  }
];

export const seedDatabaseAdmin = async () => {
  try {
    console.log('🌱 Iniciando la siembra de datos con Firebase Admin...');

    // Crear entrenadores
    console.log('👨‍💼 Creando entrenadores...');
    for (const trainer of trainersData) {
      await adminDb.collection('trainers').doc(trainer.uid).set(trainer);
      console.log(`✅ Entrenador creado: ${trainer.name}`);
    }

    // Crear usuarios
    console.log('👥 Creando usuarios...');
    for (const user of usersData) {
      await adminDb.collection('users').doc(user.uid).set(user);
      console.log(`✅ Usuario creado: ${user.name}`);
    }

    // Crear horarios
    console.log('📅 Creando horarios...');
    for (const schedule of schedulesData) {
      await adminDb.collection('trainer-schedules').doc(schedule.id).set(schedule);
      console.log(`✅ Horario creado para: ${schedule.trainerId}`);
    }

    // Crear tarifas
    console.log('💰 Creando tarifas...');
    for (const rate of ratesData) {
      await adminDb.collection('trainer-rates').doc(rate.id).set(rate);
      console.log(`✅ Tarifas creadas para: ${rate.trainerId}`);
    }

    // Crear reservas
    console.log('📋 Creando reservas...');
    for (const booking of bookingsData) {
      await adminDb.collection('bookings').doc(booking.id).set(booking);
      console.log(`✅ Reserva creada: ${booking.id}`);
    }

    console.log('\n🎉 ¡Datos de ejemplo creados exitosamente!');
    console.log('📊 Resumen:');
    console.log(`   - ${trainersData.length} entrenadores`);
    console.log(`   - ${usersData.length} usuarios`);
    console.log(`   - ${schedulesData.length} horarios`);
    console.log(`   - ${ratesData.length} tarifas`);
    console.log(`   - ${bookingsData.length} reservas`);
    console.log('\n🔥 Puedes ver los datos en tu consola de Firebase!');
    console.log('🌐 Ve a: https://console.firebase.google.com/project/entrena-peru-7f116/firestore');

  } catch (error) {
    console.error('❌ Error al crear datos de ejemplo:', error);
    throw error;
  }
};

// Ejecutar si se llama directamente
if (require.main === module) {
  seedDatabaseAdmin()
    .then(() => {
      console.log('✨ Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error en el proceso:', error);
      process.exit(1);
    });
}