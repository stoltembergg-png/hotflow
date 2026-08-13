"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Mail, Lock, CheckCircle2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

const forgotSchema = z.object({
  email: z.email("Email invalido"),
  newPassword: z.string().min(6, "A senha deve ter no minimo 6 caracteres"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);
  const [done, setDone] = React.useState(false);

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

      const result = await res.json();

      if (!res.ok) {
        toast({
          title: "Erro",
          description: result.error || "Erro ao alterar senha",
          variant: "error",
        });
        return;
      }

      setDone(true);
      toast({
        title: "Senha alterada!",
        description: "Voce ja pode fazer login com a nova senha",
        variant: "success",
      });
    } catch {
      toast({
        title: "Erro",
        description: "Erro de conexao",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-500/20 border border-emerald-500/30">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
          </div>
          <CardTitle className="text-xl font-bold text-white">Senha alterada</CardTitle>
          <CardDescription className="text-white/60">
            Sua senha foi alterada com sucesso. Faca login com a nova senha.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Link href="/auth/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
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
          <Lock className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold text-white">Esqueceu a senha?</CardTitle>
        <CardDescription className="text-white/60">
          Informe seu email e uma nova senha para redefinir
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
          <Input
            label="Nova senha"
            type="password"
            placeholder="Minimo 6 caracteres"
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />

          <Button type="submit" loading={loading} className="w-full" size="lg">
            <Mail className="w-4 h-4 mr-2" />
            Alterar senha
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
