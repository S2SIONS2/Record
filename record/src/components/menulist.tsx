'use client';

import { useRef, useState } from 'react';
import style from './menulist.module.css';
import { createClient } from '@/utils/supabase/client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

interface idNum {
    placelist_id : number
}

export default function MenuList( { placelist_id }: idNum ) {
    // details open control
    const [isOpen, setIsOpen] = useState(false);

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

    // 버튼 중복 클릭 방지
    const isProcessing = useRef(false)

    // placelist, menu 저장
    const supabase = createClient()
    const onRecordMenuList = async (placelist_id: number) => {
        if (isProcessing.current) return;

        if (!menuInfo[0].name) {
            alert('메뉴 명을 적어주세요.')
            return;
        }
        
        isProcessing.current = true;

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
        } finally {
            isProcessing.current = false;
        }
    }

    return (
        <details className={style.menuModal} open={isOpen} onToggle={(e) => setIsOpen(e.currentTarget.open)}>
            <summary className={style.menu_summary}>메뉴 추가</summary>

            <div className={style.flexBetween}>
                메뉴 or 디테일 추가
                <button type="button" onClick={addMenu} className={style.btn}>
                    <FontAwesomeIcon icon={faPlus} />
                </button>
            </div>
            {/* {isLoading ? 'true' : 'false'} */}
            {
                menuInfo.map((item, index) => (
                    <div key={index} className={style.menuWrap}>
                        <div className={style.menuSet}>
                            <input type="text" value={item.name} onChange={(e) => handleMenuName(e, index)}/>
                            <label>
                                <input type="checkbox" checked={item.is_good} onChange={(e) => handleMenuGood(e, index)}/>
                            </label>
                            <button type="button" onClick={() => deleteMenu(index)} className={style.btn}> X </button>
                        </div>
                        <textarea value={item.description} onChange={(e) => handleDescription(e, index)} className={style.textArea}></textarea>
                    </div>
                ))
            }
            
            <div className={style.btn_wrap}>
                <button type="submit" onClick={() => onRecordMenuList(placelist_id)} className={style.submitBtn}>저장</button>
                <button type='button' onClick={() => setIsOpen(false)}>닫기</button>
            </div>
        </details>   
    )
}