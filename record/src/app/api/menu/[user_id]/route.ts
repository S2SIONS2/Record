import { createClient } from "@/utils/supabase/client";
import { NextResponse } from "next/server";

const supabase = createClient()

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

    console.log(placeListIds)

    if (placelistError) {
    console.error('Error fetching placelist IDs: ', placelistError.message);
    return NextResponse.json({ error: placelistError.message }, { status: 500 });
    }
    
    try {
        const { data, error } = await supabase
        .from('menu')
        .select('id, name, description, is_good')
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