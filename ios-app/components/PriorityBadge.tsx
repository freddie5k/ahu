import React from 'react'
import { View, Text } from 'react-native'
import Svg, { Polyline, Line } from 'react-native-svg'
import type { OpportunityPriority } from '@/types/opportunity'

interface PriorityBadgeProps {
  priority: OpportunityPriority
}

const PriorityIcon = ({ priority }: { priority: OpportunityPriority }) => {
  const color = 'currentColor'
  switch (priority) {
    case 'Low':
      return (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Polyline points="6 9 12 15 18 9" />
        </Svg>
      )
    case 'Medium':
      return (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Line x1="5" y1="12" x2="19" y2="12" />
        </Svg>
      )
    case 'High':
      return (
        <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <Polyline points="18 15 12 9 6 15" />
        </Svg>
      )
  }
}

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const styles: Record<OpportunityPriority, { bg: string; text: string; ring: string; fontWeight: any }> = {
    'Low': { bg: '#f9fafb', text: '#374151', ring: '#6b7280', fontWeight: '500' },
    'Medium': { bg: '#fef9c3', text: '#854d0e', ring: '#ca8a04', fontWeight: '500' },
    'High': { bg: '#fef2f2', text: '#991b1b', ring: '#ef4444', fontWeight: '600' }
  }

  const style = styles[priority]

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
      <PriorityIcon priority={priority} />
      <Text style={{ color: style.text, fontSize: 12, fontWeight: style.fontWeight }}>{priority}</Text>
    </View>
  )
}
