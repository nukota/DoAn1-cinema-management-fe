import React, { createContext, useContext, useCallback, useState } from "react";
import axios from "axios";
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
      const response = await axios.get(`${baseURL}/setting`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSetting(response.data);
      return response.data;
    } catch (error: any) {
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
        const response = await axios.patch(`${baseURL}/setting`, payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        setSetting(response.data);
        return response.data;
      } catch (error: any) {
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
