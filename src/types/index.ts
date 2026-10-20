export interface BIT240197_DishImage {
  BIT240197_ImageUrl: string;
  BIT240197_IsThumbnail: boolean;
}

export interface BIT240197_DishCategory {
  BIT240197_Id: string;
  BIT240197_Name: string;
  BIT240197_Description: string;
}

export interface BIT240197_Dish {
  BIT240197_Id: string;
  BIT240197_Name: string;
  BIT240197_Price: number;
  BIT240197_PreparationTime: number; // In minutes
  BIT240197_IsAvailable: boolean;
  BIT240197_Description: string;
  BIT240197_DishCategoryId: string;
  BIT240197_DishImage: BIT240197_DishImage[];
}

export type BIT240197_SyncAction = 'CREATE' | 'UPDATE' | 'DELETE';
export type BIT240197_TableName = 'BIT240197_Dish' | 'BIT240197_DishCategory';

export interface BIT240197_SyncQueueItem {
  id: string;
  table: BIT240197_TableName;
  action: BIT240197_SyncAction;
  recordId: string;
  data?: any;
  timestamp: number;
}

export type SupportedLanguage = 'en' | 'vi';

export type SortOption = 'default' | 'price_asc' | 'price_desc' | 'prep_asc';

export interface FilterState {
  searchQuery: string;
  selectedCategoryId: string; // 'all' or specific category ID
  onlyAvailable: boolean;
  minPrice: string;
  maxPrice: string;
  sortBy: SortOption;
}
