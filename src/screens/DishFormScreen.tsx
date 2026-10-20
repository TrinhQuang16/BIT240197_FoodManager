import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { BIT240197_Dish, BIT240197_DishImage } from '../types';

interface DishFormScreenProps {
  initialDish?: BIT240197_Dish;
  onBack: () => void;
  onSaved: () => void;
}

export const DishFormScreen: React.FC<DishFormScreenProps> = ({
  initialDish,
  onBack,
  onSaved,
}) => {
  const { categories, addDish, updateDish, t } = useApp();

  const isEditing = Boolean(initialDish);

  // Form States
  const [name, setName] = useState(initialDish?.BIT240197_Name || '');
  const [price, setPrice] = useState(initialDish ? String(initialDish.BIT240197_Price) : '');
  const [prepTime, setPrepTime] = useState(
    initialDish ? String(initialDish.BIT240197_PreparationTime) : ''
  );
  const [categoryId, setCategoryId] = useState(
    initialDish?.BIT240197_DishCategoryId || (categories[0]?.BIT240197_Id ?? '')
  );
  const [isAvailable, setIsAvailable] = useState(
    initialDish ? initialDish.BIT240197_IsAvailable : true
  );
  const [description, setDescription] = useState(initialDish?.BIT240197_Description || '');

  // Images state
  const [images, setImages] = useState<BIT240197_DishImage[]>(
    initialDish?.BIT240197_DishImage || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Auto-set category if initial was empty
  useEffect(() => {
    if (!categoryId && categories.length > 0) {
      setCategoryId(categories[0].BIT240197_Id);
    }
  }, [categories]);

  // Image actions
  const handleAddImage = () => {
    const trimmed = newImageUrl.trim();
    if (!trimmed) return;

    // Check if first image, default to thumbnail
    const isFirst = images.length === 0;
    const newImg: BIT240197_DishImage = {
      BIT240197_ImageUrl: trimmed,
      BIT240197_IsThumbnail: isFirst,
    };

    setImages([...images, newImg]);
    setNewImageUrl('');
  };

  const handleSetThumbnail = (index: number) => {
    const updated = images.map((img, i) => ({
      ...img,
      BIT240197_IsThumbnail: i === index,
    }));
    setImages(updated);
  };

  const handleRemoveImage = (index: number) => {
    const target = images[index];
    const filtered = images.filter((_, i) => i !== index);
    // If the removed image was thumbnail, set first remaining image as thumbnail
    if (target.BIT240197_IsThumbnail && filtered.length > 0) {
      filtered[0].BIT240197_IsThumbnail = true;
    }
    setImages(filtered);
  };

  // Submit Handler
  const handleSubmit = async () => {
    const parsedPrice = parseFloat(price);
    const parsedPrepTime = parseInt(prepTime, 10);

    // Validation
    if (!name.trim()) {
      Alert.alert(t('validationError'), t('nameRequired'));
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      Alert.alert(t('validationError'), t('priceInvalid'));
      return;
    }
    if (isNaN(parsedPrepTime) || parsedPrepTime <= 0) {
      Alert.alert(t('validationError'), t('prepTimeInvalid'));
      return;
    }
    if (!categoryId) {
      Alert.alert(t('validationError'), t('categoryRequired'));
      return;
    }

    if (isEditing && initialDish) {
      const res = await updateDish({
        ...initialDish,
        BIT240197_Name: name.trim(),
        BIT240197_Price: parsedPrice,
        BIT240197_PreparationTime: parsedPrepTime,
        BIT240197_DishCategoryId: categoryId,
        BIT240197_IsAvailable: isAvailable,
        BIT240197_Description: description.trim(),
        BIT240197_DishImage: images,
      });

      if (!res.success) {
        Alert.alert(t('validationError'), res.error || 'Update failed');
        return;
      }
      Alert.alert(t('success'), t('dishUpdatedSuccess'));
      onSaved();
    } else {
      const res = await addDish({
        BIT240197_Name: name.trim(),
        BIT240197_Price: parsedPrice,
        BIT240197_PreparationTime: parsedPrepTime,
        BIT240197_DishCategoryId: categoryId,
        BIT240197_IsAvailable: isAvailable,
        BIT240197_Description: description.trim(),
        BIT240197_DishImage: images,
      });

      if (!res.success) {
        Alert.alert(t('validationError'), res.error || 'Create failed');
        return;
      }
      Alert.alert(t('success'), t('dishCreatedSuccess'));
      onSaved();
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onBack} style={styles.navIconBtn}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>
          {isEditing ? t('editDishTitle') : t('addDishTitle')}
        </Text>
        <TouchableOpacity onPress={handleSubmit} style={styles.saveNavBtn}>
          <Text style={styles.saveNavText}>
            {isEditing ? t('updateBtn') : t('createBtn')}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {t('name')} <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder={t('namePlaceholder')}
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Category Picker (Horizontal Chips) */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            {t('category')} <Text style={styles.required}>*</Text>
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryChips}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat.BIT240197_Id}
                style={[
                  styles.categoryChip,
                  categoryId === cat.BIT240197_Id && styles.activeCategoryChip,
                ]}
                onPress={() => setCategoryId(cat.BIT240197_Id)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    categoryId === cat.BIT240197_Id && styles.activeCategoryChipText,
                  ]}
                >
                  {cat.BIT240197_Name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Price & Prep Time Row */}
        <View style={styles.row}>
          <View style={[styles.inputGroup, styles.col]}>
            <Text style={styles.label}>
              {t('price')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              placeholder={t('pricePlaceholder')}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={[styles.inputGroup, styles.col]}>
            <Text style={styles.label}>
              {t('prepTime')} <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={styles.input}
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="numeric"
              placeholder={t('prepTimePlaceholder')}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Availability Switch */}
        <View style={[styles.inputGroup, styles.switchContainer]}>
          <View>
            <Text style={styles.label}>{t('isAvailableSwitch')}</Text>
            <Text style={styles.subLabel}>
              {isAvailable ? t('available') : t('unavailable')}
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: '#CBD5E1', true: '#10B981' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {/* Description */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('description')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('descriptionPlaceholder')}
            placeholderTextColor="#94A3B8"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Images Manager Section */}
        <View style={styles.imagesSection}>
          <Text style={styles.label}>{t('imagesSection')}</Text>
          <Text style={styles.subLabel}>
            {t('setAsThumbnail')}
          </Text>

          {/* Add Image URL Input */}
          <View style={styles.addImageRow}>
            <TextInput
              style={[styles.input, styles.imageUrlInput]}
              value={newImageUrl}
              onChangeText={setNewImageUrl}
              placeholder={t('imageUrlPlaceholder')}
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
            />
            <TouchableOpacity style={styles.addImageBtn} onPress={handleAddImage}>
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addImageBtnText}>{t('addImageBtn')}</Text>
            </TouchableOpacity>
          </View>

          {/* List of current images */}
          {images.length === 0 ? (
            <View style={styles.noImagesBox}>
              <Ionicons name="images-outline" size={28} color="#94A3B8" />
              <Text style={styles.noImagesText}>{t('noImages')}</Text>
            </View>
          ) : (
            <View style={styles.imageList}>
              {images.map((img, idx) => (
                <View key={idx} style={styles.imageItemCard}>
                  <Image source={{ uri: img.BIT240197_ImageUrl }} style={styles.imageItemThumb} />
                  <View style={styles.imageItemInfo}>
                    <Text style={styles.imageUrlText} numberOfLines={1}>
                      {img.BIT240197_ImageUrl}
                    </Text>
                    <View style={styles.imageItemActions}>
                      <TouchableOpacity
                        style={[
                          styles.thumbnailToggleBtn,
                          img.BIT240197_IsThumbnail && styles.activeThumbnailToggleBtn,
                        ]}
                        onPress={() => handleSetThumbnail(idx)}
                      >
                        <Ionicons
                          name={img.BIT240197_IsThumbnail ? 'star' : 'star-outline'}
                          size={14}
                          color={img.BIT240197_IsThumbnail ? '#F59E0B' : '#64748B'}
                        />
                        <Text
                          style={[
                            styles.thumbnailToggleText,
                            img.BIT240197_IsThumbnail && styles.activeThumbnailToggleText,
                          ]}
                        >
                          {img.BIT240197_IsThumbnail ? t('isThumbnailBadge') : t('setAsThumbnail')}
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.removeImageBtn}
                        onPress={() => handleRemoveImage(idx)}
                      >
                        <Ionicons name="trash-outline" size={16} color="#EF4444" />
                        <Text style={styles.removeImageText}>{t('removeImage')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  navIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  saveNavBtn: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveNavText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  formScroll: {
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  required: {
    color: '#EF4444',
  },
  subLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  textArea: {
    minHeight: 70,
  },
  categoryChips: {
    flexDirection: 'row',
  },
  categoryChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  activeCategoryChip: {
    backgroundColor: '#0284C7',
    borderColor: '#0284C7',
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#475569',
  },
  activeCategoryChipText: {
    color: '#FFFFFF',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  imagesSection: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  addImageRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  imageUrlInput: {
    flex: 1,
  },
  addImageBtn: {
    backgroundColor: '#0F172A',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 4,
  },
  addImageBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  noImagesBox: {
    alignItems: 'center',
    paddingVertical: 20,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderStyle: 'dashed',
    borderRadius: 8,
  },
  noImagesText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 6,
  },
  imageList: {
    gap: 10,
  },
  imageItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  imageItemThumb: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
  imageItemInfo: {
    flex: 1,
  },
  imageUrlText: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 6,
  },
  imageItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  thumbnailToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  activeThumbnailToggleBtn: {
    backgroundColor: '#FEF3C7',
  },
  thumbnailToggleText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  activeThumbnailToggleText: {
    color: '#D97706',
    fontWeight: '700',
  },
  removeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  removeImageText: {
    fontSize: 11,
    color: '#EF4444',
  },
  bottomSpacing: {
    height: 40,
  },
});
