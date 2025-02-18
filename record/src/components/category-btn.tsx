'use client';

import usePlaceStore from "@/store/usePlaceStore";
import { useState } from 'react';
import style from './category-btn.module.css';

export default function CategoryBtn(){
    const { setSelect, fetchPlaces } = usePlaceStore();
    const [activeBtn, setActiveBtn] = useState<number | null>(0);
    const buttons = [
        {label: "전체", value: ""},
        {label: "음식점", value: "음식점"},
        {label: "카페", value: "카페"},
        {label: "숙소", value: "숙소"},
        {label: "여가/테마파크", value: "여가/테마파크"},
        {label: "기타", value: "기타"},
    ];

    const handleClick = async (index: number, value: string) => {
        setSelect([value]);
        setActiveBtn(index);
        await fetchPlaces(); 
    };

    return (
        <div className={style.btnWrap}>
            {
                buttons.map((item, index) => (
                    <button 
                        key={index} 
                        type="button"
                        className={`${style.categorysBtn} ${
                            activeBtn === index ? style.active : ""
                        }`}
                        onClick={() => handleClick(index, item.value)}
                    >
                        {item.label}
                    </button>
                ))
            }
        </div>
    )
}