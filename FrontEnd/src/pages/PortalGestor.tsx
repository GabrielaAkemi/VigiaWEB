import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Ambulance, LogOut, LayoutDashboard, CalendarCheck, ArrowUp, ArrowDown,
  CheckCircle2, Clock, TrendingUp, Users, AlertTriangle, MapPin, HeartPulse,
  Activity, Bot, ChevronRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import logoApp from "@/assets/logo.png";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

type Prioridade = "alta" | "media" | "normal";
type StatusAg = "pendente" | "confirmado";

type Agendamento = {
  id: string;
  paciente: string;
  hora: string;
  tipo: string;
  destino: string;
  prioridade: Prioridade;
  motivoPrioridade?: string;
  status: StatusAg;
};

type Ambulancia = {
  id: string;
  nome: string;
  placa: string;
  tipo: string;
  agendamentos: Agendamento[];
  aprovada: boolean;
};

const initialAmbulancias: Ambulancia[] = [
  {
    id: "amb-01",
    nome: "Ambulância 01",
    placa: "FGR-1A23",
    tipo: "UTI Móvel",
    aprovada: false,
    agendamentos: [
      { id: "1", paciente: "Maria da Silva", hora: "07:00", tipo: "Hemodiálise", destino: "Hospital das Clínicas", prioridade: "alta", motivoPrioridade: "Hemodiálise + acamada", status: "pendente" },
      { id: "2", paciente: "João Pereira", hora: "08:00", tipo: "Quimioterapia", destino: "Hospital do Câncer", prioridade: "alta", motivoPrioridade: "Oncologia", status: "pendente" },
      { id: "3", paciente: "Beatriz Lima", hora: "09:30", tipo: "Hemodiálise", destino: "Hospital das Clínicas", prioridade: "alta", motivoPrioridade: "Hemodiálise", status: "pendente" },
    ],
  },
  {
    id: "amb-02",
    nome: "Ambulância 02",
    placa: "JKM-2B45",
    tipo: "Suporte Básico",
    aprovada: false,
    agendamentos: [
      { id: "4", paciente: "Carlos Souza", hora: "07:30", tipo: "Exame", destino: "Santa Casa", prioridade: "media", motivoPrioridade: "Cardiopatia", status: "pendente" },
      { id: "5", paciente: "Ana Costa", hora: "09:00", tipo: "Consulta", destino: "UBS Vila Real", prioridade: "normal", status: "pendente" },
      { id: "6", paciente: "Pedro Alves", hora: "10:30", tipo: "Retorno", destino: "UBS Centro", prioridade: "normal", status: "pendente" },
    ],
  },
  {
    id: "amb-03",
    nome: "Ambulância 03",
    placa: "LPQ-3C67",
    tipo: "Remoção Simples",
    aprovada: false,
    agendamentos: [
      { id: "7", paciente: "Lúcia Mendes", hora: "08:30", tipo: "Radioterapia", destino: "Hospital do Câncer", prioridade: "alta", motivoPrioridade: "Oncologia", status: "pendente" },
      { id: "8", paciente: "Roberto Dias", hora: "10:00", tipo: "Consulta", destino: "UPA Zona Sul", prioridade: "normal", status: "pendente" },
      { id: "9", paciente: "Helena Rocha", hora: "11:00", tipo: "Fisioterapia", destino: "CER Marília", prioridade: "media", motivoPrioridade: "Mobilidade reduzida", status: "pendente" },
    ],
  },
];

const prioridadeStyle: Record<Prioridade, string> = {
  alta: "border-destructive/40 bg-destructive/5",
  media: "border-accent/60 bg-accent/10",
  normal: "border-border/60 bg-background",
};

const COLORS = {
  primary: "hsl(199 100% 59%)",
  secondary: "hsl(161 45% 50%)",
  accent: "hsl(30 85% 65%)",
  destructive: "hsl(0 84% 60%)",
};

