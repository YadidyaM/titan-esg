'use client';

import React, { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, Palette, Shield, Database, Download } from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    compliance: true,
    reports: true
  });

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'data', label: 'Data Management', icon: Database }
  ];

  const renderProfileSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Profile Settings</h3>
      
      <div className="glass-morphism p-6 rounded-2xl">
        <div className="flex items-center space-x-6 mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <span className="text-2xl font-bold text-white">JD</span>
          </div>
          <div>
            <h4 className="text-lg font-semibold text-white">John Doe</h4>
            <p className="text-slate-400">ESG Manager</p>
            <button className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors">
              Change avatar
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue="John Doe"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
            <input
              type="email"
              defaultValue="john.doe@company.com"
              className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Department</label>
            <select className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              <option value="sustainability">Sustainability</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="legal">Legal</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
            <select className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
              <option value="manager">ESG Manager</option>
              <option value="analyst">ESG Analyst</option>
              <option value="director">ESG Director</option>
              <option value="coordinator">ESG Coordinator</option>
            </select>
          </div>
        </div>
        
        <button className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
          Save Changes
        </button>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Notification Preferences</h3>
      
      <div className="glass-morphism p-6 rounded-2xl">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="text-sm font-medium text-white">Email Notifications</p>
              <p className="text-xs text-slate-400">Receive updates via email</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, email: !prev.email }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.email ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.email ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="text-sm font-medium text-white">Push Notifications</p>
              <p className="text-xs text-slate-400">Real-time browser notifications</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, push: !prev.push }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.push ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.push ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="text-sm font-medium text-white">Compliance Alerts</p>
              <p className="text-xs text-slate-400">Important compliance notifications</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, compliance: !prev.compliance }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.compliance ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.compliance ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl bg-white/5">
            <div>
              <p className="text-sm font-medium text-white">Report Updates</p>
              <p className="text-xs text-slate-400">New reports and analysis</p>
            </div>
            <button
              onClick={() => setNotifications(prev => ({ ...prev, reports: !prev.reports }))}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                notifications.reports ? 'bg-emerald-500' : 'bg-slate-600'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                notifications.reports ? 'translate-x-6' : 'translate-x-0.5'
              }`}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSection();
      case 'notifications': return renderNotificationsSection();
      default: 
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">
              {sections.find(s => s.id === activeSection)?.label || 'Settings'}
            </h3>
            <div className="glass-morphism p-8 rounded-2xl text-center">
              <p className="text-slate-400">Settings panel for {activeSection} coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hologram-text">Settings Hub</h1>
          <p className="text-slate-400 mt-1">Customize your ESG platform experience</p>
        </div>
        <div className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-xl">
          <SettingsIcon className="w-5 h-5 text-slate-400" />
          <span className="text-sm text-slate-300">System Configuration</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Settings Navigation */}
        <div className="glass-morphism p-4 rounded-2xl">
          <nav className="space-y-2">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 ${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-400/30 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          {renderSection()}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-morphism p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
          <Download className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-white mb-2">Export Data</h4>
          <p className="text-xs text-slate-400 mb-4">Download your ESG data</p>
          <button className="text-xs text-blue-400 hover:text-blue-300">Export →</button>
        </div>
        
        <div className="glass-morphism p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
          <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-white mb-2">Security Check</h4>
          <p className="text-xs text-slate-400 mb-4">Review security settings</p>
          <button className="text-xs text-emerald-400 hover:text-emerald-300">Review →</button>
        </div>
        
        <div className="glass-morphism p-6 rounded-2xl text-center hover:scale-105 transition-all duration-300">
          <Database className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <h4 className="text-sm font-medium text-white mb-2">Data Backup</h4>
          <p className="text-xs text-slate-400 mb-4">Backup your information</p>
          <button className="text-xs text-purple-400 hover:text-purple-300">Backup →</button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
