import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';

const supabase = createClient();

// get 
export async function GET(
  req: Request,
  context: { params: Promise<{ user_id: string }> }
): Promise<NextResponse> {
  
  const { user_id } = await context.params;

  if (!user_id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const orderBy = searchParams.get("order") || "name";
    const selectQuery = searchParams.get("select") || "";

    const selectedCategories = selectQuery ? selectQuery.split(",") : [];

    let query = supabase
      .from("placelist")
      .select("id, name, score, mapx, mapy, address, category")
      .eq("user_id", user_id)
      .order(orderBy, { ascending: false });

    // 선택한 카테고리 필터링
    if (selectedCategories.length > 0) {
      query = query.in("category", selectedCategories);
    }

    const { data, error } = await query;

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

// post
export async function POST(
  req: Request,
  context: {params: Promise<{user_id: string}>}
) {

  const { user_id } = await context.params;
  if (!user_id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }
  try {
    // 리스트 추가 할 데이터 가져오기
    const { name, score, address, mapx, mapy, category } = await req.json();
    
    const { data, error } = await supabase
    .from('placelist')
    .insert([
      {
        name: name,
        score: score,
        address: address,
        mapx: mapx,
        mapy: mapy,
        user_id: user_id,
        category: category
      }
    ])
    .select('id')

    if (error ){
      console.error('리스트 추가 중 오류 발생', error)
    }

    return NextResponse.json(data, { status: 200 });
  }catch(err){
    console.error(err)
  }
}

// put
export async function PUT(
  req: Request,
  context: { params: Promise<{ user_id: string }>}
) {
  const { user_id } = await context.params;
  if(!user_id) {
    return NextResponse.json({ error: 'Missing user Id'}, {status: 400});
  }

  try {
    // const { id, name, score, category } = await req.json();
    const placeList = await req.json();
    const { data, error } = await supabase
    .from('placelist')
    .upsert(placeList, { onConflict: "id"})
    // .select()

    if (error ){
      console.error('리스트 수정 중 오류 발생', error)
    }

    return NextResponse.json(data, { status: 200 });
    
  }catch (err) {
    console.error('Unexpected Error:', err);
    return NextResponse.json({ error: 'Unexpected error occurred' }, { status: 500 });
  }
}

// delete
export async function DELETE(
  req: Request,
  context: {params: Promise<{user_id: string}>}
) {
  const { user_id } = await context.params;

  if (!user_id) {
    return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
  }

  try {
    const { id } = await req.json();

    const { data, error } = await supabase
      .from('placelist')
      .delete()
      .eq('id', id);

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
