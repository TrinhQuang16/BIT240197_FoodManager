import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { DishCard } from '../components/DishCard';
import { FilterModal } from '../components/FilterModal';
import { BIT240197_Dish } from '../types';

interface DishListScreenProps {
  onSelectDish: (dish: BIT240197_Dish) => void;
  onAddDish: () => void;
  onEditDish: (dish: BIT240197_Dish) => void;
}

export const DishListScreen: React.FC<DishListScreenProps> = ({
  onSelectDish,
  onAddDish,
  onEditDish,
}) => {
  const {
    dishes,
    categories,
    filterState,
    setFilterState,
    resetFilterState,
    deleteDish,
    t,
  } = useApp();

  const [filterModalVisible, setFilterModalVisible] = useState(false);

  // Filter & Sort Logic (Phối hợp đồng thời các điều kiện)
  const filteredDishes = useMemo(() => {
    let result = [...dishes];

    // 1. Partial Name Search
    if (filterState.searchQuery.trim()) {
      const q = filterState.searchQuery.toLowerCase().trim();
      result = result.filter((d) => d.BIT240197_Name.toLowerCase().includes(q));
    }

    // 2. Category Filter
    if (filterState.selectedCategoryId && filterState.selectedCategoryId !== 'all') {
      result = result.filter((d) => d.BIT240197_DishCategoryId === filterState.selectedCategoryId);
    }

    // 3. Status Filter (Only Available)
    // Exam 4.4: "món ngừng bán vẫn xuất hiện trong danh sách quản lý, nhưng không xuất hiện khi lọc trạng thái đang bán."
    if (filterState.onlyAvailable) {
      result = result.filter((d) => d.BIT240197_IsAvailable === true);
    }

    // 4. Price Range Filter
    if (filterState.minPrice) {
      const min = parseFloat(filterState.minPrice);
      if (!isNaN(min)) {
        result = result.filter((d) => d.BIT240197_Price >= min);
      }
    }
    if (filterState.maxPrice) {
      const max = parseFloat(filterState.maxPrice);
      if (!isNaN(max)) {
        result = result.filter((d) => d.BIT240197_Price <= max);
      }
    }

    // 5. Sorting
    if (filterState.sortBy === 'price_asc') {
      result.sort((a, b) => a.BIT240197_Price - b.BIT240197_Price);
    } else if (filterState.sortBy === 'price_desc') {
      result.sort((a, b) => b.BIT240197_Price - a.BIT240197_Price);
    } else if (filterState.sortBy === 'prep_asc') {
      result.sort((a, b) => a.BIT240197_PreparationTime - b.BIT240197_PreparationTime);
    }

    return result;
  }, [dishes, filterState]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filterState.selectedCategoryId !== 'all') count++;
    if (filterState.onlyAvailable) count++;
    if (filterState.minPrice) count++;
    if (filterState.maxPrice) count++;
    if (filterState.sortBy !== 'default') count++;
    return count;
  }, [filterState]);

  const handleDeletePrompt = (dish: BIT240197_Dish) => {
    Alert.alert(
      t('deleteDishConfirmTitle'),
      t('deleteDishConfirmMsg', { name: dish.BIT240197_Name }),
      [
        { text: t('cancelBtn'), style: 'cancel' },
        {
          text: t('deleteBtn'),
          style: 'destructive',
          onPress: async () => {
            await deleteDish(dish.BIT240197_Id);
          },
        },
      ]
    );
  };

  const getCategory = (catId: string) => {
    return categories.find((c) => c.BIT240197_Id === catId);
  };

  return (
    <View style={styles.container}>
      {/* Top Search & Filter Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('searchPlaceholder')}
            placeholderTextColor="#94A3B8"
            value={filterState.searchQuery}
            onChangeText={(txt) => setFilterState({ searchQuery: txt })}
          />
          {filterState.searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setFilterState({ searchQuery: '' })}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons
            name="options-outline"
            size={20}
            color={activeFilterCount > 0 ? '#FFFFFF' : '#334155'}
          />
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Active Filter Chips / Reset */}
      {activeFilterCount > 0 && (
        <View style={styles.activeFilterRow}>
          <Text style={styles.activeFilterLabel}>
            {t('activeFilters')} ({filteredDishes.length} {t('dishCount')})
          </Text>
          <TouchableOpacity onPress={resetFilterState} style={styles.clearBtn}>
            <Text style={styles.clearBtnText}>{t('clearFilters')}</Text>
            <Ionicons name="close" size={14} color="#EF4444" />
          </TouchableOpacity>
        </View>
      )}

      {/* Dishes List */}
      <FlatList
        data={filteredDishes}
        keyExtractor={(item) => item.BIT240197_Id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <DishCard
            dish={item}
            category={getCategory(item.BIT240197_DishCategoryId)}
            onPress={() => onSelectDish(item)}
            onEdit={() => onEditDish(item)}
            onDelete={() => handleDeletePrompt(item)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="restaurant-outline" size={54} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>{t('noDishesFound')}</Text>
            <Text style={styles.emptySubtitle}>{t('emptyMenuMsg')}</Text>
          </View>
        }
      />

      {/* Floating Action Button (FAB) to Add Dish */}
      <TouchableOpacity style={styles.fab} onPress={onAddDish} activeOpacity={0.85}>
        <Ionicons name="add" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Filter Modal */}
      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 10,
    alignItems: 'center',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  filterBtn: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  filterBtnActive: {
    backgroundColor: '#0284C7',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  activeFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#F0F9FF',
    borderBottomWidth: 1,
    borderBottomColor: '#BAE6FD',
  },
  activeFilterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0369A1',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
});
