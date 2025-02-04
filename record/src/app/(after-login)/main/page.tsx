'use client'

import style from './page.module.css';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import MyMap from '@/components/mymap';
import RecordListModal from '@/components/record-list-modal';
import useSearchStore from '@/store/useSearchStore';

// placelist 테이블 데이터 타입 정의
interface placelist {
    id: number;
    latitude: number;
    longitude: number;
    name: string;
    score: number
}
interface Place {
    name: string;
    score: number;
    roadAddress: string;
    mapx: number;
    mapy: number;
}

export default function Page() {
    const [placelist, setPlaceList] = useState<placelist[]>([]); // placelist 배열로 타입 지정
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const supabase = createClient();

    // zustand 스토어에서 상태 가져오기
    const { selectedPlace } = useSearchStore() as { selectedPlace: Place | null };
    
    // 리스트 호출
    useEffect(() => {
        const fetchBoards = async () => {
            setLoading(true);
            setError(null);
            
            const session = await supabase.auth.getSession()

            try {
                const response = await fetch(`/api/placelist/${session.data.session?.user.id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch boards');
                }
    
                const data = await response.json();
    
                if (data.length > 0) {
                    setPlaceList(data);
                } else {
                    setPlaceList([]);
                }
            } catch (error) {
                console.error('Unexpected Error:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchBoards();
    }, []);

    // 모달 열기
    const [modalOpen, setModalOpen] = useState<boolean>(true);

    const openModal = () => {
        setModalOpen(true);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={style.mainWrap}>
            <div className={style.leftArea}>
                <MyMap place={selectedPlace}/>
            </div>
            <div className={style.rightArea}>

                <button type='button' onClick={openModal}> + </button>
                {modalOpen && <RecordListModal />}
                <ul>
                    {placelist.map((place) => (
                        <li key={place.id}>
                            <h2>{place.name}</h2>
                            <p>{place.score} / 5</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
