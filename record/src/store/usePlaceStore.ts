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
    select: string[];
    setOrderBy: (order: string) => void;
    setSelect: (select: string[]) => void;
    fetchPlaces: () => Promise<void>;
    subscribeToPlaces: () => void
}

const supabase = createClient();

export const usePlaceStore = create<StoreState>((set, get) => ({    
    placeList: [],
    orderBy: "name",
    select: ["음식점", "카페", "숙소", "여가/테마파크", "기타", ""],

    setOrderBy: (order) => set({ orderBy: order }),
    setSelect: (selected: string[]) => set({ select: selected}),
    
    fetchPlaces: async () => {
        const session = await supabase.auth.getSession();
        const orderBy = get().orderBy;
        const select = get().select;

        const response = await fetch(`/api/placelist/${session.data.session?.user.id}?order=${orderBy}&select=${select}`);
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
              const orderBy = get().orderBy;
              const select = get().select;;
              const { data } = await supabase.from("placelist").select(select.join(',')).order(orderBy, { ascending: false }) as unknown as { data: Place[] }; // 최신 데이터 가져오기
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