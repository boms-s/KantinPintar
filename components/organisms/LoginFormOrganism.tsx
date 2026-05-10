"use client";

import { Button, FormField, Input } from "@/components";
import { loginAction } from "@/app/api/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

export function LoginFormOrganism() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const result = await loginAction(formData);

      if (result.success && result.user) {
        // Redirect based on user role
        const role = result.user.role;
        if (role === "PEMBELI") {
          router.push("/pembeli/dashboard");
        } else if (role === "PENJUAL") {
          router.push("/penjual/dashboard");
        } else if (role === "ADMIN") {
          router.push("/admin/dashboard");
        }
      } else {
        setError(result.message || "Login gagal");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-200">
          {error}
        </div>
      )}

      <FormField label="Email" required>
        <Input
          type="email"
          placeholder="nama@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={<Mail className="h-4 w-4" />}
          disabled={loading}
        />
      </FormField>

      <FormField label="Password" required>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            disabled={loading}
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </FormField>

      <Button type="submit" fullWidth loading={loading}>
        Masuk
      </Button>
    </form>
  );
}
