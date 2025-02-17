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
    orderBy: string;
    setOrderBy: (order: string) => void;
    fetchPlaces: () => Promise<void>;
    subscribeToPlaces: () => void
}

const supabase = createClient();

export const usePlaceStore = create<StoreState>((set, get) => ({    
    placeList: [],
    orderBy: "name",

    setOrderBy: (order) => set({ orderBy: order }),
    
    fetchPlaces: async () => {
        const session = await supabase.auth.getSession();
        const orderBy = get().orderBy;

        const response = await fetch(`/api/placelist/${session.data.session?.user.id}?order=${orderBy}`);
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
            async () => {              
              const orderBy = get().orderBy
              const { data } = await supabase.from("placelist").select("*").order(orderBy, { ascending: false }); // 최신 데이터 가져오기
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