import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { StorageService, INITIAL_CATEGORIES, INITIAL_DISHES } from '../services/storageService';
import { BIT240197_SyncQueueItem } from '../types';

export const SyncSettingsScreen: React.FC = () => {
  const {
    isOnline,
    isSyncing,
    pendingCount,
    isSimulatedOffline,
    setSimulatedOffline,
    language,
    setLanguage,
    refreshData,
    t,
  } = useApp();

  const [queueItems, setQueueItems] = useState<BIT240197_SyncQueueItem[]>([]);
  const [mockApiUrl, setMockApiUrl] = useState('');

  const loadSettings = async () => {
    const [queue, url] = await Promise.all([
      StorageService.getSyncQueue(),
      StorageService.getMockApiUrl(),
    ]);
    setQueueItems(queue);
    setMockApiUrl(url);
  };

  useEffect(() => {
    loadSettings();
    const interval = setInterval(loadSettings, 1500);
    return () => clearInterval(interval);
  }, [pendingCount, isOnline, isSyncing]);

  const handleSaveUrl = async () => {
    if (!mockApiUrl.trim()) return;
    await StorageService.saveMockApiUrl(mockApiUrl.trim());
    Alert.alert(t('success'), 'MockAPI URL updated');
  };

  const handleResetData = () => {
    Alert.alert(
      'Reset Data',
      'Reset all data back to original seed data (3 categories, 5 dishes)?',
      [
        { text: t('cancelBtn'), style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await StorageService.saveCategories(INITIAL_CATEGORIES);
            await StorageService.saveDishes(INITIAL_DISHES);
            await StorageService.clearSyncQueue();
            await refreshData();
            loadSettings();
            Alert.alert(t('success'), 'Data reset to initial seed state.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Student Banner */}
      <View style={styles.studentCard}>
        <View style={styles.studentBadge}>
          <Ionicons name="school" size={16} color="#0284C7" />
          <Text style={styles.studentBadgeText}>THÔNG TIN BÀI THI</Text>
        </View>
        <Text style={styles.studentName}>Mã số sinh viên: BIT240197</Text>
        <Text style={styles.studentProject}>Project: BIT240197_FoodManager</Text>
        <View style={styles.tableTags}>
          <Text style={styles.tableTag}>Table: BIT240197_Dish</Text>
          <Text style={styles.tableTag}>Table: BIT240197_DishCategory</Text>
        </View>
      </View>

      {/* Language Setting */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="globe-outline" size={20} color="#0F172A" />
          <Text style={styles.cardTitle}>Giao diện đa ngôn ngữ (Language)</Text>
        </View>
        <Text style={styles.cardDesc}>
          Mặc định: English. Cho phép chuyển đổi linh hoạt sang Tiếng Việt và lưu lại trạng thái.
        </Text>
        <View style={styles.langToggleRow}>
          <TouchableOpacity
            style={[
              styles.langChoice,
              language === 'en' && styles.activeLangChoice,
            ]}
            onPress={() => setLanguage('en')}
          >
            <Text style={[styles.langChoiceText, language === 'en' && styles.activeLangChoiceText]}>
              🇬🇧 English (Default)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.langChoice,
              language === 'vi' && styles.activeLangChoice,
            ]}
            onPress={() => setLanguage('vi')}
          >
            <Text style={[styles.langChoiceText, language === 'vi' && styles.activeLangChoiceText]}>
              🇻🇳 Tiếng Việt
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* OFFLINE & AUTO-SYNC SECTION (1.5 ĐIỂM NÂNG CAO) */}
      <View style={[styles.card, styles.highlightCard]}>
        <View style={styles.cardHeader}>
          <Ionicons
            name={isOnline ? 'cloud-done-outline' : 'cloud-offline-outline'}
            size={22}
            color={isOnline ? '#10B981' : '#EF4444'}
          />
          <Text style={styles.cardTitle}>
            Yêu cầu nâng cao: Offline & Tự đồng bộ (1.5 đ)
          </Text>
        </View>

        {/* Real Network Status */}
        <View style={styles.statusDisplay}>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>{t('networkStatus')}:</Text>
            <View
              style={[
                styles.netPill,
                { backgroundColor: isOnline ? '#ECFDF5' : '#FEF2F2' },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  { backgroundColor: isOnline ? '#10B981' : '#EF4444' },
                ]}
              />
              <Text
                style={[
                  styles.netPillText,
                  { color: isOnline ? '#059669' : '#DC2626' },
                ]}
              >
                {isOnline ? t('statusOnline') : t('statusOffline')}
              </Text>
            </View>
          </View>

          {isSyncing && (
            <View style={styles.syncingBanner}>
              <Ionicons name="sync" size={16} color="#D97706" />
              <Text style={styles.syncingBannerText}>{t('syncingNow')}</Text>
            </View>
          )}
        </View>

        {/* Demo Switch for Video 1 Presentation */}
        <View style={styles.demoBox}>
          <View style={styles.demoBoxText}>
            <Text style={styles.demoBoxTitle}>{t('simulatedOfflineTitle')}</Text>
            <Text style={styles.demoBoxDesc}>{t('simulatedOfflineDesc')}</Text>
          </View>
          <Switch
            value={isSimulatedOffline}
            onValueChange={setSimulatedOffline}
            trackColor={{ false: '#CBD5E1', true: '#EF4444' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Pending Sync Queue */}
        <View style={styles.queueContainer}>
          <View style={styles.queueHeader}>
            <Text style={styles.queueTitle}>
              Hàng đợi đồng bộ (@BIT240197_SyncQueue)
            </Text>
            <View style={styles.queueBadge}>
              <Text style={styles.queueBadgeText}>{queueItems.length}</Text>
            </View>
          </View>

          {queueItems.length === 0 ? (
            <View style={styles.emptyQueue}>
              <Ionicons name="checkmark-done-circle" size={24} color="#10B981" />
              <Text style={styles.emptyQueueText}>{t('syncAllSynced')}</Text>
            </View>
          ) : (
            <View style={styles.queueList}>
              {queueItems.map((item) => (
                <View key={item.id} style={styles.queueItem}>
                  <View style={styles.queueItemLeft}>
                    <Text
                      style={[
                        styles.actionPill,
                        item.action === 'CREATE'
                          ? styles.createPill
                          : item.action === 'UPDATE'
                          ? styles.updatePill
                          : styles.deletePill,
                      ]}
                    >
                      {item.action}
                    </Text>
                    <Text style={styles.queueTable}>{item.table}</Text>
                  </View>
                  <Text style={styles.queueRecord}>ID: {item.recordId}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* MockAPI Endpoint */}
        <View style={styles.endpointSection}>
          <Text style={styles.inputLabel}>{t('mockApiEndpoint')}</Text>
          <View style={styles.endpointRow}>
            <TextInput
              style={styles.endpointInput}
              value={mockApiUrl}
              onChangeText={setMockApiUrl}
              placeholder="https://xxx.mockapi.io/api/v1"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.saveEndpointBtn} onPress={handleSaveUrl}>
              <Text style={styles.saveEndpointText}>{t('saveEndpoint')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Danger / Reset Zone */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="refresh-circle-outline" size={22} color="#64748B" />
          <Text style={styles.cardTitle}>Khôi phục dữ liệu mẫu (Seed Data)</Text>
        </View>
        <Text style={styles.cardDesc}>
          Đặt lại cơ sở dữ liệu local về trạng thái ban đầu (3 loại món, 5 món ăn theo yêu cầu tối thiểu của đề).
        </Text>
        <TouchableOpacity style={styles.resetBtn} onPress={handleResetData}>
          <Ionicons name="reload" size={16} color="#DC2626" />
          <Text style={styles.resetBtnText}>Reset về dữ liệu ban đầu</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  studentCard: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
  },
  studentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1E293B',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
  },
  studentBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.5,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  studentProject: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
    marginBottom: 10,
  },
  tableTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tableTag: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#38BDF8',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  highlightCard: {
    borderColor: '#BAE6FD',
    backgroundColor: '#F0F9FF',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDesc: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 12,
  },
  langToggleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  langChoice: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeLangChoice: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  langChoiceText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  activeLangChoiceText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  statusDisplay: {
    marginBottom: 12,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  netPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  netPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  syncingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  syncingBannerText: {
    fontSize: 12,
    color: '#B45309',
    fontWeight: '600',
  },
  demoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  demoBoxText: {
    flex: 1,
    marginRight: 10,
  },
  demoBoxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  demoBoxDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 16,
  },
  queueContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  queueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  queueTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  queueBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  queueBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  emptyQueue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  emptyQueueText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  queueList: {
    gap: 6,
  },
  queueItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
  },
  queueItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionPill: {
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  createPill: {
    backgroundColor: '#DCFCE7',
    color: '#15803D',
  },
  updatePill: {
    backgroundColor: '#FEF3C7',
    color: '#B45309',
  },
  deletePill: {
    backgroundColor: '#FEE2E2',
    color: '#B91C1C',
  },
  queueTable: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    fontFamily: 'monospace',
  },
  queueRecord: {
    fontSize: 11,
    color: '#64748B',
    fontFamily: 'monospace',
  },
  endpointSection: {
    marginTop: 6,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#475569',
    marginBottom: 4,
  },
  endpointRow: {
    flexDirection: 'row',
    gap: 8,
  },
  endpointInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 12,
    color: '#0F172A',
  },
  saveEndpointBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 12,
    justifyContent: 'center',
    borderRadius: 8,
  },
  saveEndpointText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
  },
  bottomSpacer: {
    height: 40,
  },
});
