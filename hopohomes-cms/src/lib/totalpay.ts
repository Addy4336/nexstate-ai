/**
 * TotalPay Payment Gateway Integration
 * Helper functions for creating payment sessions and handling webhooks
 */

// TotalPay API configuration
const TOTALPAY_CONFIG = {
    merchantKey: process.env.TOTALPAY_MERCHANT_KEY!,
    password: process.env.TOTALPAY_PASSWORD!,
    checkoutHost: process.env.TOTALPAY_CHECKOUT_HOST!,
    successUrl: process.env.TOTALPAY_SUCCESS_URL || 'http://localhost:3000/payment/success',
    cancelUrl: process.env.TOTALPAY_CANCEL_URL || 'http://localhost:3000/payment/cancel',
    testMode: process.env.TOTALPAY_TEST_MODE === 'true', // Enable mock mode for testing
};

// Validate configuration on load
if (!TOTALPAY_CONFIG.merchantKey || !TOTALPAY_CONFIG.password || !TOTALPAY_CONFIG.checkoutHost) {
    console.error('❌ TotalPay configuration missing! Check your .env file:');
    console.error('   TOTALPAY_MERCHANT_KEY:', !!TOTALPAY_CONFIG.merchantKey);
    console.error('   TOTALPAY_PASSWORD:', !!TOTALPAY_CONFIG.password);
    console.error('   TOTALPAY_CHECKOUT_HOST:', !!TOTALPAY_CONFIG.checkoutHost);
} else {
    console.log('✅ TotalPay configuration loaded successfully');
    if (TOTALPAY_CONFIG.testMode) {
        console.log('⚠️  TotalPay running in TEST MODE - payments will be mocked');
    }
}

// Type definitions
export interface TotalPayPaymentRequest {
    orderNumber: string;
    amount: number;
    currency?: string;
    customerEmail: string;
    customerName: string;
    customerPhone?: string;
    description: string;
    billingAddress?: {
        address1?: string;
        city?: string;
        state?: string;
        zip?: string;
        country?: string;
    };
}

export interface TotalPayResponse {
    success: boolean;
    redirect_url?: string;
    transaction_id?: string;
    error?: string;
    message?: string;
}

/**
 * Generate unique order number
 * Format: HOPO-timestamp-random
 */
export function generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `HOPO-${timestamp}-${random}`;
}

/**
 * Create payment session with TotalPay
 * Returns redirect URL for customer to complete payment
 */
