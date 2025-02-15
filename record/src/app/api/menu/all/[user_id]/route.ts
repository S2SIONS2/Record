import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

const supabase = createClient()

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