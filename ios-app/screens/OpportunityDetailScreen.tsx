import React, { useState } from 'react'
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import type { Opportunity, OpportunityPriority, OpportunityStatus } from '@/types/opportunity'
import StatusBadge from '@/components/StatusBadge'
import PriorityBadge from '@/components/PriorityBadge'

const STATUSES: OpportunityStatus[] = ['New', 'Qualified', 'Assessing', 'Quoted', 'Won', 'Lost', 'On Hold']
const PRIORITIES: OpportunityPriority[] = ['Low', 'Medium', 'High']

export default function OpportunityDetailScreen({ route, navigation }: any) {
  const { opportunity: initialOpportunity } = route.params
  const [opportunity, setOpportunity] = useState<Opportunity>(initialOpportunity)
  const [saving, setSaving] = useState(false)
  const [editedFields, setEditedFields] = useState<Partial<Opportunity>>({})

  const handleFieldChange = (field: keyof Opportunity, value: any) => {
    setEditedFields(prev => ({ ...prev, [field]: value }))
    setOpportunity(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = async () => {
    if (Object.keys(editedFields).length === 0) {
      navigation.goBack()
      return
    }

    setSaving(true)
    try {
      const { error } = await supabase
        .from('opportunities')
        .update(editedFields)
        .eq('id', opportunity.id)

      if (error) throw error

      Alert.alert('Success', 'Opportunity updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update opportunity')
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Project Name</Text>
          <TextInput
            style={styles.input}
            value={opportunity.title}
            onChangeText={(text) => handleFieldChange('title', text)}
            placeholder="Enter project name"
          />
        </View>

        {/* Site */}
        <View style={styles.section}>
          <Text style={styles.label}>Site</Text>
          <TextInput
            style={styles.input}
            value={opportunity.site}
            onChangeText={(text) => handleFieldChange('site', text)}
            placeholder="Enter site"
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={opportunity.description || ''}
            onChangeText={(text) => handleFieldChange('description', text)}
            placeholder="Enter description"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* Status */}
        <View style={styles.section}>
          <Text style={styles.label}>Status</Text>
          <View style={styles.badgeContainer}>
            {STATUSES.map((status) => (
              <TouchableOpacity
                key={status}
                onPress={() => handleFieldChange('status', status)}
                style={{ opacity: opportunity.status === status ? 1 : 0.4 }}
              >
                <StatusBadge status={status} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Priority */}
        <View style={styles.section}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.badgeContainer}>
            {PRIORITIES.map((priority) => (
              <TouchableOpacity
                key={priority}
                onPress={() => handleFieldChange('priority', priority)}
                style={{ opacity: opportunity.priority === priority ? 1 : 0.4 }}
              >
                <PriorityBadge priority={priority} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Owner */}
        <View style={styles.section}>
          <Text style={styles.label}>Owner</Text>
          <TextInput
            style={styles.input}
            value={opportunity.owner_name || ''}
            onChangeText={(text) => handleFieldChange('owner_name', text)}
            placeholder="Enter owner name"
          />
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.label}>Price (EUR)</Text>
          <TextInput
            style={styles.input}
            value={opportunity.price_eur?.toString() || ''}
            onChangeText={(text) => {
              const numValue = parseFloat(text.replace(/[^0-9.-]/g, ''))
              handleFieldChange('price_eur', isNaN(numValue) ? null : numValue)
            }}
            placeholder="Enter price"
            keyboardType="numeric"
          />
        </View>

        {/* BU */}
        <View style={styles.section}>
          <Text style={styles.label}>Business Unit</Text>
          <TextInput
            style={styles.input}
            value={opportunity.bu || ''}
            onChangeText={(text) => handleFieldChange('bu', text)}
            placeholder="Enter BU"
          />
        </View>

        {/* Air Flow */}
        <View style={styles.section}>
          <Text style={styles.label}>Air Flow (m³/h)</Text>
          <TextInput
            style={styles.input}
            value={opportunity.air_flow_m3h?.toString() || ''}
            onChangeText={(text) => {
              const numValue = parseFloat(text)
              handleFieldChange('air_flow_m3h', isNaN(numValue) ? null : numValue)
            }}
            placeholder="Enter air flow"
            keyboardType="numeric"
          />
        </View>

        {/* Number of Units */}
        <View style={styles.section}>
          <Text style={styles.label}>Number of Units</Text>
          <TextInput
            style={styles.input}
            value={opportunity.number_of_units?.toString() || ''}
            onChangeText={(text) => {
              const numValue = parseInt(text)
              handleFieldChange('number_of_units', isNaN(numValue) ? null : numValue)
            }}
            placeholder="Enter number of units"
            keyboardType="numeric"
          />
        </View>

        {/* Comments */}
        <View style={styles.section}>
          <Text style={styles.label}>Comments</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={opportunity.comments || ''}
            onChangeText={(text) => handleFieldChange('comments', text)}
            placeholder="Enter comments"
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      {/* Save Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  saveButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
