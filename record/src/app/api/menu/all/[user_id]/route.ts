import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

const supabase = createClient()

interface Menu {
    placelist_id: number,
    name: string,
    description: string,
    is_good: boolean,
    id? :number,
}

// delete (placelist_id 전체 삭제)
export async function DELETE(
    req: Request,
    context: { params: Promise<{ user_id: string }>}
) {
    const { user_id } = await context.params;
    if (!user_id) {
        return NextResponse.json({ error: 'Missing User Id' }, { status: 400 });
    }

    try {
        const { placelist_id } = await req.json();

        const { data, error } = await supabase
            .from('menu')
            .delete()
            .eq("placelist_id", placelist_id);

        if (error) {
            console.error('메뉴 삭제 중 오류 발생', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    context: { params: Promise<{ user_id: string }>}
) {
    const { user_id } = await context.params;
    if (!user_id) {
        return NextResponse.json({ error: 'Missing User Id' }, { status: 400 });
    }

    try {
        const menuList = await req.json();
        const indata = menuList?.map(({ id, placelist_id, name, description, is_good }: Menu) => ({
            id: Number(id),
            placelist_id,
            name,
            description,
            is_good
        }));

        const { data, error } = await supabase
            .from('menu')
            .upsert(indata, { onConflict: "id" });

        if (error) {
            console.error('메뉴 수정 중 오류 발생', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
}