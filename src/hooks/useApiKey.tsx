import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const API_KEY_STORAGE = '@promptgenius_api_key';

interface ApiKeyContextValue {
  apiKey: string | null;
  isLoading: boolean;
  setKey: (key: string) => Promise<void>;
  clearKey: () => Promise<void>;
}

const ApiKeyContext = createContext<ApiKeyContextValue>({
  apiKey: null,
  isLoading: true,
  setKey: async () => {},
  clearKey: async () => {},
});

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(API_KEY_STORAGE)
      .then((stored) => {
        setApiKey(stored);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setKey = useCallback(async (key: string) => {
    await AsyncStorage.setItem(API_KEY_STORAGE, key);
    setApiKey(key);
  }, []);

  const clearKey = useCallback(async () => {
    await AsyncStorage.removeItem(API_KEY_STORAGE);
    setApiKey(null);
  }, []);

  return (
    <ApiKeyContext.Provider value={{ apiKey, isLoading, setKey, clearKey }}>
      {children}
    </ApiKeyContext.Provider>
  );
}

export function useApiKey() {
  return useContext(ApiKeyContext);
}
