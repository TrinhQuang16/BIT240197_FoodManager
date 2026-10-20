import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BIT240197_Dish,
  BIT240197_DishCategory,
  BIT240197_SyncQueueItem,
  FilterState,
  SupportedLanguage
} from '../types';

// STORAGE KEYS with strict MSSV prefix
export const STORAGE_KEYS = {
  CATEGORIES: '@BIT240197_DishCategory',
  DISHES: '@BIT240197_Dish',
  SYNC_QUEUE: '@BIT240197_SyncQueue',
  LANGUAGE: '@BIT240197_Language',
  FILTER_STATE: '@BIT240197_FilterState',
  MOCK_API_URL: '@BIT240197_MockApiUrl',
};

// Initial Seed Data (Minimum 3 categories, 5 dishes)
export const INITIAL_CATEGORIES: BIT240197_DishCategory[] = [
  {
    BIT240197_Id: 'cat_1',
    BIT240197_Name: 'Khai vị (Appetizers)',
    BIT240197_Description: 'Món ăn nhẹ mở đầu bữa tiệc / Light starters',
  },
  {
    BIT240197_Id: 'cat_2',
    BIT240197_Name: 'Món chính (Main Courses)',
    BIT240197_Description: 'Món ăn no đặc sắc đậm đà / Signature hearty dishes',
  },
  {
    BIT240197_Id: 'cat_3',
    BIT240197_Name: 'Tráng miệng & Đồ uống (Desserts & Drinks)',
    BIT240197_Description: 'Chè ngọt thanh và nước uống giải khát / Refreshing sweets & beverages',
  },
];

export const INITIAL_DISHES: BIT240197_Dish[] = [
  {
    BIT240197_Id: 'dish_1',
    BIT240197_Name: 'Phở Bò Đặc Biệt',
    BIT240197_Price: 65000,
    BIT240197_PreparationTime: 12, // Quick (<= 15 min)
    BIT240197_IsAvailable: true,
    BIT240197_Description: 'Bánh phở tươi mềm, nước dùng hầm xương 24h thơm mùi quế hồi và nạm bò tái lăn.',
    BIT240197_DishCategoryId: 'cat_2',
    BIT240197_DishImage: [
      {
        BIT240197_ImageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800',
        BIT240197_IsThumbnail: true,
      },
      {
        BIT240197_ImageUrl: 'https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=800',
        BIT240197_IsThumbnail: false,
      },
    ],
  },
  {
    BIT240197_Id: 'dish_2',
    BIT240197_Name: 'Bún Chả Hà Nội',
    BIT240197_Price: 55000,
    BIT240197_PreparationTime: 20, // Regular (> 15 min)
    BIT240197_IsAvailable: true,
    BIT240197_Description: 'Chả thịt nướng than hoa vàng rượm ăn kèm bún tươi, nước mắm dưa góp và rau thơm.',
    BIT240197_DishCategoryId: 'cat_2',
    BIT240197_DishImage: [
      {
        BIT240197_ImageUrl: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=800',
        BIT240197_IsThumbnail: true,
      },
    ],
  },
  {
    BIT240197_Id: 'dish_3',
    BIT240197_Name: 'Gỏi Cuốn Tôm Thịt',
    BIT240197_Price: 40000,
    BIT240197_PreparationTime: 10, // Quick (<= 15 min)
    BIT240197_IsAvailable: true,
    BIT240197_Description: 'Tôm luộc, thịt ba chỉ, bún tươi và hẹ cuốn bánh tráng dẻo chấm sốt tương đậu phộng.',
    BIT240197_DishCategoryId: 'cat_1',
    BIT240197_DishImage: [
      {
        BIT240197_ImageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800',
        BIT240197_IsThumbnail: true,
      },
      {
        BIT240197_ImageUrl: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800',
        BIT240197_IsThumbnail: false,
      },
    ],
  },
  {
    BIT240197_Id: 'dish_4',
    BIT240197_Name: 'Chả Giò Rế Hải Sản',
    BIT240197_Price: 45000,
    BIT240197_PreparationTime: 18, // Regular (> 15 min)
    BIT240197_IsAvailable: false, // Ngừng bán (Unavailable) - for testing filter!
    BIT240197_Description: 'Bánh tráng rế giòn rụm bọc nhân tôm cua, khoai môn và mộc nhĩ chấm sốt chua ngọt.',
    BIT240197_DishCategoryId: 'cat_1',
    BIT240197_DishImage: [
      {
        BIT240197_ImageUrl: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=800',
        BIT240197_IsThumbnail: true,
      },
    ],
  },
  {
    BIT240197_Id: 'dish_5',
    BIT240197_Name: 'Chè Khúc Bạch Hạnh Nhân',
    BIT240197_Price: 35000,
    BIT240197_PreparationTime: 8, // Quick (<= 15 min)
    BIT240197_IsAvailable: true,
    BIT240197_Description: 'Những viên khúc bạch béo ngậy vị sữa hạnh nhân, vải thiều ngọt thanh và hạnh nhân lát rang.',
    BIT240197_DishCategoryId: 'cat_3',
    BIT240197_DishImage: [
      {
        BIT240197_ImageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800',
        BIT240197_IsThumbnail: true,
      },
    ],
  },
];

