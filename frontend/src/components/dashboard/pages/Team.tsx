import React from 'react';
import { Users, UserPlus, Mail, Phone, MapPin, Calendar, Award, TrendingUp } from 'lucide-react';

const Team = () => {
  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'ESG Director',
      department: 'Sustainability',
      email: 'sarah.johnson@company.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      avatar: 'SJ',
      status: 'online',
      performance: 95,
      projects: 12,
      joinDate: '2022-03-15'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Data Analyst',
      department: 'Analytics',
      email: 'michael.chen@company.com',
      phone: '+1 (555) 234-5678',
      location: 'San Francisco, CA',
      avatar: 'MC',
      status: 'away',
      performance: 88,
      projects: 8,
      joinDate: '2023-01-20'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Compliance Officer',
      department: 'Legal',
      email: 'emily.rodriguez@company.com',
      phone: '+1 (555) 345-6789',
      location: 'Chicago, IL',
      avatar: 'ER',
      status: 'online',
      performance: 92,
      projects: 15,
      joinDate: '2021-08-10'
    },
    {
      id: 4,
      name: 'David Kim',
      role: 'Blockchain Developer',
      department: 'Technology',
      email: 'david.kim@company.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      avatar: 'DK',
      status: 'offline',
      performance: 87,
      projects: 6,
      joinDate: '2023-06-05'
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      role: 'Environmental Specialist',
      department: 'Sustainability',
      email: 'lisa.thompson@company.com',
      phone: '+1 (555) 567-8901',
      location: 'Boston, MA',
      avatar: 'LT',
      status: 'online',
      performance: 90,
      projects: 10,
      joinDate: '2022-11-12'
    },
    {
      id: 6,
      name: 'James Wilson',
      role: 'Social Impact Manager',
      department: 'Community Relations',
      email: 'james.wilson@company.com',
      phone: '+1 (555) 678-9012',
      location: 'Austin, TX',
      avatar: 'JW',
      status: 'away',
      performance: 85,
      projects: 9,
      joinDate: '2023-03-01'
    }
  ];

  const departments = [
    { name: 'Sustainability', count: 12, color: 'emerald' },
    { name: 'Analytics', count: 8, color: 'blue' },
    { name: 'Legal', count: 6, color: 'purple' },
    { name: 'Technology', count: 10, color: 'cyan' },
    { name: 'Community Relations', count: 4, color: 'orange' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-emerald-400 bg-emerald-400/20';
      case 'away': return 'text-orange-400 bg-orange-400/20';
      case 'offline': return 'text-slate-400 bg-slate-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-blue-400';
    if (score >= 70) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold hologram-text">Team Hub</h1>
          <p className="text-slate-400 mt-1">Manage your ESG team and collaboration</p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 glass-morphism px-4 py-2 rounded-xl hover:bg-white/10 transition-colors">
            <Mail className="w-5 h-5 text-blue-400" />
            <span className="text-sm text-slate-300">Send Message</span>
          </button>
          <button className="flex items-center space-x-2 bg-gradient-to-r from-emerald-500 to-blue-500 px-4 py-2 rounded-xl text-white font-medium hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-300">
            <UserPlus className="w-5 h-5" />
            <span className="text-sm">Add Member</span>
          </button>
        </div>
      </div>

      {/* Team Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <Users className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">48</div>
          <p className="text-sm text-slate-400">Team Members</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <TrendingUp className="w-8 h-8 text-blue-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">89.5%</div>
          <p className="text-sm text-slate-400">Avg Performance</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <Award className="w-8 h-8 text-purple-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">156</div>
          <p className="text-sm text-slate-400">Active Projects</p>
        </div>
        <div className="glass-morphism p-6 rounded-2xl text-center neural-network">
          <Calendar className="w-8 h-8 text-orange-400 mx-auto mb-3" />
          <div className="text-2xl font-bold text-white mb-1">12</div>
          <p className="text-sm text-slate-400">New This Month</p>
        </div>
      </div>

      {/* Department Distribution */}
      <div className="glass-morphism p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Department Distribution</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {departments.map((dept, index) => (
            <div
              key={dept.name}
              className="text-center p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-300 group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`w-16 h-16 bg-gradient-to-r from-${dept.color}-500 to-${dept.color}-600 rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-sm font-medium text-white mb-1">{dept.name}</h4>
              <p className="text-2xl font-bold text-white">{dept.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team Members Grid */}
      <div className="glass-morphism p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Team Members</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={member.id}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 group hover:scale-105 float-animation"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-2xl flex items-center justify-center">
                      <span className="text-xl font-bold text-white">{member.avatar}</span>
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                      member.status === 'online' ? 'bg-emerald-400' : 
                      member.status === 'away' ? 'bg-orange-400' : 'bg-slate-400'
                    }`}></div>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white group-hover:text-emerald-400 transition-colors">
                      {member.name}
                    </h4>
                    <p className="text-sm text-slate-400">{member.role}</p>
                    <p className="text-xs text-slate-500">{member.department}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                  {member.status}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">{member.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">{member.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">{member.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-xs text-slate-400">Joined {member.joinDate}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Performance</span>
                  <span className={`text-sm font-medium ${getPerformanceColor(member.performance)}`}>
                    {member.performance}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div 
                    className={`h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full transition-all duration-1000`}
                    style={{ width: `${member.performance}%` }}
                  ></div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Active Projects</span>
                  <span className="text-sm font-medium text-white">{member.projects}</span>
                </div>
              </div>

              <div className="mt-4 flex space-x-2">
                <button className="flex-1 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg text-sm font-medium hover:bg-emerald-500/30 transition-colors">
                  View Profile
                </button>
                <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium hover:bg-blue-500/30 transition-colors">
                  Message
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Performance Chart */}
      <div className="glass-morphism p-6 rounded-2xl">
        <h3 className="text-lg font-semibold text-white mb-6">Team Performance Trends</h3>
        
        <div className="h-64 flex items-end space-x-2">
          {[75, 82, 78, 85, 89, 87, 91, 88, 92, 89, 91, 89.5].map((value, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div 
                className="w-full bg-gradient-to-t from-emerald-500 to-blue-500 rounded-t transition-all duration-1000"
                style={{ height: `${value}%` }}
              ></div>
              <span className="text-xs text-slate-400 mt-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
              </span>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <span className="text-sm text-emerald-400">+14.5% improvement this year</span>
        </div>
      </div>
    </div>
  );
};

export default Team;
