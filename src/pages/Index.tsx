import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import {
  Zap, Bot, Shield, Rocket, MessageSquare, BarChart3, Star,
  Check, ChevronRight, ArrowRight, Menu, X, Building2, Code2,
  Globe, Twitter, Linkedin, Instagram, Github, Mail, Circle,
  Users, TrendingUp, Award, Clock, Play, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

// ─── useScrollReveal hook ───────────────────────────────────────────────
function useScrollReveal() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = ref.current?.querySelectorAll('.animate-reveal');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return ref;
}

// ─── Header ────────────────────────────────────────────────────────────
function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, isAdmin, isFreelancer, isClient } = useAuth();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const getDashboardLink = () => {
    if (isAdmin) return '/admin';
    if (isFreelancer) return '/freelas';
    if (isClient) return '/marketplace';
    return '/marketplace';
  };

  const navLinks = [
    { href: '#recursos', label: 'Recursos' },
    { href: '#como-funciona', label: 'Como Funciona' },
    { href: '#precos', label: 'Preços' },
    { href: '/marketplace', label: 'Marketplace' },
  ];

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center teal-glow">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">INOVAPRO</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              link.href.startsWith('#') ? (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <Link to={getDashboardLink()}>
                <Button className="bg-primary hover:bg-primary-light text-primary-foreground rounded-xl h-9 px-5 font-medium">
                  Meu Painel
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" className="rounded-xl h-9 px-4 font-medium text-foreground">
                    Entrar
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="bg-primary hover:bg-primary-light text-primary-foreground rounded-xl h-9 px-5 font-medium teal-glow">
                    Contratar Agora
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link) => (
                link.href.startsWith('#') ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-muted-foreground hover:text-foreground py-2"
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block text-sm text-muted-foreground hover:text-foreground py-2"
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <div className="pt-3 flex flex-col gap-2">
                <Link to="/auth/login">
                  <Button variant="outline" className="w-full rounded-xl">Entrar</Button>
                </Link>
                <Link to="/auth/register">
                  <Button className="w-full bg-primary hover:bg-primary-light text-primary-foreground rounded-xl">
                    Contratar Agora
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

// ─── Hero Section ───────────────────────────────────────────────────────
function HeroSection() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 400], [0, -80]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-gradient pt-16">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                <Sparkles className="w-3.5 h-3.5" />
                Marketplace de Freelancers #1 do Brasil
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl lg:text-6xl font-extrabold text-foreground leading-[1.1] mb-6"
            >
              Contrate freelancers{' '}
              <span className="gradient-text">profissionais</span>{' '}
              em minutos
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl">
              Match automático, pagamento seguro e entrega garantida. A plataforma que conecta sua empresa aos melhores talentos do Brasil.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link to="/auth/register">
                <Button className="h-13 px-8 py-3.5 bg-primary hover:bg-primary-light text-primary-foreground font-semibold rounded-xl text-base teal-glow transition-all duration-300 hover:scale-105">
                  Começar Agora
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/marketplace">
                <Button variant="outline" className="h-13 px-8 py-3.5 rounded-xl text-base font-semibold border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300">
                  <Play className="w-4 h-4 mr-2 text-primary" />
                  Ver Talentos
                </Button>
              </Link>
            </motion.div>

            {/* Social Proof */}
            <motion.div variants={itemVariants} className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {['A', 'B', 'C', 'D'].map((l, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full border-2 border-background flex items-center justify-center text-xs font-bold text-primary-foreground"
                    style={{ background: `hsl(${174 - i * 10} 70% ${40 + i * 5}%)` }}
                  >
                    {l}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 mb-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong className="text-foreground">+500 freelancers</strong> cadastrados
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right - 3D Dashboard Mockup */}
          <motion.div
            style={{ y, opacity }}
            className="relative hidden lg:block"
          >
            <div className="relative perspective-1000">
              <motion.div
                animate={{ y: [0, -16, 0], rotateX: [0, 1, 0], rotateY: [0, -1, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="transform-3d"
              >
                {/* Main card */}
                <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
                  {/* Header */}
                  <div className="bg-sidebar p-4 flex items-center gap-3 border-b border-sidebar-border">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-destructive/60" />
                      <div className="w-3 h-3 rounded-full bg-warning/60" />
                      <div className="w-3 h-3 rounded-full bg-accent/60" />
                    </div>
                    <div className="flex-1 bg-sidebar-accent rounded-lg h-6 flex items-center px-3">
                      <span className="text-sidebar-foreground/40 text-xs">inovapro.com/marketplace</span>
                    </div>
                  </div>

                  <div className="flex">
                    {/* Sidebar */}
                    <div className="w-48 bg-sidebar p-3 min-h-48 flex flex-col gap-1">
                      {['Dashboard', 'Projetos', 'Mensagens', 'Financeiro'].map((item, i) => (
                        <div
                          key={item}
                          className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-lg text-xs",
                            i === 0 ? "bg-primary/20 text-primary font-medium" : "text-sidebar-foreground/60"
                          )}
                        >
                          <div className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-primary" : "bg-sidebar-foreground/30")} />
                          {item}
                        </div>
                      ))}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 bg-background-alt">
                      <p className="text-xs font-semibold text-foreground mb-3">Projetos Disponíveis</p>
                      <div className="space-y-2">
                        {[
                          { title: 'App Mobile React Native', price: 'R$ 3.500', badge: 'Novo' },
                          { title: 'Landing Page Moderna', price: 'R$ 850', badge: 'Popular' },
                          { title: 'API REST Node.js', price: 'R$ 2.200', badge: null },
                        ].map((project, i) => (
                          <div key={i} className="bg-card rounded-xl p-3 border border-border flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-foreground">{project.title}</p>
                              <p className="text-xs text-primary font-semibold mt-0.5">{project.price}</p>
                            </div>
                            {project.badge && (
                              <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded-full font-medium",
                                project.badge === 'Novo' ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
                              )}>
                                {project.badge}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating stats card */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-8 -left-8 bg-card rounded-xl border border-border shadow-xl p-3 flex items-center gap-3"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Ganhos do mês</p>
                    <p className="font-bold text-foreground text-sm">R$ 12.400</p>
                  </div>
                </motion.div>

                {/* Floating notification */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                  className="absolute -top-6 -right-4 bg-card rounded-xl border border-border shadow-xl p-3 flex items-center gap-2"
                >
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <p className="text-xs text-foreground font-medium">Novo match encontrado!</p>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground"
      >
        <span className="text-xs">Role para baixo</span>
        <div className="w-5 h-8 rounded-full border-2 border-border flex items-start justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-primary animate-bounce-subtle" />
        </div>
      </motion.div>
    </section>
  );
}

// ─── Features Section ──────────────────────────────────────────────────
function FeaturesSection() {
  const ref = useScrollReveal();

  const features = [
    {
      icon: Bot,
      title: 'Match com IA',
      description: 'Nossa IA analisa seu projeto e encontra os freelancers mais compatíveis automaticamente.',
      color: 'text-primary',
      bg: 'bg-primary/10',
    },
    {
      icon: Shield,
      title: 'Pagamento em Escrow',
      description: 'Seu dinheiro fica protegido. Só liberamos para o freelancer após sua aprovação.',
      color: 'text-accent',
      bg: 'bg-accent/10',
    },
    {
      icon: Rocket,
      title: 'Entrega Rápida',
      description: 'Freelancers verificados com histórico de entrega pontual e qualidade comprovada.',
      color: 'text-warning',
      bg: 'bg-warning/10',
    },
    {
      icon: MessageSquare,
      title: 'Chat Integrado',
      description: 'Comunique-se em tempo real com seus freelancers, compartilhe arquivos e feedback.',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
    },
    {
      icon: BarChart3,
      title: 'Dashboard Completo',
      description: 'Acompanhe o progresso, prazos e métricas de todos os seus projetos em um só lugar.',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
    },
    {
      icon: Award,
      title: 'Garantia de Qualidade',
      description: 'Sistema de avaliações e revisões ilimitadas para garantir o resultado que você espera.',
      color: 'text-rose-500',
      bg: 'bg-rose-500/10',
    },
  ];

  return (
    <section id="recursos" className="py-24 bg-background-alt" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" />
              Recursos poderosos
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa para{' '}
              <span className="gradient-text">crescer</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa que simplifica a contratação e gestão de freelancers do início ao fim.
            </p>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="bg-card rounded-2xl border border-border p-6 card-hover group"
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110", feature.bg)}>
                <feature.icon className={cn("w-6 h-6", feature.color)} />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works Section ──────────────────────────────────────────────
function HowItWorksSection() {
  const [activeTab, setActiveTab] = useState<'client' | 'freelancer'>('client');

  const steps = {
    client: [
      { step: '01', icon: Building2, title: 'Publique sua necessidade', desc: 'Descreva o projeto, prazo e orçamento. Leva menos de 5 minutos.' },
      { step: '02', icon: Bot, title: 'Receba o match automático', desc: 'Nossa IA seleciona os melhores freelancers para o seu projeto.' },
      { step: '03', icon: Shield, title: 'Pague e acompanhe', desc: 'Pagamento seguro em escrow. Libere só após aprovar a entrega.' },
    ],
    freelancer: [
      { step: '01', icon: Code2, title: 'Crie seu portfólio', desc: 'Publique seus projetos e habilidades para se destacar no marketplace.' },
      { step: '02', icon: Sparkles, title: 'Receba matches', desc: 'A IA envia automaticamente projetos compatíveis com o seu perfil.' },
      { step: '03', icon: TrendingUp, title: 'Entregue e receba', desc: 'Conclua o projeto, receba aprovação do cliente e retire seus ganhos.' },
    ],
  };

  return (
    <section id="como-funciona" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              <Clock className="w-3.5 h-3.5" />
              Simples e rápido
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Como funciona o <span className="gradient-text">INOVAPRO</span>
            </h2>
          </motion.div>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-12">
          <div className="bg-muted rounded-xl p-1 flex gap-1">
            <button
              onClick={() => setActiveTab('client')}
              className={cn(
                "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === 'client'
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Building2 className="w-4 h-4 inline mr-1.5" />
              Sou Cliente
            </button>
            <button
              onClick={() => setActiveTab('freelancer')}
              className={cn(
                "px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === 'freelancer'
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Code2 className="w-4 h-4 inline mr-1.5" />
              Sou Freelancer
            </button>
          </div>
        </div>

        {/* Steps */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid md:grid-cols-3 gap-8 relative"
          >
            {/* Connecting line */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/30 via-primary to-primary/30" />

            {steps[activeTab].map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center teal-glow mx-auto">
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-12">
          <Link to="/auth/register">
            <Button className="bg-primary hover:bg-primary-light text-primary-foreground rounded-xl h-12 px-8 font-semibold teal-glow transition-all duration-300">
              Começar agora — é grátis
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Pricing Section ──────────────────────────────────────────────────
function PricingSection() {
  const [annual, setAnnual] = useState(false);

  const plans = [
    {
      name: 'Free',
      monthlyPrice: 0,
      annualPrice: 0,
      description: 'Para começar a explorar',
      features: [
        '1 projeto ativo',
        '3 conversas/mês',
        'Perfil básico',
        'Suporte por email',
      ],
      cta: 'Começar grátis',
      ctaLink: '/auth/register',
      highlighted: false,
    },
    {
      name: 'Pro',
      monthlyPrice: 49,
      annualPrice: 39,
      description: 'Para freelancers sérios',
      features: [
        'Projetos ilimitados',
        'Conversas ilimitadas',
        'Perfil em destaque',
        'Match com IA prioritário',
        'Suporte prioritário',
        'Análises avançadas',
      ],
      cta: 'Assinar Pro',
      ctaLink: '/auth/register',
      highlighted: true,
      badge: 'Mais Popular',
    },
    {
      name: 'Premium',
      monthlyPrice: 99,
      annualPrice: 79,
      description: 'Para agências e times',
      features: [
        'Tudo do Pro',
        'Múltiplos usuários',
        'API de integração',
        'Gerente de conta',
        'SLA garantido',
        'Relatórios customizados',
      ],
      cta: 'Falar com Vendas',
      ctaLink: '/auth/register',
      highlighted: false,
    },
  ];

  return (
    <section id="precos" className="py-24 bg-background-alt">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 border border-primary/20">
              <Zap className="w-3.5 h-3.5" />
              Planos e preços
            </span>
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Escolha o plano <span className="gradient-text">ideal para você</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">Comece grátis, faça upgrade quando quiser.</p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 bg-muted rounded-xl p-1">
              <button
                onClick={() => setAnnual(false)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  !annual ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                Mensal
              </button>
              <button
                onClick={() => setAnnual(true)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                  annual ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
                )}
              >
                Anual
                <span className="bg-accent text-accent-foreground text-xs px-2 py-0.5 rounded-full font-semibold">
                  -20%
                </span>
              </button>
            </div>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "rounded-2xl border p-7 relative",
                plan.highlighted
                  ? "bg-card border-primary/30 shadow-pricing-pro scale-105 animate-glow"
                  : "bg-card border-border"
              )}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-4 py-1 rounded-full">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={annual ? 'annual' : 'monthly'}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-end gap-1"
                  >
                    <span className="text-4xl font-extrabold text-foreground">
                      {plan.monthlyPrice === 0 ? 'Grátis' : `R$ ${annual ? plan.annualPrice : plan.monthlyPrice}`}
                    </span>
                    {plan.monthlyPrice > 0 && (
                      <span className="text-muted-foreground text-sm mb-1">/mês</span>
                    )}
                  </motion.div>
                </AnimatePresence>
                {annual && plan.monthlyPrice > 0 && (
                  <p className="text-xs text-accent font-medium mt-1">
                    Economize R$ {(plan.monthlyPrice - plan.annualPrice) * 12}/ano
                  </p>
                )}
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                      plan.highlighted ? "bg-primary/10" : "bg-accent/10"
                    )}>
                      <Check className={cn("w-3 h-3", plan.highlighted ? "text-primary" : "text-accent")} />
                    </div>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link to={plan.ctaLink}>
                <Button
                  className={cn(
                    "w-full rounded-xl h-11 font-semibold",
                    plan.highlighted
                      ? "bg-primary hover:bg-primary-light text-primary-foreground teal-glow"
                      : "border border-border bg-transparent hover:bg-muted text-foreground"
                  )}
                  variant={plan.highlighted ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials Section ─────────────────────────────────────────────
function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const testimonials = [
    {
      name: 'Ana Costa',
      role: 'CEO, TechStart',
      avatar: 'AC',
      text: 'Encontrei um desenvolvedor incrível em menos de 24 horas. O sistema de escrow me deu a segurança que precisava para contratar sem medo.',
      rating: 5,
    },
    {
      name: 'Carlos Mendes',
      role: 'Designer Freelancer',
      avatar: 'CM',
      text: 'Minha renda triplicou depois que entrei no INOVAPRO. Os clientes chegam automaticamente e o processo de pagamento é muito seguro.',
      rating: 5,
    },
    {
      name: 'Marina Silva',
      role: 'Gerente de Marketing, Agência X',
      avatar: 'MS',
      text: 'Usamos para contratar redatores e developers. A qualidade dos profissionais é excelente e o suporte da plataforma é ágil.',
      rating: 5,
    },
    {
      name: 'Rafael Lima',
      role: 'Dev Full Stack',
      avatar: 'RL',
      text: 'O match automático da IA é surreal. Recebo projetos que combinam exatamente com minhas habilidades. Recomendo muito!',
      rating: 5,
    },
    {
      name: 'Juliana Rocha',
      role: 'Diretora, E-commerce BR',
      avatar: 'JR',
      text: 'Contratamos 5 freelancers pelo INOVAPRO no último trimestre. Todos entregaram no prazo e dentro do orçamento.',
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((c) => (c + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '+500', label: 'Freelancers', icon: Users },
    { value: '+1000', label: 'Projetos', icon: BarChart3 },
    { value: '98%', label: 'Satisfação', icon: Star },
    { value: 'R$ 2M+', label: 'Pagos', icon: TrendingUp },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <stat.icon className="w-6 h-6 text-primary" />
              </div>
              <p className="text-3xl font-extrabold text-foreground mb-1">{stat.value}</p>
              <p className="text-muted-foreground text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-foreground mb-4">
              O que nossos <span className="gradient-text">usuários dizem</span>
            </h2>
          </motion.div>
        </div>

        {/* Carousel */}
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="bg-card rounded-2xl border border-border p-8 text-center shadow-card-hover"
            >
              <div className="flex justify-center mb-4">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                ))}
              </div>
              <p className="text-lg text-foreground leading-relaxed mb-6">
                "{testimonials[current].text}"
              </p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  {testimonials[current].avatar}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-foreground">{testimonials[current].name}</p>
                  <p className="text-sm text-muted-foreground">{testimonials[current].role}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  i === current ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white"
            style={{
              width: `${(i + 1) * 150}px`,
              height: `${(i + 1) * 150}px`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-5xl font-extrabold text-primary-foreground mb-4">
            Pronto para começar?
          </h2>
          <p className="text-xl text-white/80 mb-10">
            Junte-se a mais de 500 freelancers e 300 empresas que já usam o INOVAPRO.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link to="/auth/register">
              <Button className="h-14 px-10 bg-white hover:bg-white/90 text-primary font-bold rounded-xl text-base transition-all duration-300 hover:scale-105">
                Criar Conta Grátis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button variant="outline" className="h-14 px-10 border-white/30 text-white hover:bg-white/10 rounded-xl text-base font-semibold">
                Ver Marketplace
              </Button>
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-white/60 text-sm">
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-white/80" /> Sem cartão de crédito</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-white/80" /> Cancele quando quiser</span>
            <span className="flex items-center gap-1.5"><Check className="w-4 h-4 text-white/80" /> Suporte em português</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────
function Footer() {
  const [email, setEmail] = useState('');

  const links = {
    produto: ['Marketplace', 'Como Funciona', 'Preços', 'Para Empresas', 'Para Freelancers'],
    empresa: ['Sobre nós', 'Blog', 'Carreiras', 'Imprensa', 'Afiliados'],
    legal: ['Termos de Uso', 'Privacidade', 'Cookies', 'LGPD', 'Licenças'],
  };

  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Zap className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-white">INOVAPRO</span>
            </div>
            <p className="text-sidebar-foreground/60 text-sm leading-relaxed mb-6">
              O marketplace de freelancers mais confiável do Brasil. Conectando empresas e talentos.
            </p>
            <div className="flex gap-3">
              {[Twitter, Linkedin, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-sidebar-accent flex items-center justify-center text-sidebar-foreground/60 hover:text-primary hover:bg-primary/10 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4 capitalize">{category}</h4>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item}>
                    <a href="#" className="text-sidebar-foreground/60 hover:text-primary text-sm transition-colors">
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter + Status */}
        <div className="border-t border-sidebar-border pt-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-sm text-sidebar-foreground/60">Todos os serviços operacionais</span>
          </div>

          <form
            onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
            className="flex gap-2 w-full max-w-sm"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 h-9 px-3 rounded-lg bg-sidebar-accent border border-sidebar-border text-sm text-sidebar-foreground placeholder:text-sidebar-foreground/40 focus:outline-none focus:border-primary"
            />
            <Button type="submit" size="sm" className="bg-primary hover:bg-primary-light text-primary-foreground rounded-lg">
              <Mail className="w-4 h-4" />
            </Button>
          </form>

          <p className="text-sidebar-foreground/40 text-xs">
            © 2025 INOVAPRO. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Index Page ───────────────────────────────────────────────────
export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <PricingSection />
        <TestimonialsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
