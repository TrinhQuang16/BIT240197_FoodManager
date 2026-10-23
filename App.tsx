import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { AppProvider, useApp } from './src/context/AppContext';
import { Header } from './src/components/Header';
import { DishListScreen } from './src/screens/DishListScreen';
import { DishDetailScreen } from './src/screens/DishDetailScreen';
import { DishFormScreen } from './src/screens/DishFormScreen';
import { CategoryScreen } from './src/screens/CategoryScreen';
import { SyncSettingsScreen } from './src/screens/SyncSettingsScreen';
import { BIT240197_Dish } from './src/types';

type Tab = 'dishes' | 'categories' | 'sync';
type DishScreen = 'list' | 'detail' | 'form';

const MainNavigator: React.FC = () => {
  const { isOnline, pendingCount, t } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('dishes');
  const [dishScreen, setDishScreen] = useState<DishScreen>('list');
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null);
  const [editingDish, setEditingDish] = useState<BIT240197_Dish | undefined>(undefined);

  // Dish navigation helpers
  const handleSelectDish = (dish: BIT240197_Dish) => {
    setSelectedDishId(dish.BIT240197_Id);
    setDishScreen('detail');
  };

  const handleAddDish = () => {
    setEditingDish(undefined);
    setDishScreen('form');
  };

  const handleEditDish = (dish: BIT240197_Dish) => {
    setEditingDish(dish);
    setDishScreen('form');
  };

  const handleBackToList = () => {
    setDishScreen('list');
    setSelectedDishId(null);
    setEditingDish(undefined);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" />

      {/* Persistent Header */}
      <Header />

      {/* Offline Alert Strip */}
      {!isOnline && (
        <View style={styles.offlineStrip}>
          <Ionicons name="cloud-offline" size={14} color="#DC2626" />
          <Text style={styles.offlineStripText}>
            {t('offlineBannerMsg')} ({pendingCount} pending)
          </Text>
        </View>
      )}

      {/* Main Screen Content */}
      <View style={styles.content}>
        {activeTab === 'dishes' && (
          <>
            {dishScreen === 'list' && (
              <DishListScreen
                onSelectDish={handleSelectDish}
                onAddDish={handleAddDish}
                onEditDish={handleEditDish}
              />
            )}
            {dishScreen === 'detail' && selectedDishId && (
              <DishDetailScreen
                dishId={selectedDishId}
                onBack={handleBackToList}
                onEdit={handleEditDish}
              />
            )}
            {dishScreen === 'form' && (
              <DishFormScreen
                initialDish={editingDish}
                onBack={handleBackToList}
                onSaved={handleBackToList}
              />
            )}
          </>
        )}

        {activeTab === 'categories' && <CategoryScreen />}

        {activeTab === 'sync' && <SyncSettingsScreen />}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'dishes' && styles.activeTabItem]}
          onPress={() => {
            setActiveTab('dishes');
            if (activeTab === 'dishes' && dishScreen !== 'list') {
              handleBackToList();
            }
          }}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === 'dishes' ? 'restaurant' : 'restaurant-outline'}
            size={22}
            color={activeTab === 'dishes' ? '#0284C7' : '#64748B'}
          />
          <Text
            style={[styles.tabLabel, activeTab === 'dishes' && styles.activeTabLabel]}
          >
            {t('dishesTab')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'categories' && styles.activeTabItem]}
          onPress={() => setActiveTab('categories')}
          activeOpacity={0.8}
        >
          <Ionicons
            name={activeTab === 'categories' ? 'folder' : 'folder-outline'}
            size={22}
            color={activeTab === 'categories' ? '#0284C7' : '#64748B'}
          />
          <Text
            style={[styles.tabLabel, activeTab === 'categories' && styles.activeTabLabel]}
          >
            {t('categoriesTab')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabItem, activeTab === 'sync' && styles.activeTabItem]}
          onPress={() => setActiveTab('sync')}
          activeOpacity={0.8}
        >
          <View style={styles.iconWithBadge}>
            <Ionicons
              name={activeTab === 'sync' ? 'cloud-done' : 'cloud-outline'}
              size={22}
              color={activeTab === 'sync' ? '#0284C7' : '#64748B'}
            />
            {pendingCount > 0 && (
              <View style={styles.tabBadge}>
                <Text style={styles.tabBadgeText}>{pendingCount}</Text>
              </View>
            )}
          </View>
          <Text
            style={[styles.tabLabel, activeTab === 'sync' && styles.activeTabLabel]}
          >
            {t('settingsTab')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  const { width, height } = useWindowDimensions();
  const isWeb = Platform.OS === 'web';
  const isLargeScreen = isWeb && width > 520;

  // Real-time clock for simulated Android status bar
  const [timeStr, setTimeStr] = useState('09:41');
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = String(d.getHours()).padStart(2, '0');
      const m = String(d.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaProvider>
      <AppProvider>
        {isLargeScreen ? (
          <View style={styles.webBackdrop}>
            {/* Top Desktop Banner Info */}
            <View style={styles.webHeader}>
              <View style={styles.webHeaderLeft}>
                <Ionicons name="phone-portrait" size={18} color="#38BDF8" />
                <Text style={styles.webHeaderTitle}>Android Mobile Simulation Mode</Text>
              </View>
              <Text style={styles.webHeaderMSSV}>MSSV: BIT240197</Text>
            </View>

            {/* Android Device Mockup Frame */}
            <View
              style={[
                styles.androidDeviceFrame,
                { height: Math.min(height - 80, 890) },
              ]}
            >
              {/* Simulated Android Status Bar (Camera notch, Clock, Battery) */}
              <View style={styles.simulatedStatusBar}>
                <Text style={styles.statusTime}>{timeStr}</Text>
                <View style={styles.punchHoleCamera} />
                <View style={styles.statusIcons}>
                  <Ionicons name="wifi" size={13} color="#CBD5E1" />
                  <Ionicons name="cellular" size={13} color="#CBD5E1" />
                  <Ionicons name="battery-charging" size={14} color="#10B981" />
                </View>
              </View>

              {/* Main Mobile Screen */}
              <View style={styles.deviceScreenInner}>
                <MainNavigator />
              </View>

              {/* Android Bottom Home Navigation Bar */}
              <View style={styles.simulatedHomeBar}>
                <View style={styles.homeIndicatorPill} />
              </View>
            </View>
          </View>
        ) : (
          <MainNavigator />
        )}
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  // Web Container styles
  webBackdrop: {
    flex: 1,
    backgroundColor: '#090D16',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  webHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 440,
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  webHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  webHeaderTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  webHeaderMSSV: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    backgroundColor: '#1E293B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  androidDeviceFrame: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: '#0F172A',
    borderRadius: 38,
    borderWidth: 4,
    borderColor: '#334155',
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.65,
    shadowRadius: 30,
    elevation: 25,
  },
  simulatedStatusBar: {
    height: 32,
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderTopLeftRadius: 34,
    borderTopRightRadius: 34,
  },
  statusTime: {
    color: '#F8FAFC',
    fontSize: 11,
    fontWeight: '700',
  },
  punchHoleCamera: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#0B0F19',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  deviceScreenInner: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  simulatedHomeBar: {
    height: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: 34,
    borderBottomRightRadius: 34,
  },
  homeIndicatorPill: {
    width: 90,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0F172A',
  },

  // App native styles
  safeArea: {
    flex: 1,
    backgroundColor: '#1E293B',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  offlineStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#FEE2E2',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FCA5A5',
  },
  offlineStripText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#DC2626',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  activeTabItem: {},
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 3,
  },
  activeTabLabel: {
    color: '#0284C7',
    fontWeight: '700',
  },
  iconWithBadge: {
    position: 'relative',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#EF4444',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
});
