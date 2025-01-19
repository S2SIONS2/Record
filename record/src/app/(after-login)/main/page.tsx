'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

// board 테이블 데이터 타입 정의
interface Board {
    id: number;
    title: string;
    contents: string; // 게시판 내용 필드
    created_at: string; // 생성 날짜 필드
}


export default function Page() {
    const [boards, setBoards] = useState<Board[]>([]); // Board 배열로 타입 지정
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchBoards = async () => {
            setLoading(true);
            setError(null);
    
            try {

                const response = await fetch('/api/boards');
                if (!response.ok) {
                    throw new Error('Failed to fetch boards');
                }
    
                const data = await response.json();
                console.log('Fetched data from API route:', data);
    
                if (data.length > 0) {
                    setBoards(data);
                } else {
                    setBoards([]);
                }
            } catch (error) {
                setError(error.message);
                console.error('Unexpected Error:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchBoards();
    }, []);    
    

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <h1>Boards</h1>
            <ul>
                {boards.map((board) => (
                    <li key={board.id}>
                        <h2>{board.title}</h2>
                        <p>{board.contents}</p>
                        <small>{new Date(board.created_at).toLocaleString()}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}
