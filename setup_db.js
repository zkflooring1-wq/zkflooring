const { Client } = require('pg');

const connectionString = "postgresql://postgres:Vif%25FeEKs%2C42NP%3F@db.vsdvpvmnwmpwvjmcckju.supabase.co:5432/postgres";

const client = new Client({
  connectionString: connectionString,
});

async function setupDB() {
  await client.connect();
  console.log("Connected to Supabase PostgreSQL.");

  try {
    // 1. Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        location TEXT NOT NULL,
        short_desc TEXT,
        description JSONB DEFAULT '[]'::jsonb,
        highlights JSONB DEFAULT '[]'::jsonb,
        client TEXT,
        duration TEXT,
        area TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
      
      -- Add missing columns if table already existed
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS short_desc TEXT;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS description JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS highlights JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS client TEXT;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS duration TEXT;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS area TEXT;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS category TEXT;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS location TEXT;
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS image TEXT;
    `);
    console.log("Projects table updated.");

    // 2. Services Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS services (
        slug TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        image TEXT NOT NULL,
        summary TEXT,
        description JSONB DEFAULT '[]'::jsonb,
        features JSONB DEFAULT '[]'::jsonb,
        info_label TEXT,
        info_value TEXT,
        cta_text TEXT,
        cta_link TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
      
      ALTER TABLE services ADD COLUMN IF NOT EXISTS summary TEXT;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS description JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS info_label TEXT;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS info_value TEXT;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS cta_text TEXT;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS cta_link TEXT;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS category TEXT;
      ALTER TABLE services ADD COLUMN IF NOT EXISTS image TEXT;
    `);
    console.log("Services table updated.");

    // 3. Posts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        content TEXT NOT NULL,
        status TEXT DEFAULT 'draft',
        featured_image TEXT,
        categories JSONB DEFAULT '[]'::jsonb,
        tags JSONB DEFAULT '[]'::jsonb,
        seo_data JSONB DEFAULT '{}'::jsonb,
        excerpt TEXT,
        author TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );

      ALTER TABLE posts ADD COLUMN IF NOT EXISTS categories JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS tags JSONB DEFAULT '[]'::jsonb;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS seo_data JSONB DEFAULT '{}'::jsonb;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS excerpt TEXT;
      ALTER TABLE posts ADD COLUMN IF NOT EXISTS author TEXT;
    `);
    console.log("Posts table updated.");

    // 4. FAQs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        sort_order INTEGER DEFAULT 0,
        enabled BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);
    console.log("FAQs table updated.");

    // 5. Pages Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        sections JSONB DEFAULT '{}'::jsonb,
        seo_data JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);
    console.log("Pages table updated.");

    // 6. Team Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS team (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        image TEXT,
        sort_order INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);
    console.log("Team table updated.");

  } catch (err) {
    console.error("Error setting up DB schema:", err);
  } finally {
    await client.end();
  }
}

setupDB();
