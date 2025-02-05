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
    name: string;
    score: number;
    roadAddress: string;
    mapx: number;
    mapy: number;
}

export default function Page() {
    // zustand 스토어에서 상태 가져오기
    const { selectedPlace } = useSearchStore() as { selectedPlace: Place | null }; // 모달 검색 place
    const { placeList, fetchPlaces } = usePlaceStore() as {placeList: Place[] | null, fetchPlaces: () => Promise<void>} // 장소 리스트 

    // 모달 열기
    const [modalOpen, setModalOpen] = useState<boolean>(true);
    const openModal = () => {
        setModalOpen(true);
    }

    useEffect(() => {
        fetchPlaces()
        console.log(placeList)
        // console.log(selectedPlace)
    }, [])

    return (
        <div className={style.mainWrap}>
            <div className={style.leftArea}>
                <MyMap 
                    selectedPlace={selectedPlace} 
                    placeList={placeList}
                />
            </div>
            <div className={style.rightArea}>

                <button type='button' onClick={openModal}> + </button>
                {modalOpen && <RecordListModal />}
                <PlaceList 
                    placeList={placeList}
                />
            </div>
        </div>
    );
}
