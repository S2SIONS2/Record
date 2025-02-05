import { createClient } from '@/utils/supabase/client';
import { create } from 'zustand';

interface Place {
    name: string;
    score: number;
    address: string;
    mapx: number;
    mapy: number;
}
  
interface StoreState {
    placeList: Place[] | null;
    fetchPlaces: () => void
}

const supabase = createClient();

export const usePlaceStore = create<StoreState>((set) => ({    
    placeList: [],
    
    fetchPlaces: async () => {
        const session = await supabase.auth.getSession();

        const response = await fetch(`/api/placelist/${session.data.session?.user.id}`);
        if(!response.ok) {
            throw new Error('Failed to fetch lists');
        }

        const data = await response.json();
        set({ placeList: data || []})
    }
}))

export default usePlaceStore;