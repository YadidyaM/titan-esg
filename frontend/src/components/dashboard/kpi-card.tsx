'use client'

import {
  ChartBarIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

interface KpiCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: 'chart' | 'check' | 'shield' | 'currency'
}

const iconMap = {
  chart: ChartBarIcon,
  check: CheckCircleIcon,
  shield: ShieldCheckIcon,
  currency: CurrencyDollarIcon,
}

export function KpiCard({ title, value, change, changeType, icon }: KpiCardProps) {
  const IconComponent = iconMap[icon]

  return (
    <div className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
          <IconComponent className="h-6 w-6 text-primary-600" />
        </div>
      </div>
      
      <div className="mt-4 flex items-center">
        <span
          className={cn(
            'inline-flex items-center text-sm font-medium',
            changeType === 'positive' && 'text-esg-environmental',
            changeType === 'negative' && 'text-error',
            changeType === 'neutral' && 'text-gray-500'
          )}
        >
          {changeType === 'positive' && (
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L12 10.586z" clipRule="evenodd" />
            </svg>
          )}
          {changeType === 'negative' && (
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L12 9.414z" clipRule="evenodd" />
            </svg>
          )}
          {change}
        </span>
        <span className="text-sm text-gray-500 ml-2">from last month</span>
      </div>
    </div>
  )
}
