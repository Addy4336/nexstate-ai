"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function TestCardsPage() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const testCards = [
    {
      id: "quick-success",
      title: "✅ Quick Success (No 3DS)",
      description: "RECOMMENDED - Use this for testing",
      icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      cardNumber: "4111 1111 1111 1111",
      expiry: "01/38",
      cvv: "000",
      name: "TESTING GUY",
      expectedResult: "Immediate success without 3DS → Property marked as rented",
      highlight: true,
    },
    {
      id: "3ds-success",
      title: "⚠️ 3DS Success (Currently Failing)",
      description: "3DS test environment has issues",
      icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
      cardNumber: "4111 1111 1111 1111",
      expiry: "05/38",
      cvv: "000",
      name: "TESTING GUY",
      expectedResult: "Should work with 3DS but currently fails in test environment",
      highlight: false,
    },
    {
      id: "3ds-fail",
      title: "⚠️ 3DS Failure (Currently Failing)",
      description: "3DS test environment has issues",
      icon: <AlertCircle className="w-5 h-5 text-amber-500" />,
      cardNumber: "4111 1111 1111 1111",
      expiry: "06/38",
      cvv: "000",
      name: "TESTING GUY",
      expectedResult: "3DS verification should fail but test environment has issues",
      highlight: false,
    },
    {
      id: "quick-fail",
      title: "⚡ Quick Failure (No 3DS)",
      description: "Fast decline testing",
      icon: <XCircle className="w-5 h-5 text-orange-500" />,
      cardNumber: "4111 1111 1111 1111",
      expiry: "02/38",
      cvv: "000",
      name: "TESTING GUY",
      expectedResult: "Immediate decline",
      highlight: false,
    },
  ];

  const billingAddresses = [
    {
      country: "India",
      city: "Mumbai",
      address: "Warli Sea Link Mumbai",
      zip: "400018",
      phone: "+91 9876543210",
    },
    {
      country: "United Arab Emirates",
      city: "Dubai",
      address: "Sheikh Zayed Road",
      zip: "12345",
      phone: "+971 50 123 4567",
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">TotalPay Test Cards</h1>
          <p className="text-muted-foreground text-lg">
            Development testing reference for payment integration
          </p>
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-100 px-4 py-2 rounded-full text-sm">
            <AlertCircle className="w-4 h-4" />
            <span>For testing purposes only - Do not use in production</span>
          </div>
        </div>

        {/* 3DS Warning */}
        <Card className="border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
              <XCircle className="w-5 h-5" />
              Known Issue: 3DS Test Cards Failing
            </CardTitle>
            <CardDescription>
              The 3D Secure test cards (05/38, 06/38) are currently failing in the TotalPay test environment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-red-900 dark:text-red-100">
              <strong>Issue:</strong> "Transaction Declined - 3D Secure authentication failed"
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Workarounds:</strong>
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span><strong>Use card 01/38</strong> - Works without 3DS (Quick Success)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span><strong>Use Mock Payment Tool</strong> - <a href="/tools/mock-payment" className="text-primary hover:underline">Visit /tools/mock-payment</a></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5" />
                <span><strong>Contact TotalPay Support</strong> - Resolve 3DS configuration</span>
              </li>
            </ul>
            <p className="text-xs text-muted-foreground pt-2 border-t">
              See <code className="bg-background px-1 py-0.5 rounded">3DS_WORKAROUND.md</code> for detailed solutions
            </p>
          </CardContent>
        </Card>

        {/* Test Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {testCards.map((card) => (
            <Card 
              key={card.id} 
              className={`${
                card.highlight 
                  ? 'border-2 border-primary shadow-lg' 
                  : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {card.icon}
                      {card.title}
                    </CardTitle>
                    <CardDescription>{card.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Card Details */}
                <div className="space-y-3 font-mono text-sm">
                  <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                    <span className="text-muted-foreground">Card Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{card.cardNumber}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(card.cardNumber.replace(/ /g, ''), `${card.id}-card`)}
                      >
                        {copiedField === `${card.id}-card` ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                    <span className="text-muted-foreground">Expiry:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{card.expiry}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(card.expiry, `${card.id}-expiry`)}
                      >
                        {copiedField === `${card.id}-expiry` ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                    <span className="text-muted-foreground">CVV:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{card.cvv}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(card.cvv, `${card.id}-cvv`)}
                      >
                        {copiedField === `${card.id}-cvv` ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between bg-muted p-3 rounded-lg">
                    <span className="text-muted-foreground">Name:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{card.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 w-6 p-0"
                        onClick={() => copyToClipboard(card.name, `${card.id}-name`)}
                      >
                        {copiedField === `${card.id}-name` ? (
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Expected Result */}
                <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-900">
                  <p className="text-xs text-muted-foreground mb-1">Expected Result:</p>
                  <p className="text-sm">{card.expectedResult}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Billing Addresses */}
        <Card>
          <CardHeader>
            <CardTitle>Sample Billing Addresses</CardTitle>
            <CardDescription>Use these addresses when testing payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {billingAddresses.map((address, idx) => (
                <div key={idx} className="space-y-2 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold">{address.country}</h3>
                  <div className="text-sm space-y-1">
                    <p><span className="text-muted-foreground">City:</span> {address.city}</p>
                    <p><span className="text-muted-foreground">Address:</span> {address.address}</p>
                    <p><span className="text-muted-foreground">Zip:</span> {address.zip}</p>
                    <p><span className="text-muted-foreground">Phone:</span> {address.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Testing Checklist */}
        <Card>
          <CardHeader>
            <CardTitle>Testing Checklist</CardTitle>
            <CardDescription>Verify these items after payment</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Payment redirects to TotalPay checkout page</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <span>3D Secure verification page appears (for 05/38 card)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Successfully redirects back to success page</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Property shows as "Rented" or "Unavailable"</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Tenant information displays correctly</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <span>Payment record in database shows "success" status</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Common Issues */}
        <Card className="border-amber-200 dark:border-amber-900 bg-amber-50/50 dark:bg-amber-950/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              Common Issues
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-1">❌ "Transaction Declined - 3D Secure authentication failed"</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Cause:</strong> TotalPay test environment 3DS configuration issue<br />
                <strong>Solution:</strong> Use expiry <code className="bg-background px-1 py-0.5 rounded">01/38</code> (no 3DS) or visit <a href="/tools/mock-payment" className="text-primary hover:underline">/tools/mock-payment</a> to simulate successful payments
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">❌ Property doesn't update after payment</h4>
              <p className="text-sm text-muted-foreground">
                <strong>Cause:</strong> Webhook not receiving TotalPay callback<br />
                <strong>Solution:</strong> For local dev, use ngrok or test on staging server with public URL. Or use the mock payment tool at <a href="/tools/mock-payment" className="text-primary hover:underline">/tools/mock-payment</a>
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1">💡 Want to test without TotalPay issues?</h4>
              <p className="text-sm text-muted-foreground">
                Use the <strong>Mock Payment Tool</strong> at <a href="/tools/mock-payment" className="text-primary hover:underline font-semibold">/tools/mock-payment</a> to directly simulate successful/failed payment webhooks
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-8 border-t">
          <p>📚 For more details, see: <a href="https://docs.totalpay.global/docs/guides/s2s_card#testing" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">TotalPay Testing Documentation</a></p>
          <p className="mt-2">💡 Quick access: <code className="bg-muted px-2 py-1 rounded">http://localhost:3000/tools/test-cards</code></p>
        </div>
      </div>
    </div>
  );
}
