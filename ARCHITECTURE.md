# Arquitectura de Carpetas — Verteles

Este documento es la referencia de arquitectura del proyecto. Cumple dos funciones:
1. **Descriptiva**: define la estructura de carpetas acordada.
2. **Normativa**: guía el desarrollo futuro con criterios, ejemplos y flujos de decisión.

---

## Principio General

La arquitectura combina **capas** (core, shared, features) con **organización por dominio** dentro de cada capa:

- **`core/`** y **`shared/`** también están organizados internamente en sub-carpetas **feature-based** (por dominio de responsabilidad), no por tipo de archivo (`/components`, `/hooks` planos).
- **`features/`** contiene módulos funcionales completamente autocontenidos.
- **`utils/`** contiene funciones puras sin efectos secundarios.

> **Regla de oro**: Si algo tiene suficiente identidad de dominio para tener su propio estado, es un `feature`. Si existe independientemente de cualquier feature pero es parte del shell o infraestructura base de la app, es `core`. Si es una utilidad reutilizable sin estado de dominio, es `shared`. Si es una función pura, es `utils`.

---

## Árbol de Referencia

```
src/
├── App.tsx                         # Raíz de la aplicación, ensamblado de capas
├── main.tsx                        # Entry point de Vite/React
│
├── core/                           # Infraestructura fundamental de la app
│   │                               # Sub-carpetas organizadas por dominio (feature-based)
│   ├── layout/                     # Shell visual de la aplicación
│   │   ├── TopBar.tsx
│   │   └── Sidebar.tsx
│   ├── navigation/                 # Control de foco D-pad y Spatial Navigation
│   │   └── (futuro: SpatialNav.tsx, useSpatialNav.ts)
│   └── storage/                    # Wrapper unificado de persistencia
│       └── (futuro: storage.ts, useStorage.ts)
│
├── shared/                         # Utilidades transversales reutilizables
│   │                               # Sub-carpetas organizadas por dominio (feature-based)
│   │                               # Sin estado de dominio propio. Si crece → graduate a feature
│   ├── network/                    # Estado de conectividad
│   │   ├── NetworkStatus.tsx       # Componente indicador de red
│   │   └── useNetworkStatus.ts     # Hook que provee el estado de red
│   ├── clock/                      # Reloj en tiempo real
│   │   └── useClock.ts
│   └── media/                      # Utilidades de medios
│       └── LazyImage.tsx           # Imagen con carga diferida y fallback
│
├── features/                       # Módulos funcionales autocontenidos
│   │                               # Cada feature agrupa TODO lo suyo internamente
│   ├── player/
│   │   ├── components/
│   │   │   ├── VideoPlayer.tsx     # Abstracción Web vs Tizen
│   │   │   ├── WebPlayer.tsx
│   │   │   ├── TizenPlayer.tsx
│   │   │   ├── VisualStream.tsx
│   │   │   ├── PlaybackBar.tsx
│   │   │   ├── LoadingOverlay.tsx
│   │   │   └── ErrorOverlay.tsx
│   │   ├── hooks/
│   │   │   └── usePlayerInterface.ts
│   │   ├── store/
│   │   │   └── usePlayerStore.ts
│   │   ├── services/               # Lógica de dominio del player
│   │   └── index.ts                # Barrel export de la feature
│   │
│   └── playlist/
│       ├── components/
│       │   ├── ChannelItem.tsx
│       │   ├── ListsModal.tsx
│       │   └── SettingsModal.tsx
│       ├── store/
│       │   └── usePlaylistStore.ts
│       ├── services/               # M3U parser, lógica de dominio
│       ├── types.ts
│       └── (futuro: hooks/, index.ts)
│
└── utils/                          # Funciones puras sin efectos secundarios
    └── platform.ts                 # Detección de plataforma (Web vs Tizen)
```

---

## Reglas por Capa

### `core/` — Infraestructura base de la app

**¿Qué va aquí?** Todo lo que la aplicación necesita para existir, independientemente de cualquier feature: el shell visual, la navegación y el acceso a datos persistentes.

**Reglas:**
- Las sub-carpetas representan dominios del shell: `layout/`, `navigation/`, `storage/`.
- Cada sub-carpeta puede tener componentes, hooks y lógica propios de ese dominio (feature-based).
- **`core/` nunca importa de `features/`**. La dependencia es unidireccional: features dependen de core, nunca al revés.

**Sub-dominios actuales:**
| Sub-dominio | Responsabilidad |
|---|---|
| `layout/` | Componentes de shell: TopBar, Sidebar |
| `navigation/` | Spatial Nav, D-pad, mapeo de teclas Tizen |
| `storage/` | Wrapper de IndexedDB / localforage |

---

### `shared/` — Utilidades transversales

**¿Qué va aquí?** Componentes o hooks reutilizables que no pertenecen a ninguna feature ni al core, pero que varios módulos necesitan.

**Reglas:**
- Las sub-carpetas agrupan por dominio de responsabilidad, no por tipo de archivo.
- Componente y su hook de origen van **juntos** en la misma sub-carpeta (cohesión).
- `shared/` **no tiene stores de Zustand propios**. Si algo en shared empieza a necesitar estado global, es señal de que debe graduarse a `features/`.
- Si un dominio de `shared/` crece mucho → se gradúa a `features/`.

