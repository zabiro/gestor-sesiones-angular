# Gestor de Sesiones — Prueba Técnica

Aplicación Angular 17+ para gestión de sesiones con autenticación mock, calendario interactivo, CRUD de sesiones y control de acceso por roles.

## Tecnologías

| Paquete | Versión | Uso |
|---------|---------|-----|
| Angular | 17.3.0 | Framework SPA con standalone components, signals, @if/@for |
| Angular Material | 17.3.0 | UI components (toolbar, tables, dialogs, forms, chips, menus) |
| FullCalendar | 6.1.11 | Vista calendario mensual con plugins daygrid e interaction |
| TypeScript | 5.4.2 | Tipado estricto |
| RxJS | 7.8.1 | Programación reactiva (BehaviorSubject) |
| SCSS | — | Estilos con theming de Material |
| Fuente Satoshi | — | Tipografía (fontshare.com) |

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── guards/         # authGuard, adminGuard (funcionales)
│   │   ├── interceptors/   # authInterceptor (funcional)
│   │   ├── models/         # User, Session interfaces
│   │   └── services/       # AuthService, SessionService (mock)
│   ├── features/
│   │   ├── auth/login/     # Pantalla de inicio de sesión
│   │   ├── calendar/       # Calendario + diálogo de detalle
│   │   ├── admin/          # Tabla de administración
│   │   └── sessions/       # Formulario crear/editar sesión
│   └── shared/
│       ├── components/     # Navbar, ConfirmDialog
│       └── pipes/          # StateLabelPipe, FilterPipe
├── styles.scss             # Tema global Material + Satoshi
└── index.html
```

## Funcionalidades Implementadas

### Autenticación
- Login mock con validación de email/contraseña
- **Administrador**: emails con dominio `@sdi.es`
- **Usuario registrado**: cualquier otro email válido
- Token simulado persistido en `localStorage`
- Redirección automática al calendario tras login

### Menú de Navegación
- **Calendario**: acceso para todos los usuarios autenticados
- **Administración**: visible solo para administradores
- **Nombre de usuario**: en el lado derecho con desplegable (cerrar sesión)

### Calendario de Sesiones
- Vista mensual con FullCalendar (localizado en español)
- Filtro por **categoría con búsqueda** (autocomplete Material)
- Filtro por **estado** (Borrador, Bloqueado, Oculto)
- Búsqueda de texto libre
- Clic en evento → diálogo con detalles de la sesión
- Leyenda de colores por estado

### Administración (Solo Admin)
- Tabla Material con todas las sesiones
- Crear / Editar sesiones (formulario reactivo)
- **Eliminar sesiones** solo si pertenecen a la misma ciudad del admin
- Confirmación por diálogo antes de eliminar

### Formulario de Sesión
- Imagen (opcional, URL para banner/cover)
- Título, Descripción
- Categoría (desplegable con búsqueda - autocomplete)
- Ciudad
- Fecha + Hora (DatePicker + time input)
- Estado (borrador, bloqueado, oculto)
- Validaciones reactivas con mensajes de error

### Seguridad de Rutas
- `authGuard`: protege todas las rutas excepto /login
- `adminGuard`: protege /admin y /session/* (crear/editar)
- Lazy loading de todos los componentes de features

## Categorías Disponibles

Formación, Reunión, Demo, Tecnología, Negocios, Salud, Educación, Entretenimiento, Deportes, Ciencia, Arte, Marketing, Diseño

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
ng serve

# Compilar para producción
ng build
```

## Credenciales de Prueba

| Tipo | Email | Contraseña |
|------|-------|------------|
| Admin | admin@sdi.es | 1234 |
| Usuario | usuario@gmail.com | 1234 |

> La contraseña puede ser cualquier valor con mínimo 4 caracteres.

---

## Preguntas sobre IA

### ¿Qué IA han utilizado?
GitHub Copilot (Claude) integrado en VS Code.

### ¿Para qué la han utilizado?
- Generación del scaffolding inicial del proyecto
- Implementación de componentes, servicios, guards e interceptores
- Creación de datos mock (seed sessions)
- Traducción de textos al español
- Migración de directivas legacy (*ngIf/*ngFor) a la nueva sintaxis de Angular 17+ (@if/@for)
- Revisión de cumplimiento con los requisitos de la prueba

### ¿Cómo la han utilizado?
A través de prompts conversacionales en el chat de Copilot dentro de VS Code, indicando los requisitos de la prueba técnica. Se fue construyendo el proyecto de forma iterativa: primero la estructura base, luego los componentes, después la traducción al español, y finalmente la migración a las nuevas directivas de Angular 17+. Cada cambio fue verificado compilando la aplicación.
