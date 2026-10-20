"use client";
import React, { useState, useEffect } from 'react';
import { Twitter, Github, Linkedin, Brain, Zap, Shield, BarChart3, Rocket, ArrowRight, Menu, X, Scale } from 'lucide-react';

const LandingPage = () => {
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const phrases = [
    "5 ACTIVE LLMS // ZERO BIAS.",
    "REAL-TIME PARALLEL ARBITRATION.",
    "ALGORITHMIC CONSENSUS OVER HYPE.",
    "ELIMINATE SINGLE-MODEL BLINDSPOTS.",
  ];

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 30 : 60;

    if (!isDeleting && typedText === currentPhrase) {
      setTimeout(() => setIsDeleting(true), 2000);
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

  const features = [
    {
      code: "01 // PARALLEL-EXEC",
      title: "MULTI-THREAD INFERENCE",
      description: "Dispatch identical user queries concurrently across 5 disparate foundational architectures in <800ms.",
      color: "bg-violet-400"
    },
    {
      code: "02 // ARBITRATION",
      title: "120B CONSENSUS JUDGE",
      description: "OpenAI GPT-OSS-120B synthesizes all 5 streams into an unambiguous, factually consolidated decision.",
      color: "bg-cyan-400"
    },
    {
      code: "03 // DIVERGENCE",
      title: "HALLUCINATION ISOLATION",
      description: "Single-model false positives are immediately exposed and neutralized by divergent source perspectives.",
      color: "bg-lime-400"
    },
    {
      code: "04 // TELEMETRY",
      title: "LATENCY & METRICS HUD",
      description: "Per-node millisecond benchmarks and response time analysis for complete transparency.",
      color: "bg-orange-400"
    },
    {
      code: "05 // INDEPENDENCE",
      title: "MULTI-KEY RATE CONTROL",
      description: "Segregated API keys for independent throughput quotas, eliminating cross-model blocking.",
      color: "bg-purple-400"
    },
    {
      code: "06 // DISPATCH",
      title: "SINGLE & AGGREGATE MODES",
      description: "Target isolated single architectures or dispatch collective 5-way batch runs with a single toggle.",
      color: "bg-rose-400"
    }
  ];

  const models = [
    { name: "GPT-OSS-120B", brand: "OpenAI", role: "Consensus Judge", badge: "bg-emerald-400" },
    { name: "Llama-3.3-70B", brand: "Meta", role: "Primary Node", badge: "bg-blue-400" },
    { name: "Qwen-3.8-27B", brand: "Alibaba", role: "Primary Node", badge: "bg-amber-400" },
    { name: "Compound-Mini", brand: "Groq", role: "Speed Node", badge: "bg-purple-400" },
    { name: "Kimi-K2", brand: "Moonshot AI", role: "Reasoning Node", badge: "bg-rose-400" }
  ];

  return (
    <div className="min-h-screen bg-[#0e0e11] text-[#f4f4f0] font-mono selection:bg-violet-400 selection:text-black">


      {/* Navigation */}
      <nav className="border-b-2 border-black bg-[#121217] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-violet-400 text-black border-2 border-black flex items-center justify-center font-black text-base brutal-shadow-sm">
              P
            </div>
            <span className="text-base font-black text-white uppercase tracking-tight">
              PARALLEL<span className="bg-violet-400 text-black px-1.5 ml-1">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8 text-xs font-bold uppercase tracking-wider">
            <a href="#architecture" className="text-gray-400 hover:text-violet-400 transition-colors">
              // ARCHITECTURE
            </a>
            <a href="#nodes" className="text-gray-400 hover:text-violet-400 transition-colors">
              // ACTIVE_NODES
            </a>
            <a href="#specs" className="text-gray-400 hover:text-violet-400 transition-colors">
              // SPECS
            </a>
            <a
              href="/chat"
              className="px-4 py-2 bg-violet-400 text-black border-2 border-black font-black uppercase tracking-widest brutal-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 transition-all cursor-pointer"
            >
              LAUNCH CONSOLE -&gt;
            </a>
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t-2 border-black bg-[#121217] p-4 space-y-3 text-xs font-bold uppercase">
            <a href="#architecture" className="block text-gray-400 hover:text-violet-400 py-1" onClick={() => setIsMobileMenuOpen(false)}>// ARCHITECTURE</a>
            <a href="#nodes" className="block text-gray-400 hover:text-violet-400 py-1" onClick={() => setIsMobileMenuOpen(false)}>// ACTIVE_NODES</a>
            <a href="#specs" className="block text-gray-400 hover:text-violet-400 py-1" onClick={() => setIsMobileMenuOpen(false)}>// SPECS</a>
            <a href="/chat" className="block w-full py-2.5 bg-violet-400 text-black text-center border-2 border-black font-black" onClick={() => setIsMobileMenuOpen(false)}>LAUNCH CONSOLE</a>
          </div>
        )}
      </nav>

      <main>
        {/* Hero Section */}
        <section className="px-4 lg:px-6 pt-16 pb-20 border-b-2 border-black bg-[#0e0e11]">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="inline-block px-3 py-1 bg-[#181822] border-2 border-black text-violet-400 text-xs font-black uppercase tracking-widest brutal-shadow-sm">
              ENGINEERED PROTOCOL // MULTI-LLM VERDICT
            </div>

            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black text-white font-sans uppercase tracking-tight leading-[0.95]">
                DISPATCH ONCE. <br />
                <span className="bg-violet-400 text-black px-3 py-1 inline-block mt-1">QUERY 5 ARCHITECTURES.</span>
              </h1>

              <div className="h-6">
                <p className="text-xs sm:text-sm font-black text-cyan-400 uppercase tracking-widest">
                  &gt; {typedText}<span className="animate-pulse">_</span>
                </p>
              </div>

              <p className="text-sm lg:text-base text-gray-400 max-w-2xl font-sans leading-relaxed pt-2">
                ParallelAI eliminates single-model hallucination by running queries simultaneously across OpenAI, Meta Llama, Alibaba Qwen, Groq, and Moonshot AI, feeding all raw telemetry into a 120B parameter consensus engine.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <a
                href="/chat"
                className="px-8 py-3.5 bg-violet-400 hover:bg-violet-300 text-black border-2 border-black font-black text-xs uppercase tracking-widest brutal-shadow hover:translate-x-0.5 hover:translate-y-0.5 transition-all text-center"
              >
                [ENTER CONSOLE INTERFACE]
              </a>
              <a
                href="#nodes"
                className="px-8 py-3.5 bg-[#1a1a24] hover:bg-[#232330] text-gray-300 border-2 border-black font-black text-xs uppercase tracking-widest text-center"
              >
                VIEW NODE LINEUP
              </a>
            </div>

            {/* Live Terminal Preview */}
            <div className="mt-12 border-2 border-black bg-[#121217] brutal-shadow-lg">
              <div className="flex items-center justify-between px-4 py-2 bg-[#1c1c24] border-b-2 border-black text-xs font-bold text-gray-400 uppercase">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-rose-500 border border-black inline-block"></span>
                  <span className="w-2.5 h-2.5 bg-violet-400 border border-black inline-block"></span>
                  <span className="w-2.5 h-2.5 bg-emerald-400 border border-black inline-block"></span>
                  <span className="ml-2 font-mono text-[10px] text-gray-400">TELEMETRY_PIPELINE.SH</span>
                </div>
                <span className="text-[10px] text-emerald-400">STATUS: 5/5 ONLINE</span>
              </div>
              <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
                {models.map((m, idx) => (
                  <div key={idx} className="p-3 bg-black border-2 border-black brutal-shadow-sm space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-gray-500 font-bold">NODE-0{idx + 1}</span>
                      <span className={`text-[8px] font-black uppercase px-1 py-0.2 ${m.badge} text-black border border-black`}>
                        {m.brand}
                      </span>
                    </div>
                    <p className="text-white font-bold text-xs truncate">{m.name}</p>
                    <p className="text-[10px] text-gray-400 font-sans">{m.role}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Models Grid Section */}
        <section id="nodes" className="py-20 px-4 lg:px-6 border-b-2 border-black bg-[#121217]">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-1">
              <span className="text-xs font-black text-violet-400 uppercase tracking-widest">[ORCHESTRATED INVENTORY]</span>
              <h2 className="text-3xl lg:text-5xl font-black text-white font-sans uppercase tracking-tight">
                5 ACTIVE NEURAL FOUNDATIONS
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map((model, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-[#171720] border-2 border-black brutal-shadow space-y-4"
                >
                  <div className="flex items-center justify-between border-b-2 border-black pb-2">
                    <span className="text-xs font-black text-gray-500 font-mono">NODE // 0{idx + 1}</span>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase ${model.badge} text-black border border-black`}>
                      {model.brand}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white font-sans uppercase">{model.name}</h3>
                    <p className="text-xs text-gray-400 mt-1 font-mono uppercase">{model.role}</p>
                  </div>
                  <div className="text-[10px] text-gray-500 border-t border-[#262633] pt-2 flex justify-between font-mono">
                    <span>MODE: CHAT_JSON</span>
                    <span className="text-emerald-400">STANDBY_READY</span>
                  </div>
                </div>
              ))}
              <div className="p-5 bg-violet-400 text-black border-2 border-black brutal-shadow flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-xs font-black font-mono uppercase">[CONSENSUS MATRIX]</span>
                  <h3 className="text-xl font-black font-sans uppercase">SUPER-MAJORITY ENGINE</h3>
                  <p className="text-xs font-sans leading-relaxed">
                    Answers are clustered, cross-referenced, and synthesized by GPT-OSS-120B to discard outliers.
                  </p>
                </div>
                <a href="/chat" className="mt-4 inline-block text-xs font-black uppercase underline">
                  TEST IN ENGINE -&gt;
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section id="architecture" className="py-20 px-4 lg:px-6 border-b-2 border-black bg-[#0e0e11]">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="space-y-1">
              <span className="text-xs font-black text-cyan-400 uppercase tracking-widest">[SYSTEM CAPABILITIES]</span>
              <h2 className="text-3xl lg:text-5xl font-black text-white font-sans uppercase tracking-tight">
                ZERO COMPROMISE ARCHITECTURE
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 bg-[#141419] border-2 border-black brutal-shadow space-y-3"
                >
                  <span className="text-[10px] font-black text-violet-400 tracking-wider block font-mono">
                    {feature.code}
                  </span>
                  <h3 className="text-base font-black text-white font-sans uppercase tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Terminal Banner */}
        <section className="py-20 px-4 lg:px-6 bg-[#121217]">
          <div className="max-w-4xl mx-auto border-2 border-black bg-violet-400 text-black p-8 sm:p-12 brutal-shadow-lg text-center space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-black uppercase tracking-widest font-mono">[READY FOR DEPLOYMENT]</span>
              <h2 className="text-3xl sm:text-5xl font-black font-sans uppercase tracking-tight">
                HARNESS COLLECTIVE AI INTELLIGENCE
              </h2>
              <p className="text-xs sm:text-sm font-sans max-w-xl mx-auto font-bold leading-relaxed">
                Stop guessing which LLM gives the right answer. Query 5 flagship models side-by-side and read verified consensus now.
              </p>
            </div>
            <div>
              <a
                href="/chat"
                className="inline-block px-10 py-4 bg-black text-violet-400 hover:bg-neutral-900 border-2 border-black font-black text-xs uppercase tracking-widest brutal-shadow transition-transform hover:scale-105"
              >
                OPEN CONSOLE NOW -&gt;
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Industrial Footer */}
      <footer className="border-t-2 border-black bg-[#0a0a0d] py-10 px-4 lg:px-6 font-mono text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2 text-white font-black">
            <div className="w-5 h-5 bg-violet-400 text-black border border-black flex items-center justify-center text-[10px]">P</div>
            <span>PARALLELAI PROTOCOL</span>
          </div>

          <div className="flex space-x-6">
            <a href="https://github.com/chinmaye5/parallel-ai" target="_blank" rel="noopener noreferrer" className="hover:text-violet-400 transition-colors uppercase font-bold">
              [GITHUB]
            </a>
            <span className="text-gray-700">|</span>
            <span className="uppercase">5-WAY GROQ SDK ORCHESTRATOR</span>
          </div>

          <p className="text-[10px] uppercase text-gray-600">
            © 2026 PARALLELAI // NEO-BRUTALIST ARCHITECTURE
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;