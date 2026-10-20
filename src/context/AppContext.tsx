import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  BIT240197_Dish,
  BIT240197_DishCategory,
  FilterState,
  SupportedLanguage,
} from '../types';
import { StorageService, DEFAULT_FILTER_STATE } from '../services/storageService';
import { syncManager } from '../services/syncService';
import { translations } from '../i18n/translations';

interface AppContextType {
  dishes: BIT240197_Dish[];
  categories: BIT240197_DishCategory[];
  language: SupportedLanguage;
  filterState: FilterState;
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  isSimulatedOffline: boolean;
  
  // Translation function
  t: (key: string, params?: Record<string, string | number>) => string;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  
  // Dish actions
  addDish: (dishData: Omit<BIT240197_Dish, 'BIT240197_Id'>) => Promise<{ success: boolean; error?: string }>;
  updateDish: (dish: BIT240197_Dish) => Promise<{ success: boolean; error?: string }>;
  deleteDish: (id: string) => Promise<{ success: boolean }>;
  
  // Category actions
  addCategory: (catData: Omit<BIT240197_DishCategory, 'BIT240197_Id'>) => Promise<{ success: boolean; error?: string }>;
  deleteCategory: (id: string) => Promise<{ success: boolean; error?: string }>;
  
  // Filter actions
  setFilterState: (newFilter: Partial<FilterState>) => Promise<void>;
  resetFilterState: () => Promise<void>;
  
  // Offline toggle
  setSimulatedOffline: (val: boolean) => Promise<void>;
  
