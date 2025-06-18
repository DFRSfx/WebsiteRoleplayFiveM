import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Users, ShieldCheck, Shield, Stethoscope, Wrench, Briefcase, ChevronRight } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Job {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requirements: string[];
  benefits: string[];
}

const DiscordMemberCount = () => {
  const [memberCount, setMemberCount] = useState(0);

  useEffect(() => {
    const fetchDiscordMembers = async () => {
      try {
        const response = await fetch(
          'https://discord.com/api/guilds/1330697860836233217/widget.json'
        );
        const data = await response.json();
        setMemberCount(data.presence_count || 0); // Approximate member count
      } catch (error) {
        console.error("Failed to fetch Discord members:", error);
      }
    };

    fetchDiscordMembers();
    const interval = setInterval(fetchDiscordMembers, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-center bg-black bg-opacity-50 p-4 rounded-lg">
      <h3 className="text-3xl font-bold text-white mb-1">
        {memberCount.toLocaleString()}
      </h3>
      <p className="text-gray-400">Membros Discord</p>
    </div>
  );
};

const PlayerCount = () => {
  const [playerCount, setPlayerCount] = useState(0);
  const [maxPlayers, setMaxPlayers] = useState(128); // Default or fetch from info.json

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Fetch current players
        const playersResponse = await fetch('http://167.86.117.116:30120/players.json');
        const players = await playersResponse.json();
        setPlayerCount(players.length);
        
        // Optional: Fetch max players from info.json
        const infoResponse = await fetch('http://167.86.117.116:30120/info.json');
        const info = await infoResponse.json();
        setMaxPlayers(info.vars?.sv_maxClients || 128);
      } catch (error) {
        console.error("Error fetching server data:", error);
      }
    };

    // Initial fetch
    fetchPlayers();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchPlayers, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <h3 className="text-3xl font-bold text-white mb-1">
        {playerCount}/{maxPlayers}
      </h3>
      <p className="text-gray-400">Jogadores Online</p>
    </>
  );
};

