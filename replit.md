# Yoga & Bienestar

Sitio web para un estudio de yoga y bienestar holístico. Tiene dos caras: un sitio público para clientes y un panel de administración para la profesora.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — API server (port 8080)
- `pnpm --filter @workspace/yoga-wellness run dev` — Frontend (port 20141)
- `pnpm run typecheck` — typecheck completo
- `pnpm run typecheck:libs` — solo libs (ejecutar tras cambios en lib/)
- `pnpm --filter @workspace/api-spec run codegen` — regenerar hooks y schemas
- `pnpm --filter @workspace/db run push` — aplicar cambios de schema DB

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Tailwind + shadcn/ui + wouter + TanStack Query
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validación: Zod (`zod/v4`), `drizzle-zod`
- Codegen: Orval (OpenAPI → hooks + Zod schemas)

## Where things live

- `lib/api-spec/openapi.yaml` — contrato de API (fuente de verdad)
- `lib/db/src/schema/` — tablas: `students.ts`, `payments.ts`, `orders.ts`
- `artifacts/api-server/src/routes/` — rutas: `students.ts`, `payments.ts`, `orders.ts`, `admin.ts`
- `artifacts/yoga-wellness/src/` — todo el frontend

## Product

**Sitio público:**
- `/` — Landing page: clases de yoga como servicio principal + servicios complementarios de bienestar energético
- `/servicios` — Detalle de todos los servicios: yoga, carta astral, numerología, tarot, radiomancía, reiki, péndulo
- `/pedido` — Formulario público para pedir un servicio (llega al panel admin)

**Panel de administración** (`/admin`):
- `/admin` — Dashboard con estadísticas en tiempo real (alumnas, pedidos, pagos del mes, gráfico por servicio)
- `/admin/alumnas` — Lista de alumnas (filtrable por activas/inactivas)
- `/admin/alumnas/nueva` — Alta de nueva alumna
- `/admin/alumnas/:id` — Ficha completa: datos, tipo de pago, flexibilidad en 4 posturas (0–10), notas médicas, observaciones, historial de pagos
- `/admin/pedidos` — Bandeja de pedidos de servicios con gestión de estado

## Architecture decisions

- Sin autenticación en el admin por ahora (acceso directo por URL `/admin`)
- Flexibilidad medida en 4 posturas: Paschimottanasana, Ustrasana, Trikonasana, Ardha Matsyendrasana (score 0–10)
- Tipos de pago: mensual, semanal, clase suelta
- Servicios: yoga_class | carta_astral | numerologia | tarot | radiomancia | reiki | pendulo
- Estados de pedido: pending | in_progress | completed | cancelled
- `amount` en pagos usa `numeric` en DB → se convierte a/desde string en la capa de ruta

## User preferences

_Populate as you build._

## Gotchas

- Tras cambios en `lib/db/src/schema/`, correr `pnpm run typecheck:libs` antes de `typecheck` en el API server
- `amount` en `paymentsTable` es `numeric` en Drizzle → convertir a `String(amount)` al insertar
- `periodStart`/`periodEnd` son `date` mode string → convertir con `String()` al insertar

## Pointers

- Ver skill `pnpm-workspace` para estructura del monorepo
