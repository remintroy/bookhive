"use client";

import { create } from "zustand";
import server from "./axios";

type ProviderData = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  providerId: string;
};

type AppGlobal = {
  metadata: {
    loggedIn: boolean;
    uid: string;
    displayName: string;
    email: string;
    emailVerified: boolean;
    photoURL: string;
    photoURLCustom: string;
    disabled: boolean;
    provider: string;
    phoneNumber: string;
    role: string;
    isDonor: string;
    lastLoginAt: string;
    accessToken: string;
    updatedAt: string;
    createdAt: string;
    metadata: {
      lastSignInTime: string;
      creationTime: string;
      lastRefreshTime: string;
    };
    tokensValidAfterTime: string;
    providerData: ProviderData[];
    loading: boolean;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setData: (data: any) => void;
    fetchData: () => Promise<boolean>;
  };
};

const appGlobal = create<AppGlobal>((set) => ({
  metadata: {
    loggedIn: false,
    uid: "",
    displayName: "",
    email: "",
    emailVerified: false,
    photoURL: "",
    photoURLCustom: "",
    provider: "",
    phoneNumber: "",
    role: "",
    isDonor: "",
    lastLoginAt: "",
    accessToken: "",
    updatedAt: "",
    createdAt: "",
    loading: true,
    metadata: {
      lastSignInTime: "",
      creationTime: "",
      lastRefreshTime: "",
    },
    disabled: false,
    providerData: [],
    tokensValidAfterTime: "",
    setData: (data) => {
      set((state) => ({
        metadata: { ...state.metadata, ...data },
      }));
    },
    fetchData: async () => {
      set((state) => ({ metadata: { ...state.metadata, loading: true } }));
      try {
        const data = await server.get("/api/metadata");
        set((state) => ({ metadata: { ...state.metadata, ...data.data, loggedIn: true } }));
        return true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        if (error?.response?.status == 401) set((state) => ({ metadata: { ...state.metadata, loggedIn: false } }));
        return error?.response?.status != 401;
      } finally {
        set((state) => ({ metadata: { ...state.metadata, loading: false } }));
      }
    },
  },
}));

export default appGlobal;
