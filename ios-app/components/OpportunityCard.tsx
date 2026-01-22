import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import { supabase } from '@/lib/supabase'
import type { Opportunity, OpportunityPriority, OpportunityStatus } from '@/types/opportunity'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'

interface OpportunityCardProps {
  opportunity: Opportunity
  onPress?: () => void
  onDelete?: () => void
}

export default function OpportunityCard({ opportunity, onPress, onDelete }: OpportunityCardProps) {
  const [deleting, setDeleting] = useState(false)

  const handleDelete = () => {
    Alert.alert(
      'Delete Opportunity',
      'Are you sure you want to delete this opportunity?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeleting(true)
            try {
              const { error } = await supabase
                .from('opportunities')
                .delete()
                .eq('id', opportunity.id)

              if (error) throw error
              onDelete?.()
            } catch (error: any) {
              Alert.alert('Error', error.message || 'Failed to delete opportunity')
            } finally {
              setDeleting(false)
            }
          },
        },
      ]
    )
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Not set'
    return new Date(dateStr).toLocaleDateString()
  }

  const formatPrice = (price: number | null) => {
    if (price === null || price === undefined) return '—'
    return `€${price.toLocaleString()}`
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      }}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#111827', marginBottom: 4 }}>
            {opportunity.title}
          </Text>
          <Text style={{ fontSize: 14, color: '#6b7280' }}>
            {opportunity.site}
          </Text>
        </View>

        {deleting ? (
          <ActivityIndicator size="small" color="#ef4444" />
        ) : (
          <TouchableOpacity onPress={handleDelete} style={{ padding: 4 }}>
            <Text style={{ color: '#ef4444', fontSize: 20 }}>×</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Status and Priority */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <StatusBadge status={opportunity.status} />
        <PriorityBadge priority={opportunity.priority} />
      </View>

      {/* Details Grid */}
      <View style={{ gap: 8 }}>
        {opportunity.description && (
          <View>
            <Text style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Description</Text>
            <Text style={{ fontSize: 13, color: '#374151' }} numberOfLines={2}>
              {opportunity.description}
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Owner</Text>
            <Text style={{ fontSize: 13, color: '#374151' }}>
              {opportunity.owner_name || '—'}
            </Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Close Date</Text>
            <Text style={{ fontSize: 13, color: '#374151' }}>
              {formatDate(opportunity.target_close_date)}
            </Text>
          </View>
        </View>

        {opportunity.price_eur !== null && (
          <View>
            <Text style={{ fontSize: 11, color: '#9ca3af', marginBottom: 2 }}>Price</Text>
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#059669' }}>
              {formatPrice(opportunity.price_eur)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  )
}
