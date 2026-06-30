import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AssetType, ContributionDraft } from "../types";
import { useCloudAssets } from "./CloudAssetsContext";
import {
  deleteContribution,
  exportContributionPackage,
  listContributions,
  saveContribution,
} from "../utils/contributionStore";

interface AddContributionInput {
  personId: string;
  personName: string;
  title: string;
  type: AssetType;
  caption: string;
  uploadedBy: string;
  file: File;
}

interface AddContributionResult {
  destination: "cloud" | "local";
  fallback?: boolean;
  error?: string;
  code?: string;
}

interface ContributionsContextValue {
  contributions: ContributionDraft[];
  loading: boolean;
  cloudAvailable: boolean;
  addContribution: (input: AddContributionInput) => Promise<AddContributionResult>;
  removeContribution: (id: string) => Promise<void>;
  exportAll: () => Promise<void>;
  refresh: () => Promise<void>;
}

const ContributionsContext = createContext<ContributionsContextValue | null>(null);

export function ContributionsProvider({ children }: { children: ReactNode }) {
  const { uploadCloud, cloudAvailable } = useCloudAssets();
  const [contributions, setContributions] = useState<ContributionDraft[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setContributions(await listContributions());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addContribution = useCallback(
    async (input: AddContributionInput): Promise<AddContributionResult> => {
      if (cloudAvailable) {
        const result = await uploadCloud(input);
        if (result.ok) {
          return { destination: "cloud" };
        }
        if (result.code === "AUTH_REQUIRED") {
          return { destination: "local", error: result.error, code: result.code };
        }
      }

      const draft: ContributionDraft = {
        id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        personId: input.personId,
        personName: input.personName,
        title: input.title.trim() || input.file.name,
        type: input.type,
        caption: input.caption.trim(),
        uploadedBy: input.uploadedBy.trim(),
        fileName: input.file.name,
        mimeType: input.file.type || "application/octet-stream",
        blob: input.file,
        createdAt: new Date().toISOString(),
      };
      await saveContribution(draft);
      await refresh();
      return { destination: "local", fallback: cloudAvailable };
    },
    [cloudAvailable, uploadCloud, refresh]
  );

  const removeContribution = useCallback(
    async (id: string) => {
      await deleteContribution(id);
      await refresh();
    },
    [refresh]
  );

  const exportAll = useCallback(async () => {
    const list = await listContributions();
    if (list.length === 0) return;
    await exportContributionPackage(list);
  }, []);

  const value = useMemo(
    () => ({
      contributions,
      loading,
      cloudAvailable,
      addContribution,
      removeContribution,
      exportAll,
      refresh,
    }),
    [contributions, loading, cloudAvailable, addContribution, removeContribution, exportAll, refresh]
  );

  return (
    <ContributionsContext.Provider value={value}>{children}</ContributionsContext.Provider>
  );
}

export function useContributions(): ContributionsContextValue {
  const ctx = useContext(ContributionsContext);
  if (!ctx) throw new Error("useContributions must be used within ContributionsProvider");
  return ctx;
}
