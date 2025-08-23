import React from 'react';
import { CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'success',
      icon: CheckCircle,
      title: 'ESG data validation completed successfully',
      time: '2 minutes ago',
      color: 'text-emerald-400'
    },
    {
      id: 2,
      type: 'warning',
      icon: AlertTriangle,
      title: 'Carbon emissions report requires review',
      time: '15 minutes ago',
      color: 'text-orange-400'
    },
    {
      id: 3,
      type: 'info',
      icon: Info,
      title: 'New compliance regulation updates available',
      time: '1 hour ago',
      color: 'text-blue-400'
    },
    {
      id: 4,
      type: 'success',
      icon: CheckCircle,
      title: 'AI analysis completed for Q4 sustainability metrics',
      time: '2 hours ago',
      color: 'text-emerald-400'
    },
    {
      id: 5,
      type: 'info',
      icon: Clock,
      title: 'Scheduled backup completed',
      time: '4 hours ago',
      color: 'text-slate-400'
    }
  ];

  return (
    <div className="glass-morphism p-6 rounded-2xl">
      <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
      <p className="text-sm text-slate-400 mb-6">Latest updates and notifications</p>
      
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={activity.id}
              className="flex items-start space-x-4 p-3 rounded-xl hover:bg-white/5 transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`flex-shrink-0 ${activity.color} mt-0.5`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-slate-200 transition-colors">
                  {activity.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
              </div>
              <div className="flex-shrink-0">
                <div className="w-2 h-2 bg-transparent rounded-full group-hover:bg-white/30 transition-all duration-300"></div>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-4 py-2 text-sm text-slate-400 hover:text-white transition-colors text-center">
        View all activities →
      </button>
    </div>
  );
};

export default RecentActivity;
