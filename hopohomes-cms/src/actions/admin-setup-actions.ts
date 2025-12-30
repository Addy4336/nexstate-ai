"use server";

import { supabaseAdmin } from "@/lib/db";
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
  try {
    // Check if user exists
    const { data: existingUser, error: userError } = await supabaseAdmin
      .from("user")
      .select("id, role, name")
      .eq("email", formData.email)
      .single();

    let userId: string;
    let isNewUser = false;

    if (!existingUser || userError) {
      // Create new admin user
      const { data: newUser, error: createError } = await supabaseAdmin
        .from("user")
        .insert({
          name: formData.name || "Admin User",
          email: formData.email,
          email_verified: true,
          role: "admin",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();

      if (createError || !newUser) {
        console.error("Error creating user:", createError);
        return { error: createError?.message || "Failed to create admin account" };
      }

      userId = newUser.id;
      isNewUser = true;
    } else {
      userId = existingUser.id;

      // Check if password already exists
      const { data: existingAccount } = await supabaseAdmin
        .from("account")
        .select("id")
        .eq("user_id", userId)
        .eq("provider_id", "credential")
        .single();

      if (existingAccount) {
        // Delete existing credential to allow re-setup
        await supabaseAdmin
          .from("account")
          .delete()
          .eq("user_id", userId)
          .eq("provider_id", "credential");
      }
    }

    // Use Better Auth's internal password hashing via the auth context
    // Better Auth uses scrypt internally, so we access it through the password context
    const ctx = await auth.$context;
    const hashedPassword = await ctx.password.hash(formData.password);

    // Insert account with properly hashed password
    const { error: accountError } = await supabaseAdmin
      .from("account")
      .insert({
        user_id: userId,
        account_id: formData.email,
        provider_id: "credential",
        password: hashedPassword,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (accountError) {
      console.error("Error creating account:", accountError);
      // Provide more specific error messages
      if (accountError.code === "23505") {
        return { error: "An account with this email already exists" };
      }
      return { error: accountError.message || "Failed to create admin account" };
    }

    return {
      success: true,
      message: isNewUser ? "Admin account created successfully" : "Password set successfully"
    };
  } catch (error: any) {
    console.error("Error setting admin password:", error);
    return { error: error.message || "Failed to create admin account" };
  }
}

