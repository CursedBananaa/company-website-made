import { useState } from "react";
import { CreditCard } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function Payment() {
  const [cardNumber, setCardNumber] = useState(["2412", "5687", "9345", "3564"]);
  const [cvv, setCvv] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");

  const formatCardNumber = (index: number, value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    const newCardNumber = [...cardNumber];
    newCardNumber[index] = cleaned;
    setCardNumber(newCardNumber);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <CreditCard className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-semibold">Payment</h1>
        </div>

        {/* Credit Card Preview */}
        <div className="flex justify-center">
          <div className="w-80 h-48 rounded-2xl bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-600 p-6 text-white shadow-xl relative overflow-hidden">
            {/* Card Background Pattern */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-4 right-4 w-32 h-32 rounded-full bg-white/20" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-white/10" />
            </div>
            
            {/* Card Content */}
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-lg font-medium">Finaci</span>
                <span className="text-sm font-bold bg-white/20 px-2 py-0.5 rounded">VISA</span>
              </div>
              
              <div className="space-y-1">
                <div className="text-2xl font-mono tracking-wider">
                  {cardNumber.join(" ").replace(/(\d{4})/g, "•••• ").slice(0, -1)}2345
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-70">Card Holder name</p>
                  <p className="font-medium">Noman Manzoor</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70">Expiry Date</p>
                  <p className="font-medium">02/30</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Card Number Input */}
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">card Number</h3>
            <p className="text-sm text-muted-foreground">Enter the 16 digit card number on the card</p>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
            <div className="flex items-center gap-1">
              <div className="w-8 h-5 bg-red-500 rounded-sm" />
              <div className="w-8 h-5 bg-yellow-500 rounded-full -ml-4" />
            </div>
            <div className="flex items-center gap-2 flex-1">
              {cardNumber.map((segment, index) => (
                <div key={index} className="flex items-center">
                  <Input
                    value={segment}
                    onChange={(e) => formatCardNumber(index, e.target.value)}
                    className="w-16 text-center border-0 bg-transparent text-sm font-mono"
                    maxLength={4}
                  />
                  {index < 3 && <span className="text-muted-foreground">-</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CVV and Expiry Date */}
        <div className="grid grid-cols-2 gap-8">
          {/* CVV */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold">CVV Number</h3>
              <p className="text-sm text-muted-foreground">Enter the 3 or 4 number on the card</p>
            </div>
            <Input
              value={cvv}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
              className="bg-muted/50 border-0"
              placeholder="•••"
              maxLength={4}
            />
          </div>

          {/* Expiry Date */}
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold">Expiry Date</h3>
              <p className="text-sm text-muted-foreground">Enter the expiration Date Of the card</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                value={expiryMonth}
                onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
                className="w-16 bg-muted/50 border-0 text-center"
                placeholder="MM"
                maxLength={2}
              />
              <span className="text-xl text-muted-foreground">/</span>
              <Input
                value={expiryYear}
                onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, "").slice(0, 2))}
                className="w-16 bg-muted/50 border-0 text-center"
                placeholder="YY"
                maxLength={2}
              />
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <Button 
          className="w-full h-14 text-xl font-bold rounded-xl shadow-[0_0_20px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_hsl(var(--primary)/0.6)] transition-all duration-300"
        >
          PAY NOW
        </Button>
      </div>
    </DashboardLayout>
  );
}
