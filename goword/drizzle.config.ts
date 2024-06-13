import "dotenv/config";
import type { Config } from "drizzle-kit";
import { sql } from "drizzle-orm";

const config: Config = {
    schema: "./db/schema.ts",
    out: "./db/drizzle.ts",
    driver: "pg",
    dbCredentials: {
        connectionString: sql,
    },
};

export default config;