import { Client } from "pg";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load parent .env
dotenv.config({ path: path.join(__dirname, "../../../.env") });

const connectionString = process.env.SUPABASE_URL;

if (!connectionString) {
  console.error("Error: SUPABASE_URL (PostgreSQL connection string) is not defined in .env");
  process.exit(1);
}

async function runMigrations() {
  console.log("Connecting to Supabase PostgreSQL database...");
  const client = new Client({
    connectionString,
    ssl: {
      rejectUnauthorized: false // Required for Supabase pooler connections
    }
  });

  try {
    await client.connect();
    console.log("Connected successfully.");

    const baseDir = path.join(__dirname, "../../../supabase");
    
    // 1. Run Schema Migration
    console.log("Running Schema Migration (01_schema.sql)...");
    const schemaSql = fs.readFileSync(path.join(baseDir, "migrations/01_schema.sql"), "utf-8");
    await client.query(schemaSql);
    console.log("Schema migration completed.");

    // 2. Run RLS Policies Migration
    console.log("Running RLS Policies Migration (02_rls_policies.sql)...");
    const rlsSql = fs.readFileSync(path.join(baseDir, "migrations/02_rls_policies.sql"), "utf-8");
    await client.query(rlsSql);
    console.log("RLS policies migration completed.");

    // 3. Run Seed Data
    console.log("Running Seed Data (seed.sql)...");
    const seedSql = fs.readFileSync(path.join(baseDir, "seed.sql"), "utf-8");
    await client.query(seedSql);
    console.log("Database seeding completed.");

    console.log("\n All migrations and seed data applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigrations();
