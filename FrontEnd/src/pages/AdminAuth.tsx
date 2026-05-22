import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoVigia from "@/assets/logo-vigia.png";

const AdminAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative noise"
    >
      <div className="absolute w-[200px] h-[200px] rounded-full bg-primary/12 blur-[90px]" />

      <div className="w-full max-w-md relative z-10">
        <button
          onClick={() => navigate("/acesso")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6 text-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Voltar
        </button>

        <div className="glass-card rounded-xl p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="relative">
              <img src={logoVigia} alt="VIGIA" className="w-9 h-9" style={{ filter: "drop-shadow(0 0 8px hsl(0 85% 48% / 0.35))" }} />
            </div>
            <div>
              <h1 className="font-heading text-lg font-bold text-foreground tracking-wide flex items-center gap-2">
                Área do Administrador
                <ShieldCheck className="w-4 h-4 text-primary" />
              </h1>
              <p className="text-muted-foreground text-[11px]">{isLogin ? "Acesse o painel de controle" : "Crie sua conta administrativa"}</p>
            </div>
          </div>

          <div className="gradient-line mb-6" />

          <div className="flex bg-muted/40 rounded-lg p-1 mb-6">
            {["Login", "Cadastro"].map((tab) => (
              <button
                key={tab}
                onClick={() => setIsLogin(tab === "Login")}
                className={`flex-1 py-2 rounded-md text-xs font-heading font-semibold tracking-wide transition-all ${
                  (tab === "Login" ? isLogin : !isLogin)
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
                onSubmit={(e) => { e.preventDefault(); navigate("/admin/painel"); }}
              >
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground font-medium">E-mail institucional</Label>
                  <Input type="email" placeholder="admin@municipio.gov.br" className="bg-muted/40 border-border/50 text-sm h-9" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[11px] text-muted-foreground font-medium">Senha</Label>
                  <Input type="password" placeholder="••••••••" className="bg-muted/40 border-border/50 text-sm h-9" />
                </div>
                <Button className="w-full font-heading font-semibold tracking-[0.15em] uppercase neon-box text-xs h-10 mt-2">
                  Entrar
                </Button>
                <Button type="button" variant="ghost" onClick={() => navigate("/admin/painel")} className="w-full font-heading font-semibold tracking-[0.08em] uppercase text-[10px] h-8 text-muted-foreground hover:text-foreground">
                  Pular Login →
                </Button>
              </motion.form>
            ) : (
              <motion.form
                key="signup"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-3 max-h-[55vh] overflow-y-auto custom-scrollbar pr-1"
                onSubmit={(e) => e.preventDefault()}
              >
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground font-medium">Nome</Label>
                    <Input type="text" placeholder="João" className="bg-muted/40 border-border/50 text-sm h-9" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground font-medium">Sobrenome</Label>
                    <Input type="text" placeholder="Silva" className="bg-muted/40 border-border/50 text-sm h-9" />
                  </div>
                </div>
                {[
                  { label: "E-mail institucional", placeholder: "admin@municipio.gov.br", type: "email" },
                  { label: "Matrícula funcional", placeholder: "000000", type: "text" },
                  { label: "Cargo", placeholder: "Ex: Coordenador de Frota", type: "text" },
                  { label: "Empresa / Órgão", placeholder: "Secretaria de Saúde", type: "text" },
                  { label: "Telefone", placeholder: "(00) 00000-0000", type: "tel" },
                  { label: "Senha", placeholder: "••••••••", type: "password" },
                  { label: "Confirmar senha", placeholder: "••••••••", type: "password" },
                ].map((field) => (
                  <div key={field.label} className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground font-medium">{field.label}</Label>
                    <Input type={field.type} placeholder={field.placeholder} className="bg-muted/40 border-border/50 text-sm h-9" />
                  </div>
                ))}
                <Button className="w-full font-heading font-semibold tracking-[0.15em] uppercase neon-box text-xs h-10 mt-2">
                  Cadastrar
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminAuth;
