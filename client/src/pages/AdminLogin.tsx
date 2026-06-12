import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Lock, AlertCircle } from "lucide-react";
import { AdminSession } from "@/types";

interface AdminLoginProps {
  onLoginSuccess: (session: AdminSession) => void;
}

export default function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginMutation = trpc.admin.login.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginMutation.mutateAsync({
        username,
        password,
      });

      if (result.success) {
        toast.success("Login successful!");
        onLoginSuccess({
          adminId: result.adminId,
          username: result.username,
        });
      }
    } catch (err: any) {
      const errorMessage = err?.message || "Invalid credentials";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted py-12 px-4">
      <Card className="w-full max-w-md">
        <div className="p-8">
          <div className="flex items-center justify-center mb-8">
            <div className="bg-accent rounded-lg p-3">
              <Lock className="w-6 h-6 text-accent-foreground" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Admin Panel</h1>
          <p className="text-center text-muted-foreground mb-8">
            Sign in to manage your products
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex gap-3">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Demo Credentials (for testing):
            </p>
            <div className="space-y-1 text-xs text-muted-foreground text-center">
              <p>Username: <span className="font-mono">admin</span></p>
              <p>Password: <span className="font-mono">password123</span></p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
