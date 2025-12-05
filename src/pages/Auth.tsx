import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

type AuthView = "login" | "forgot" | "verify";

export default function Auth() {
  const navigate = useNavigate();
  const [view, setView] = useState<AuthView>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState(["", "", "", ""]);
  const [countdown, setCountdown] = useState(22);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, just navigate to home (will add real auth with Supabase)
    toast.success("Login successful!");
    navigate("/");
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Verification code sent to your email!");
    setView("verify");
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Email verified successfully!");
    setView("login");
  };

  const handleCodeInput = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Purple blob background */}
      {view === "login" && (
        <>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl opacity-60 -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary rounded-full blur-3xl opacity-50 translate-x-1/2 translate-y-1/2" />
        </>
      )}

      {/* Login View */}
      {view === "login" && (
        <div className="relative z-10 w-full max-w-md mx-4">
          <div className="bg-card/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
            <h1 className="text-2xl font-bold text-center mb-8 italic">Log In</h1>
            
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm text-muted-foreground">
                  password_
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-0 border-b border-border rounded-none bg-transparent px-0 pr-10 focus-visible:ring-0 focus-visible:border-primary"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setView("forgot")}
                  className="text-sm"
                >
                  Forget Password?
                  <span className="text-primary ml-1">help</span>
                </button>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
              >
                Log In
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password View */}
      {view === "forgot" && (
        <div className="relative z-10 w-full max-w-sm mx-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Forget Password ?</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Write Your Email To Recive a Confirmation code<br />
            to Rest Your Password
          </p>

          <form onSubmit={handleForgotPassword} className="space-y-6">
            <div className="text-left">
              <Label htmlFor="forgot-email" className="text-sm text-muted-foreground">
                Email
              </Label>
              <Input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 border-b border-border rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-primary"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5"
            >
              Confirm Mail
            </Button>
          </form>

          <button
            onClick={() => setView("login")}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Back to Login
          </button>
        </div>
      )}

      {/* Verify Email View */}
      {view === "verify" && (
        <div className="relative z-10 w-full max-w-sm mx-4 text-center">
          <h1 className="text-2xl font-bold mb-2">Verify Email Address</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Verify Code Sent to Your Email
          </p>

          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div className="flex justify-center gap-3">
              {verificationCode.map((digit, index) => (
                <Input
                  key={index}
                  id={`code-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeInput(index, e.target.value)}
                  className="w-14 h-14 text-center text-xl font-medium border border-border rounded-lg focus-visible:ring-2 focus-visible:ring-primary"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-5"
            >
              Confirm
            </Button>
          </form>

          <div className="mt-4 text-sm">
            <span className="text-primary font-medium">00:{countdown.toString().padStart(2, "0")}</span>
            <span className="text-muted-foreground ml-2">Resend code</span>
          </div>

          <button
            onClick={() => setView("forgot")}
            className="mt-4 text-sm text-primary hover:underline"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}
