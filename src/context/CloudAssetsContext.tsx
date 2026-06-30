import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { FamilyAsset } from "../types";
import {
  checkCloudAvailable,
  cloudEntryToAsset,
  fetchCloudGallery,
  uploadToCloud,
  type CloudUploadInput,
} from "../utils/cloudAssets";

interface CloudAssetsContextValue {
  cloudAssets: FamilyAsset[];
  cloudAvailable: boolean;
  loading: boolean;
  refreshCloud: () => Promise<void>;
  uploadCloud: (input: CloudUploadInput) => Promise<{ ok: boolean; error?: string }>;
}

const CloudAssetsContext = createContext<CloudAssetsContextValue | null>(null);

export function CloudAssetsProvider({ children }: { children: ReactNode }) {
  const [cloudAssets, setCloudAssets] = useState<FamilyAsset[]>([]);
  const [cloudAvailable, setCloudAvailable] = useState(false);
  const [loading, setLoading] = useState(true);

  const refreshCloud = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCloudGallery();
      setCloudAvailable(data.available);
      setCloudAssets(data.entries.map(cloudEntryToAsset));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCloud();
  }, [refreshCloud]);

  const uploadCloud = useCallback(
    async (input: CloudUploadInput) => {
      const result = await uploadToCloud(input);
      if (result.ok) {
        await refreshCloud();
        return { ok: true };
      }
      return { ok: false, error: result.error, code: result.code };
    },
    [refreshCloud]
  );

  const value = useMemo(
    () => ({ cloudAssets, cloudAvailable, loading, refreshCloud, uploadCloud }),
    [cloudAssets, cloudAvailable, loading, refreshCloud, uploadCloud]
  );

  return <CloudAssetsContext.Provider value={value}>{children}</CloudAssetsContext.Provider>;
}

export function useCloudAssets(): CloudAssetsContextValue {
  const ctx = useContext(CloudAssetsContext);
  if (!ctx) throw new Error("useCloudAssets must be used within CloudAssetsProvider");
  return ctx;
}

export function useCloudAvailableOnMount(): boolean {
  const [available, setAvailable] = useState(false);
  useEffect(() => {
    checkCloudAvailable().then(setAvailable);
  }, []);
  return available;
}
