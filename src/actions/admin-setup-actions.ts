"use server";

import { pool } from "@/lib/db";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

/**
 * Set initial password for admin user or create new admin
 * This should only be used for the first-time setup
 */
export async function setInitialAdminPassword(formData: {
  email: string;
  password: string;
  name?: string;
}) {
  let client;
  
  try {
    client = await pool.connect();
  } catch (error: any) {
    console.error("Database connection error:", error);
    return { 
      error: "Cannot connect to database. Please check your DATABASE_URL in .env.local file." 
    };
  }

  try {
    // Check if user exists
    const userResult = await client.query(
      'SELECT id, role, name FROM "user" WHERE email = $1',
      [formData.email]
    );

    let userId: string;
    let isNewUser = false;

    if (userResult.rows.length === 0) {
      // Create new admin user
      const newUserResult = await client.query(
        `INSERT INTO "user" (id, name, email, email_verified, role, created_at, updated_at)
         VALUES (uuid_generate_v4(), $1, $2, true, 'admin', now(), now())
         RETURNING id`,
        [formData.name || "Admin User", formData.email]
      );
      userId = newUserResult.rows[0].id;
      isNewUser = true;
    } else {
      const user = userResult.rows[0];
      userId = user.id;

      // Check if password already exists
      const accountResult = await client.query(
        'SELECT id FROM "account" WHERE user_id = $1 AND provider_id = $2',
        [userId, "credential"]
      );

      if (accountResult.rows.length > 0) {
        return { error: "Admin account already exists. Please use the login page." };
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(formData.password, 10);

    // Insert account with password
    await client.query(
      `INSERT INTO "account" (id, user_id, account_id, provider_id, password, created_at, updated_at)
       VALUES (uuid_generate_v4(), $1, $2, $3, $4, now(), now())`,
      [userId, formData.email, "credential", hashedPassword]
    );

    return { 
      success: true, 
      message: isNewUser ? "Admin account created successfully" : "Password set successfully" 
    };
  } catch (error: any) {
    console.error("Error setting admin password:", error);
    
    // Provide more specific error messages
    if (error.code === "23505") {
      return { error: "An account with this email already exists" };
    }
    
    return { error: error.message || "Failed to create admin account" };
  } finally {
    client.release();
  }
}