export const DEFAULT_FILTER_STATE: FilterState = {
  searchQuery: '',
  selectedCategoryId: 'all',
  onlyAvailable: false,
  minPrice: '',
  maxPrice: '',
  sortBy: 'default',
};

export const StorageService = {
  // Load Categories (init with seed data if not present)
  async getCategories(): Promise<BIT240197_DishCategory[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES);
      if (data) {
        return JSON.parse(data);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
      return INITIAL_CATEGORIES;
    } catch (e) {
      console.error('Error reading categories:', e);
      return INITIAL_CATEGORIES;
    }
  },

  async saveCategories(categories: BIT240197_DishCategory[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  },

  // Load Dishes (init with seed data if not present)
  async getDishes(): Promise<BIT240197_Dish[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.DISHES);
      if (data) {
        return JSON.parse(data);
      }
      await AsyncStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(INITIAL_DISHES));
      return INITIAL_DISHES;
    } catch (e) {
      console.error('Error reading dishes:', e);
      return INITIAL_DISHES;
    }
  },

  async saveDishes(dishes: BIT240197_Dish[]): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.DISHES, JSON.stringify(dishes));
  },

  // Language (default 'en')
  async getLanguage(): Promise<SupportedLanguage> {
    try {
      const lang = await AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE);
      return (lang as SupportedLanguage) || 'en';
    } catch (e) {
      return 'en';
    }
  },

  async saveLanguage(lang: SupportedLanguage): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  },

  // Filter State persistence
  async getFilterState(): Promise<FilterState> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.FILTER_STATE);
      return data ? JSON.parse(data) : DEFAULT_FILTER_STATE;
    } catch (e) {
      return DEFAULT_FILTER_STATE;
    }
  },

  async saveFilterState(filter: FilterState): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.FILTER_STATE, JSON.stringify(filter));
  },

  // Sync Queue for Offline-first operations
  async getSyncQueue(): Promise<BIT240197_SyncQueueItem[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  async addToSyncQueue(item: Omit<BIT240197_SyncQueueItem, 'id' | 'timestamp'>): Promise<void> {
    const queue = await this.getSyncQueue();
    const newItem: BIT240197_SyncQueueItem = {
      ...item,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: Date.now(),
    };
    queue.push(newItem);
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  },

  async removeSyncQueueItem(id: string): Promise<void> {
    const queue = await this.getSyncQueue();
    const updated = queue.filter(item => item.id !== id);
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(updated));
  },

  async clearSyncQueue(): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify([]));
  },

  // MockAPI URL setting
  async getMockApiUrl(): Promise<string> {
    const url = await AsyncStorage.getItem(STORAGE_KEYS.MOCK_API_URL);
    return url || 'https://67b557b707ba6e59083fecf0.mockapi.io/api/v1'; // Default realistic endpoint
  },

  async saveMockApiUrl(url: string): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.MOCK_API_URL, url.trim());
  },
};