export async function createTotalPaySession(
    paymentRequest: TotalPayPaymentRequest
): Promise<TotalPayResponse> {
    try {
        // TEST MODE - Mock payment for local development
        if (TOTALPAY_CONFIG.testMode) {
            console.log('🧪 TEST MODE: Mocking TotalPay payment session');
            const mockRedirectUrl = `${TOTALPAY_CONFIG.successUrl}?order_number=${paymentRequest.orderNumber}&test=true`;
            return {
                success: true,
                redirect_url: mockRedirectUrl,
                transaction_id: `test_txn_${Date.now()}`,
                message: 'Test mode - payment mocked',
            };
        }

        // Try different possible endpoint paths
        // TODO: Update this with the correct endpoint from TotalPay documentation
        const possibleEndpoints = [
            '/api/v1/checkout/session',
            '/api/checkout/session',
            '/checkout/session',
            '/api/v1/session',
            '/payment/session',
        ];

        const endpointToTry = possibleEndpoints[0]; // Using first one for now

        const payload = {
            merchant_key: TOTALPAY_CONFIG.merchantKey,
            password: TOTALPAY_CONFIG.password,
            order_number: paymentRequest.orderNumber,
            amount: paymentRequest.amount.toFixed(2),
            currency: paymentRequest.currency || 'USD',
            description: paymentRequest.description,
            
            // Customer information
            customer_email: paymentRequest.customerEmail,
            customer_name: paymentRequest.customerName,
            customer_phone: paymentRequest.customerPhone || '',
            
            // Billing address (optional)
            billing_address: paymentRequest.billingAddress || {},
            
            // Return URLs
            success_url: TOTALPAY_CONFIG.successUrl,
            cancel_url: TOTALPAY_CONFIG.cancelUrl,
        };

        console.log('Creating TotalPay session:', {
            order_number: paymentRequest.orderNumber,
            amount: paymentRequest.amount,
            customer: paymentRequest.customerEmail,
            api_url: `${TOTALPAY_CONFIG.checkoutHost}${endpointToTry}`,
        });

        const response = await fetch(`${TOTALPAY_CONFIG.checkoutHost}${endpointToTry}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('TotalPay API response status:', response.status, response.statusText);

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
            } catch {
                errorData = { message: errorText || 'Unknown error' };
            }
            console.error('TotalPay API error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData,
            });
            
            // Provide helpful error message for 404
            if (response.status === 404) {
                console.error('❌ TotalPay endpoint not found!');
                console.error('   Please verify the correct API endpoint from TotalPay documentation');
                console.error('   Current endpoint:', `${TOTALPAY_CONFIG.checkoutHost}${endpointToTry}`);
                console.error('   💡 TIP: Set TOTALPAY_TEST_MODE=true in .env to test without TotalPay API');
            }
            
            return {
                success: false,
                error: errorData.message || errorData.error_message || errorData.error || `TotalPay API error: ${response.status}`,
            };
        }

        const data = await response.json();
        
        console.log('TotalPay session created:', {
            transaction_id: data.transaction_id,
            has_redirect_url: !!data.redirect_url,
        });

        return {
            success: true,
            redirect_url: data.redirect_url,
            transaction_id: data.transaction_id,
        };
    } catch (error: any) {
        console.error('TotalPay session creation error:', error);
        return {
            success: false,
            error: error.message || 'Failed to create payment session',
        };
    }
}

/**
 * Verify webhook signature (if TotalPay provides signature verification)
 * This is a placeholder - implement according to TotalPay's documentation
 */
export function verifyWebhookSignature(
    payload: string,
    signature: string
): boolean {
    const webhookSecret = process.env.TOTALPAY_WEBHOOK_SECRET;
    
    // If no secret is configured, skip verification
    if (!webhookSecret) {
        console.warn('TOTALPAY_WEBHOOK_SECRET not set - webhook signature verification disabled');
        return true;
    }
    
    // TODO: Implement signature verification based on TotalPay's documentation
    // This might involve HMAC-SHA256 or similar cryptographic verification
    // Example:
    // const crypto = require('crypto');
    // const expectedSignature = crypto
    //     .createHmac('sha256', webhookSecret)
    //     .update(payload)
    //     .digest('hex');
    // return expectedSignature === signature;
    
    return true;
}

/**
 * Webhook payload structure from TotalPay
 */
export interface WebhookPayload {
    order_number: string;
    transaction_id: string;
    status: 'success' | 'failed' | 'pending' | 'cancelled';
    amount: number;
    currency: string;
    customer_email: string;
    payment_method?: string;
    timestamp?: string;
    [key: string]: any; // Allow additional fields
}

/**
 * Parse and validate webhook payload from TotalPay
 */
export function parseWebhookPayload(body: any): WebhookPayload | null {
    try {
        // Validate required fields
        if (!body.order_number || !body.transaction_id || !body.status) {
            console.error('Missing required webhook fields:', body);
            return null;
        }

        return {
            order_number: body.order_number,
            transaction_id: body.transaction_id,
            status: body.status?.toLowerCase(),
            amount: parseFloat(body.amount || '0'),
            currency: body.currency || 'USD',
            customer_email: body.customer_email || '',
            payment_method: body.payment_method,
            timestamp: body.timestamp,
            ...body, // Include all other fields
        };
    } catch (error) {
        console.error('Failed to parse webhook payload:', error);
        return null;
    }
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
}

/**
 * Validate payment amount
 */
export function validatePaymentAmount(amount: number): boolean {
    return amount > 0 && amount < 1000000 && Number.isFinite(amount);
}

/**
 * Get payment status display info
 */
export function getPaymentStatusInfo(status: string): {
    label: string;
    color: string;
    description: string;
} {
    const statusMap: Record<string, { label: string; color: string; description: string }> = {
        pending: {
            label: 'Pending',
            color: 'yellow',
            description: 'Payment is being processed',
        },
        success: {
            label: 'Success',
            color: 'green',
            description: 'Payment completed successfully',
        },
        failed: {
            label: 'Failed',
            color: 'red',
            description: 'Payment failed',
        },
        cancelled: {
            label: 'Cancelled',
            color: 'orange',
            description: 'Payment was cancelled',
        },
        refunded: {
            label: 'Refunded',
            color: 'blue',
            description: 'Payment has been refunded',
        },
    };

    return statusMap[status] || {
        label: status,
        color: 'gray',
        description: 'Unknown status',
    };
}
