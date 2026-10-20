import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../context/AppContext';
import { BIT240197_Dish } from '../types';

interface DishDetailScreenProps {
  dishId: string;
  onBack: () => void;
  onEdit: (dish: BIT240197_Dish) => void;
}

const { width } = Dimensions.get('window');

export const DishDetailScreen: React.FC<DishDetailScreenProps> = ({
  dishId,
  onBack,
  onEdit,
}) => {
  const { dishes, categories, deleteDish, updateDish, t } = useApp();

  const dish = dishes.find((d) => d.BIT240197_Id === dishId);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!dish) {
    return (
      <View style={styles.notFoundContainer}>
        <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
        <Text style={styles.notFoundText}>{t('noDishesFound')}</Text>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>{t('backBtn')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const category = categories.find((c) => c.BIT240197_Id === dish.BIT240197_DishCategoryId);
  const isQuick = dish.BIT240197_PreparationTime <= 15;
  const images = dish.BIT240197_DishImage;

  // Set selected image as thumbnail
  const handleSetAsThumbnail = async (index: number) => {
    const updatedImages = images.map((img, i) => ({
      ...img,
      BIT240197_IsThumbnail: i === index,
    }));
    await updateDish({
      ...dish,
      BIT240197_DishImage: updatedImages,
    });
  };

  const handleDelete = () => {
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
            onBack();
          },
        },
      ]
    );
  };

  const currentDisplayImage = images[selectedImageIndex] || images[0];

  return (
    <View style={styles.container}>
      {/* Top Navigation Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={onBack} style={styles.navIconBtn}>
          <Ionicons name="arrow-back" size={22} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {dish.BIT240197_Name}
        </Text>
        <View style={styles.navActions}>
          <TouchableOpacity onPress={() => onEdit(dish)} style={styles.navIconBtn}>
            <Ionicons name="create-outline" size={22} color="#0284C7" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDelete} style={[styles.navIconBtn, styles.deleteNavBtn]}>
            <Ionicons name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image Banner */}
        <View style={styles.mainImageContainer}>
          {currentDisplayImage ? (
            <Image
              source={{ uri: currentDisplayImage.BIT240197_ImageUrl }}
              style={styles.mainImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="fast-food-outline" size={64} color="#94A3B8" />
            </View>
          )}

          {/* Thumbnail Tag on Main Banner */}
          {currentDisplayImage?.BIT240197_IsThumbnail && (
            <View style={styles.thumbnailBadge}>
              <Ionicons name="star" size={12} color="#FBBF24" />
              <Text style={styles.thumbnailBadgeText}>{t('isThumbnailBadge')}</Text>
            </View>
          )}

          {/* Quick / Regular Badge */}
          <View style={[styles.prepBadge, isQuick ? styles.quickBadge : styles.regularBadge]}>
            <Ionicons
              name={isQuick ? 'flash' : 'time-outline'}
              size={12}
              color={isQuick ? '#065F46' : '#1E40AF'}
            />
            <Text style={[styles.prepBadgeText, isQuick ? styles.quickText : styles.regularText]}>
              {isQuick ? t('quickBadge') : t('regularBadge')}
            </Text>
          </View>
        </View>

        {/* Thumbnail Selector / Image Gallery */}
        {images.length > 0 && (
          <View style={styles.gallerySection}>
            <View style={styles.galleryHeader}>
              <Text style={styles.sectionLabel}>
                {t('imagesSection')} ({images.length})
              </Text>
              {currentDisplayImage && !currentDisplayImage.BIT240197_IsThumbnail && (
                <TouchableOpacity
                  style={styles.setThumbnailBtn}
                  onPress={() => handleSetAsThumbnail(selectedImageIndex)}
                >
                  <Ionicons name="star-outline" size={14} color="#0284C7" />
                  <Text style={styles.setThumbnailText}>{t('setAsThumbnail')}</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.thumbnailRow}>
              {images.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.thumbnailItem,
                    selectedImageIndex === idx && styles.selectedThumbnail,
                  ]}
                  onPress={() => setSelectedImageIndex(idx)}
                >
                  <Image source={{ uri: img.BIT240197_ImageUrl }} style={styles.thumbnailThumb} />
                  {img.BIT240197_IsThumbnail && (
                    <View style={styles.thumbStar}>
                      <Ionicons name="star" size={10} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Content Card */}
        <View style={styles.cardContent}>
          <View style={styles.headerInfo}>
            <View style={styles.badgeRow}>
              <View style={styles.categoryBadge}>
                <Ionicons name="pricetag-outline" size={12} color="#0284C7" />
                <Text style={styles.categoryBadgeText}>
                  {category ? category.BIT240197_Name : t('category')}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  dish.BIT240197_IsAvailable ? styles.availableBadge : styles.unavailableBadge,
                ]}
              >
                <View
                  style={[
                    styles.statusDot,
                    { backgroundColor: dish.BIT240197_IsAvailable ? '#10B981' : '#EF4444' },
                  ]}
                />
                <Text
                  style={[
                    styles.statusBadgeText,
                    dish.BIT240197_IsAvailable ? styles.availableText : styles.unavailableText,
                  ]}
                >
                  {dish.BIT240197_IsAvailable ? t('available') : t('unavailable')}
                </Text>
              </View>
            </View>

            <Text style={styles.dishName}>{dish.BIT240197_Name}</Text>

            <View style={styles.priceRow}>
              <Text style={styles.priceValue}>
                {dish.BIT240197_Price.toLocaleString('vi-VN')} đ
              </Text>
              <View style={styles.timeTag}>
                <Ionicons name="time-outline" size={14} color="#64748B" />
                <Text style={styles.timeTagText}>
                  {dish.BIT240197_PreparationTime} {t('prepTime')}
                </Text>
              </View>
            </View>
          </View>

          {/* Description Section */}
          <View style={styles.descriptionBox}>
            <Text style={styles.sectionLabel}>{t('description')}</Text>
            <Text style={styles.descriptionText}>
              {dish.BIT240197_Description || 'Chưa có mô tả cho món ăn này.'}
            </Text>
          </View>

          {/* Database Info Display (For Student Demo & Teacher Review) */}
          <View style={styles.dbInfoBox}>
            <View style={styles.dbInfoHeader}>
              <Ionicons name="code-slash" size={14} color="#64748B" />
              <Text style={styles.dbInfoTitle}>Mã lưu trữ: BIT240197_Dish</Text>
            </View>
            <Text style={styles.dbInfoText}>BIT240197_Id: {dish.BIT240197_Id}</Text>
            <Text style={styles.dbInfoText}>
              BIT240197_DishCategoryId: {dish.BIT240197_DishCategoryId}
            </Text>
            <Text style={styles.dbInfoText}>
              BIT240197_Price: {dish.BIT240197_Price}
            </Text>
            <Text style={styles.dbInfoText}>
              BIT240197_PreparationTime: {dish.BIT240197_PreparationTime} phút
            </Text>
          </View>
        </View>
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
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteNavBtn: {
    backgroundColor: '#FEF2F2',
  },
  navTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginHorizontal: 12,
  },
  navActions: {
    flexDirection: 'row',
    gap: 8,
  },
  mainImageContainer: {
    width: width,
    height: 240,
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  thumbnailBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  thumbnailBadgeText: {
    color: '#FBBF24',
    fontSize: 11,
    fontWeight: '700',
  },
  prepBadge: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  quickBadge: {
    backgroundColor: '#D1FAE5',
  },
  regularBadge: {
    backgroundColor: '#DBEAFE',
  },
  prepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  quickText: {
    color: '#065F46',
  },
  regularText: {
    color: '#1E40AF',
  },
  gallerySection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  galleryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  setThumbnailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  setThumbnailText: {
    fontSize: 11,
    color: '#0284C7',
    fontWeight: '700',
  },
  thumbnailRow: {
    flexDirection: 'row',
  },
  thumbnailItem: {
    width: 64,
    height: 64,
    borderRadius: 10,
    overflow: 'hidden',
    marginRight: 10,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedThumbnail: {
    borderColor: '#0284C7',
  },
  thumbnailThumb: {
    width: '100%',
    height: '100%',
  },
  thumbStar: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    padding: 16,
  },
  headerInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0284C7',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  availableBadge: {
    backgroundColor: '#ECFDF5',
  },
  unavailableBadge: {
    backgroundColor: '#FEF2F2',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '700',
  },
  availableText: {
    color: '#059669',
  },
  unavailableText: {
    color: '#DC2626',
  },
  dishName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 10,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#EA580C',
  },
  timeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeTagText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  descriptionBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#334155',
    lineHeight: 22,
  },
  dbInfoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
  },
  dbInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  dbInfoTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  dbInfoText: {
    fontSize: 11,
    fontFamily: 'monospace',
    color: '#475569',
    marginBottom: 2,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notFoundText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 12,
    marginBottom: 16,
  },
  backBtn: {
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
