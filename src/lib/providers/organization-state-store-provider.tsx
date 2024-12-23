// The purpose of this provider is to provide compatibility with
// Next.js re-rendering and component caching
"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import {
  type OrganizationStateStore,
  createOrganizationStateStore,
} from "@/lib/stores/organization-state-store";

export const OrganizationStateStoreContext =
  createContext<StoreApi<OrganizationStateStore> | null>(null);

export interface OrganizationStateStoreProviderProps {
  children: ReactNode;
}

export const OrganizationStateStoreProvider = ({
  children,
}: OrganizationStateStoreProviderProps) => {
  const storeRef = useRef<StoreApi<OrganizationStateStore>>(undefined);
  if (!storeRef.current) {
    storeRef.current = createOrganizationStateStore();
  }

  return (
    <OrganizationStateStoreContext.Provider value={storeRef.current}>
      {children}
    </OrganizationStateStoreContext.Provider>
  );
};

export const useOrganizationStateStore = <T,>(
  selector: (store: OrganizationStateStore) => T
): T => {
  const orgStateStoreContext = useContext(OrganizationStateStoreContext);

  if (!orgStateStoreContext) {
    throw new Error(
      `useOrganizationStateStore must be used within OrganizationStateStoreProvider`
    );
  }

  return useStore(orgStateStoreContext, selector);
};
