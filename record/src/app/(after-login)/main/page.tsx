'use client'

import style from './page.module.css';
import { useEffect, useState } from 'react';

import useSearchStore from '@/store/useSearchStore'; // zustand 검색된 리스트 스토어
import usePlaceStore from '@/store/usePlaceStore'; // 저장된 리스트 스토어
import useMenuStore from '@/store/useMenuStore'; // 저장된 메뉴 스토어

import MyMap from '@/components/mymap'; // 지도 컴포넌트
import RecordListModal from '@/components/record-list-modal'; // 리스트 추가 모달
import PlaceList from '@/components/placelist'; // 장소 리스트 컴포넌트

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

interface Menu {
    placelist_id: number,
    id: number,
    name: string,
    description: string,
    is_good: boolean,
}

export default function Page() {
    // zustand 스토어에서 상태 가져오기
    const { selectedPlace } = useSearchStore() as { selectedPlace: Place | null }; // 모달에서 검색된 place값
    const { placeList, fetchPlaces, subscribeToPlaces } = usePlaceStore() as {placeList: Place[] | null, fetchPlaces: () => Promise<void>, subscribeToPlaces: () => void} // 장소 리스트 
    const { menuList, fetchMenus, subscribeToMenus } = useMenuStore() as {menuList: Menu[] | null, fetchMenus: () => Promise<void>, subscribeToMenus: () => void} // 메뉴 리스트

    // 모달 열기
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const openModal = () => {
        setModalOpen(true);
    }

    useEffect(() => {
        fetchPlaces(); // 전역 placeList 가져오기
        subscribeToPlaces(); // 실시간으로 테이블 변화 감지 후 최신 데이터 가져오기

        fetchMenus(); // menulist 가져오기
        subscribeToMenus(); // 실시간으로 테이블 변화 감지 후 최신 데이터 가져오기
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
                {modalOpen && (
                    <RecordListModal setModalOpen={setModalOpen} />
                )}
                <PlaceList 
                    placeList={placeList || []}
                    menuList={menuList || []}
                />
            </div>
        </div>
    );
}
