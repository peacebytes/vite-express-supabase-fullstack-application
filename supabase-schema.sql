-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'readonly' CHECK (role IN ('admin', 'readonly')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  business_size TEXT NOT NULL CHECK (business_size IN ('small', 'medium', 'big')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI Tools table
CREATE TABLE ai_tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  url TEXT,
  learning_notes TEXT,
  youtube_link TEXT,
  how_to_article TEXT,
  subscription TEXT NOT NULL CHECK (subscription IN ('free', 'pay-as-you-go')),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed admin user (password: "SPRINGc@n@d4" and "SPRINGcanada", bcrypt hashes)
INSERT INTO users (username, password_hash, role) VALUES
  ('admin', '$2b$10$2yKpvL2Ft9py1Bmt8Mfp.ef4IorHcNBAIwcYF203r8Z1ytSdwOseS', 'admin'),
  ('user', '$2b$10$Ppasqa23l7okdPJzYTMHC.Wz68eoEql2SnF23G0NHLcksxs0PkyE2', 'readonly');

-- Seed categories
INSERT INTO categories (name, description, business_size) VALUES
  ('Developer Tools', 'AI tools for software developers', 'big'),
  ('QA Tools', 'AI tools for quality assurance engineers', 'medium'),
  ('Manager Tools', 'AI tools for engineering managers', 'small'),
  ('DevOps Tools', 'AI tools for DevOps and infrastructure', 'medium');

-- Seed AI tools
INSERT INTO ai_tools (name, description, url, subscription, category_id) VALUES
  ('GitHub Copilot', 'AI pair programmer for code suggestions', 'https://github.com/features/copilot', 'pay-as-you-go',
    (SELECT id FROM categories WHERE name = 'Developer Tools')),
  ('Amazon Q Developer', 'AI assistant for AWS development', 'https://aws.amazon.com/q/developer/', 'free',
    (SELECT id FROM categories WHERE name = 'Developer Tools')),
  ('Testim', 'AI-powered test automation', 'https://www.testim.io', 'pay-as-you-go',
    (SELECT id FROM categories WHERE name = 'QA Tools')),
  ('Liner AI', 'AI project management assistant', 'https://liner.ai', 'free',
    (SELECT id FROM categories WHERE name = 'Manager Tools'));
