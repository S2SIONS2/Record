import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';

const supabase = createClient();

export async function GET(): Promise<NextResponse> {
    try {
        const { data, error } = await supabase
            .from('board')
            .select('id, title, contents, created_at');

        if (error) {
            console.error('Supabase Error:', error.message);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const response = NextResponse.json(data, { status: 200 });
        return response;
    } catch (err) {
        console.error('Unexpected Error:', err);
        return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
    }
}
