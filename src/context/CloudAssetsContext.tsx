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
  cloudEntryToAsset,
  fetchCloudGallery,
  uploadToCloud,
  type CloudUploadInput,
} from "../utils/cloudAssets";
import {
  clearStoredUploadKey,
  fetchAuthStatus,
  validateUploadKey,
  type AuthStatus,
} from "../utils/uploadAuth";

interface CloudAssetsContextValue {
  cloudAssets: FamilyAsset[];
  cloudAvailable: boolean;
  authStatus: AuthStatus;
  loading: boolean;
  refreshCloud: () => Promise<void>;
  unlockUpload: (key: string) => Promise<boolean>;
  lockUpload: () => void;
  uploadCloud: (input: CloudUploadInput) => Promise<{ ok: boolean; error?: string; code?: string }>;
}

const defaultAuth: AuthStatus = {
  authRequired: false,
  blobAvailable: false,
  authenticated: false,
};

const CloudAssetsContext = createContext<CloudAssetsContextValue | null>(null);

export function CloudAssetsProvider({ children }: { children: ReactNode }) {
  const [cloudAssets, setCloudAssets] = useState<FamilyAsset[]>([]);
  const [cloudAvailable, setCloudAvailable] = useState(false);
  const [authStatus, setAuthStatus] = useState<AuthStatus>(defaultAuth);
  const [loading, setLoading] = useState(true);

  const refreshCloud = useCallback(async () => {
    setLoading(true);
    try {
      const [gallery, auth] = await Promise.all([fetchCloudGallery(), fetchAuthStatus()]);
      setCloudAvailable(gallery.available);
      setCloudAssets(gallery.entries.map(cloudEntryToAsset));
      setAuthStatus(auth);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCloud();
  }, [refreshCloud]);

  const unlockUpload = useCallback(async (key: string) => {
    const ok = await validateUploadKey(key);
    if (ok) {
      await refreshCloud();
    }
    return ok;
  }, [refreshCloud]);

  const lockUpload = useCallback(() => {
    clearStoredUploadKey();
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
    () => ({
      cloudAssets,
      cloudAvailable,
      authStatus,
      loading,
      refreshCloud,
      unlockUpload,
      lockUpload,
      uploadCloud,
    }),
    [cloudAssets, cloudAvailable, authStatus, loading, refreshCloud, unlockUpload, lockUpload, uploadCloud]
  );

  return <CloudAssetsContext.Provider value={value}>{children}</CloudAssetsContext.Provider>;
}

export function useCloudAssets(): CloudAssetsContextValue {
  const ctx = useContext(CloudAssetsContext);
  if (!ctx) throw new Error("useCloudAssets must be used within CloudAssetsProvider");
  return ctx;
}
