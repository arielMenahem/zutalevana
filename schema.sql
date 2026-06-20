-- Zuta Levana – Neon PostgreSQL schema

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS leads (
    id               SERIAL PRIMARY KEY,
    lead_uuid        UUID DEFAULT uuid_generate_v4(),
    full_name        VARCHAR(255) NOT NULL,
    phone            VARCHAR(50)  NOT NULL,
    email            VARCHAR(255) NOT NULL,
    catering_interest VARCHAR(50) DEFAULT 'General Inquiry',
    preferred_language VARCHAR(5) DEFAULT 'he',
    user_agent       TEXT,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_email      ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at);
