import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { FilterState, SortOption } from '../types';

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
}

export const FilterModal: React.FC<FilterModalProps> = ({ visible, onClose }) => {
  const { categories, filterState, setFilterState, resetFilterState, t } = useApp();

  const [localSearch, setLocalSearch] = useState(filterState.searchQuery);
  const [localCategory, setLocalCategory] = useState(filterState.selectedCategoryId);
  const [localOnlyAvailable, setLocalOnlyAvailable] = useState(filterState.onlyAvailable);
  const [localMinPrice, setLocalMinPrice] = useState(filterState.minPrice);
  const [localMaxPrice, setLocalMaxPrice] = useState(filterState.maxPrice);
  const [localSortBy, setLocalSortBy] = useState<SortOption>(filterState.sortBy);

  // Sync state whenever modal opens or filterState changes
  useEffect(() => {
    if (visible) {
      setLocalSearch(filterState.searchQuery);
      setLocalCategory(filterState.selectedCategoryId);
      setLocalOnlyAvailable(filterState.onlyAvailable);
      setLocalMinPrice(filterState.minPrice);
      setLocalMaxPrice(filterState.maxPrice);
      setLocalSortBy(filterState.sortBy);
    }
  }, [visible, filterState]);

  const handleApply = async () => {
    // Validate price range if both entered
    if (localMinPrice && localMaxPrice) {
      const min = parseFloat(localMinPrice);
      const max = parseFloat(localMaxPrice);
      if (!isNaN(min) && !isNaN(max) && min > max) {
        Alert.alert(t('validationError'), t('invalidPriceRange'));
        return;
      }
    }

    await setFilterState({
      searchQuery: localSearch,
      selectedCategoryId: localCategory,
      onlyAvailable: localOnlyAvailable,
      minPrice: localMinPrice,
      maxPrice: localMaxPrice,
      sortBy: localSortBy,
    });
    onClose();
  };

  const handleReset = async () => {
    setLocalSearch('');
    setLocalCategory('all');
    setLocalOnlyAvailable(false);
    setLocalMinPrice('');
    setLocalMaxPrice('');
    setLocalSortBy('default');
    await resetFilterState();
    onClose();
  };

  const sortOptions: { key: SortOption; labelKey: string }[] = [
    { key: 'default', labelKey: 'sortDefault' },
    { key: 'price_asc', labelKey: 'sortPriceAsc' },
    { key: 'price_desc', labelKey: 'sortPriceDesc' },
    { key: 'prep_asc', labelKey: 'sortPrepAsc' },
  ];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="filter" size={20} color="#0F172A" />
              <Text style={styles.title}>{t('filterModalTitle')}</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={24} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Search Input */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t('dishListTitle')}</Text>
              <View style={styles.searchBox}>
                <Ionicons name="search" size={18} color="#94A3B8" />
                <TextInput
                  style={styles.searchInput}
                  value={localSearch}
                  onChangeText={setLocalSearch}
                  placeholder={t('searchPlaceholder')}
                  placeholderTextColor="#94A3B8"
                />
                {localSearch.length > 0 && (
                  <TouchableOpacity onPress={() => setLocalSearch('')}>
                    <Ionicons name="close" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Category Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t('category')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
                <TouchableOpacity
                  style={[
                    styles.chip,
                    localCategory === 'all' && styles.activeChip,
                  ]}
                  onPress={() => setLocalCategory('all')}
                >
                  <Text
                    style={[
                      styles.chipText,
                      localCategory === 'all' && styles.activeChipText,
                    ]}
                  >
                    {t('allCategories')}
                  </Text>
                </TouchableOpacity>

                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.BIT240197_Id}
                    style={[
                      styles.chip,
                      localCategory === cat.BIT240197_Id && styles.activeChip,
                    ]}
                    onPress={() => setLocalCategory(cat.BIT240197_Id)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        localCategory === cat.BIT240197_Id && styles.activeChipText,
                      ]}
                    >
                      {cat.BIT240197_Name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Availability Filter */}
            <View style={styles.section}>
              <View style={styles.switchRow}>
                <View>
                  <Text style={styles.sectionLabel}>{t('statusFilter')}</Text>
                  <Text style={styles.switchDesc}>{t('onlyAvailable')}</Text>
                </View>
                <Switch
                  value={localOnlyAvailable}
                  onValueChange={setLocalOnlyAvailable}
                  trackColor={{ false: '#CBD5E1', true: '#10B981' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Price Range Filter */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t('filterByPrice')}</Text>
              <View style={styles.priceRow}>
                <View style={styles.priceCol}>
                  <Text style={styles.inputSubLabel}>{t('minPrice')}</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={localMinPrice}
                    onChangeText={setLocalMinPrice}
                    keyboardType="numeric"
                    placeholder="0 đ"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <Text style={styles.priceDash}>—</Text>
                <View style={styles.priceCol}>
                  <Text style={styles.inputSubLabel}>{t('maxPrice')}</Text>
                  <TextInput
                    style={styles.priceInput}
                    value={localMaxPrice}
                    onChangeText={setLocalMaxPrice}
                    keyboardType="numeric"
                    placeholder="100.000 đ"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            {/* Sort Options */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>{t('sortBy')}</Text>
              {sortOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.sortOptionRow,
                    localSortBy === opt.key && styles.activeSortOptionRow,
                  ]}
                  onPress={() => setLocalSortBy(opt.key)}
                >
                  <Text
                    style={[
                      styles.sortOptionText,
                      localSortBy === opt.key && styles.activeSortOptionText,
                    ]}
                  >
                    {t(opt.labelKey)}
                  </Text>
                  {localSortBy === opt.key && (
                    <Ionicons name="checkmark-circle" size={18} color="#0284C7" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetBtn} onPress={handleReset}>
              <Text style={styles.resetBtnText}>{t('resetBtn')}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.applyBtn} onPress={handleApply}>
              <Text style={styles.applyBtnText}>{t('applyBtn')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  body: {
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  section: {
    marginBottom: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
  chipRow: {
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeChip: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchDesc: {
    fontSize: 12,
    color: '#64748B',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  priceCol: {
    flex: 1,
  },
  inputSubLabel: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 4,
  },
  priceInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#0F172A',
  },
  priceDash: {
    marginHorizontal: 10,
    color: '#94A3B8',
    fontWeight: '700',
    alignSelf: 'center',
    marginTop: 14,
  },
  sortOptionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  activeSortOptionRow: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  sortOptionText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '500',
  },
  activeSortOptionText: {
    color: '#0284C7',
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#0284C7',
    alignItems: 'center',
  },
  applyBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
