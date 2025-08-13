# 📚 Guía de Firebase para Entrena Perú

## 🔥 ¿Qué es Firebase?

Firebase es como una **caja fuerte digital** donde guardamos toda la información de nuestra aplicación. Imagínate que es como un gran armario con muchos cajones, donde cada cajón guarda un tipo diferente de información.

## 📂 Las Colecciones (Los Cajones del Armario)

En Firebase, cada "cajón" se llama **colección**. Nuestra aplicación tiene 5 colecciones principales:

### 1. 👨‍💼 Colección "trainers" (Entrenadores)

**¿Qué guarda?** Toda la información de los entrenadores de fitness.

**Campos que contiene:**
- `uid`: Es como el **número de cédula** del entrenador (único para cada uno)
- `alias`: El **nombre artístico** (ejemplo: "Coach Ana")
- `name`: El **nombre real** completo
- `dni`: **Documento Nacional de Identidad** (como la cédula)
- `whatsapp`: **Número de WhatsApp** para contacto
- `address`: **Dirección exacta** donde vive o trabaja
- `location`: **Ciudad o zona** general (ejemplo: "Lima, Perú")
- `generalDescription`: **Descripción corta** de qué hace el entrenador
- `bio`: **Historia completa** del entrenador (como su currículum)
- `specialties`: **Lista de especialidades** (ejemplo: ["PILATES", "YOGA"])
- `profileImage`: **Enlace a su foto** de perfil
- `referencePhotos`: **Lista de fotos** adicionales del entrenador trabajando
- `rating`: **Calificación promedio** (de 1 a 5 estrellas)
- `reviewCount`: **Número total** de reseñas que ha recibido
- `isActive`: **¿Está activo?** (true = sí, false = no)
- `experience`: **Años de experiencia** (ejemplo: "8 años")
- `certifications`: **Lista de certificados** que tiene
- `createdAt`: **Fecha y hora** cuando se registró
- `updatedAt`: **Fecha y hora** de la última actualización

### 2. 👥 Colección "users" (Usuarios/Clientes)

**¿Qué guarda?** Información de las personas que buscan entrenadores.

**Campos que contiene:**
- `uid`: **Identificador único** del usuario
- `email`: **Correo electrónico** para iniciar sesión
- `name`: **Nombre completo** del usuario
- `phone`: **Número de teléfono**
- `age`: **Edad** en años
- `fitnessGoals`: **Lista de objetivos** (ejemplo: ["Pérdida de peso", "Tonificación"])
- `fitnessLevel`: **Nivel de fitness** ("Principiante", "Intermedio", "Avanzado")
- `isActive`: **¿Está activo?** (true = sí, false = no)
- `createdAt`: **Fecha de registro**
- `updatedAt`: **Fecha de última actualización**

### 3. 📅 Colección "trainer-schedules" (Horarios de Entrenadores)

**¿Qué guarda?** Los horarios disponibles de cada entrenador.

**Campos que contiene:**
- `id`: **Identificador único** del horario
- `trainerId`: **A qué entrenador pertenece** este horario
- `schedule`: **Horarios por día de la semana**:
  - `monday`, `tuesday`, `wednesday`, etc.: Cada día tiene horas específicas
  - Cada hora puede estar: `"available"` (disponible) o `"booked"` (ocupada)
- `timezone`: **Zona horaria** (ejemplo: "America/Lima")
- `createdAt`: **Fecha de creación**
- `updatedAt`: **Fecha de actualización**

**Ejemplo de horario:**
```
monday: {
  '08:00': 'available',  // 8:00 AM disponible
  '09:00': 'booked',     // 9:00 AM ocupado
  '10:00': 'available'   // 10:00 AM disponible
}
```

### 4. 💰 Colección "trainer-rates" (Tarifas de Entrenadores)

**¿Qué guarda?** Los precios que cobra cada entrenador.

