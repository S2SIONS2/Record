'use client';

import { useState } from 'react';
import style from './menulist.module.css';
import { createClient } from '@/utils/supabase/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

interface idNum {
    placelist_id : number
}


export default function MenuList( { placelist_id }: idNum ) {
    // db에 저장 할 메뉴 리스트 정보
    const [menuInfo, setMenuInfo] = useState([{
        placelist_id: 0, 
        name: '', 
        description: '',
        is_good: false
    }]);
    
    const handleMenuName = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newMenus = [...menuInfo || []]
        newMenus[index].name = e.target.value
        setMenuInfo(newMenus)
    }
    
    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        const newMenus = [...menuInfo || []]
        newMenus[index].description = e.target.value
        setMenuInfo(newMenus)
    }
    
    const handleMenuGood = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const newMenus = [...menuInfo || []]
        newMenus[index].is_good = e.target.checked
        setMenuInfo(newMenus)
    }
    
    // 버튼 클릭 시 메뉴 input, textarea 추가
    const addMenu = () => {
        setMenuInfo([
            ...menuInfo,
            {   
                placelist_id: 0,
                name: '', 
                description: '',
                is_good: false
            }
        ])
    }
    
    // 버튼 클릭 시 메뉴 input, textarea 삭제
    const deleteMenu = (index: number) => {
        const newMenuList = menuInfo.filter((_, i) => i !== index)
        setMenuInfo(newMenuList)
    }

    // placelist, menu 저장
    const supabase = createClient()
    const onRecordMenuList = async (placelist_id: number) => {
        try {
            const session = await supabase.auth.getSession()
            const user_id = session.data.session?.user.id;
            
            for(let i=0; i < menuInfo.length; i++) {
                menuInfo[i].placelist_id = placelist_id;
            }        

            // post 요청 - placelist
            const response = await fetch(`/api/menu/${user_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({menuInfo: menuInfo})
            });

            if (!response.ok) {
                throw new Error('가게 저장에 실패했습니다.');
            }

            await response.json();

            setMenuInfo([
                {   
                    placelist_id: 0,
                    name: '', 
                    description: '',
                    is_good: false
                }
            ])

        }catch(err) {
            console.error(err)
        }
    }

    return (
        <div className={style.menuModal}>
            <div className={style.flexBetween}>
                메뉴
                <button type="button" onClick={addMenu}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            {
                menuInfo.map((item, index) => (
                    <div key={index} className={style.menuWrap}>
                        <div className={style.menuSet}>
                            <input type="text" value={item.name} onChange={(e) => handleMenuName(e, index)}/>
                            <label>
                                <input type="checkbox" checked={item.is_good} onChange={(e) => handleMenuGood(e, index)}/>
                            </label>
                            <button type="button" onClick={() => deleteMenu(index)}> X </button>
                        </div>
                        <textarea value={item.description} onChange={(e) => handleDescription(e, index)} className={style.textArea}></textarea>
                    </div>
                ))
            }
            
            <div className={style.btn_wrap}>
                <button type="submit" onClick={() => onRecordMenuList(placelist_id)} className={style.submitBtn}>저장</button>
                <button type="submit" className={style.closeBtn}>닫기</button>
            </div>
        </div>
    )
}