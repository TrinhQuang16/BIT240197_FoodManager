import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { language, setLanguage, isOnline, isSyncing, pendingCount, t } = useApp();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'vi' : 'en');
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <View>
          <Text style={styles.appTitle}>BIT240197 Food Manager</Text>
          <Text style={styles.studentId}>MSSV: BIT240197</Text>
        </View>

        <View style={styles.actionsRow}>
          {/* Language Toggle Button */}
          <TouchableOpacity
            style={styles.langButton}
            onPress={toggleLanguage}
            activeOpacity={0.7}
          >
            <Ionicons name="globe-outline" size={16} color="#FFFFFF" />
            <Text style={styles.langText}>
              {language === 'en' ? 'EN' : 'VI'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sync / Connectivity Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.statusLeft}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: !isOnline ? '#EF4444' : isSyncing ? '#F59E0B' : '#10B981' },
            ]}
          />
          <Text style={styles.statusText}>
            {!isOnline
              ? `${t('statusOffline')} • ${pendingCount} ${t('syncPending', { count: pendingCount })}`
              : isSyncing
              ? t('syncingNow')
              : `${t('statusOnline')} • ${t('syncAllSynced')}`}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    paddingTop: 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    letterSpacing: 0.3,
  },
  studentId: {
    fontSize: 12,
    fontWeight: '600',
    color: '#38BDF8',
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#334155',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    gap: 5,
    borderWidth: 1,
    borderColor: '#475569',
  },
  langText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  statusBar: {
    marginTop: 8,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#334155',
  },
  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '500',
  },
});
