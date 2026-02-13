"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Twitter, Github, Linkedin, Brain, Zap, Clock, Shield, BarChart3, Rocket, ChevronRight, Menu, X, Sparkles } from 'lucide-react';

const LandingPage = () => {
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const phrases = [
    "5 FLAGSHIP MODELS. ONE INTERFACE.",
    "ELIMINATE HALLUCINATIONS.",
    "PARALLEL INTELLIGENCE ARCHITECTURE.",
    "DISCOVER TRUTH THROUGH CONSENSUS.",
  ];

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && typedText === currentPhrase) {
      setTimeout(() => setIsDeleting(true), 2500);
      return;
    }

    if (isDeleting && typedText === '') {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setTypedText(prev =>
        isDeleting
          ? prev.slice(0, -1)
          : currentPhrase.slice(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, currentPhraseIndex]);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Brain className="w-6 h-6 text-blue-400" />,
      title: "COLLECTIVE BRAIN",
      description: "Query Llama, Qwen, Groq, and more simultaneously for comprehensive perspective."
    },
    {
      icon: <Shield className="w-6 h-6 text-cyan-400" />,
      title: "HALLUCINATION SHIELD",
      description: "Cross-reference responses to filter out inaccuracies and synthetic errors automatically."
    },
    {
      icon: <Zap className="w-6 h-6 text-blue-400" />,
      title: "ULTRA PARALLEL",
      description: "Proprietary architecture delivers 5 model responses in the time it takes for one."
    },
    {
      icon: <Sparkles className="w-6 h-6 text-indigo-400" />,
      title: "CONSENSUS ENGINE",
      description: "Our algorithm identifies the majority view to find the most probable truth."
    },
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
      title: "ANALYTIC DEPTH",
      description: "Compare nuances in model logic to gain a deeper understanding of complex topics."
    },
    {
      icon: <Rocket className="w-6 h-6 text-cyan-400" />,
      title: "API INTEGRATION",
      description: "Deploy collective intelligence directly into your own applications and workflows."
    }
  ];

  const models = [
    { name: "Llama 3.1", brand: "Meta", logo: "/models/meta.png" },
    { name: "Qwen 3", brand: "Alibaba", logo: "/models/Qwen_logo.svg.png" },
    { name: "Compound", brand: "Groq", logo: "/models/groq.png" },
    { name: "GPT-OSS", brand: "OpenAI", logo: "/models/openai.png" },
    { name: "Kimi-K2", brand: "Moonshot AI", logo: "/models/kimi-ai-logo.webp" }
  ];

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-blue-500/30">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/[0.03]">
        <div className="max-w-7xl mx-auto px-6 h-16 lg:h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-black text-white uppercase tracking-widest">
              Parallel<span className="text-blue-500">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-10">
            {['Features', 'Models', 'Network'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-[10px] font-black text-gray-500 hover:text-white uppercase tracking-[0.2em] transition-colors"
              >
                {item}
              </a>
            ))}
            <a
              href="/chat"
              className="px-6 py-2.5 rounded-xl bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105"
            >
              Launch Interface
            </a>
          </div>

          <button className="md:hidden p-2 text-gray-400" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <main className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="inline-block p-4 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 shadow-2xl shadow-blue-600/40 mb-4 animate-bounce-slow">
              <Brain className="w-10 h-10 lg:w-14 lg:h-14 text-white" />
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl lg:text-8xl font-black text-white tracking-tighter leading-tight lg:leading-none">
                COLLECTIVE <br />
                <span className="bg-gradient-to-r from-blue-500 via-cyan-400 to-blue-600 bg-clip-text text-transparent uppercase">Intelligence</span>
              </h1>

              <div className="h-8">
                <p className="text-xs lg:text-sm font-black text-blue-500 uppercase tracking-[0.4em]">
                  {typedText}<span className="animate-pulse">_</span>
                </p>
              </div>

              <p className="text-sm lg:text-lg text-gray-500 max-w-xl mx-auto font-medium leading-relaxed uppercase tracking-widest">
                A high-performance interface for parallel neural processing across world-leading LLMs.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8">
              <a
                href="/chat"
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-blue-600 text-white text-xs font-black uppercase tracking-widest hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center space-x-3"
              >
                <span>Initialize Session</span>
                <Zap className="w-4 h-4" />
              </a>
              <a
                href="#features"
                className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center"
              >
                Core Architecture
              </a>
            </div>
          </div>
        </section>

        {/* Models Grid */}
        <section id="models" className="py-32 px-6 border-y border-white/[0.03] bg-white/[0.01]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-1 h-1 rounded-full bg-blue-500 animate-pulse"></div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Neural Network Nodes</span>
              </div>
              <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase">Integrated Models</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-8">
              {models.map((model, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-blue-500/30 transition-all duration-500 text-center space-y-6"
                >
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-black flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform">
                    <img
                      src={model.logo}
                      alt={model.name}
                      className="w-10 h-10 object-contain brightness-90 group-hover:brightness-110"
                      onError={(e) => {
                        (e.target as any).style.display = 'none';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">{model.name}</h3>
                    <p className="text-[10px] font-bold text-gray-600 uppercase mt-1 transition-colors group-hover:text-blue-400">{model.brand}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Bento */}
        <section id="features" className="py-32 px-6 relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 space-y-4">
              <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Capabilities</span>
              <h2 className="text-3xl lg:text-6xl font-black text-white tracking-tighter uppercase">Engineered for Accuracy</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all group"
                >
                  <div className="mb-8 p-3 rounded-2xl bg-white/[0.03] border border-white/5 inline-block group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-black text-white uppercase tracking-widest mb-4">{feature.title}</h3>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed tracking-wide">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="relative p-12 lg:p-24 rounded-[3rem] bg-gradient-to-br from-blue-900/20 to-indigo-900/20 border border-blue-500/20 text-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)] pointer-events-none"></div>

              <div className="relative z-10 space-y-10">
                <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter uppercase">Switch to Parallel<br />Intelligence</h2>
                <p className="text-gray-400 max-w-xl mx-auto text-sm lg:text-base font-medium uppercase tracking-widest leading-loose">
                  Join the elite users leveraging the power of collective AI for research, coding, and strategic planning.
                </p>
                <a
                  href="/chat"
                  className="inline-flex items-center space-x-4 px-12 py-5 rounded-2xl bg-white text-black text-xs font-black uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all transform hover:scale-105"
                >
                  <span>Enter Interface</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-20 px-6 border-t border-white/[0.03] bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <span className="text-xs font-black text-white uppercase tracking-widest">ParallelAI</span>
          </div>

          <div className="flex space-x-8">
            <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-400 cursor-pointer transition-colors" />
            <Github className="w-5 h-5 text-gray-600 hover:text-white cursor-pointer transition-colors" />
            <Linkedin className="w-5 h-5 text-gray-600 hover:text-blue-600 cursor-pointer transition-colors" />
          </div>

          <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest">
            © 2026 Parallel Intelligence Protocol
          </p>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s ease-in-out infinite;
        }
        body {
          scrollbar-width: thin;
          scrollbar-color: #1f2937 transparent;
        }
        ::-webkit-scrollbar {
          width: 4px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #1f2937;
          border-radius: 20px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;