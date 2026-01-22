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
import type { OpportunityPriority, OpportunityStatus } from '@/types/opportunity'
import StatusBadge from '@/components/StatusBadge'
import PriorityBadge from '@/components/PriorityBadge'

const STATUSES: OpportunityStatus[] = ['New', 'Qualified', 'Assessing', 'Quoted', 'Won', 'Lost', 'On Hold']
const PRIORITIES: OpportunityPriority[] = ['Low', 'Medium', 'High']

export default function NewOpportunityScreen({ navigation }: any) {
  const [creating, setCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    site: '',
    description: '',
    status: 'New' as OpportunityStatus,
    priority: 'Medium' as OpportunityPriority,
    owner_name: '',
    price_eur: '',
    bu: '',
    air_flow_m3h: '',
    number_of_units: '',
    comments: '',
  })

  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.site.trim()) {
      Alert.alert('Validation Error', 'Title and Site are required')
      return
    }

    setCreating(true)
    try {
      const payload = {
        title: formData.title.trim(),
        site: formData.site.trim(),
        description: formData.description.trim() || null,
        status: formData.status,
        priority: formData.priority,
        owner_name: formData.owner_name.trim() || null,
        price_eur: formData.price_eur ? parseFloat(formData.price_eur) : null,
        bu: formData.bu.trim() || null,
        air_flow_m3h: formData.air_flow_m3h ? parseFloat(formData.air_flow_m3h) : null,
        number_of_units: formData.number_of_units ? parseInt(formData.number_of_units) : null,
        comments: formData.comments.trim() || null,
      }

      const { error } = await supabase.from('opportunities').insert([payload])

      if (error) throw error

      Alert.alert('Success', 'Opportunity created successfully', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ])
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create opportunity')
    } finally {
      setCreating(false)
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Project Name <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.title}
            onChangeText={(text) => handleFieldChange('title', text)}
            placeholder="Enter project name"
          />
        </View>

        {/* Site */}
        <View style={styles.section}>
          <Text style={styles.label}>
            Site <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={formData.site}
            onChangeText={(text) => handleFieldChange('site', text)}
            placeholder="Enter site"
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.description}
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
                style={{ opacity: formData.status === status ? 1 : 0.4 }}
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
                style={{ opacity: formData.priority === priority ? 1 : 0.4 }}
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
            value={formData.owner_name}
            onChangeText={(text) => handleFieldChange('owner_name', text)}
            placeholder="Enter owner name"
          />
        </View>

        {/* Price */}
        <View style={styles.section}>
          <Text style={styles.label}>Price (EUR)</Text>
          <TextInput
            style={styles.input}
            value={formData.price_eur}
            onChangeText={(text) => handleFieldChange('price_eur', text.replace(/[^0-9.-]/g, ''))}
            placeholder="Enter price"
            keyboardType="numeric"
          />
        </View>

        {/* BU */}
        <View style={styles.section}>
          <Text style={styles.label}>Business Unit</Text>
          <TextInput
            style={styles.input}
            value={formData.bu}
            onChangeText={(text) => handleFieldChange('bu', text)}
            placeholder="Enter BU"
          />
        </View>

        {/* Air Flow */}
        <View style={styles.section}>
          <Text style={styles.label}>Air Flow (m³/h)</Text>
          <TextInput
            style={styles.input}
            value={formData.air_flow_m3h}
            onChangeText={(text) => handleFieldChange('air_flow_m3h', text.replace(/[^0-9.-]/g, ''))}
            placeholder="Enter air flow"
            keyboardType="numeric"
          />
        </View>

        {/* Number of Units */}
        <View style={styles.section}>
          <Text style={styles.label}>Number of Units</Text>
          <TextInput
            style={styles.input}
            value={formData.number_of_units}
            onChangeText={(text) => handleFieldChange('number_of_units', text.replace(/[^0-9]/g, ''))}
            placeholder="Enter number of units"
            keyboardType="numeric"
          />
        </View>

        {/* Comments */}
        <View style={styles.section}>
          <Text style={styles.label}>Comments</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.comments}
            onChangeText={(text) => handleFieldChange('comments', text)}
            placeholder="Enter comments"
            multiline
            numberOfLines={3}
          />
        </View>
      </ScrollView>

      {/* Create Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.createButton, creating && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.createButtonText}>Create Opportunity</Text>
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
  required: {
    color: '#ef4444',
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
  createButton: {
    backgroundColor: '#16a34a',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
})