const PortalGestor = () => {
  const navigate = useNavigate();
  const [ambulancias, setAmbulancias] = useState<Ambulancia[]>(initialAmbulancias);
  const [activeAmb, setActiveAmb] = useState<string>(initialAmbulancias[0].id);

  const updateAmb = (id: string, updater: (a: Ambulancia) => Ambulancia) =>
    setAmbulancias(prev => prev.map(a => (a.id === id ? updater(a) : a)));

  const move = (ambId: string, idx: number, dir: -1 | 1) => {
    updateAmb(ambId, amb => {
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= amb.agendamentos.length) return amb;
      const list = [...amb.agendamentos];
      [list[idx], list[newIdx]] = [list[newIdx], list[idx]];
      const horas = amb.agendamentos.map(a => a.hora).sort();
      list.forEach((a, i) => (a.hora = horas[i]));
      return { ...amb, agendamentos: list };
    });
  };

  const aprovarAmbulancia = (ambId: string) => {
    updateAmb(ambId, amb => ({
      ...amb,
      aprovada: true,
      agendamentos: amb.agendamentos.map(a => ({ ...a, status: "confirmado" })),
    }));
    toast.success(`Escala aprovada — avançando para a próxima ambulância`);
    const idx = ambulancias.findIndex(a => a.id === ambId);
    const next = ambulancias[idx + 1];
    if (next) setActiveAmb(next.id);
    else toast.success("Todas as escalas foram aprovadas! 🎉");
  };

  const handleLogout = () => navigate("/");

  const allAgendamentos = ambulancias.flatMap(a => a.agendamentos);
  const total = allAgendamentos.length;
  const confirmados = allAgendamentos.filter(a => a.status === "confirmado").length;
  const altaPrioridade = allAgendamentos.filter(a => a.prioridade === "alta").length;
  const ambulanciasAprovadas = ambulancias.filter(a => a.aprovada).length;

  const semanaData = useMemo(() => ([
    { dia: "Seg", agendados: 18, concluidos: 16 },
    { dia: "Ter", agendados: 24, concluidos: 22 },
    { dia: "Qua", agendados: 21, concluidos: 20 },
    { dia: "Qui", agendados: 27, concluidos: 25 },
    { dia: "Sex", agendados: 19, concluidos: 18 },
    { dia: "Sáb", agendados: 12, concluidos: 11 },
    { dia: "Dom", agendados: 9, concluidos: 9 },
  ]), []);

  const tipoData = useMemo(() => {
    const counts: Record<string, number> = {};
    allAgendamentos.forEach(a => { counts[a.tipo] = (counts[a.tipo] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [ambulancias]);

  const prioridadeData = useMemo(() => ([
    { name: "Alta", value: allAgendamentos.filter(a => a.prioridade === "alta").length },
    { name: "Média", value: allAgendamentos.filter(a => a.prioridade === "media").length },
    { name: "Normal", value: allAgendamentos.filter(a => a.prioridade === "normal").length },
  ]), [ambulancias]);

  const ocupacaoAmb = ambulancias.map(a => ({
    nome: a.nome.replace("Ambulância ", "Amb. "),
    ocupacao: Math.round((a.agendamentos.length / 5) * 100),
  }));

  const horarioPico = [
    { hora: "06h", chamados: 4 }, { hora: "08h", chamados: 12 },
    { hora: "10h", chamados: 18 }, { hora: "12h", chamados: 9 },
    { hora: "14h", chamados: 15 }, { hora: "16h", chamados: 11 },
    { hora: "18h", chamados: 6 },
  ];

  const desempenho = [
    { area: "Pontualidade", valor: 92 },
    { area: "Confirmações", valor: 88 },
    { area: "Prioridade IA", valor: 95 },
    { area: "Cobertura", valor: 80 },
    { area: "Satisfação", valor: 90 },
  ];

  const activeAmbObj = ambulancias.find(a => a.id === activeAmb)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-surface to-secondary/5 relative overflow-x-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <img src={logoApp} alt="" className="w-[900px] h-[900px] object-contain opacity-[0.03] grayscale brightness-125 select-none" />
      </div>

      <header className="bg-card/80 backdrop-blur-md shadow-sm border-b border-border/50 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <img src={logoApp} alt="Logo VIGIA" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground font-poppins">VIGIA — Portal do Gestor</h1>
                <p className="text-xs text-muted-foreground">Secretaria de Saúde • Marília/SP</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-2" onClick={handleLogout}>
              <LogOut className="w-4 h-4" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="dashboard" className="gap-2"><LayoutDashboard className="w-4 h-4" /> Dashboard</TabsTrigger>
            <TabsTrigger value="escala" className="gap-2"><CalendarCheck className="w-4 h-4" /> Escala do Dia</TabsTrigger>
          </TabsList>

          {/* DASHBOARD */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: CalendarCheck, label: "Agendamentos hoje", value: total, color: "primary" },
                { icon: CheckCircle2, label: "Confirmados", value: confirmados, color: "secondary" },
                { icon: AlertTriangle, label: "Alta prioridade", value: altaPrioridade, color: "destructive" },
                { icon: Ambulance, label: "Ambulâncias aprovadas", value: `${ambulanciasAprovadas}/${ambulancias.length}`, color: "accent" },
              ].map((s, i) => (
                <Card key={i} className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
                  <CardContent className="p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-${s.color}/10 border border-${s.color}/20`}>
                      <s.icon className={`w-6 h-6 text-${s.color}`} />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium">{s.label}</div>
                      <div className="text-2xl font-bold text-foreground font-poppins">{s.value}</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Linha 1: Área + Pizza */}
            <div className="grid lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins text-base">
                    <TrendingUp className="w-5 h-5 text-primary" /> Transportes da semana
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <AreaChart data={semanaData}>
                      <defs>
                        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.primary} stopOpacity={0.5} />
                          <stop offset="100%" stopColor={COLORS.primary} stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="cc" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.secondary} stopOpacity={0.5} />
                          <stop offset="100%" stopColor={COLORS.secondary} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="dia" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                      <Legend />
                      <Area type="monotone" dataKey="agendados" stroke={COLORS.primary} fill="url(#ag)" strokeWidth={2} />
                      <Area type="monotone" dataKey="concluidos" stroke={COLORS.secondary} fill="url(#cc)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins text-base">
                    <AlertTriangle className="w-5 h-5 text-destructive" /> Por prioridade
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie data={prioridadeData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} paddingAngle={4}>
                        {prioridadeData.map((_, i) => (
                          <Cell key={i} fill={[COLORS.destructive, COLORS.accent, COLORS.secondary][i]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Linha 2: Barra ocupação + Barra horários */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins text-base">
                    <Ambulance className="w-5 h-5 text-primary" /> Ocupação por ambulância
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={ocupacaoAmb}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="nome" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                      <Bar dataKey="ocupacao" fill={COLORS.primary} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins text-base">
                    <Clock className="w-5 h-5 text-secondary" /> Horários de pico
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={horarioPico}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hora" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                      <Bar dataKey="chamados" fill={COLORS.secondary} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Linha 3: Radar desempenho + Tipos */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins text-base">
                    <Activity className="w-5 h-5 text-primary" /> Desempenho operacional
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <RadarChart data={desempenho}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="area" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
                      <Radar dataKey="valor" stroke={COLORS.primary} fill={COLORS.primary} fillOpacity={0.35} />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-poppins text-base">
                    <Users className="w-5 h-5 text-accent-foreground" /> Tipos de transporte
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={tipoData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis type="category" dataKey="name" width={110} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                      <Bar dataKey="value" fill={COLORS.accent} radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ESCALA POR AMBULÂNCIA */}
          <TabsContent value="escala" className="space-y-6">
            <Card className="border border-primary/20 bg-primary/5 rounded-2xl">
              <CardContent className="p-4 flex items-center gap-3">
                <Bot className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm text-foreground">
                  <strong>IA já organizou</strong> a fila inicial por prioridade clínica. Revise cada ambulância, ajuste com ↑ ↓ e <strong>aprove para liberar a próxima</strong>.
                </p>
              </CardContent>
            </Card>

            {/* Seletor de ambulâncias */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {ambulancias.map((amb, idx) => {
                const isActive = amb.id === activeAmb;
                return (
                  <button
                    key={amb.id}
                    onClick={() => setActiveAmb(amb.id)}
                    className={`text-left rounded-2xl border-2 p-4 transition-all ${
                      isActive ? "border-primary bg-primary/5 shadow-lg" : "border-border/60 bg-card/70 hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Ambulance className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-bold text-foreground font-poppins text-sm">{amb.nome}</div>
                          <div className="text-[11px] text-muted-foreground">{amb.placa} • {amb.tipo}</div>
                        </div>
                      </div>
                      {amb.aprovada ? (
                        <Badge className="bg-secondary text-white gap-1"><CheckCircle2 className="w-3 h-3" /> OK</Badge>
                      ) : (
                        <Badge variant="outline">#{idx + 1}</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {amb.agendamentos.length} agendamentos
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Fila vertical da ambulância ativa */}
            <Card className="shadow-xl border border-border/50 bg-card/95 backdrop-blur-xl rounded-2xl">
              <CardHeader className="flex flex-row items-center justify-between gap-4 flex-wrap">
                <div>
                  <CardTitle className="flex items-center gap-2 font-poppins">
                    <Ambulance className="w-5 h-5 text-primary" /> {activeAmbObj.nome}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{activeAmbObj.placa} • {activeAmbObj.tipo} • {activeAmbObj.agendamentos.length} transportes</p>
                </div>
                <Button
                  onClick={() => aprovarAmbulancia(activeAmbObj.id)}
                  disabled={activeAmbObj.aprovada}
                  className="bg-gradient-primary text-white hover:opacity-90 rounded-xl gap-2 disabled:opacity-50"
                >
                  {activeAmbObj.aprovada ? (
                    <><CheckCircle2 className="w-4 h-4" /> Escala aprovada</>
                  ) : (
                    <>Aprovar escala <ChevronRight className="w-4 h-4" /></>
                  )}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                  {activeAmbObj.agendamentos.map((a, idx) => (
                    <div
                      key={a.id}
                      className={`rounded-2xl border-2 p-5 aspect-square sm:aspect-auto transition-all ${prioridadeStyle[a.prioridade]} hover:shadow-lg flex flex-col`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Clock className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <div className="text-2xl font-bold font-poppins text-foreground leading-none">{a.hora}</div>
                            <div className="text-xs text-muted-foreground mt-1">#{idx + 1} na fila</div>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => move(activeAmbObj.id, idx, -1)} disabled={idx === 0 || activeAmbObj.aprovada}>
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="outline" className="h-8 w-8" onClick={() => move(activeAmbObj.id, idx, 1)} disabled={idx === activeAmbObj.agendamentos.length - 1 || activeAmbObj.aprovada}>
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-2 flex-1">
                        <div className="font-semibold text-foreground text-lg">{a.paciente}</div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <HeartPulse className="w-4 h-4" /> {a.tipo}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" /> {a.destino}
                        </div>
                        {a.motivoPrioridade && (
                          <div className="flex items-center gap-2 text-xs text-destructive font-medium pt-1">
                            <AlertTriangle className="w-3 h-3" /> {a.motivoPrioridade}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
                        <Badge variant={a.prioridade === "alta" ? "destructive" : a.prioridade === "media" ? "default" : "secondary"}>
                          {a.prioridade === "alta" ? "Alta prioridade" : a.prioridade === "media" ? "Média" : "Normal"}
                        </Badge>
                        {a.status === "confirmado" && (
                          <Badge variant="outline" className="gap-1 border-secondary/40 text-secondary">
                            <CheckCircle2 className="w-3 h-3" /> Confirmado
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PortalGestor;
