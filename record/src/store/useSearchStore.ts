'use client';

import { create } from 'zustand';

interface Place {
  name: string;
  score: number;
  address: string;
  mapx: number;
  mapy: number;
}

interface StoreState {
  selectedPlace: Place | null;
  setSelectedPlace: (place: Place) => void; 
}

export const useSearchStore = create<StoreState>((set) => ({
  selectedPlace: null,
  setSelectedPlace: (place) => set({ selectedPlace: place }), 
}));

export default useSearchStore;
