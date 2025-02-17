'use client';

import { useState } from 'react';
import usePlaceStore from "@/store/usePlaceStore";
import style from './orderby-btn.module.css';

export default function OrderbyBtn() {
    const { setOrderBy, fetchPlaces } = usePlaceStore();
    const [activeBtn, setActiveBtn] = useState<number | null>(1);
    const buttons = [
        { label: "별점", value: "score" },
        { label: "가게명", value: "name" },
        // { label: "근처", value: "mapx" }
    ];

    const handleClick = async (index: number, value: string) => {
        setOrderBy(value);
        setActiveBtn(index);
        await fetchPlaces(); 
      };


    return (
        <div className={style.btnWrap}>
            {
                buttons.map((btn, index) => (
                    <button 
                        key={index} 
                        type='button'
                        className={`${style.analysisBtn} ${
                            activeBtn === index ? style.active : ""
                          }`}
                          onClick={() => handleClick(index, btn.value)}
                    >
                        {btn.label}
                    </button>
                ))
            }
        </div>
    )
};