"use client";

import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center max-w-md animate-fadeIn">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-500/25">
          <span className="text-4xl font-bold text-white">404</span>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Pagina nao encontrada
        </h1>
        <p className="text-foreground/60 mb-8">
          A pagina que voce procura pode ter sido movida ou excluida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard">
            <Button className="w-full sm:w-auto">
              <Home className="w-4 h-4 mr-2" />
              Ir para o dashboard
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto">
              <Search className="w-4 h-4 mr-2" />
              Voltar ao inicio
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