**Campos que contiene:**
- `id`: **Identificador único** de la tarifa
- `trainerId`: **A qué entrenador pertenecen** estas tarifas
- `rates`: **Precios organizados por tiempo**:
  - `weekly`: **Tarifas por semana**
    - `1_hour`: Precio por **1 hora a la semana**
    - `3_hours`: Precio por **3 horas a la semana**
    - `10_hours`: Precio por **10 horas a la semana**
  - `monthly`: **Tarifas por mes**
    - `4_hours`: Precio por **4 horas al mes**
    - `12_hours`: Precio por **12 horas al mes**
    - `40_hours`: Precio por **40 horas al mes**
- `currency`: **Tipo de moneda** ("PEN" = Soles peruanos)
- `createdAt`: **Fecha de creación**
- `updatedAt`: **Fecha de actualización**

**Ejemplo de tarifas:**
```
weekly: {
  '1_hour': 40,    // S/ 40 por 1 hora semanal
  '3_hours': 100,  // S/ 100 por 3 horas semanales
  '10_hours': 200  // S/ 200 por 10 horas semanales
}
```

### 5. 📋 Colección "bookings" (Reservas)

**¿Qué guarda?** Las citas programadas entre usuarios y entrenadores.

**Campos que contiene:**
- `id`: **Identificador único** de la reserva
- `clientId`: **ID del usuario** que hizo la reserva
- `clientName`: **Nombre del cliente**
- `clientEmail`: **Email del cliente**
- `trainerId`: **ID del entrenador** reservado
- `trainerName`: **Nombre del entrenador**
- `sessionType`: **Tipo de sesión** ("individual" o "group")
- `specialty`: **Especialidad** de la sesión (ejemplo: "Pilates")
- `date`: **Fecha** de la sesión
- `time`: **Hora** de inicio (ejemplo: "09:00")
- `duration`: **Duración** en minutos (ejemplo: 60)
- `price`: **Precio** de la sesión
- `currency`: **Moneda** ("PEN")
- `status`: **Estado** de la reserva:
  - `"pending"`: Esperando confirmación
  - `"confirmed"`: Confirmada
  - `"cancelled"`: Cancelada
  - `"completed"`: Completada
- `location`: **Lugar** donde será la sesión
- `notes`: **Notas adicionales** sobre la sesión
- `createdAt`: **Fecha de creación**
- `updatedAt`: **Fecha de actualización**

## 🔗 ¿Cómo se Conectan las Colecciones?

Las colecciones están **conectadas** entre sí como piezas de un rompecabezas:

1. **Un entrenador** (`trainers`) tiene:
   - **Un horario** (`trainer-schedules`)
   - **Unas tarifas** (`trainer-rates`)
   - **Varias reservas** (`bookings`)

2. **Un usuario** (`users`) puede hacer:
   - **Varias reservas** (`bookings`)

3. **Una reserva** (`bookings`) conecta:
   - **Un usuario específico** con **un entrenador específico**
   - En **una fecha y hora específica**
   - Con **un precio específico**

## 🛠️ ¿Cómo Actualizar los Datos?

Para agregar datos de prueba a Firebase:

1. **Abrir la terminal** en el proyecto
2. **Ejecutar el comando**: `npm run seed-admin`
3. **Esperar** a que aparezca el mensaje de éxito
4. **Verificar** en la consola de Firebase: https://console.firebase.google.com/project/entrena-peru-7f116/firestore

## 📊 Resumen de Datos Actuales

Cuando ejecutas el script, se crean:
- ✅ **5 entrenadores** con diferentes especialidades
- ✅ **5 usuarios** con diferentes objetivos
- ✅ **2 horarios** para los primeros entrenadores
- ✅ **5 tarifas** (una para cada entrenador)
- ✅ **4 reservas** de ejemplo

## 🎯 ¿Para Qué Sirve Cada Colección?

- **trainers**: Para mostrar la **lista de entrenadores** disponibles
- **users**: Para **gestionar cuentas** de clientes
- **trainer-schedules**: Para **mostrar horarios disponibles** al reservar
- **trainer-rates**: Para **mostrar precios** antes de reservar
- **bookings**: Para **gestionar las citas** programadas

¡Ahora ya sabes cómo funciona la base de datos de Entrena Perú! 🚀