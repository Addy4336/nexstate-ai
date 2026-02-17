"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

export default function MockPaymentPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleMockSuccess = async () => {
    if (!orderNumber.trim()) {
      setResult({ success: false, message: "Please enter an order number" });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      // Simulate successful payment webhook callback
      const mockCallbackData = {
        id: `MOCK-${Date.now()}`,
        order_number: orderNumber,
        order_amount: "1000.00",
        order_currency: "AED",
        order_description: `Property Booking - Order ${orderNumber}`,
        order_status: "settled",
        type: "sale",
        status: "success",
        customer_name: "Test User",
        customer_email: "test@example.com",
        customer_ip: "127.0.0.1",
        card: "411111******1111",
        hash: "mock_hash_for_testing",
      };

      console.log("🧪 Sending mock webhook callback:", mockCallbackData);

      const response = await fetch("http://localhost:3001/api/payments/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockCallbackData),
      });

      const data = await response.text();

      if (response.ok && data === "OK") {
        setResult({
          success: true,
          message: `✅ Success! Payment ${orderNumber} marked as successful. Check the property status now.`,
        });
      } else {
        setResult({
          success: false,
          message: `❌ Failed: ${data}. Make sure the order number exists in the database.`,
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `❌ Error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMockFailure = async () => {
    if (!orderNumber.trim()) {
      setResult({ success: false, message: "Please enter an order number" });
      return;
    }

    try {
      setLoading(true);
      setResult(null);

      const mockCallbackData = {
        id: `MOCK-${Date.now()}`,
        order_number: orderNumber,
        order_amount: "1000.00",
        order_currency: "AED",
        order_description: `Property Booking - Order ${orderNumber}`,
        order_status: "decline",
        type: "sale",
        status: "fail",
        reason: "Insufficient funds",
        customer_name: "Test User",
        customer_email: "test@example.com",
        customer_ip: "127.0.0.1",
        card: "411111******1111",
        hash: "mock_hash_for_testing",
      };

      console.log("🧪 Sending mock webhook callback:", mockCallbackData);

      const response = await fetch("http://localhost:3001/api/payments/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(mockCallbackData),
      });

      const data = await response.text();

      if (response.ok) {
        setResult({
          success: true,
          message: `✅ Mock failure processed. Payment ${orderNumber} marked as failed.`,
        });
      } else {
        setResult({
          success: false,
          message: `❌ Failed: ${data}`,
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: `❌ Error: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Mock Payment Webhook</h1>
          <p className="text-muted-foreground">
            Simulate successful/failed payment callbacks for testing
          </p>
        </div>

        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Testing Tool - Development Only
            </CardTitle>
            <CardDescription>
              This bypasses TotalPay and directly triggers the webhook to test property rental updates
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Go to a property page and click "Book Now"</li>
              <li>Fill in customer details and click "Proceed to Payment"</li>
              <li>
                <strong>On the TotalPay page</strong>, note the order number from the URL or browser
                console
              </li>
              <li>
                <strong>Come back to this page</strong> and enter the order number below
              </li>
              <li>Click "Simulate Success" to mark the payment as successful</li>
              <li>Check the property - it should now show as "Rented" with tenant info</li>
            </ol>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulate Payment Callback</CardTitle>
            <CardDescription>Enter the order number from your payment session</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="orderNumber">Order Number</Label>
              <Input
                id="orderNumber"
                placeholder="HOPO-1234567890-123"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                disabled={loading}
              />
              <p className="text-xs text-muted-foreground">
                Format: HOPO-timestamp-random (e.g., HOPO-1708185600000-456)
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleMockSuccess}
                disabled={loading || !orderNumber.trim()}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Simulate Success
                  </>
                )}
              </Button>

              <Button
                onClick={handleMockFailure}
                disabled={loading || !orderNumber.trim()}
                variant="outline"
                className="flex-1"
              >
                Simulate Failure
              </Button>
            </div>

            {result && (
              <div
                className={`p-4 rounded-lg border ${
                  result.success
                    ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900"
                    : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
                }`}
              >
                <p className={result.success ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"}>
                  {result.message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alternative: Check Order in Console</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              When you're redirected to TotalPay, check your browser console (F12) for logs showing the
              order number. Copy it from there.
            </p>
            <div className="bg-muted p-3 rounded-lg font-mono text-xs">
              <div>Creating payment session...</div>
              <div>Order number: <span className="text-primary">HOPO-1708185600000-456</span></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What This Does</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Marks the payment as successful in the database</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Updates property status to "rented"</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Adds rental period with tenant information</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span>Triggers all the same logic as a real TotalPay webhook</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
