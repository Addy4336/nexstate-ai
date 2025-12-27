"use server";

import { pool } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sendUserInviteEmail, generateSecurePassword } from "@/lib/email";

export async function inviteUser(formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string || "editor";

    if (!name || !email) {
        return { error: "Name and email are required" };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { error: "Invalid email format" };
    }

    // Validate role
    const validRoles = ["admin", "manager", "editor"];
    if (!validRoles.includes(role)) {
        return { error: "Invalid role selected" };
    }

    // Generate a secure password
    const password = generateSecurePassword(12);

    const client = await pool.connect();
    try {
        // Check if user already exists
        const existingUser = await client.query(
            'SELECT id FROM "user" WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return { error: "User with this email already exists" };
        }

        // Use Better Auth's internal password hashing
        const ctx = await auth.$context;
        const hashedPassword = await ctx.password.hash(password);

        // Create user
        const userResult = await client.query(
            `INSERT INTO "user" (name, email, role, email_verified, created_at, updated_at) 
             VALUES ($1, $2, $3, true, now(), now()) 
             RETURNING id`,
            [name, email, role]
        );

        const userId = userResult.rows[0].id;

        // Create account with hashed password
        await client.query(
            `INSERT INTO "account" (
                user_id, 
                account_id, 
                provider_id, 
                password
            ) VALUES ($1, $2, $3, $4)`,
            [userId, email, "credential", hashedPassword]
        );

        // Send invitation email with credentials
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';
        const emailResult = await sendUserInviteEmail({
            to: email,
            name,
            email,
            password,
            role,
            loginUrl: `${baseUrl}/admin/login`,
        });

        if (!emailResult.success) {
            console.error("Failed to send invitation email:", emailResult.error);
            // User is created but email failed - don't fail the whole operation
        }

    } catch (error: any) {
        console.error("Error creating user:", error);
        return { error: error.message || "Failed to create user" };
    } finally {
        client.release();
    }

    revalidatePath("/admin/users");
    return { success: true, message: "User invited successfully! An email with login credentials has been sent." };
}

// Keep the old function name as an alias for backwards compatibility
export const createUser = inviteUser;

export async function updateUser(id: string, formData: FormData) {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const role = formData.get("role") as string;
    const banned = formData.get("banned") === "true";
    const banReason = formData.get("ban_reason") as string || null;

    if (!name || !email) {
        return { error: "Name and email are required" };
    }

    const client = await pool.connect();
    try {
        // Check if email is taken by another user
        const existingUser = await client.query(
            'SELECT id FROM "user" WHERE email = $1 AND id != $2',
            [email, id]
        );

        if (existingUser.rows.length > 0) {
            return { error: "Email is already in use" };
        }

        await client.query(
            `UPDATE "user" 
             SET name = $1, email = $2, role = $3, banned = $4, ban_reason = $5, updated_at = now()
             WHERE id = $6`,
            [name, email, role, banned, banReason, id]
        );
    } catch (error: any) {
        console.error("Error updating user:", error);
        return { error: error.message || "Failed to update user" };
    } finally {
        client.release();
    }

    revalidatePath("/admin/users");
    redirect("/admin/users");
}

export async function deleteUser(id: string) {
    const client = await pool.connect();
    try {
        await client.query('DELETE FROM "user" WHERE id = $1', [id]);
    } catch (error: any) {
        console.error("Error deleting user:", error);
        return { error: error.message || "Failed to delete user" };
    } finally {
        client.release();
    }
    revalidatePath("/admin/users");
}

export async function resetUserPassword(id: string, formData: FormData) {
    const newPassword = formData.get("password") as string;

    if (!newPassword || newPassword.length < 8) {
        return { error: "Password must be at least 8 characters long" };
    }

    const client = await pool.connect();
    try {
        // Use Better Auth's internal password hashing
        const ctx = await auth.$context;
        const hashedPassword = await ctx.password.hash(newPassword);

        await client.query(
            'UPDATE "account" SET password = $1 WHERE user_id = $2 AND provider_id = $3',
            [hashedPassword, id, "credential"]
        );
    } catch (error: any) {
        console.error("Error resetting password:", error);
        return { error: error.message || "Failed to reset password" };
    } finally {
        client.release();
    }

    return { success: true };
}

