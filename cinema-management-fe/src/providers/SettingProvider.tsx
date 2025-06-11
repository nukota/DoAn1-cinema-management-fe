import React, { createContext, useContext, useCallback, useState } from "react";
import { SettingType } from "../interfaces/types";

type SettingContextType = {
  setting: SettingType | null;
  getSetting: () => Promise<SettingType>;
  updateSetting: (payload: Partial<SettingType>) => Promise<SettingType>;
  loading: boolean;
};

const SettingContext = createContext<SettingContextType | undefined>(undefined);

export const SettingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [setting, setSetting] = useState<SettingType | null>(null);
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const getSetting = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(`${baseURL}/setting`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData?.error?.message || "Fetching setting failed.";
        throw new Error(errorMsg);
      }
      const data = await response.json();
      setSetting(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch setting:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [baseURL]);

  const updateSetting = useCallback(
    async (payload: Partial<SettingType>) => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await fetch(`${baseURL}/setting`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          const errorData = await response.json();
          const errorMsg = errorData?.error?.message || "Updating setting failed.";
          throw new Error(errorMsg);
        }
        const data = await response.json();
        setSetting(data);
        return data;
      } catch (error) {
        console.error("Failed to update setting:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  return (
    <SettingContext.Provider
      value={{ setting, getSetting, updateSetting, loading }}
    >
      {children}
    </SettingContext.Provider>
  );
};

export const useSetting = () => {
  const context = useContext(SettingContext);
  if (!context) {
    throw new Error("useSetting must be used within a SettingProvider");
  }
  return context;
};