const HomePage: React.FC = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  
  const [activeJob, setActiveJob] = useState<Job | null>(null);

  const jobs: Job[] = [
    {
      id: "police",
      title: "Police Department",
      description: "Enforce the law, respond to emergencies, and keep the city safe as a member of the LSPD.",
      icon: <Shield className="w-8 h-8" />,
      color: "bg-blue-500",
      requirements: [
        "Minimum 50 hours on the server",
        "Clean criminal record",
        "Excellent communication skills",
        "Ability to remain calm under pressure",
        "Knowledge of server rules and SOPs"
      ],
      benefits: [
        "Competitive salary and benefits",
        "Access to police vehicles and equipment",
        "Career advancement opportunities",
        "Specialized training programs",
        "Authority to enforce the law"
      ]
    },
    {
      id: "ems",
      title: "Emergency Medical Services",
      description: "Save lives as a paramedic or doctor, providing emergency medical care throughout Los Santos.",
      icon: <Stethoscope className="w-8 h-8" />,
      color: "bg-red-500",
      requirements: [
        "Minimum 30 hours on the server",
        "Basic understanding of medical roleplay",
        "Good communication skills",
        "Availability during peak hours",
        "Ability to work under pressure"
      ],
      benefits: [
        "Stable salary and benefits package",
        "Access to medical vehicles and equipment",
        "Specialized medical training",
        "Respected position in the community",
        "Career advancement opportunities"
      ]
    },
    {
      id: "mechanic",
      title: "Mechanic",
      description: "Repair and customize vehicles, providing essential services to the citizens of Los Santos.",
      icon: <Wrench className="w-8 h-8" />,
      color: "bg-yellow-500",
      requirements: [
        "Minimum 20 hours on the server",
        "Basic knowledge of vehicles",
        "Customer service skills",
        "Ability to roleplay repairs professionally",
        "Valid driver's license"
      ],
      benefits: [
        "Commission-based pay structure",
        "Access to repair tools and equipment",
        "Vehicle modification permissions",
        "Business ownership opportunities",
        "Steady customer base"
      ]
    },
    {
      id: "legal",
      title: "Legal Services",
      description: "Provide legal counsel, represent clients in court, and ensure justice is served in Los Santos.",
      icon: <Briefcase className="w-8 h-8" />,
      color: "bg-green-500",
      requirements: [
        "Minimum 40 hours on the server",
        "Strong understanding of server laws",
        "Excellent writing and speaking skills",
        "Ability to maintain client confidentiality",
        "Professional demeanor"
      ],
      benefits: [
        "High earning potential",
        "Respected position in the community",
        "Access to courthouse facilities",
        "Ability to represent clients in legal proceedings",
        "Prestigious career path"
      ]
    }
  ];

  return (
    <div className="animate-fadeIn bg-gray-900">
      {/* Hero Section - Redesigned to match reference */}
      <section className="relative min-h-screen bg-black bg-opacity-80 bg-[url('https://media.discordapp.net/attachments/1103427244162023434/1334277500989341696/image.png?ex=68378341&is=683631c1&hm=394843689314df8cabc1b98c9f6f8733f963a7744c25f405c9784be8a05e0890&=&format=webp&quality=lossless&width=960&height=960')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-t from-black to-red-900 opacity-80"></div>
        
        <div className="relative container mx-auto px-4 flex flex-col justify-center h-full pt-32 pb-20">
          <div className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold text-white mb-6 font-montserrat"
            >
              <span className="text-red-600">ENIGMA</span> RP
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-f2xl md:text-3xl text-white mb-8 font-light"
            >
              <p>Seja Bem-Vindo ao Maior</p>
              <p className="text-red-500 font-bold">servidor do Mundo!</p>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xl text-gray-300 mb-12"
            >
              Desde 2022 fazendo História
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="bg-red-600 bg-opacity-90 text-white py-4 px-6 rounded-lg shadow-lg mb-8 max-w-md mx-auto"
            >
              <div className="text-2xl font-bold animate-pulse">ENIGMA10</div>
              <div className="text-lg">10% off em todos os produtos</div>
            </motion.div>
            
            {/* Server Status */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="flex flex-wrap justify-center gap-8 mb-12"
            >
              <div className="text-center bg-black bg-opacity-50 p-4 rounded-lg">
                <PlayerCount />
              </div>
              <div className="text-center bg-black bg-opacity-50 p-4 rounded-lg">
                <h3 className="text-3xl font-bold text-green-500 mb-1">Online</h3>
                <p className="text-gray-400">Status do Servidor</p>
              </div>
              <DiscordMemberCount />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/store" 
                className="btn bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
              >
                Compre VIP
              </Link>
              <Link 
                to="/features" 
                className="btn bg-transparent border-2 border-red-600 text-white hover:bg-red-600 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
              >
                Todos os produtos
              </Link>
            </motion.div>
          </div>
        </div>
        
        {/* Limited Time Offer */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.5 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-red-900 to-red-800 py-4 px-6 text-center"
        >
          <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-2 md:mb-0">
              <span className="line-through text-gray-300">DE 100€</span>
              <span className="text-2xl font-bold ml-4">80€</span>
            </div>
            <div className="text-xl font-bold text-white animate-pulse">
              PACOTE DE TEMPO LIMITADO
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section - Redesigned */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-center text-white mb-16"
          >
            POR QUE ESCOLHER <span className="text-red-600">ENIGMA RP</span>?
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-8 rounded-lg border-l-4 border-red-600 transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">VEÍCULOS PREMIUM</h3>
              <p className="text-gray-400 text-center">
                Coleção exclusiva de veículos customizados de alta qualidade disponíveis apenas no nosso servidor.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-8 rounded-lg border-l-4 border-red-600 transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">COMUNIDADE ATIVA</h3>
              <p className="text-gray-400 text-center">
                Junte-se à nossa comunidade vibrante de roleplayers e faça conexões duradouras.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-800 p-8 rounded-lg border-l-4 border-red-600 transform hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-4 text-center">ADMINISTRAÇÃO JUSTA</h3>
              <p className="text-gray-400 text-center">
                Nossa equipe dedicada garante uma experiência justa e divertida para todos os jogadores.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Careers Section - Kept similar but styled to match */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-4xl font-bold text-white mb-4"
            >
              PROFISSÕES <span className="text-red-600">DISPONÍVEIS</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="max-w-2xl mx-auto text-gray-400"
            >
              Explore diversas oportunidades de emprego dentro do nosso servidor de roleplay
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Job selection menu */}
            <div className="lg:col-span-1">
              <div className="bg-gray-700 rounded-xl shadow-md overflow-hidden border-t-4 border-red-600">
                <h3 className="p-4 bg-red-600 text-white font-semibold text-center">CARREIRAS</h3>
                <ul className="divide-y divide-gray-600">
                  {jobs.map((job) => (
                    <li key={job.id}>
                      <button
                        onClick={() => setActiveJob(activeJob?.id === job.id ? null : job)}
                        className={`w-full flex items-center justify-between p-4 transition-colors ${
                          activeJob?.id === job.id 
                            ? 'bg-gray-600 text-white'
                            : 'hover:bg-gray-600 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full ${job.color} flex items-center justify-center text-white`}>
                            {job.icon}
                          </div>
                          <span className="ml-3 font-medium">{job.title}</span>
                        </div>
                        <ChevronRight size={18} className={activeJob?.id === job.id ? 'text-white' : 'text-gray-400'} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Job details */}
            <div className="lg:col-span-4">
              <AnimatePresence mode="wait">
                {activeJob ? (
                  <motion.div
                    key={activeJob.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gray-700 rounded-xl shadow-md h-full border-t-4 border-red-600"
                  >
                    <div className={`p-6 ${activeJob.color} text-white`}>
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                          {activeJob.icon}
                        </div>
                        <h3 className="ml-4 text-2xl font-bold">{activeJob.title}</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <p className="text-gray-300 mb-6">{activeJob.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold mb-4 text-white">REQUISITOS</h4>
                          <ul className="space-y-2">
                            {activeJob.requirements.map((req, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-red-500 mt-1 mr-2">•</span>
                                <span className="text-gray-300">{req}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold mb-4 text-white">BENEFÍCIOS</h4>
                          <ul className="space-y-2">
                            {activeJob.benefits.map((benefit, index) => (
                              <li key={index} className="flex items-start">
                                <span className="text-green-500 mt-1 mr-2">•</span>
                                <span className="text-gray-300">{benefit}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="mt-8 text-center">
                        <Link
                          to="/job-application"
                          className="inline-flex items-center bg-red-600 text-white font-bold px-8 py-3 rounded-md hover:bg-red-700 transition-all transform hover:scale-105"
                        >
                          APLICAR AGORA
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-gray-700 rounded-xl shadow-md h-full p-6 flex flex-col items-center justify-center text-center border-t-4 border-red-600"
                  >
                    <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center mb-6">
                      <Briefcase size={32} className="text-red-500" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-white">SELECIONE UMA CARREIRA</h3>
                    <p className="text-gray-300 max-w-lg">
                      Escolha uma opção de carreira na lista para visualizar informações detalhadas sobre requisitos, responsabilidades e benefícios.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link
              to="/job-application"
              className="inline-flex items-center gap-2 bg-red-600 text-white font-bold px-8 py-3 rounded-md hover:bg-red-700 transition-all transform hover:scale-105"
            >
              VER TODAS AS CARREIRAS
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://media.discordapp.net/attachments/1103427244162023434/1334277500989341696/image.png?ex=68378341&is=683631c1&hm=394843689314df8cabc1b98c9f6f8733f963a7744c25f405c9784be8a05e0890&=&format=webp&quality=lossless&width=960&height=960')] bg-cover bg-center opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-4xl font-bold text-white mb-6"
          >
            PRONTO PARA SE JUNTAR AO <span className="text-red-600">ENIGMA RP</span>?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Junte-se à nossa comunidade hoje e experimente o melhor servidor de roleplay FiveM com veículos personalizados, equipe ativa e experiência imersiva.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a 
              href="https://discord.gg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              Entre no Discord
            </a>
            <Link 
              to="/store" 
              className="btn bg-transparent border-2 border-red-600 text-white hover:bg-red-600 font-bold py-3 px-8 rounded-lg transition-all transform hover:scale-105"
            >
              Loja VIP
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Server Stats */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-css-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center bg-gray-700 p-6 rounded-lg border-t-4 border-red-600"
            >
              <h3 className="text-4xl font-bold text-red-600 mb-2">500+</h3>
              <p className="text-gray-400">Jogadores Ativos</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center bg-gray-700 p-6 rounded-lg border-t-4 border-red-600"
            >
              <h3 className="text-4xl font-bold text-red-600 mb-2">100+</h3>
              <p className="text-gray-400">Veículos Custom</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              className="text-center bg-gray-700 p-6 rounded-lg border-t-4 border-red-600"
            >
              <h3 className="text-4xl font-bold text-red-600 mb-2">20+</h3>
              <p className="text-gray-400">Membros da Staff</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
              className="text-center bg-gray-700 p-6 rounded-lg border-t-4 border-red-600"
            >
              <h3 className="text-4xl font-bold text-red-600 mb-2">24/7</h3>
              <p className="text-gray-400">Servidor Online</p>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;