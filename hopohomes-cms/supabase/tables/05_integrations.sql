-- Zoho Integration Tables
-- Run this migration to enable Zoho Creator integration

-- Zoho Tokens Table
CREATE TABLE IF NOT EXISTS zoho_tokens (
  id INTEGER PRIMARY KEY DEFAULT 1,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  api_domain TEXT DEFAULT 'https://www.zohoapis.in',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT zoho_tokens_single_row CHECK (id = 1)
);

COMMENT ON TABLE zoho_tokens IS 'Stores Zoho OAuth tokens for system-wide integration';

ALTER TABLE zoho_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_view_zoho_tokens" ON zoho_tokens
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "admin_manage_zoho_tokens" ON zoho_tokens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "service_full_access_zoho_tokens" ON zoho_tokens
  FOR ALL USING (true);

-- Zoho Creator Configuration Table
CREATE TABLE IF NOT EXISTS zoho_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  owner_name TEXT,
  app_name TEXT,
  form_name TEXT,
  report_name TEXT,
  field_mapping JSONB DEFAULT '{}',
  auto_sync BOOLEAN DEFAULT false,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT zoho_config_single_row CHECK (id = 1)
);

COMMENT ON TABLE zoho_config IS 'Stores Zoho Creator app configuration and field mappings';

ALTER TABLE zoho_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_view_zoho_config" ON zoho_config
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "admin_manage_zoho_config" ON zoho_config
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM "user" u 
      WHERE u.id = current_setting('app.current_user_id', true) 
      AND u.role = 'admin'
    )
  );

CREATE POLICY "service_full_access_zoho_config" ON zoho_config
  FOR ALL USING (true);