**Sub-dominios actuales:**
| Sub-dominio | Responsabilidad |
|---|---|
| `network/` | Indicador de conectividad (componente + hook) |
| `clock/` | Reloj en tiempo real |
| `media/` | LazyImage con fallback |

---

### `features/` — Módulos funcionales

**¿Qué va aquí?** Toda la lógica de negocio de un dominio funcional específico (player, playlist, etc.).

**Reglas:**
- Cada feature es **completamente autocontenida**: sus internals no deben importarse directamente desde otra feature.
- La comunicación entre features se hace exclusivamente a través de sus **stores de Zustand** o props pasados desde `App.tsx`.
- Estructura interna estándar de cada feature:

```
features/<nombre>/
├── components/   # Componentes de UI de la feature
├── hooks/        # Hooks específicos del dominio
├── store/        # Store de Zustand de la feature
├── services/     # Lógica de negocio, llamadas externas, parsers
├── types.ts      # Tipos e interfaces propios
└── index.ts      # Barrel export (expone solo lo necesario)
```

No todas las carpetas son obligatorias. Crear solo las que tengan contenido.

---

### `utils/` — Funciones puras

**¿Qué va aquí?** Funciones que dado un input siempre retornan el mismo output, sin efectos secundarios, sin dependencias externas.

**Reglas:**
- Sin imports de React, Zustand ni dependencias del proyecto.
- Sin llamadas a APIs, localStorage, ni I/O.
- 100% testeables con pruebas unitarias simples.

---

## Flujo de Decisión: ¿Dónde va un archivo nuevo?

```
¿Es una función pura sin efectos secundarios?
  └─ SÍ → src/utils/

¿Necesita estado global (Zustand store) propio?
  └─ SÍ → src/features/<dominio>/

¿Es parte del shell visual, navegación o storage de la app?
  └─ SÍ → src/core/<dominio>/

¿Es reutilizable por múltiples features y no tiene estado de dominio?
  └─ SÍ → src/shared/<dominio>/

¿Pertenece exclusivamente a un dominio funcional (player, playlist)?
  └─ SÍ → src/features/<feature>/<tipo>/
```

---

## Guía: Cómo Agregar una Nueva Feature

1. **Crea la carpeta** bajo `src/features/<nombre>/`.
2. **Agrega solo las sub-carpetas que necesites** (no crear vacías).
3. **Define los tipos** en `types.ts` si la feature tiene datos propios.
4. **Crea el store** en `store/use<Nombre>Store.ts` si necesita estado global.
5. **Implementa la lógica** de negocio en `services/` antes de los componentes.
6. **Construye los componentes** en `components/`, consumiendo store y services.
7. **Exponé solo lo necesario** en `index.ts` (barrel export).

**Ejemplo: agregar feature `epg/`**
```
src/features/epg/
├── components/
│   ├── EpgGrid.tsx
│   └── EpgChannelRow.tsx
├── hooks/
│   └── useEpgNavigation.ts
├── store/
│   └── useEpgStore.ts
├── services/
│   └── epgParser.ts
├── types.ts
└── index.ts
```

---

## Guía: Cómo Agregar a `shared/`

1. **Verificá que no pertenece a ninguna feature específica.**
2. **Verificá que no necesita store propio.**
3. **Identificá el dominio de responsabilidad** (ej: `toast/`, `keyboard/`, `analytics/`).
4. **Crea la sub-carpeta** bajo `src/shared/<dominio>/`.
5. **Co-localizá componente y hook** en la misma sub-carpeta.

**Ejemplo: agregar un sistema de toasts**
```
src/shared/toast/
├── Toast.tsx           # Componente visual
├── ToastContainer.tsx  # Contenedor de toasts
└── useToast.ts         # Hook para disparar toasts
```

---

## Guía: Cómo Agregar a `core/`

1. **Verificá que existe independientemente de cualquier feature.**
2. **Identificá el sub-dominio**: ¿es layout, navigation, storage, u otro?
3. Si el sub-dominio no existe, **crea la nueva sub-carpeta**.
4. Dentro del sub-dominio, organizá también de forma cohesiva (componente + hook + lógica juntos).

**Ejemplo: agregar un sistema de theming**
```
src/core/theme/
├── ThemeProvider.tsx   # Proveedor de contexto de tema
└── useTheme.ts         # Hook de acceso al tema actual
```

---

## Anti-patrones a Evitar

| ❌ Anti-patrón | ✅ Corrección |
|---|---|
| `src/components/` o `src/hooks/` flat (sin dominio) | Organizar en `core/`, `shared/` o `features/` por dominio |
| Importar internals de una feature desde otra feature | Comunicarse via stores de Zustand o props desde `App.tsx` |
| Poner lógica de dominio (stores, parsers) en `shared/` | Mover a la feature correspondiente |
| Poner componentes de layout en `features/` | Mover a `core/layout/` |
| Separar componente de su hook en `shared/` (ej: `shared/components/X.tsx` + `shared/hooks/useX.ts`) | Co-localizar ambos en `shared/<dominio>/` |
| Crear sub-carpetas vacías por anticipación | Crear solo cuando tienen contenido real |
