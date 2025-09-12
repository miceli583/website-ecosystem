#!/usr/bin/env node

/**
 * Environment Setup Script
 * Validates and helps set up required environment variables
 */

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ENV_FILE = path.join(process.cwd(), ".env");
const ENV_EXAMPLE = path.join(process.cwd(), ".env.example");

const REQUIRED_VARS = {
  AUTH_SECRET: {
    description: "Secret for encrypting JWT tokens",
    generate: () => {
      try {
        return execSync("npx auth secret", { encoding: "utf8" }).trim();
      } catch {
        // Fallback to crypto random string
        return require("crypto").randomBytes(32).toString("base64");
      }
    },
    required: process.env.NODE_ENV === "production",
  },
  DATABASE_URL: {
    description:
      "Database connection string (SQLite for dev, PostgreSQL for production)",
    default: "file:./db.sqlite",
    required: true,
  },
};

/**
 * @param {string} filePath
 * @returns {Record<string, string>}
 */
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {};

  const content = fs.readFileSync(filePath, "utf8");
  /** @type {Record<string, string>} */
  const env = {};

  content.split("\n").forEach((line) => {
    const [key, ...valueParts] = line.split("=");
    if (key && !line.startsWith("#")) {
      env[key.trim()] = valueParts.join("=").replace(/^["']|["']$/g, "");
    }
  });

  return env;
}

function validateEnvironment() {
  console.log("🔍 Validating environment variables...\n");

  const currentEnv = { ...process.env, ...loadEnvFile(ENV_FILE) };
  /** @type {Array<{key: string, config: any}>} */
  const missing = [];
  /** @type {Array<{key: string, config: any}>} */
  const warnings = [];

  Object.entries(REQUIRED_VARS).forEach(([key, config]) => {
    const value = currentEnv[key];

    if (!value || value === "") {
      if (config.required) {
        missing.push({ key, config });
      } else {
        warnings.push({ key, config });
      }
    }
  });

  if (missing.length === 0 && warnings.length === 0) {
    console.log("✅ All environment variables are properly configured!");
    return true;
  }

  if (missing.length > 0) {
    console.log("❌ Missing required environment variables:\n");
    missing.forEach(({ key, config }) => {
      console.log(`${key}: ${config.description}`);
      if ("setup" in config && config.setup)
        console.log(`   Setup: ${config.setup}`);
      if ("default" in config && config.default)
        console.log(`   Default: ${config.default}`);
      console.log();
    });
  }

  if (warnings.length > 0) {
    console.log("⚠️  Optional environment variables:\n");
    warnings.forEach(({ key, config }) => {
      console.log(`${key}: ${config.description}`);
      console.log();
    });
  }

  return false;
}

function setupEnvironment() {
  console.log("🚀 Setting up environment variables...\n");

  if (!fs.existsSync(ENV_FILE)) {
    if (fs.existsSync(ENV_EXAMPLE)) {
      fs.copyFileSync(ENV_EXAMPLE, ENV_FILE);
      console.log("📋 Created .env file from .env.example");
    } else {
      fs.writeFileSync(ENV_FILE, "# Environment Variables\n");
      console.log("📋 Created new .env file");
    }
  }

  const currentEnv = loadEnvFile(ENV_FILE);
  let updated = false;

  Object.entries(REQUIRED_VARS).forEach(([key, config]) => {
    if (!currentEnv[key] || currentEnv[key] === "") {
      if ("generate" in config && config.generate) {
        currentEnv[key] = config.generate();
        console.log(`✨ Generated ${key}`);
        updated = true;
      } else if ("default" in config && config.default) {
        currentEnv[key] = config.default;
        console.log(`📝 Set ${key} to default value`);
        updated = true;
      }
    }
  });

  if (updated) {
    const envContent = Object.entries(currentEnv)
      .map(([key, value]) => `${key}=${value}`)
      .join("\n");

    fs.writeFileSync(ENV_FILE, envContent);
    console.log("\n💾 Updated .env file");
  }

  console.log("\n📋 Next steps:");
  console.log(
    "1. Configure database connection (SQLite default is fine for development)"
  );
  console.log(
    "2. Set up Supabase for production database and auth when needed"
  );
  console.log("3. Run: npm run build to test your setup");
}

function main() {
  const command = process.argv[2];

  switch (command) {
    case "validate":
      const isValid = validateEnvironment();
      process.exit(isValid ? 0 : 1);

    case "setup":
      setupEnvironment();
      break;

    default:
      console.log("Environment Variable Manager\n");
      console.log("Commands:");
      console.log("  validate  - Check if all required variables are set");
      console.log("  setup     - Initialize .env file with defaults");
      console.log("\nUsage:");
      console.log("  node scripts/setup-env.js validate");
      console.log("  node scripts/setup-env.js setup");
  }
}

if (require.main === module) {
  main();
}

module.exports = { validateEnvironment, setupEnvironment };
