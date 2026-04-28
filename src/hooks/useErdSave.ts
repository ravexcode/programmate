import { useCallback, useState } from "react";
import type { ERDTable } from "@/types/team.types";

interface ConnectionType {
  connector: { table: string; row: string };
  connected: { table: string; row: string };
  type: "oto" | "mto" | "mtm";
}

interface SaveResponse {
  message: string;
  data?: {
    id: string;
    team_id: string;
    tables: ERDTable[];
    connections: ConnectionType[];
    created_at: string;
    updated_at: string;
  };
}

interface UseErdSaveReturn {
  isSaving: boolean;
  error: string | null;
  lastSaved: Date | null;
  saveErd: (
    teamId: string,
    tables: ERDTable[],
    connections: ConnectionType[]
  ) => Promise<SaveResponse | null>;
  loadErd: (teamId: string) => Promise<{
    tables: ERDTable[];
    connections: ConnectionType[];
  } | null>;
}

/**
 * Custom hook for managing ERD save/load operations
 * Handles API communication with the ERD endpoint
 */
export function useErdSave() {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const getAuthToken = useCallback(async () => {
    try {
      // Try to get token from session storage first (most common for Supabase)
      const sessionData = typeof window !== "undefined" ? sessionStorage.getItem("sb-session") : null;
      
      if (sessionData) {
        const session = JSON.parse(sessionData);
        return session.access_token;
      }

      // Fallback to localStorage
      const localData = typeof window !== "undefined" ? localStorage.getItem("sb-session") : null;
      if (localData) {
        const session = JSON.parse(localData);
        return session.access_token;
      }

      // If no token found, throw error
      throw new Error("No authentication session found");
    } catch (err) {
      console.error("Failed to retrieve auth token:", err);
      throw new Error("Authentication required");
    }
  }, []);

  const saveErd = useCallback(
    async (
      teamId: string,
      tables: ERDTable[],
      connections: ConnectionType[]
    ): Promise<SaveResponse | null> => {
      setIsSaving(true);
      setError(null);

      try {
        const token = await getAuthToken();

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`/api/teams/${teamId}/erd`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tables,
            connections,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to save ERD");
        }

        const data: SaveResponse = await response.json();
        setLastSaved(new Date());
        return data;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("ERD save error:", err);
        return null;
      } finally {
        setIsSaving(false);
      }
    },
    [getAuthToken]
  );

  const loadErd = useCallback(
    async (
      teamId: string
    ): Promise<{ tables: ERDTable[]; connections: ConnectionType[] } | null> => {
      setError(null);

      try {
        const token = await getAuthToken();

        if (!token) {
          throw new Error("Authentication required");
        }

        const response = await fetch(`/api/teams/${teamId}/erd`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to load ERD");
        }

        const data = await response.json();
        return {
          tables: data.tables || [],
          connections: data.connections || [],
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        console.error("ERD load error:", err);
        return null;
      }
    },
    [getAuthToken]
  );

  return {
    isSaving,
    error,
    lastSaved,
    saveErd,
    loadErd,
  };
}