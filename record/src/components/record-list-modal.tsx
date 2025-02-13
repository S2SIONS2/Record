'use client'

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import useSearchStore from "@/store/useSearchStore";
import style from "./record-list-modal.module.css";

interface SetModalOpen {
    setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RecordListModal({ setModalOpen }: SetModalOpen) {
    // zustand
    const { setSelectedPlace } = useSearchStore();

    // 검색 input 
    const [search, setSearch] = useState('');
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    // db에 저장 할 가게 정보
    const [placeName, setPlaceName] = useState(''); // 가게 이름
    const [placeScore, setPlaceScore] = useState<number>(5); // 가게 점수
    const [placeAddress, setPlaceAddress] = useState(''); // 가게 주소
    const [placeCategory, setPlaceCategory] = useState('') // 가게 카테고리
    const categoryList = ["음식점", "카페", "숙소", "여가/테마파크", "기타"]

    const handlePlaceName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceName(e.target.value);
    }
    const handlePlaceScore = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlaceScore(Number(e.target.value));
    }
    const handlePlaceAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceAddress(e.target.value);
    }
    const handlePlaceCategory = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlaceCategory(e.target.value)
    }
    
    // api 제공 map x, y 값
    const [mapx, setMapx] = useState<number>();
    const [mapy, setMapy] = useState<number>();
    

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

    // 가게 검색 시
    const onSubmit = async () => {
        const response = await fetch(
            `/api/naver?query=${search}`,
            { cache: "force-cache" }
        )
        .then(response => {
            if (!response.ok) {
              throw new Error('네트워크 응답이 올바르지 않습니다.');
            }
            return response.json();
          })
          .then(data => {
            // 데이터 추가
            setPlaceAddress(data.items[0].address)
            // 정규식 활용
            const noTags = data.items[0].title.replace(/<[^>]*>/g, '')
            const parser = new DOMParser();
            const decodedString = parser.parseFromString(`<!DOCTYPE html><body>${noTags}</body>`, "text/html").body.textContent;

            setPlaceName(decodedString || '')
            setMapx(parseFloat(data.items[0].mapx))
            setMapy(parseFloat(data.items[0].mapy))

            // zustand 전역 전달
            setSelectedPlace(data.items[0])
            
          })
          .catch(error => {
            console.error('API 호출 중 오류가 발생했습니다: ', error);
          });

          return response
    }

    
    // 인풋에서 엔터 입력으로 검색
    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        onSubmit();
        }
    };

    const supabase = createClient();

    // placelist, menu 저장
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

        }catch(err) {
            console.error(err)
        }
    }

    // placelist id값을 받아온 후 menu 저장 실행
    const onRecordPlaceList = async () => {
        try {
            const session = await supabase.auth.getSession()
            const user_id = session.data.session?.user.id;

            const list = {
                name: placeName,
                score: placeScore,
                address: placeAddress,
                category: placeCategory,
                mapx: mapx,
                mapy: mapy,
                user_id: user_id,
            }

            // post 요청 - placelist
            const response = await fetch(`/api/placelist/${session.data.session?.user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(list)
            });

            if (!response.ok) {
                throw new Error('가게 저장에 실패했습니다.');
            }
            
            const result =await response.json();

            onRecordMenuList(result[0].id)

        }catch(err) {
            console.error(err)
        }
    }

    // 모달 닫기
    const onClose = () => {
        if(placeName != '' || placeAddress != '') {
            if(!confirm("작성중인 리스트가 있습니다. 종료하시겠습니까?")){
                return
            }else {
                setModalOpen(false)
            }
        }
        setModalOpen(false)
    }

    return (
        <div className={style.recordModal}>
            <h4 className={style.modalTitle}>리스트 추가</h4>
            <div className={style.flex}>
                <input 
                    type="text" 
                    value={search} 
                    onChange={handleSearch} 
                    onKeyPress={onKeyUp} 
                    className={style.searchInput}
                    placeholder="가게 이름을 검색해주세요."
                />
                <button onClick={onSubmit}>검색</button>
            </div>
            <div className={style.inputWrap}>
                <div>
                    <p>가게 명 & 별점</p>
                    <div className={style.flex}>
                        <input type="text" value={placeName} onChange={handlePlaceName} required/>
                        <select value={placeScore} onChange={handlePlaceScore} required>
                            <option value="5" defaultValue={5}>5</option>
                            <option value="4">4</option>
                            <option value="3">3</option>
                            <option value="2">2</option>
                            <option value="1">1</option>
                        </select>
                    </div>
                </div>
                <div>
                    <p>가게 분류</p>
                    <select value={placeCategory} onChange={handlePlaceCategory}>
                        {
                            categoryList.map((item) => (
                                <option value={item} key={item}>
                                    {item}
                                </option>
                            ))
                        }
                    </select>
                </div>
                <div>
                    <p>주소</p>
                    <input type="text" value={placeAddress} onChange={handlePlaceAddress} />
                </div>
                <div>
                    <div className={style.flexBetween}>
                        메뉴
                        <button type="button" onClick={addMenu}> 메뉴 추가 </button>
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
                </div>
                <div className={style.btn_wrap}>
                    <button type="submit" onClick={onRecordPlaceList} className={style.submitBtn}>저장</button>
                    <button type="submit" onClick={onClose} className={style.closeBtn}>닫기</button>
                </div>
            </div>
        </div>
    )
}