import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { StorageService } from './storageService';
import { MockApiService } from './mockApiService';

type SyncStatusListener = (status: {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncedAt?: number;
}) => void;

class SyncManager {
  private isOnline: boolean = true;
  private isSimulatedOffline: boolean = false;
  private isSyncing: boolean = false;
  private listeners: Set<SyncStatusListener> = new Set();
  private lastSyncedAt?: number;

  constructor() {
    this.initNetworkListener();
  }

  private initNetworkListener() {
    // Listen to real device network changes
    NetInfo.addEventListener((state: NetInfoState) => {
      const realOnline = Boolean(state.isConnected && state.isInternetReachable !== false);
      const effectiveOnline = realOnline && !this.isSimulatedOffline;

      const becameOnline = !this.isOnline && effectiveOnline;
      this.isOnline = effectiveOnline;

      this.notifyListeners();

      // REQUIREMENT 5: When internet is restored, AUTOMATICALLY sync without pressing any button!
      if (becameOnline) {
        this.processSyncQueue();
      }
    });
  }

  public subscribe(listener: SyncStatusListener) {
    this.listeners.add(listener);
    // emit initial status
    this.notifyStatus(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private async notifyListeners() {
    const queue = await StorageService.getSyncQueue();
    const status = {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: queue.length,
      lastSyncedAt: this.lastSyncedAt,
    };
    this.listeners.forEach((l) => l(status));
  }

  private async notifyStatus(listener: SyncStatusListener) {
    const queue = await StorageService.getSyncQueue();
    listener({
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingCount: queue.length,
      lastSyncedAt: this.lastSyncedAt,
    });
  }

  /**
   * Toggle simulated offline mode (ideal for demoing without dropping Expo connection)
   */
  public async setSimulatedOffline(offline: boolean) {
    this.isSimulatedOffline = offline;
    const netState = await NetInfo.fetch();
    const realOnline = Boolean(netState.isConnected && netState.isInternetReachable !== false);
    const effectiveOnline = realOnline && !offline;

    const becameOnline = !this.isOnline && effectiveOnline;
    this.isOnline = effectiveOnline;

    this.notifyListeners();

    if (becameOnline) {
      this.processSyncQueue();
    }
  }

  public getIsOnline(): boolean {
    return this.isOnline;
  }

  public getIsSimulatedOffline(): boolean {
    return this.isSimulatedOffline;
  }

  /**
   * Process pending sync queue automatically when online
   */
  public async processSyncQueue(): Promise<void> {
    if (!this.isOnline || this.isSyncing) {
      return;
    }

    const queue = await StorageService.getSyncQueue();
    if (queue.length === 0) {
      return;
    }

    this.isSyncing = true;
    this.notifyListeners();

    try {
      // Process items in FIFO order
      for (const item of queue) {
        const success = await MockApiService.syncItem(item);
        if (success) {
          await StorageService.removeSyncQueueItem(item.id);
        } else {
          // If network call fails midway, break and retry next time
          break;
        }
      }
      this.lastSyncedAt = Date.now();
    } catch (e) {
      console.error('Error during auto-sync process:', e);
    } finally {
      this.isSyncing = false;
      this.notifyListeners();
    }
  }

  /**
   * Enqueue an action. If currently online, attempts immediate background sync.
   * If offline, stores in queue to auto-sync once online.
   */
  public async enqueueChange(item: {
    table: 'BIT240197_Dish' | 'BIT240197_DishCategory';
    action: 'CREATE' | 'UPDATE' | 'DELETE';
    recordId: string;
    data?: any;
  }): Promise<void> {
    await StorageService.addToSyncQueue(item);
    this.notifyListeners();

    // If online, immediately auto-sync
    if (this.isOnline) {
      this.processSyncQueue();
    }
  }
}

export const syncManager = new SyncManager();
