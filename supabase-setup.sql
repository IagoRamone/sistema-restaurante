-- ===========================================
-- SQL para configurar o Supabase
-- Execute no SQL Editor do Supabase Dashboard
-- ===========================================

-- 1. Tabela de perfis
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('gerente', 'recepcionista')) DEFAULT 'recepcionista',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Trigger para criar perfil automaticamente quando usuario e criado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'recepcionista')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 3. Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Politicas de acesso
-- Usuarios podem ler seu proprio perfil
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Gerentes podem ler todos os perfis
CREATE POLICY "Gerentes can read all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'gerente'
    )
  );

-- ===========================================
-- 5. Tabela de estado atual das mesas
-- ===========================================
CREATE TABLE public.table_states (
  table_id TEXT PRIMARY KEY,
  status TEXT NOT NULL CHECK (status IN ('available', 'occupied', 'reserved')) DEFAULT 'available',
  guests_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  is_eating BOOLEAN NOT NULL DEFAULT false,
  started_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.table_states ENABLE ROW LEVEL SECURITY;

-- Todos autenticados podem ler
CREATE POLICY "Authenticated users can read table_states"
  ON public.table_states FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Todos autenticados podem inserir
CREATE POLICY "Authenticated users can insert table_states"
  ON public.table_states FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Todos autenticados podem atualizar
CREATE POLICY "Authenticated users can update table_states"
  ON public.table_states FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Todos autenticados podem deletar
CREATE POLICY "Authenticated users can delete table_states"
  ON public.table_states FOR DELETE
  USING (auth.uid() IS NOT NULL);

-- Habilitar Realtime para table_states
ALTER PUBLICATION supabase_realtime ADD TABLE public.table_states;

-- ===========================================
-- 6. Tabela de historico de ocupacoes
-- ===========================================
CREATE TABLE public.occupancy_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id TEXT NOT NULL,
  guests_count INTEGER NOT NULL DEFAULT 0,
  notes TEXT DEFAULT '',
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.occupancy_history ENABLE ROW LEVEL SECURITY;

-- Todos autenticados podem ler
CREATE POLICY "Authenticated users can read occupancy_history"
  ON public.occupancy_history FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Todos autenticados podem inserir
CREATE POLICY "Authenticated users can insert occupancy_history"
  ON public.occupancy_history FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
