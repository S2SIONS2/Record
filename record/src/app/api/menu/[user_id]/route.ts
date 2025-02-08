import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

const supabase = createClient()

interface Menu {
    placelist_id: number,
    name: string,
    description: string,
    is_good: boolean
}

// get
export async function GET(
    req: Request,
    context: { params: Promise<{ user_id: string }>}
): Promise<NextResponse> {

    const { user_id } = await context.params;
    
    if(!user_id) {
        return NextResponse.json({ error: 'Missing user ID'}, { status: 400 })
    }

    // placelist에서 user_id에 맞는 id를 가져오기
    const { data: placeListIds, error: placelistError } = await supabase
    .from('placelist')
    .select('id')
    .eq('user_id', user_id);

    if (placelistError) {
    console.error('Error fetching placelist IDs: ', placelistError.message);
    return NextResponse.json({ error: placelistError.message }, { status: 500 });
    }
    
    try {
        const { data, error } = await supabase
        .from('menu')
        .select('placelist_id, id, name, description, is_good')
        .in("placelist_id", placeListIds.map((item) => item.id));

        if(error) {
            console.error('Supabase Error: ', error.message);
            return NextResponse.json({ error: error.message}, {status: 500})
        }

        return NextResponse.json(data, {status: 200});

    }catch(err){
        console.error(err)
        return NextResponse.json({ error: 'Unexpected error occured' }, {status: 500})
    }
}

// post
export async function POST(
    req:Request,
    context: {params: Promise<{user_id: string}>}
) {
    const { user_id } = await context.params;
    if(!user_id) {
        return NextResponse.json({error: 'Missing User Id'}, {status:400})
    }

    // menu 추가
    try{
        const { menuInfo } = await req.json();

        const indata = menuInfo.map(({ placelist_id, name, description, is_good }: Menu) => ({
            placelist_id,
            name,
            description,
            is_good
        }));
        
        const { data, error } = await supabase
        .from('menu')
        .insert(indata)

        if(error) {
            console.error('메뉴 추가 중 오류 발생', error);
        }

        return NextResponse.json(data, { status: 200 })
    }catch(err){
        console.error(err)
    }
}