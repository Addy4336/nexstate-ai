"use server";

import { pool } from "@/lib/db";
import { auth } from "@/lib/auth";

/**
 * Set initial password for admin user or create new admin
 * Uses Better Auth's internal password context for proper hash format
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
         VALUES (gen_random_uuid()::text, $1, $2, true, 'admin', now(), now())
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
        // Delete existing credential to allow re-setup
        await client.query(
          'DELETE FROM "account" WHERE user_id = $1 AND provider_id = $2',
          [userId, "credential"]
        );
      }
    }

    // Use Better Auth's internal password hashing via the auth context
    // Better Auth uses scrypt internally, so we access it through the password context
    const ctx = await auth.$context;
    const hashedPassword = await ctx.password.hash(formData.password);

    // Insert account with properly hashed password
    await client.query(
      `INSERT INTO "account" (id, user_id, account_id, provider_id, password, created_at, updated_at)
       VALUES (gen_random_uuid()::text, $1, $2, $3, $4, now(), now())`,
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

