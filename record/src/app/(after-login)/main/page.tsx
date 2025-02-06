'use client'

import style from './page.module.css';
import { useEffect, useState } from 'react';
// import { createClient } from '@/utils/supabase/client';
import MyMap from '@/components/mymap';
import RecordListModal from '@/components/record-list-modal';
import useSearchStore from '@/store/useSearchStore';
import PlaceList from '@/components/placelist';
import usePlaceStore from '@/store/usePlaceStore';

interface Place {
    id: number;
    name: string;
    score: number;
    address: string;
    mapx: number;
    mapy: number;
    latitude?: number;
    longitude?: number;
}

export default function Page() {
    // zustand 스토어에서 상태 가져오기
    const { selectedPlace } = useSearchStore() as { selectedPlace: Place | null }; // 모달에서 검색된 place값
    const { placeList, fetchPlaces, subscribeToPlaces } = usePlaceStore() as {placeList: Place[] | null, fetchPlaces: () => Promise<void>, subscribeToPlaces: () => void} // 장소 리스트 

    // 모달 열기
    const [modalOpen, setModalOpen] = useState<boolean>(true);
    const openModal = () => {
        setModalOpen(true);
    }

    useEffect(() => {
        fetchPlaces() // 전역 placeList 가져오기
        subscribeToPlaces() // 실시간으로 테이블 변화 감지 후 최신 데이터 가져오기
    }, [])

    return (
        <div className={style.mainWrap}>
            <div className={style.leftArea}>
                <MyMap 
                    selectedPlace={selectedPlace} 
                    placeList={placeList || []}
                />
            </div>
            <div className={style.rightArea}>

                <button type='button' onClick={openModal}> + </button>
                {modalOpen && <RecordListModal />}
                <PlaceList 
                    placeList={placeList || []}
                />
            </div>
        </div>
    );
}
