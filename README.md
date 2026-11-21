# Normandía — Gestión Ganadera y Registro de Ordeño en Campo

Aplicación web progresiva (**PWA**) y empaquetable como **APK Android** diseñada para pequeños ganaderos y operarios de campo. Permite registrar vacas, anotar la producción diaria de ordeño **incluso sin señal de internet en el potrero**, generar comprobantes inmediatos y respaldar automáticamente la información en **PostgreSQL** cuando se recupera la conexión.

- **Aplicación en producción:** [https://ahto-app.onrender.com](https://ahto-app.onrender.com)
- **Repositorio oficial:** [https://github.com/Juan-419/Innovaci-n](https://github.com/Juan-419/Innovaci-n)

---

## Características principales

- **Operación Offline-First real:** Funciona sin señal ni datos móviles guardando usuario, vacas, borradores y registros en el almacenamiento local del dispositivo (`localStorage` + `Service Worker`).
- **Sincronización automática con la nube:** Al iniciar sesión con Google (Firebase Auth) y recuperar conectividad, los registros pendientes (`En móvil`) se sincronizan de forma idempotente con **PostgreSQL** (`Enviado / Sincronizado`).
- **Inicio limpio y personalizado:**
  - Registro libre del nombre del trabajador/ordeñador al ingresar por primera vez (editable desde el perfil o el panel inicial).
  - Registro libre de cualquier vaca nueva (nombre, número o chapeta, lote, raza y potrero) sin datos ficticios precargados.
- **Flujo guiado en 3 pasos:**
  1. **Selección o creación de vaca** con buscador por nombre/número y filtros por lote.
  2. **Turno y producción** con botones táctiles grandes (`-5`, `-0.5`, `+0.5`, `+5` y accesos rápidos `12 / 16 / 20 / 24 L`) y reporte de calidad/novedades de la leche.
  3. **Comprobante oficial** con código consecutivo, estado de respaldo, copia/envío directo por **WhatsApp** e impresión de ticket.
- **Accesibilidad rural (Adulto Mayor):**
  - Botones táctiles amplios (`48px–68px`), tipografía clara y lenguaje sencillo.
  - **Modo Cálido Marfil** (para luz solar directa) y **Modo Noche Alto Contraste** (para ordeño de madrugada).
- **Instalable en celular:** Manifiesto PWA (`manifest.webmanifest`), Service Worker (`sw.js`) y soporte **Trusted Web Activity (TWA)** mediante `/.well-known/assetlinks.json` para abrir como app nativa Android en pantalla completa.

---

## Stack tecnológico

| Capa | Tecnología |
| --- | --- |
| **Frontend** | React 19, TypeScript, Vite 8, Tailwind CSS v4 |
| **PWA / Móvil** | Web App Manifest, Service Worker, TWA / PWABuilder (Android APK) |
| **Backend** | Node.js (ESM nativo), Express.js |
| **Base de datos** | PostgreSQL + Drizzle ORM (`drizzle-kit` para migraciones) |
| **Autenticación** | Firebase Authentication (Google Sign-In) + verificación Bearer Token en backend (`firebase-admin`) |
| **Despliegue** | Render (Web Service HTTPS + PostgreSQL) |

---

## Estructura del proyecto

```text
├── public/
│   ├── .well-known/assetlinks.json   # Verificación Digital Asset Links para APK Android
│   ├── manifest.webmanifest          # Configuración PWA instalable
│   ├── sw.js                         # Service Worker para caché offline
│   └── pwa-*.png / icon.svg          # Íconos de la aplicación
├── src/
│   ├── components/
│   │   ├── AppShell.tsx              # Barra superior, navegación fija y modal de perfil/sync
│   │   ├── WelcomeRegistrationScreen.tsx # Registro inicial por nombre o Google
│   │   ├── HomeScreen.tsx            # Panel de estado de jornada y acciones principales
│   │   ├── GuidedRegisterScreen.tsx  # Flujo guiado en 3 pasos y alta libre de vacas
│   │   ├── ConfirmationHistoryScreen.tsx # Comprobante digital, historial y WhatsApp
│   │   └── SafeImage.tsx             # Carga segura de imágenes con respaldo visual
│   ├── db/
│   │   ├── drizzle.config.ts         # Configuración de Drizzle Kit
│   │   ├── index.ts                  # Pool de conexión PostgreSQL
│   │   ├── schema.ts                 # Tablas: users, cows y milking_records
│   │   ├── users.ts                  # Consultas y preferencias de usuario
│   │   ├── cows.ts                   # Sincronización idempotente de vacas
│   │   └── records.ts                # Sincronización idempotente de ordeños
│   ├── hooks/usePWAInstall.ts        # Detección y guía de instalación PWA
│   ├── lib/
│   │   ├── firebase.ts               # SDK cliente Firebase Auth
│   │   └── firebase-admin.ts         # Verificación de tokens ID en servidor
│   ├── middleware/auth.ts            # Middleware Express requireAuth
│   ├── data/mockNormandia.ts         # Constantes visuales y motivos de novedad
│   ├── types/normandia.ts            # Tipos TypeScript del dominio
│   ├── App.tsx                       # Estado global offline-first y sincronización
│   └── main.tsx                      # Punto de entrada y registro del Service Worker
├── docs/
│   ├── Archivo_Maestro_Proyecto_Integrador_Normandia.docx
│   └── Presentacion_Sustentacion_Normandia.pptx
├── server.ts                         # Servidor Express + Vite (dev) / estáticos (prod)
├── package.json
└── vite.config.ts
```

---

## Modelo de datos y API

### Tablas en PostgreSQL (`src/db/schema.ts`)
- **`users`**: `uid`, `email`, `display_name`, `theme_preference` (`calido` | `noche`), `created_at`.
- **`cows`**: `client_id`, `user_uid`, `name`, `tag_number`, `lot`, `breed`, `paddock`, `image_url`, `default_liters`, `created_at`.
- **`milking_records`**: `client_id`, `user_uid`, `receipt_code`, `cow_id`, `cow_name`, `cow_tag`, `lot`, `breed`, `liters`, `shift`, `shift_time`, `quality`, `quality_note`, `time_formatted`, `date_formatted`, `operator`, `recorded_at`.

### Endpoints REST (`server.ts`)
Todas las rutas `/api/*` validan el token JWT de Firebase (`Authorization: Bearer <token>`) y realizan validación estricta de entrada antes de escribir en PostgreSQL:

- `GET /api/bootstrap` — Carga el perfil del usuario, sus vacas personalizadas y su historial de ordeños.
- `POST /api/cows/sync` — Sincroniza vacas creadas offline sin duplicar registros (`onConflictDoNothing`).
- `POST /api/records/sync` — Sincroniza registros de ordeño pendientes desde el celular.
- `PATCH /api/preferences` — Actualiza el nombre del operario (`displayName`) y/o el tema visual (`themePreference`).

---

## Instalación y ejecución local

### 1. Requisitos previos
- **Node.js** 22+
- Instancia **PostgreSQL** disponible
- Archivo de configuración Firebase (`firebase-applet-config.json`)

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz con la conexión a tu base de datos PostgreSQL:
```env
SQL_HOST=localhost
SQL_USER=postgres
SQL_PASSWORD=tu_password
SQL_DB_NAME=normandia
PORT=3000
```

### 4. Aplicar el esquema en PostgreSQL
```bash
npx drizzle-kit push --config=src/db/drizzle.config.ts
```

### 5. Scripts disponibles
```bash
npm run dev     # Levanta servidor Express + Vite en http://localhost:3000
npm run lint    # Verifica tipos con TypeScript (tsc --noEmit)
npm run build   # Compila el frontend en dist/
npm run start   # Ejecuta el servidor en modo producción (node server.ts)
```

---

## Despliegue y empaquetado APK (Android)

1. **Web en Render:**
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start`
   - Configurar `NODE_ENV=production` y las variables `SQL_HOST`, `SQL_USER`, `SQL_PASSWORD`, `SQL_DB_NAME`.
2. **APK Android (Trusted Web Activity):**
   - Generar el paquete desde [PWABuilder](https://www.pwabuilder.com) apuntando a la URL HTTPS de producción.
   - Copiar el archivo `assetlinks.json` generado en `public/.well-known/assetlinks.json` (Express lo sirve con `dotfiles: 'allow'`) para abrir la app en pantalla completa sin barra de navegación.

---

## Contexto académico

Proyecto integrador desarrollado en la **Universidad Católica de Colombia** — Facultad de Ingeniería · Programa de Ingeniería Industrial · Asignatura *Innovación y Emprendimiento (2026-3)* — **Grupo 4**.

La documentación completa del proyecto y las capturas de validación interna se encuentran en la carpeta `docs/`.
