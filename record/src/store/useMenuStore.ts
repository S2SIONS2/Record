import { createClient } from "@/utils/supabase/client";
import { create } from 'zustand';

interface Menu {
    name: string,
    description: string,
    is_good: boolean,
}

interface MenuState {
    menuList: Menu[] | null;
    fetchMenus: () => Promise<void>
    subscribeToMenus: () => void
}

const supabase = createClient();

export const useMenuStore = create<MenuState>((set) => ({
    menuList: [],

    fetchMenus: async() => {
        const session = await supabase.auth.getSession();
        // console.log(session)
        const response = await fetch(`/api/menu/${session.data.session?.user.id}`)
        if(!response.ok) {
            throw new Error('Failed to fetch lists');
        }

        const data = await response.json();
        set({ menuList: data || [] })
    },
    // realtime , 실시간으로 menu 테이블 리스트 가져오기
    subscribeToMenus: () => {
        const channel = supabase
        .channel("public:menu")
        .on(
            "postgres_changes",
            {event: "*", schema: "public", table: "menu"},
            async (payload) => {
                console.log("supabase change detected: ", payload);
                const { data } = await supabase.from('menu').select("*");
                set({ menuList: data || []})
            }
        )
        .subscribe();

        return () => {
            supabase.removeChannel(channel);
            console.log("Unsubscribed from Supabase Realtime.");
        }
    }
}))

export default useMenuStore;