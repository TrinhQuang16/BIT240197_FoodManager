import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BIT240197_Dish, BIT240197_DishCategory } from '../types';
import { useApp } from '../context/AppContext';

interface DishCardProps {
  dish: BIT240197_Dish;
  category?: BIT240197_DishCategory;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const DishCard: React.FC<DishCardProps> = ({
  dish,
  category,
  onPress,
  onEdit,
  onDelete,
}) => {
  const { t } = useApp();

  // Find thumbnail or first image
  const thumbnail =
    dish.BIT240197_DishImage.find((img) => img.BIT240197_IsThumbnail)?.BIT240197_ImageUrl ||
    dish.BIT240197_DishImage[0]?.BIT240197_ImageUrl;

  const isQuick = dish.BIT240197_PreparationTime <= 15;
  const imageCount = dish.BIT240197_DishImage.length;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Dish Image */}
      <View style={styles.imageContainer}>
        {thumbnail ? (
          <Image source={{ uri: thumbnail }} style={styles.image} resizeMode="cover" />
        ) : (
          <View style={styles.placeholderImage}>
            <Ionicons name="fast-food-outline" size={36} color="#94A3B8" />
          </View>
        )}

        {/* Image count badge */}
        {imageCount > 1 && (
          <View style={styles.imageBadge}>
            <Ionicons name="images-outline" size={11} color="#FFFFFF" />
            <Text style={styles.imageBadgeText}>{imageCount}</Text>
          </View>
        )}

        {/* Preparation Time Badge: Quick vs Regular */}
        <View style={[styles.prepBadge, isQuick ? styles.quickBadge : styles.regularBadge]}>
          <Ionicons
            name={isQuick ? 'flash' : 'time-outline'}
            size={11}
            color={isQuick ? '#065F46' : '#1E40AF'}
          />
          <Text style={[styles.prepBadgeText, isQuick ? styles.quickText : styles.regularText]}>
            {isQuick ? t('quickBadge') : t('regularBadge')}
          </Text>
        </View>
      </View>

      {/* Dish Info */}
      <View style={styles.infoContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.categoryName} numberOfLines={1}>
            {category ? category.BIT240197_Name : t('category')}
          </Text>
          {/* Availability Status */}
          <View
            style={[
              styles.statusChip,
              dish.BIT240197_IsAvailable ? styles.availableChip : styles.unavailableChip,
            ]}
          >
            <Text
              style={[
                styles.statusChipText,
                dish.BIT240197_IsAvailable ? styles.availableText : styles.unavailableText,
              ]}
            >
              {dish.BIT240197_IsAvailable ? t('available') : t('unavailable')}
            </Text>
          </View>
        </View>

        <Text style={styles.dishName} numberOfLines={2}>
          {dish.BIT240197_Name}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {dish.BIT240197_Description || '—'}
        </Text>

        <View style={styles.bottomRow}>
          <View>
            <Text style={styles.priceLabel}>{t('price')}</Text>
            <Text style={styles.priceValue}>
              {dish.BIT240197_Price.toLocaleString('vi-VN')} đ
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={onEdit}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="create-outline" size={18} color="#0284C7" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionBtn, styles.deleteActionBtn]}
              onPress={onDelete}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  imageBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  imageBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  prepBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  quickBadge: {
    backgroundColor: '#D1FAE5',
  },
  regularBadge: {
    backgroundColor: '#DBEAFE',
  },
  prepBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  quickText: {
    color: '#065F46',
  },
  regularText: {
    color: '#1E40AF',
  },
  infoContainer: {
    padding: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  statusChip: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  availableChip: {
    backgroundColor: '#ECFDF5',
  },
  unavailableChip: {
    backgroundColor: '#FEF2F2',
  },
  statusChipText: {
    fontSize: 10,
    fontWeight: '700',
  },
  availableText: {
    color: '#059669',
  },
  unavailableText: {
    color: '#DC2626',
  },
  dishName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginBottom: 10,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceLabel: {
    fontSize: 10,
    color: '#94A3B8',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#EA580C',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteActionBtn: {
    backgroundColor: '#FEF2F2',
  },
});
