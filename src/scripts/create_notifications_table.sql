-- Tabela de notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
  read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);

-- RLS (Row Level Security)
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Usuários só veem suas próprias notificações
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

-- Usuários só podem atualizar suas próprias notificações
CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

-- Usuários podem inserir notificações (para o sistema)
CREATE POLICY "System can insert notifications"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Função para criar notificações em massa (admin notifica todos)
CREATE OR REPLACE FUNCTION notify_all_users(
  p_title TEXT,
  p_message TEXT,
  p_type TEXT DEFAULT 'info',
  p_link TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type, link)
  SELECT id, p_title, p_message, p_type, p_link
  FROM profiles
  WHERE id != ALL(ARRAY(SELECT COALESCE(
    (SELECT auth.uid() FROM auth.users LIMIT 1),
    '00000000-0000-0000-0000-000000000000'::uuid
  )));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Função para notificar quando resultado é salvo
CREATE OR REPLACE FUNCTION notify_match_result(
  p_match_id UUID,
  p_home_team TEXT,
  p_away_team TEXT,
  p_home_result INT,
  p_away_result INT
)
RETURNS void AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type, link)
  SELECT
    b.user_id,
    'Resultado atualizado!',
    p_home_team || ' ' || p_home_result || ' x ' || p_away_result || ' ' || p_away_team,
    'info',
    '/minhas-apostas'
  FROM bets b
  WHERE b.match_id = p_match_id
    AND b.user_id != ALL(ARRAY(SELECT COALESCE(auth.uid(), '00000000-0000-0000-0000-000000000000'::uuid)));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
