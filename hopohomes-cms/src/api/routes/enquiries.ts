import { Elysia, t } from "elysia";
import { supabaseAdmin } from "@/lib/db";

export const enquiriesRoutes = new Elysia({ prefix: "/enquiries" })
    // Submit a new enquiry (public)
    .post("/", async ({ body }) => {
        const { type, name, email, phone, message, propertyId, propertyTitle, propertyDetails } = body;

        // Basic validation
        if (!name || !email || !message) {
            return { success: false, error: "Missing required fields" };
        }

        const { error } = await supabaseAdmin
            .from("enquiry")
            .insert({
                type: type || "general_contact",
                name,
                email,
                phone: phone || null,
                message,
                property_id: propertyId || null,
                property_title: propertyTitle || null,
                property_details: propertyDetails || null,
                status: "new",
            });

        if (error) {
            console.error("Error submitting enquiry:", error);
            return { success: false, error: "Failed to submit enquiry" };
        }

        return { success: true, message: "Enquiry submitted successfully" };
    }, {
        body: t.Object({
            type: t.Optional(t.String()),
            name: t.String(),
            email: t.String(),
            phone: t.Optional(t.String()),
            message: t.String(),
            propertyId: t.Optional(t.String()),
            propertyTitle: t.Optional(t.String()),
            propertyDetails: t.Optional(t.Any()),
        }),
        detail: {
            tags: ["Enquiries"],
            summary: "Submit enquiry",
            description: "Submit a new enquiry or contact request",
        },
    })

    // Get enquiry types (public - for form dropdowns)
    .get("/types", async () => {
        const types = [
            { value: "tenant_enquiry", label: "Property Enquiry" },
            { value: "owner_enquiry", label: "Owner Services" },
            { value: "general_contact", label: "General Enquiry" },
            { value: "schedule_viewing", label: "Schedule Viewing" },
        ];

        return { success: true, data: types };
    }, {
        detail: {
            tags: ["Enquiries"],
            summary: "Get enquiry types",
            description: "Get available enquiry types for forms",
        },
    });
