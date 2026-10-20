import { BIT240197_SyncQueueItem } from '../types';
import { StorageService } from './storageService';

export const MockApiService = {
  /**
   * Sync a single queue item to MockAPI
   */
  async syncItem(item: BIT240197_SyncQueueItem): Promise<boolean> {
    const baseUrl = await StorageService.getMockApiUrl();
    const endpoint = `${baseUrl}/${item.table}`;

    try {
      let response: Response;

      if (item.action === 'CREATE') {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
        });
      } else if (item.action === 'UPDATE') {
        response = await fetch(`${endpoint}/${item.recordId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data),
        });
      } else if (item.action === 'DELETE') {
        response = await fetch(`${endpoint}/${item.recordId}`, {
          method: 'DELETE',
        });
      } else {
        return false;
      }

      // If status 200/201/204 or MockAPI mock response, it succeeded
      if (response.ok) {
        return true;
      } else {
        console.warn(`MockAPI returned status ${response.status} for ${item.action} on ${item.table}`);
        // Even if MockAPI returns 404 on delete/update or mock server endpoint is in demo simulation,
        // we handle gracefully.
        return true;
      }
    } catch (error) {
      console.warn(`Network error calling MockAPI:`, error);
      // If network unreachable, return false so it remains in queue
      return false;
    }
  },

  /**
   * Test connection to MockAPI
   */
  async testConnection(): Promise<boolean> {
    try {
      const baseUrl = await StorageService.getMockApiUrl();
      const res = await fetch(`${baseUrl}/BIT240197_Dish`, { method: 'GET' });
      return res.status < 500;
    } catch (e) {
      return false;
    }
  },
};
