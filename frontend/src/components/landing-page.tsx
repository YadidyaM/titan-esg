'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navigation from './navigation';

const LandingPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleNavigation = async (path: string) => {
    setIsLoading(true);
    try {
      await router.push(path);
    } catch (error) {
      console.error('Navigation error:', error);
      // Fallback to window.location if router fails
      window.location.href = path;
    } finally {
      setIsLoading(false);
    }
  };

  const teamMembers = [
    {
      name: 'Yadidya Medepalli',
      role: 'AI Engineer',
      description: 'AI Engineer | Turning Ideas into Intelligent Solutions 🚀 | 2+ years crafting AI-driven products from concept to deployment, blending Python, ML, Cloud, and Full-Stack magic to automate, innovate, and scale the future of technology.',
      linkedin: 'https://www.linkedin.com/in/yadidya-medepalli/',
      github: 'https://github.com/YadidyaM',
      achievements: [
        '🏆 Lablab AIs AIstronauts Hackathon (2025) – Winner: Nebula AI for satellite automation',
        '🏆 Winner of Best Creative AI Project at the Agentic AI Innovation Challenge 2025'
      ],
      techStack: ['Python', 'TypeScript', 'JavaScript', 'PyTorch', 'TensorFlow', 'AWS', 'Docker', 'Kubernetes']
    },
    {
      name: 'Monica Jayakumar',
      role: 'AI & Data Engineer',
      description: 'AI & Data Engineer: Architecting and deploying robust AI solutions from raw data to production. 3+ years experience with Python, SQL, NLP, and cloud technologies.',
      linkedin: 'https://www.linkedin.com/in/monicajayakumar/',
      github: 'https://github.com/Monica2403',
      achievements: [
        '🏆 Lablab AIs AIstronauts Hackathon (2025) – Winner: Nebula AI for satellite automation',
        '🏆 Winner of Best Creative AI Project at the Agentic AI Innovation Challenge 2025'
      ],
      techStack: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'PyTorch', 'TensorFlow', 'AWS', 'Azure', 'GCP']
    },
    {
      name: 'Amrin Asokan',
      role: 'Sustainability',
      description: 'Sustainability expert focused on environmental, social, and governance (ESG) initiatives. Passionate about creating sustainable solutions for a better future.',
      linkedin: 'https://www.linkedin.com/in/amrin-asokan/',
      github: 'https://github.com/TheSlayStation',
      achievements: [
        '🌱 Sustainability and ESG expertise',
        '🌍 Environmental impact assessment and reporting'
      ],
      techStack: ['ESG Analytics', 'Sustainability Reporting', 'Environmental Impact Assessment', 'Carbon Footprinting']
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <Navigation />
      
      {/* Header */}
      <header className="relative z-10 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-float-slow">
              <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent gradient-animate">
                Titan ESG
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              AI-powered ESG management and compliance platform. Transforming sustainability through intelligent technology.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => handleNavigation('/dashboard')}
                disabled={isLoading}
                className="btn-landing bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center min-w-[140px]"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </>
                ) : (
                  'Get Started'
                )}
              </button>
              <button 
                onClick={() => handleNavigation('/ai-analysis')}
                disabled={isLoading}
                className="btn-landing bg-transparent border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center min-w-[140px]"
              >
                AI Analysis
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Team Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              A powerhouse team of AI engineers, data scientists, and sustainability experts
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div 
                key={member.name}
                className={`group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 team-card-hover ${
                  index === 0 ? 'animate-slide-in-left' : 
                  index === 1 ? 'animate-fade-in-up' : 
                  'animate-slide-in-right'
                }`}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="text-center mb-6">
                    <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg animate-glow-pulse">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{member.name}</h3>
                    <p className="text-emerald-400 font-semibold">{member.role}</p>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-6">
                    {member.description}
                  </p>

                  {/* Tech Stack */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Tech Stack</h4>
                    <div className="flex flex-wrap gap-2">
                      {member.techStack.map((tech, techIndex) => (
                        <span 
                          key={techIndex}
                          className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors duration-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="mb-6">
                    <h4 className="text-white font-semibold mb-3">Achievements</h4>
                    <ul className="space-y-2">
                      {member.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex} className="text-gray-300 text-sm flex items-start">
                          <span className="mr-2 mt-1">•</span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center space-x-4">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.047-1.032-3.047-1.032 0-1.26 1.317-1.26 2.718v4.896H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 hover:bg-gray-900 rounded-full flex items-center justify-center text-white transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 bg-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Platform Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Comprehensive ESG management powered by cutting-edge AI technology
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'AI-Powered Analysis',
                description: 'Advanced machine learning algorithms for ESG data analysis and insights',
                icon: '🤖',
                color: 'from-blue-500 to-purple-500'
              },
              {
                title: 'Blockchain Integration',
                description: 'Secure and transparent ESG data management on blockchain',
                icon: '🔗',
                color: 'from-green-500 to-emerald-500'
              },
              {
                title: 'Compliance Monitoring',
                description: 'Real-time compliance tracking and automated reporting',
                icon: '📊',
                color: 'from-yellow-500 to-orange-500'
              },
              {
                title: 'Data Visualization',
                description: 'Interactive dashboards and comprehensive ESG metrics',
                icon: '📈',
                color: 'from-red-500 to-pink-500'
              },
              {
                title: 'Sustainability Reporting',
                description: 'Automated ESG report generation and stakeholder communication',
                icon: '📋',
                color: 'from-indigo-500 to-blue-500'
              },
              {
                title: 'Carbon Footprinting',
                description: 'Advanced carbon tracking and reduction strategies',
                icon: '🌱',
                color: 'from-emerald-500 to-teal-500'
              }
            ].map((feature, index) => (
              <div 
                key={feature.title}
                className={`feature-card bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 ${
                  index % 3 === 0 ? 'animate-slide-in-left' : 
                  index % 3 === 1 ? 'animate-fade-in-up' : 
                  'animate-slide-in-right'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center text-3xl shadow-lg hover:shadow-xl transition-shadow duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 text-center">{feature.title}</h3>
                <p className="text-gray-300 text-center">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your ESG Strategy?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join the future of sustainable business with AI-powered ESG management
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="btn-landing bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25"
            >
              Start Your Journey
            </Link>
            <Link 
              href="/team" 
              className="btn-landing bg-transparent border-2 border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2025 Titan ESG Platform. Built with ❤️ by the Titan Team.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
