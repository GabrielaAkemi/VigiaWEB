import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LayoutDashboard, Eye, EyeOff, ArrowLeft, SkipForward, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoApp from "@/assets/logo.png";

export default function LoginGestor() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/gestor");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/5 via-surface to-primary/5 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-fade-in">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-all duration-300 hover:gap-3 font-medium"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar ao início
        </button>

        <div className="flex items-center justify-center gap-4 mb-8">
          <div className="w-16 h-16 flex items-center justify-center">
            <img src={logoApp} alt="VIGIA" className="w-full h-full object-contain" />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-bold text-foreground font-poppins">VIGIA — Admin do Gestor</h1>
            <p className="text-xs text-muted-foreground font-medium">Acesso restrito • Marília/SP</p>
          </div>
        </div>

        <Card className="shadow-2xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center pb-6 pt-10 px-8 bg-gradient-to-b from-secondary/5 to-transparent">
            <div className="w-20 h-20 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-3xl flex items-center justify-center mx-auto mb-5 border-2 border-secondary/20 shadow-lg">
              <ShieldCheck className="w-10 h-10 text-secondary" />
            </div>
            <CardTitle className="text-2xl font-bold text-foreground font-poppins mb-1">Bem-vindo, gestor</CardTitle>
            <CardDescription className="text-muted-foreground text-base">
              Acesse para gerenciar a escala de ambulâncias
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5 mt-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-foreground">E-mail institucional</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="gestor@marilia.sp.gov.br"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-foreground">Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="h-12 rounded-xl border-2 border-border/50 focus:border-secondary bg-background/50 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-secondary"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary text-white hover:opacity-90 h-12 font-bold rounded-xl shadow-xl mt-2 gap-2"
              >
                Entrar no Portal <LayoutDashboard className="w-5 h-5" />
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/gestor")}
                className="w-full h-11 rounded-xl gap-2 border-2"
              >
                <SkipForward className="w-4 h-4" /> Pular login (modo demo)
              </Button>
            </form>

            <p className="mt-6 text-xs text-muted-foreground text-center leading-relaxed">
              Acesso destinado a gestores autorizados da Secretaria de Saúde de Marília
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
