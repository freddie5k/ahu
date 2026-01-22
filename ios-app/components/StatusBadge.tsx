import React from 'react'
import { View, Text } from 'react-native'
import Svg, { Circle, Path, Polyline, Line, Rect } from 'react-native-svg'
import type { OpportunityStatus } from '@/types/opportunity'

interface StatusBadgeProps {
  status: OpportunityStatus
}

const StatusIcon = ({ status }: { status: OpportunityStatus }) => {
  const color = 'currentColor'
  switch (status) {
    case 'New':
      return (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Path d="M12 16v-4" />
          <Path d="M12 8h.01" />
        </Svg>
      )
    case 'Qualified':
      return (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <Polyline points="22 4 12 14.01 9 11.01" />
        </Svg>
      )
    case 'Assessing':
      return (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Polyline points="12 6 12 12 16 14" />
        </Svg>
      )
    case 'Quoted':
      return (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Line x1="12" y1="1" x2="12" y2="23" />
          <Path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </Svg>
      )
    case 'Won':
      return (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <Path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <Path d="M4 22h16" />
          <Path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <Path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <Path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </Svg>
      )
    case 'Lost':
      return (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="10" />
          <Line x1="15" y1="9" x2="9" y2="15" />
          <Line x1="9" y1="9" x2="15" y2="15" />
        </Svg>
      )
    case 'On Hold':
      return (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Rect x="6" y="4" width="4" height="16" />
          <Rect x="14" y="4" width="4" height="16" />
        </Svg>
      )
  }
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<OpportunityStatus, { bg: string; text: string; ring: string }> = {
    'New': { bg: '#dbeafe', text: '#1e40af', ring: '#2563eb' },
    'Qualified': { bg: '#f3e8ff', text: '#6b21a8', ring: '#9333ea' },
    'Assessing': { bg: '#fef3c7', text: '#92400e', ring: '#f59e0b' },
    'Quoted': { bg: '#ffedd5', text: '#9a3412', ring: '#f97316' },
    'Won': { bg: '#dcfce7', text: '#166534', ring: '#16a34a' },
    'Lost': { bg: '#fee2e2', text: '#991b1b', ring: '#ef4444' },
    'On Hold': { bg: '#f3f4f6', text: '#374151', ring: '#6b7280' }
  }

  const style = styles[status]

  return (
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      borderRadius: 6,
      paddingHorizontal: 8,
      paddingVertical: 4,
      backgroundColor: style.bg,
      borderWidth: 1,
      borderColor: style.ring + '33',
    }}>
      <StatusIcon status={status} />
      <Text style={{ color: style.text, fontSize: 12, fontWeight: '500' }}>{status}</Text>
    </View>
  )
}
