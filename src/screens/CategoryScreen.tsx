import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { BIT240197_DishCategory } from '../types';

export const CategoryScreen: React.FC = () => {
  const { categories, dishes, addCategory, deleteCategory, t } = useApp();

  const [modalVisible, setModalVisible] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');

  const handleAddCategory = async () => {
    if (!newCatName.trim()) {
      Alert.alert(t('validationError'), t('nameRequired'));
      return;
    }

    const res = await addCategory({
      BIT240197_Name: newCatName.trim(),
      BIT240197_Description: newCatDesc.trim(),
    });

    if (!res.success) {
      Alert.alert(t('validationError'), res.error || 'Failed');
      return;
    }

    Alert.alert(t('success'), t('categoryCreatedSuccess'));
    setNewCatName('');
    setNewCatDesc('');
    setModalVisible(false);
  };

  const handleDeleteCategory = (cat: BIT240197_DishCategory) => {
    // Constraint check preview
    const count = dishes.filter((d) => d.BIT240197_DishCategoryId === cat.BIT240197_Id).length;

    if (count > 0) {
      Alert.alert(
        t('validationError'),
        t('cannotDeleteCategoryInUse', { count }),
        [{ text: t('closeBtn'), style: 'default' }]
      );
      return;
    }

    Alert.alert(
      t('deleteCategoryConfirmTitle'),
      t('deleteCategoryConfirmMsg', { name: cat.BIT240197_Name }),
      [
        { text: t('cancelBtn'), style: 'cancel' },
        {
          text: t('deleteBtn'),
          style: 'destructive',
          onPress: async () => {
            const res = await deleteCategory(cat.BIT240197_Id);
            if (!res.success) {
              Alert.alert(t('validationError'), res.error);
            }
          },
        },
      ]
    );
  };

  const getDishCountForCategory = (catId: string) => {
    return dishes.filter((d) => d.BIT240197_DishCategoryId === catId).length;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>{t('categoriesTitle')}</Text>
          <Text style={styles.subtitle}>
            {categories.length} {t('category').toLowerCase()}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="add" size={18} color="#FFFFFF" />
          <Text style={styles.addBtnText}>{t('addCategoryTitle')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={categories}
        keyExtractor={(item) => item.BIT240197_Id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const count = getDishCountForCategory(item.BIT240197_Id);
          return (
            <View style={styles.categoryCard}>
              <View style={styles.categoryInfo}>
                <View style={styles.catHeader}>
                  <Text style={styles.categoryName}>{item.BIT240197_Name}</Text>
                  <View style={[styles.badge, count > 0 ? styles.badgeActive : styles.badgeEmpty]}>
                    <Text style={[styles.badgeText, count > 0 ? styles.badgeTextActive : styles.badgeTextEmpty]}>
                      {count} {t('dishCount')}
                    </Text>
                  </View>
                </View>

                <Text style={styles.categoryDesc}>
                  {item.BIT240197_Description || '—'}
                </Text>

                <Text style={styles.catIdText}>
                  ID: {item.BIT240197_Id}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleDeleteCategory(item)}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>{t('noCategories')}</Text>
          </View>
        }
      />

      {/* Add Category Modal */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('addCategoryTitle')}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close-circle" size={24} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {t('categoryName')} <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={styles.input}
                  value={newCatName}
                  onChangeText={setNewCatName}
                  placeholder={t('categoryNamePlaceholder')}
                  placeholderTextColor="#94A3B8"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{t('categoryDescription')}</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newCatDesc}
                  onChangeText={setNewCatDesc}
                  placeholder={t('categoryDescriptionPlaceholder')}
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>{t('cancelBtn')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleAddCategory}
              >
                <Text style={styles.modalSaveText}>{t('createCategoryBtn')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0284C7',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryInfo: {
    flex: 1,
  },
  catHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeActive: {
    backgroundColor: '#E0F2FE',
  },
  badgeEmpty: {
    backgroundColor: '#F1F5F9',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  badgeTextActive: {
    color: '#0284C7',
  },
  badgeTextEmpty: {
    color: '#94A3B8',
  },
  categoryDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 6,
  },
  catIdText: {
    fontSize: 10,
    fontFamily: 'monospace',
    color: '#94A3B8',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalBody: {
    gap: 14,
  },
  inputGroup: {},
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 60,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  modalCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  modalSaveBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#0284C7',
    alignItems: 'center',
  },
  modalSaveText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
