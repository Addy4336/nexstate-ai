import { Elysia, t } from "elysia";
import { supabaseAdmin } from "@/lib/db";
import { 
    createTotalPaySession, 
    generateOrderNumber,
    parseWebhookPayload,
    verifyWebhookSignature,
    validatePaymentAmount,
    type TotalPayPaymentRequest 
} from "@/lib/totalpay";

export const paymentsRoutes = new Elysia({ prefix: "/payments" })
    /**
     * Create payment session
     * POST /api/payments/create-session
     */
    .post("/create-session", async ({ body }) => {
        try {
            const { 
                propertyId, 
                amount, 
                customerEmail, 
                customerName, 
                customerPhone,
                checkInDate,
                checkOutDate,
                guests,
                enquiryId,
                description
            } = body;

            // Validate input
            if (!amount || !customerEmail || !customerName) {
                return { 
                    success: false, 
                    error: "Missing required fields: amount, customerEmail, customerName" 
                };
            }

            // Validate amount
            if (!validatePaymentAmount(amount)) {
                return {
                    success: false,
                    error: "Invalid payment amount"
                };
            }

            // Generate unique order number
            const orderNumber = generateOrderNumber();

            console.log('Creating payment for order:', orderNumber);

            // Create payment record in database
            const { data: payment, error: dbError } = await supabaseAdmin
                .from("payments")
                .insert({
                    order_number: orderNumber,
                    property_id: propertyId || null,
                    enquiry_id: enquiryId || null,
                    user_email: customerEmail,
                    user_name: customerName,
                    user_phone: customerPhone || null,
                    amount,
                    currency: 'USD',
                    check_in_date: checkInDate || null,
                    check_out_date: checkOutDate || null,
                    guests: guests || null,
                    status: 'pending',
                })
                .select()
                .single();

            if (dbError) {
                console.error("Database error:", dbError);
                return { success: false, error: "Failed to create payment record" };
            }

            // Create TotalPay payment session
            const paymentRequest: TotalPayPaymentRequest = {
                orderNumber,
                amount,
                customerEmail,
                customerName,
                customerPhone,
                description: description || `Property Booking - Order ${orderNumber}`,
            };

            const totalPayResponse = await createTotalPaySession(paymentRequest);

            if (!totalPayResponse.success) {
                // Mark payment as failed
                await supabaseAdmin
                    .from("payments")
                    .update({ status: 'failed' })
                    .eq("id", payment.id);

                return { 
                    success: false, 
                    error: totalPayResponse.error || 'Failed to create payment session' 
                };
            }

            // Store session data
            await supabaseAdmin
                .from("payment_sessions")
                .insert({
                    payment_id: payment.id,
                    session_data: totalPayResponse,
                    redirect_url: totalPayResponse.redirect_url,
                    expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 minutes
                });

            console.log('Payment session created successfully:', {
                order_number: orderNumber,
                payment_id: payment.id,
            });

            return {
                success: true,
                redirect_url: totalPayResponse.redirect_url,
                order_number: orderNumber,
                transaction_id: totalPayResponse.transaction_id,
                payment_id: payment.id,
            };
        } catch (error: any) {
            console.error("Payment session creation error:", error);
            return { 
                success: false, 
                error: error.message || "Internal server error" 
            };
        }
    }, {
        body: t.Object({
            propertyId: t.Optional(t.String()),
            amount: t.Number(),
            customerEmail: t.String(),
            customerName: t.String(),
            customerPhone: t.Optional(t.String()),
            checkInDate: t.Optional(t.String()),
            checkOutDate: t.Optional(t.String()),
            guests: t.Optional(t.Number()),
            enquiryId: t.Optional(t.String()),
            description: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Payments"],
            summary: "Create payment session",
            description: "Create a TotalPay payment session and return redirect URL",
        },
    })

    /**
     * Webhook endpoint for payment status updates
     * POST /api/payments/webhook
     */
    .post("/webhook", async ({ body, headers }) => {
        try {
            console.log('='.repeat(60));
            console.log('🔔 WEBHOOK RECEIVED FROM TOTALPAY');
            console.log('='.repeat(60));
            console.log('Headers:', JSON.stringify(headers, null, 2));
            console.log('Body:', JSON.stringify(body, null, 2));
            console.log('='.repeat(60));

            // Verify webhook signature (if TotalPay provides it)
            const signature = (headers['x-totalpay-signature'] as string) || '';
            
            // Note: Implement proper signature verification based on TotalPay docs
            // For now, we'll log it for debugging
            if (signature) {
                console.log('Webhook signature received:', signature);
            }
            
            // Parse webhook payload
            const payload = parseWebhookPayload(body);
            
            if (!payload) {
                console.error("Invalid webhook payload:", body);
                return { success: false, error: "Invalid payload" };
            }

            console.log("Webhook payload parsed:", {
                order_number: payload.order_number,
                status: payload.status,
                transaction_id: payload.transaction_id,
            });

            // Find payment by order number
            const { data: payment, error: fetchError } = await supabaseAdmin
                .from("payments")
                .select("*")
                .eq("order_number", payload.order_number)
                .single();

            if (fetchError || !payment) {
                console.error("Payment not found:", payload.order_number, fetchError);
                return { success: false, error: "Payment not found" };
            }

            // Update payment status
            const updateData: any = {
                status: payload.status,
                totalpay_transaction_id: payload.transaction_id,
                totalpay_status: payload.status,
                totalpay_response: payload,
                payment_method: payload.payment_method,
                updated_at: new Date().toISOString(),
            };

            if (payload.status === 'success') {
                updateData.paid_at = new Date().toISOString();
            }

            const { error: updateError } = await supabaseAdmin
                .from("payments")
                .update(updateData)
                .eq("id", payment.id);

            if (updateError) {
                console.error("Failed to update payment:", updateError);
                return { success: false, error: "Failed to update payment" };
            }

            console.log('Payment updated successfully:', {
                payment_id: payment.id,
                new_status: payload.status,
            });

            // If payment successful and it's for a property booking
            if (payload.status === 'success' && payment.property_id && payment.check_in_date) {
                console.log('Processing property booking for payment:', payment.id);

                // Get current property data
                const { data: property } = await supabaseAdmin
                    .from("property")
                    .select("rental_periods")
                    .eq("id", payment.property_id)
                    .single();

                // Create new rental period
                const newRentalPeriod = {
                    start_date: payment.check_in_date,
                    end_date: payment.check_out_date,
                    tenant_info: `${payment.user_name} (${payment.user_email})`,
                    amount: payment.amount,
                    status: "active",
                    guests: payment.guests || 1,
                    payment_id: payment.id,
                    created_at: new Date().toISOString(),
                };

                const updatedRentalPeriods = [...(property?.rental_periods || []), newRentalPeriod];

                // Update property status
                const { error: propertyError } = await supabaseAdmin
                    .from("property")
                    .update({
                        status: "rented",
                        current_rental_start: payment.check_in_date,
                        current_rental_end: payment.check_out_date,
                        rental_periods: updatedRentalPeriods,
                    })
                    .eq("id", payment.property_id);

                if (propertyError) {
                    console.error("Failed to update property:", propertyError);
                } else {
                    console.log('Property updated to rented status');
                }

                // Update enquiry status if exists
                if (payment.enquiry_id) {
                    await supabaseAdmin
                        .from("enquiry")
                        .update({ status: "converted" })
                        .eq("id", payment.enquiry_id);
                    
                    console.log('Enquiry marked as converted');
                }
            }

            // TODO: Send confirmation email to customer
            // You can integrate with your existing email service here

            return { 
                success: true, 
                message: "Webhook processed successfully",
                order_number: payload.order_number,
            };
        } catch (error: any) {
            console.error("Webhook processing error:", error);
            return { success: false, error: error.message };
        }
    }, {
        body: t.Any(),
        detail: {
            tags: ["Payments"],
            summary: "Payment webhook",
            description: "Receive payment status updates from TotalPay",
        },
    })

    /**
     * Get payment by order number
     * GET /api/payments/:orderNumber
     */
    .get("/:orderNumber", async ({ params }) => {
        try {
            const { data: payment, error } = await supabaseAdmin
                .from("payments")
                .select(`
                    *,
                    property:property_id (
                        id,
                        title
                    )
                `)
                .eq("order_number", params.orderNumber)
                .single();

            if (error) {
                console.error("Error fetching payment:", error);
                return { success: false, error: "Payment not found" };
            }

            if (!payment) {
                return { success: false, error: "Payment not found" };
            }

            return { success: true, payment };
        } catch (error: any) {
            console.error("Exception fetching payment:", error);
            return { success: false, error: error.message };
        }
    }, {
        params: t.Object({
            orderNumber: t.String(),
        }),
        detail: {
            tags: ["Payments"],
            summary: "Get payment details",
            description: "Retrieve payment information by order number",
        },
    })

    /**
     * Get all payments (admin only - add auth middleware later)
     * GET /api/payments
     */
    .get("/", async ({ query }) => {
        try {
            let queryBuilder = supabaseAdmin
                .from("payments")
                .select(`
                    *,
                    property:property_id (
                        id,
                        title
                    )
                `)
                .order("created_at", { ascending: false });

            // Add filters if provided
            if (query.status) {
                queryBuilder = queryBuilder.eq("status", query.status);
            }

            if (query.limit) {
                queryBuilder = queryBuilder.limit(parseInt(query.limit as string));
            }

            const { data: payments, error } = await queryBuilder;

            if (error) {
                return { success: false, error: error.message };
            }

            return { success: true, payments, count: payments?.length || 0 };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }, {
        query: t.Object({
            status: t.Optional(t.String()),
            limit: t.Optional(t.String()),
        }),
        detail: {
            tags: ["Payments"],
            summary: "List payments",
            description: "Get all payments with optional filters (admin only)",
        },
    })

    /**
     * Get payment statistics (admin dashboard)
     * GET /api/payments/stats/summary
     */
    .get("/stats/summary", async () => {
        try {
            // Get total payments count and sum
            const { data: payments, error } = await supabaseAdmin
                .from("payments")
                .select("amount, status");

            if (error) {
                return { success: false, error: error.message };
            }

            const stats = {
                total_payments: payments?.length || 0,
                total_revenue: payments?.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0,
                successful_payments: payments?.filter(p => p.status === 'success').length || 0,
                pending_payments: payments?.filter(p => p.status === 'pending').length || 0,
                failed_payments: payments?.filter(p => p.status === 'failed').length || 0,
                successful_revenue: payments
                    ?.filter(p => p.status === 'success')
                    .reduce((sum, p) => sum + (Number(p.amount) || 0), 0) || 0,
            };

            return { success: true, stats };
        } catch (error: any) {
            return { success: false, error: error.message };
        }
    }, {
        detail: {
            tags: ["Payments"],
            summary: "Payment statistics",
            description: "Get payment statistics for admin dashboard",
        },
    });
