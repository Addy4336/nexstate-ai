"use client";

import { PaymentButton } from "@/components/payments/payment-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function PaymentTestPage() {
    const [amount, setAmount] = useState("0.01");
    const [email, setEmail] = useState("test@example.com");
    const [name, setName] = useState("Test User");
    const [phone, setPhone] = useState("+1234567890");

    return (
        <div className="container max-w-2xl mx-auto px-4 py-16">
            <Card>
                <CardHeader>
                    <CardTitle>TotalPay Payment Test</CardTitle>
                    <CardDescription>
                        Test the payment gateway integration
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount ($)</Label>
                        <Input
                            id="amount"
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone (Optional)</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div className="pt-4 border-t">
                        <PaymentButton
                            amount={parseFloat(amount)}
                            customerEmail={email}
                            customerName={name}
                            customerPhone={phone}
                            description="Test Payment"
                            className="w-full"
                        >
                            Pay ${amount}
                        </PaymentButton>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
                        <p className="font-semibold text-blue-900 mb-2">🧪 Test Card Numbers (Try these):</p>
                        <div className="space-y-1 text-blue-800 font-mono text-xs">
                            <p>Visa: 4111 1111 1111 1111</p>
                            <p>Mastercard: 5555 5555 5555 4444</p>
                            <p>CVV: 123 | Expiry: 12/28</p>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded p-4 text-sm">
                        <p className="font-semibold text-green-900 mb-2">How to test:</p>
                        <ol className="list-decimal list-inside space-y-1 text-green-800">
                            <li>Click "Pay" button below</li>
                            <li>You'll be redirected to TotalPay</li>
                            <li>Use test card numbers above</li>
                            <li>Check backend terminal for webhook logs</li>
                            <li>You'll return to success page</li>
                        </ol>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
                        <p className="font-semibold text-yellow-900 mb-2">⚠️ Important:</p>
                        <p className="text-yellow-800 mb-2">
                            Make sure backend (port 3001) and ngrok are running!
                        </p>
                        <p className="text-yellow-700 text-xs">
                            Webhook URL in TotalPay: https://your-ngrok-url.ngrok.io/api/payments/webhook
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
