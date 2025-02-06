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
    fetchPlaces: () => Promise<void>;
    subscribeToPlaces: () => void
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
    },

    subscribeToPlaces: () => {
        const channel = supabase
          .channel("public:placelist")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "placelist" }, // 실시간으로 "placelist" 테이블 감지
            async (payload) => {
              console.log("Supabase Change Detected:", payload);
              const { data } = await supabase.from("placelist").select("*"); // 최신 데이터 가져오기
              set({ placeList: data || [] });
            }
          )
          .subscribe();
    
        return () => {
          supabase.removeChannel(channel);
          console.log("Unsubscribed from Supabase Realtime.");
        };
      },
}))

export default usePlaceStore;