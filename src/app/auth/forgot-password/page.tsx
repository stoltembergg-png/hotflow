"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

const forgotSchema = z.object({
  email: z.email("Email inválido"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // Always show success to prevent email enumeration
      setSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada",
        variant: "success",
      });
    } catch {
      setSent(true);
      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada",
        variant: "success",
      });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30">
            <svg className="h-8 w-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
          </div>
          <CardTitle className="text-xl font-bold text-white">Email enviado</CardTitle>
          <CardDescription className="text-white/60">
            Se existir uma conta com o email informado, você receberá um link para redefinir sua senha.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              Voltar ao login
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25">
          <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
          </svg>
        </div>
        <CardTitle className="text-2xl font-bold text-white">Esqueceu a senha?</CardTitle>
        <CardDescription className="text-white/60">
          Informe seu email e enviaremos um link para redefinir sua senha
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register("email")}
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Enviar link de recuperação
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-white/60">
          Lembrou a senha?{" "}
          <Link href="/auth/login" className="text-orange-400 hover:text-orange-300 font-medium transition-colors">
            Voltar ao login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
