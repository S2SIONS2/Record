import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';

const supabase = createClient();

export async function GET(
    req: Request,
    { params }: { params: { user_id: string } }
): Promise<NextResponse> {
    const { user_id } = params; // 동적 경로 변수 가져오기
    if (!user_id) {
        return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    try {
        const { data, error } = await supabase
            .from('placelist')
            .select('id, name, score, latitude, longitude')
            .eq('user_id', user_id); 

        if (error) {
            console.error('Supabase Error:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        console.error('Unexpected Error:', err);
        return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
}
