"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";
import { useAuthStore } from "@/store/auth-store";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
  email: z.email("Email inválido"),
  password: z.string().min(8, "Senha deve ter no mínimo 8 caracteres"),
  orgName: z.string().optional(),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { login } = useAuthStore();
  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Erro ao criar conta");
      }

      login(result.user, result.token);

      toast({
        title: "Conta criada!",
        description: "Bem-vindo ao HOTFLOW",
        variant: "success",
      });

      router.push("/dashboard");
    } catch (err) {
      toast({
        title: "Erro no registro",
        description: err instanceof Error ? err.message : "Tente novamente",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25">
          <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        </div>
        <CardTitle className="text-2xl font-bold text-white">Criar sua conta</CardTitle>
        <CardDescription className="text-white/60">
          Comece a gerenciar seus fluxos agora
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nome completo"
            placeholder="João Silva"
            error={errors.name?.message}
            {...register("name")}
          />
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register("email")}
          />
          <Input
            label="Senha"
            type="password"
            placeholder="Mínimo 8 caracteres"
            error={errors.password?.message}
            {...register("password")}
          />
          <Input
            label="Nome da empresa (opcional)"
            placeholder="Minha Empresa"
            error={errors.orgName?.message}
            {...register("orgName")}
          />

          <div className="text-xs text-white/40">
            Ao criar sua conta, você concorda com nossos{" "}
            <span className="text-orange-400">Termos de Uso</span> e{" "}
            <span className="text-orange-400">Política de Privacidade</span>.
          </div>

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Criar conta
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-white/60">
          Já tem uma conta?{" "}
          <Link href="/auth/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
            Entrar
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
