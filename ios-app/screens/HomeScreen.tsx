import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { supabase } from '@/lib/supabase'
import type { Opportunity } from '@/types/opportunity'
import OpportunityCard from '@/components/OpportunityCard'

export default function HomeScreen({ navigation }: any) {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchOpportunities = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(50)

      if (error) throw error
      setOpportunities(data || [])
    } catch (error: any) {
      console.error('Error fetching opportunities:', error.message)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchOpportunities()
  }, [fetchOpportunities])

  const onRefresh = () => {
    setRefreshing(true)
    fetchOpportunities()
  }

  const handleOpportunityPress = (opportunity: Opportunity) => {
    navigation.navigate('OpportunityDetail', { opportunity })
  }

  const handleOpportunityDelete = () => {
    fetchOpportunities() // Refresh list after delete
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading opportunities...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>AHU Opportunity Tracker</Text>
          <Text style={styles.headerSubtitle}>Track and manage your opportunities</Text>
        </View>
      </View>

      {/* New Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => navigation.navigate('NewOpportunity')}
        >
          <Text style={styles.newButtonText}>+ New Opportunity</Text>
        </TouchableOpacity>
      </View>

      {/* Opportunities List */}
      {opportunities.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No opportunities yet</Text>
          <Text style={styles.emptySubtitle}>Create one to get started</Text>
        </View>
      ) : (
        <FlatList
          data={opportunities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OpportunityCard
              opportunity={item}
              onPress={() => handleOpportunityPress(item)}
              onDelete={handleOpportunityDelete}
            />
          )}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  newButton: {
    backgroundColor: '#2563eb',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  newButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9ca3af',
  },
})
