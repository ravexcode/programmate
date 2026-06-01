# Database Changes - Bug Reports

## Required Table: `bug_reports`

Execute the following SQL in your Supabase SQL editor to create the table:

```sql
-- Create bug_reports table
CREATE TABLE public.bug_reports (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  titulo TEXT NOT NULL,
  descripcion TEXT NOT NULL,
  pasos TEXT NOT NULL,
  version TEXT NOT NULL,
  fecha_error TEXT NOT NULL,
  email TEXT,
  screenshot_url TEXT,
  status TEXT DEFAULT 'nuevo' CHECK (status IN ('nuevo', 'revisado', 'en_progreso', 'resuelto', 'duplicado', 'no_es_bug')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT email_format CHECK (email IS NULL OR email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create indexes for better query performance
CREATE INDEX idx_bug_reports_status ON public.bug_reports(status);
CREATE INDEX idx_bug_reports_version ON public.bug_reports(version);
CREATE INDEX idx_bug_reports_created_at ON public.bug_reports(created_at DESC);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.bug_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bug reports
CREATE POLICY "Allow anyone to insert bug reports" ON public.bug_reports
  FOR INSERT
  WITH CHECK (true);

-- Allow anyone to view bug reports (optional - comment out if you want to restrict viewing)
CREATE POLICY "Allow anyone to view bug reports" ON public.bug_reports
  FOR SELECT
  USING (true);
```

## Field Specifications

| Campo | Tipo | Requerido | Descripción |
|-------|------|----------|-------------|
| `id` | BIGINT | ✓ | Primary key auto-incrementado |
| `titulo` | TEXT | ✓ | Título del bug |
| `descripcion` | TEXT | ✓ | Descripción detallada del problema |
| `pasos` | TEXT | ✓ | Pasos para reproducir el bug |
| `version` | TEXT | ✓ | Versión donde ocurre el bug |
| `fecha_error` | TEXT | ✓ | Fecha en que ocurrió el error |
| `email` | TEXT | ✗ | Email del reportante (opcional) |
| `screenshot_url` | TEXT | ✗ | URL de screenshot (opcional) |
| `status` | TEXT | - | Estado del bug (nuevo, revisado, en_progreso, resuelto, duplicado, no_es_bug) |
| `created_at` | TIMESTAMP | - | Timestamp de creación automática |
| `updated_at` | TIMESTAMP | - | Timestamp de última actualización |

## Steps to Apply

1. Go to Supabase Dashboard → SQL Editor
2. Create a new query
3. Paste the SQL above
4. Click "Run"
5. Verify the table was created in the "Tables" section

## Notes

- The `status` field has a CHECK constraint to ensure only valid values are inserted
- Indexes are created for better performance on common queries
- Row Level Security is enabled (RLS policies allow anyone to insert, optional for viewing)
- The `email` field has a regex validation (optional CONSTRAINT)
