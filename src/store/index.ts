import Storage from 'react-native-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 不设置过期时间默认永远不会过期
 */
export default new Storage({
  // Use AsyncStorage for RN apps, or window.localStorage for web apps.
  // If storageBackend is not set, data will be lost after reload.
  storageBackend: AsyncStorage,
  // cache data in the memory. default is true.
  enableCache: true,
});
