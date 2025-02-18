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
    subscribeToPlaces: () => void;
}

const supabase = createClient();

export const usePlaceStore = create<StoreState>((set, get) => ({    
    placeList: [],
    orderBy: "name",
    select: ["음식점", "카페", "숙소", "여가/테마파크", "기타"],

    setOrderBy: (order) => set({ orderBy: order }),
    setSelect: (selected: string[]) => {
        const filteredSelect = selected.filter(s => s.trim() !== "");
        set({ select: filteredSelect });
    },

    fetchPlaces: async () => {
        const session = await supabase.auth.getSession();
        const orderBy = get().orderBy;
        const select = get().select.filter(s => s.trim() !== "");

        // "전체"를 선택한 경우 전체 데이터 조회
        if (select.length === 0) {
            console.log("전체 카테고리 조회 중...");
        }

        const response = await fetch(`/api/placelist/${session.data.session?.user.id}?order=${orderBy}&select=${select}`);
        if (!response.ok) {
            throw new Error("Failed to fetch lists");
        }

        const data = await response.json();
        set({ placeList: data || [] });
    },

    subscribeToPlaces: () => {
        const channel = supabase
            .channel("public:placelist")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "placelist" },
                async () => {
                    const orderBy = get().orderBy;
                    const selectedCategories = get().select.filter(s => s.trim() !== "");

                    // "전체"가 선택되었는지 확인
                    const isAllSelected = selectedCategories.length === 0;

                    let query = supabase.from("placelist").select("*").order(orderBy, { ascending: false });

                    if (!isAllSelected) {
                        query = query.in("category", selectedCategories);
                    }

                    const { data, error } = await query;

                    if (error) {
                        console.error("Error fetching places:", error);
                        return;
                    }

                    set({ placeList: data || [] });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
            console.log("Unsubscribed from Supabase Realtime.");
        };
    },
}));

export default usePlaceStore;