  // Refresh data
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [dishes, setDishes] = useState<BIT240197_Dish[]>([]);
  const [categories, setCategories] = useState<BIT240197_DishCategory[]>([]);
  const [language, setLanguageState] = useState<SupportedLanguage>('en'); // Default is English per exam!
  const [filterState, setFilterStateInternal] = useState<FilterState>(DEFAULT_FILTER_STATE);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);

  // Initialize app data
  useEffect(() => {
    const init = async () => {
      const [savedLang, savedFilter, loadedCategories, loadedDishes] = await Promise.all([
        StorageService.getLanguage(),
        StorageService.getFilterState(),
        StorageService.getCategories(),
        StorageService.getDishes(),
      ]);

      setLanguageState(savedLang);
      setFilterStateInternal(savedFilter);
      setCategories(loadedCategories);
      setDishes(loadedDishes);
    };

    init();

    // Subscribe to SyncManager
    const unsubscribe = syncManager.subscribe((status) => {
      setIsOnline(status.isOnline);
      setIsSyncing(status.isSyncing);
      setPendingCount(status.pendingCount);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = (translations[language] || translations.en) as Record<string, string>;
    let text = dict[key] || translations.en[key as keyof typeof translations.en] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  const setLanguage = async (newLang: SupportedLanguage) => {
    setLanguageState(newLang);
    await StorageService.saveLanguage(newLang);
  };

  const setFilterState = async (updates: Partial<FilterState>) => {
    const updated = { ...filterState, ...updates };
    setFilterStateInternal(updated);
    await StorageService.saveFilterState(updated);
  };

  const resetFilterState = async () => {
    setFilterStateInternal(DEFAULT_FILTER_STATE);
    await StorageService.saveFilterState(DEFAULT_FILTER_STATE);
  };

  const setSimulatedOffline = async (offline: boolean) => {
    setIsSimulatedOffline(offline);
    await syncManager.setSimulatedOffline(offline);
  };

  const refreshData = async () => {
    const [c, d] = await Promise.all([
      StorageService.getCategories(),
      StorageService.getDishes(),
    ]);
    setCategories(c);
    setDishes(d);
  };

  // Dish Validation
  const validateDish = (
    data: Omit<BIT240197_Dish, 'BIT240197_Id'>,
    currentId?: string
  ): { valid: boolean; error?: string } => {
    if (!data.BIT240197_Name || !data.BIT240197_Name.trim()) {
      return { valid: false, error: t('nameRequired') };
    }
    if (isNaN(data.BIT240197_Price) || data.BIT240197_Price <= 0) {
      return { valid: false, error: t('priceInvalid') };
    }
    if (isNaN(data.BIT240197_PreparationTime) || data.BIT240197_PreparationTime <= 0) {
      return { valid: false, error: t('prepTimeInvalid') };
    }
    if (!data.BIT240197_DishCategoryId) {
      return { valid: false, error: t('categoryRequired') };
    }
    // Check unique name in same category
    const normalizedName = data.BIT240197_Name.trim().toLowerCase();
    const isDuplicate = dishes.some(
      (d) =>
        d.BIT240197_DishCategoryId === data.BIT240197_DishCategoryId &&
        d.BIT240197_Name.trim().toLowerCase() === normalizedName &&
        d.BIT240197_Id !== currentId
    );
    if (isDuplicate) {
      return { valid: false, error: t('duplicateNameInCategory') };
    }
    return { valid: true };
  };

  const addDish = async (
    dishData: Omit<BIT240197_Dish, 'BIT240197_Id'>
  ): Promise<{ success: boolean; error?: string }> => {
    const val = validateDish(dishData);
    if (!val.valid) return { success: false, error: val.error };

    // Ensure thumbnail logic: exactly 1 thumbnail if images exist
    const images = [...dishData.BIT240197_DishImage];
    const hasThumbnail = images.some((img) => img.BIT240197_IsThumbnail);
    if (!hasThumbnail && images.length > 0) {
      images[0].BIT240197_IsThumbnail = true;
    }

    const newDish: BIT240197_Dish = {
      ...dishData,
      BIT240197_Id: `dish_${Date.now()}`,
      BIT240197_DishImage: images,
    };

    const updated = [newDish, ...dishes];
    setDishes(updated);
    await StorageService.saveDishes(updated);

    // Enqueue for auto-sync with MockAPI
    await syncManager.enqueueChange({
      table: 'BIT240197_Dish',
      action: 'CREATE',
      recordId: newDish.BIT240197_Id,
      data: newDish,
    });

    return { success: true };
  };

  const updateDish = async (
    dish: BIT240197_Dish
  ): Promise<{ success: boolean; error?: string }> => {
    const val = validateDish(dish, dish.BIT240197_Id);
    if (!val.valid) return { success: false, error: val.error };

    // Ensure thumbnail logic
    const images = [...dish.BIT240197_DishImage];
    const hasThumbnail = images.some((img) => img.BIT240197_IsThumbnail);
    if (!hasThumbnail && images.length > 0) {
      images[0].BIT240197_IsThumbnail = true;
    }

    const updatedDish = { ...dish, BIT240197_DishImage: images };
    const updated = dishes.map((d) => (d.BIT240197_Id === dish.BIT240197_Id ? updatedDish : d));
    setDishes(updated);
    await StorageService.saveDishes(updated);

    // Enqueue for auto-sync with MockAPI
    await syncManager.enqueueChange({
      table: 'BIT240197_Dish',
      action: 'UPDATE',
      recordId: dish.BIT240197_Id,
      data: updatedDish,
    });

    return { success: true };
  };

  const deleteDish = async (id: string): Promise<{ success: boolean }> => {
    const updated = dishes.filter((d) => d.BIT240197_Id !== id);
    setDishes(updated);
    await StorageService.saveDishes(updated);

    // Enqueue for auto-sync with MockAPI
    await syncManager.enqueueChange({
      table: 'BIT240197_Dish',
      action: 'DELETE',
      recordId: id,
    });

    return { success: true };
  };

  const addCategory = async (
    catData: Omit<BIT240197_DishCategory, 'BIT240197_Id'>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!catData.BIT240197_Name.trim()) {
      return { success: false, error: t('nameRequired') };
    }

    const newCat: BIT240197_DishCategory = {
      ...catData,
      BIT240197_Id: `cat_${Date.now()}`,
    };

    const updated = [...categories, newCat];
    setCategories(updated);
    await StorageService.saveCategories(updated);

    await syncManager.enqueueChange({
      table: 'BIT240197_DishCategory',
      action: 'CREATE',
      recordId: newCat.BIT240197_Id,
      data: newCat,
    });

    return { success: true };
  };

  const deleteCategory = async (id: string): Promise<{ success: boolean; error?: string }> => {
    // Constraint check: do not delete if dishes are using it
    const inUseCount = dishes.filter((d) => d.BIT240197_DishCategoryId === id).length;
    if (inUseCount > 0) {
      return {
        success: false,
        error: t('cannotDeleteCategoryInUse', { count: inUseCount }),
      };
    }

    const updated = categories.filter((c) => c.BIT240197_Id !== id);
    setCategories(updated);
    await StorageService.saveCategories(updated);

    await syncManager.enqueueChange({
      table: 'BIT240197_DishCategory',
      action: 'DELETE',
      recordId: id,
    });

    return { success: true };
  };

  return (
    <AppContext.Provider
      value={{
        dishes,
        categories,
        language,
        filterState,
        isOnline,
        isSyncing,
        pendingCount,
        isSimulatedOffline,
        t,
        setLanguage,
        addDish,
        updateDish,
        deleteDish,
        addCategory,
        deleteCategory,
        setFilterState,
        resetFilterState,
        setSimulatedOffline,
        refreshData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
