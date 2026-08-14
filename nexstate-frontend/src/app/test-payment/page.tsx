"use client";

import { PaymentButton } from "@/components/payments/payment-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export default function PaymentTestPage() {
    const [amount, setAmount] = useState("100.00");
    const [email, setEmail] = useState("test@example.com");
    const [name, setName] = useState("Test User");
    const [phone, setPhone] = useState("+971501234567");

    return (
        <div className="container max-w-2xl mx-auto px-4 py-16">
            <Card>
                <CardHeader>
                    <CardTitle>TotalPay Checkout Test</CardTitle>
                    <CardDescription>
                        Test the TotalPay Checkout integration (Hosted Payment Page)
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="amount">Amount (AED)</Label>
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
                            Pay {amount} AED
                        </PaymentButton>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded p-4 text-sm">
                        <p className="font-semibold text-blue-900 mb-2">🧪 TotalPay Test Cards:</p>
                        <div className="space-y-2 text-blue-800">
                            <div className="font-mono text-xs">
                                <p className="font-semibold">✅ SUCCESS (Direct):</p>
                                <p>Card: 4111 1111 1111 1111</p>
                                <p>Expiry: 01/38 | CVV: 123</p>
                            </div>
                            <div className="font-mono text-xs">
                                <p className="font-semibold">✅ SUCCESS (with 3DS):</p>
                                <p>Card: 4111 1111 1111 1111</p>
                                <p>Expiry: 05/38 | CVV: 123</p>
                            </div>
                            <div className="font-mono text-xs">
                                <p className="font-semibold">❌ DECLINED:</p>
                                <p>Card: 4111 1111 1111 1111</p>
                                <p>Expiry: 02/38 | CVV: 123</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded p-4 text-sm">
                        <p className="font-semibold text-green-900 mb-2">📝 How to test:</p>
                        <ol className="list-decimal list-inside space-y-1 text-green-800">
                            <li>Click "Pay" button below</li>
                            <li>You'll be redirected to TotalPay Checkout</li>
                            <li>Enter test card (use 05/38 for 3DS success)</li>
                            <li>Complete payment on TotalPay's page</li>
                            <li>TotalPay sends callback to backend webhook</li>
                            <li>You'll return to success/cancel page</li>
                        </ol>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm">
                        <p className="font-semibold text-yellow-900 mb-2">⚠️ Important Notes:</p>
                        <ul className="list-disc list-inside space-y-1 text-yellow-800 text-xs">
                            <li>Backend must be running on port 3001</li>
                            <li>If 3DS fails, use Expiry: 05/38 instead of 01/38</li>
                            <li>Check backend logs for callback data</li>
                            <li>Payment status will update in database</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
