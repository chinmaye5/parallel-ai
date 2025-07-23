"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Twitter, Github, Linkedin } from 'lucide-react';

const LandingPage = () => {
  const [typedText, setTypedText] = useState('');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  const phrases = [
    "Get answers from 5 AI models instantly",
    "Eliminate AI hallucinations forever",
    "Compare responses side-by-side",
    "Find the truth through consensus",
    "Power through parallel intelligence"
  ];

  // Typing animation effect
  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 50 : 100;

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
  }, [typedText, isDeleting, currentPhraseIndex, phrases]);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  const useIntersectionObserver = (options = {}) => {
    const [isIntersecting, setIsIntersecting] = useState(false);
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      }, { threshold: 0.1, ...options });

      if (ref.current) observer.observe(ref.current);
      return () => observer.disconnect();
    }, [options]);

    return [ref, isIntersecting] as [React.RefObject<HTMLElement>, boolean];
  };

  const [featuresRef, featuresVisible] = useIntersectionObserver();
  const [testimonialsRef, testimonialsVisible] = useIntersectionObserver();
  const [statsRef, statsVisible] = useIntersectionObserver();

  const features = [
    {
      icon: "🧠",
      title: "Multi-Model Intelligence",
      description: "Query 5 leading AI models simultaneously including Llama, Qwen, DeepSeek, and Gemma for comprehensive answers."
    },
    {
      icon: "🎯",
      title: "Hallucination Prevention",
      description: "Cross-reference responses from multiple models to identify and eliminate AI hallucinations through consensus."
    },
    {
      icon: "⚡",
      title: "Instant Comparison",
      description: "View all model responses side-by-side in real-time to make informed decisions about answer accuracy."
    },
    {
      icon: "🔍",
      title: "Truth Discovery",
      description: "Leverage the wisdom of crowds principle applied to AI - find truth through majority consensus."
    },
    {
      icon: "📊",
      title: "Performance Analytics",
      description: "Track which models perform best for different types of queries with detailed analytics."
    },
    {
      icon: "🚀",
      title: "Lightning Fast",
      description: "Parallel processing ensures you get all responses as fast as querying a single model."
    }
  ];

  const testimonials = [
    {
      name: "Chidurala Manikanta",
      role: "AI Researcher",
      company: "TechCorp",
      avatar: "https://ui-avatars.com/api/?name=chidurala+manikanta&background=3A21E5&color=fff",
      text: "ParallelAI has revolutionized how I validate AI responses. The consensus approach eliminates uncertainty."
    },
    {
      name: "Sarolla Druva harshith",
      role: "Data Scientist",
      company: "InnovateLab",
      avatar: "https://ui-avatars.com/api/?name=druva+harshith&background=8B5CF6&color=fff",
      text: "Finally, a solution to AI hallucinations. Comparing multiple models gives me confidence in every answer."
    },
    {
      name: "Raja Likhith",
      role: "Product Manager",
      company: "FutureTech",
      avatar: "https://ui-avatars.com/api/?name=Raja+likhith&background=10B981&color=fff",
      text: "The parallel processing is incredible. Getting insights from 5 models faster than querying one."
    }
  ];

  const models = [
    {
      name: "Llama 3",
      brand: "Meta",
      color: "black",
      logo: "/models/meta.png"
    },
    {
      name: "Qwen 3",
      brand: "Alibaba",
      color: "black",
      logo: "/models/Qwen_logo.svg.png"
    },
    {
      name: "DeepSeek R1",
      brand: "DeepSeek",
      color: "black",
      logo: "/models/deepseek.svg"
    },
    {
      name: "Gemma 2",
      brand: "Google",
      color: "black",
      logo: "/models/gemma-color.png"
    },
    {
      name: "compound beta",
      brand: "groq",
      color: "black",
      logo: "/models/download.png"
    }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-gray-100 overflow-x-hidden">
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900"></div>
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '80px 80px',
              animation: 'gridScroll 100s linear infinite',
            }}
          />
        </div>
      </div>

      <nav className="relative z-50 px-6 py-4 backdrop-blur-md bg-gray-900/50 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:shadow-lg group-hover:shadow-blue-500/30">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
              <a href='/'>ParallelAI</a>
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
              <span className="relative group">
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </a>
            <a href="#models" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
              <span className="relative group">
                Models
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </a>
            <a href="#testimonials" className="text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
              <span className="relative group">
                Testimonials
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </a>
            <button className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 py-2 rounded-full font-semibold transition-all duration-500 transform hover:scale-105 shadow-lg hover:shadow-blue-500/25 group">
              <span className="relative z-10 flex items-center">
                <a href='/chat' className="text-white">Get Started</a>
                <svg className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </button>
          </div>
        </div>
      </nav>

      <section className="relative z-10 px-6 py-32 md:py-40">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-12" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
            <h1 className="text-5xl md:text-8xl font-black mb-6 leading-tight tracking-tighter">
              <span className="bg-gradient-to-r from-blue-400 via-blue-300 to-cyan-400 bg-clip-text text-transparent animate-gradient bg-300%">
                Parallel
              </span>
              <span className="block bg-gradient-to-r from-cyan-400 via-blue-300 to-blue-400 bg-clip-text text-transparent animate-gradient bg-300%">
                Intelligence
              </span>
            </h1>
          </div>

          <div className="h-20 mb-10 flex items-center justify-center">
            <div className="relative inline-block">
              <p className="text-xl md:text-2xl text-gray-300 font-light bg-gray-900/50 px-6 py-3 rounded-full backdrop-blur-sm border border-gray-700/50">
                {typedText}
                <span className="animate-pulse">|</span>
              </p>
              <div className="absolute -z-10 inset-0 bg-blue-500/10 blur-xl rounded-full"></div>
            </div>
          </div>

          <p className="text-lg md:text-xl text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed">
            Harness the collective power of multiple AI models to get the most accurate,
            reliable answers. Say goodbye to AI hallucinations and hello to truth through consensus.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24">
            <button className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-10 py-5 rounded-full font-bold text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50 flex items-center space-x-3">
              <span className="relative z-10">
                <a href='/chat' className="text-white">Start Asking Questions</a>
              </span>
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
            </button>
          </div>

          <div className="relative">
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {models.map((model, index) => (
                <div
                  key={index}
                  className={`group relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-3xl p-8 hover:scale-105 transition-all duration-700 text-center overflow-hidden`}
                >
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${model.color} flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-500`}>

                    <img
                      src={model.logo}
                      alt={`${model.name} logo`}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text x="50%" y="50%" font-size="60" text-anchor="middle" dominant-baseline="middle" fill="white">' +
                          model.name.charAt(0) + '</text></svg>';
                      }}
                    />
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-white">{model.name}</h3>
                  <p className="text-gray-400 text-base">{model.brand}</p>
                  <div className={`absolute inset-0 bg-gradient-to-br ${model.color} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-500`}></div>
                  <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/5 rounded-3xl transition-all duration-700 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" ref={featuresRef} className="relative z-10 px-6 py-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight">
              Why Choose ParallelAI?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Experience the future of AI interaction with our revolutionary multi-model approach
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-3xl p-10 hover:border-blue-500/50 transition-all duration-700 hover:scale-[1.03] overflow-hidden ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-blue-500/10 blur-xl group-hover:bg-purple-500/20 transition-all duration-1000"></div>
                <div className="relative z-10">
                  <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-500 inline-block">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-300 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-lg">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section id="testimonials" ref={testimonialsRef} className="relative z-10 px-6 py-28">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
              What Users Say
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Join thousands of professionals who trust ParallelAI for accurate AI responses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`group relative bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border border-gray-700/30 rounded-3xl p-10 hover:border-yellow-500/50 transition-all duration-700 hover:scale-[1.03] overflow-hidden ${testimonialsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 0.2}s` }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/5 to-orange-600/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full bg-yellow-500/10 blur-xl group-hover:bg-orange-500/20 transition-all duration-1000"></div>
                <div className="relative z-10">
                  <div className="flex items-center mb-8">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-14 h-14 rounded-full mr-5 border-2 border-gray-700 group-hover:border-yellow-500/50 transition-all duration-500"
                    />
                    <div>
                      <h4 className="font-bold text-xl text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-400">{testimonial.role} at {testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 leading-relaxed text-lg italic mb-6">
                    "{testimonial.text}"
                  </p>
                  <div className="flex text-yellow-400/80 group-hover:text-yellow-400 transition-colors duration-300">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="relative z-10 px-6 py-28">
        <div className="max-w-5xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-sm border border-blue-500/30 rounded-3xl p-12 overflow-hidden">
            <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute -left-20 -bottom-20 w-64 h-64 rounded-full bg-purple-500/10 blur-3xl"></div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
                Ready to Experience True AI Intelligence?
              </h2>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                Join the revolution and start getting better, more reliable AI responses today.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button className="relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-12 py-5 rounded-full font-bold text-lg transition-all duration-500 transform hover:scale-105 shadow-2xl hover:shadow-blue-500/50 flex items-center justify-center space-x-3">
                  <span className="relative z-10">
                    <a href='/chat' className="text-white">Get Started Free</a>
                  </span>
                  <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 px-6 py-20 border-t border-gray-800/50 bg-gradient-to-b from-gray-900/50 to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-8 group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-12 group-hover:shadow-lg group-hover:shadow-blue-500/30">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">
                  <a href='/'>ParallelAI</a>
                </span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed text-lg mb-8">
                Revolutionizing AI interaction through parallel intelligence. Get the most accurate answers by leveraging multiple AI models simultaneously.
              </p>
              <div className="flex space-x-5">
                {[
                  { name: 'twitter', icon: <Twitter className="w-5 h-5" />, color: 'hover:text-blue-400' },
                  { name: 'github', icon: <Github className="w-5 h-5" />, color: 'hover:text-gray-200' },
                  { name: 'linkedin', icon: <Linkedin className="w-5 h-5" />, color: 'hover:text-blue-500' },
                ].map((social) => (
                  <a
                    key={social.name}
                    href="#"
                    className={`w-12 h-12 bg-gray-800/50 hover:bg-gray-700/30 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 border border-gray-700/50 hover:border-blue-500/50 ${social.color}`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 text-white">Product</h3>
              <ul className="space-y-4 text-gray-400 text-lg">
                {['Features', 'Documentation'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors duration-300 flex items-center">
                      <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-xl mb-6 text-white">Company</h3>
              <ul className="space-y-4 text-gray-400 text-lg">
                {['About', 'Blog', 'Careers', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-white transition-colors duration-300 flex items-center">
                      <svg className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800/50 pt-12 text-center">
            <p className="text-gray-500 text-lg">
              © 2025 ParallelAI. All rights reserved. (Chinmaye HG)
            </p>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
        }
        
        @keyframes gridScroll {
          0% { background-position: 0 0; }
          100% { background-position: 80px 80px; }
        }
        
        .animate-gradient {
          animation: gradient 8s ease infinite;
          background-size: 300% 300%;
        }
        
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;