import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils, faMugSaucer, faBed, faPlaceOfWorship, faLocationDot, faStar, faMinus, faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import style from './placelist.module.css';
import { createClient } from '@/utils/supabase/client';
import MenuList from './menulist';
import Link from 'next/link';
import OrderbyBtn from './orderby-btn';
import CategoryBtn from './category-btn';
import useSearchStore from '@/store/useSearchStore';

// placelist 테이블 데이터 타입 정의
interface Place {
    id: number;
    latitude?: number;
    longitude?: number;
    address: string;
    roadaddress: string;
    mapx?: number;
    mapy?: number;
    name: string;
    score: number;
    category: string;
}

interface Menu {
    placelist_id: number,
    id: number,
    name: string,
    description: string,
    is_good: boolean,
}

interface PlaceListProps {
    placeList: Place[] | null;
    menuList: Menu[] | null
}

export default function PlaceList({ placeList, menuList }: PlaceListProps) {
// 카테고리 별 서머리 이미지
const checkCategory = (category: string) => {
    if (category === '음식점') {
        return <FontAwesomeIcon icon={faUtensils} className={style.restaurant}/>;
    }
    if (category === '카페') {
        return <FontAwesomeIcon icon={faMugSaucer} className={style.cafe}/>;
    }
    if (category === '숙소') {
        return <FontAwesomeIcon icon={faBed} className={style.accom}/>;
    }
    if (category === '여가/테마파크') {
        return <FontAwesomeIcon icon={faPlaceOfWorship} className={style.park}/>;
    }
    if (category === '기타') {
        return <FontAwesomeIcon icon={faLocationDot} className={style.etc}/>;
    }
    return <FontAwesomeIcon icon={faLocationDot} />; // 기본값 추가 (예외처리)
};

// 별점 별 표시
const setStars = (score: number) => {
    const stars = [];
    for(let i = 0; i < score; i++) {
        stars.push(<FontAwesomeIcon icon={faStar} key={i} />);
    }
    // {[...Array(score)].map((_, i) => (
    //     <FontAwesomeIcon icon={faStar} key={i} />
    // ))}
    return <div className={style.stars}>{stars}</div>;
}

const supabase = createClient(); // supabase 호출

// 메뉴 삭제
const deleteMenu = async (id: number) => {
    const session = await supabase.auth.getSession()
    const user_id = session.data.session?.user.id; // user_id 체크

    if(!confirm('메뉴를 삭제하시겠습니까?')){
        return
    }else {
        const response = await fetch(`/api/menu/${user_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id})
        })
    
        await response.json();
    
        if(!response.ok) {
            throw new Error('메뉴 삭제에 실패했습니다.');
        }
    }
}

// placelist 삭제
// 메뉴 없을 때
const deleteList = async (id: number) => {
    const session = await supabase.auth.getSession()
    const user_id = session.data.session?.user.id; // user_id 체크

    const response = await fetch(`/api/placelist/${user_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({id: id})
        })
    
        await response.json();
    
        if(!response.ok) {
            throw new Error('메뉴 삭제에 실패했습니다.');
    }
}
const deleteAllLists = async (id: number) => {
    if(!confirm('리스트를 삭제하시겠습니까?')){
        return
    }else {
        // 해당 리스트에 메뉴가 있는지 체크
        const filteredMenuList = menuList?.filter(item => item.placelist_id === id);

        // 메뉴가 있다면
        if(filteredMenuList && filteredMenuList.length > 0) {
            // 메뉴 삭제 먼저
            const session = await supabase.auth.getSession()
            const user_id = session.data.session?.user.id; // user_id 체크

            const responseAll = await fetch(`/api/menu/all/${user_id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ placelist_id: id }) // 전체 삭제
            });
        
            if(!responseAll.ok) {
                throw new Error('메뉴 삭제에 실패했습니다.');
            }
            // 메뉴 삭제 후 리스트 삭제
            deleteList(id)
        }else{
            deleteList(id)
        }
        
    }
}

// 리스트 클릭 시 해당 리스트의 주소 전달
const { setSelectedPlace } = useSearchStore();
const handleClickPlace = (value: Place) => {
    const placeWithDefaults = {
        ...value,
        mapx: value.mapx ?? 0,
        mapy: value.mapy ?? 0,
    };
    setSelectedPlace(placeWithDefaults);
}

    return (
        <div className={style.listWrap}>
            <OrderbyBtn />
            <div className={style.listArea}>
                <CategoryBtn />
                <div className={style.list}>
                    {placeList?.map((place) => (
                        <details key={place.id} className={style.details}> 
                            <summary className={style.summary}>
                                <div className={style.categoryImage}>
                                    {checkCategory(place.category)}
                                </div>
                                <div className={style.categorySummary}>
                                    <p className={style.placeName}>{place.name}</p>
                                    {setStars(place.score)}
                                </div>
                                <div className={style.downBtn}>
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </div>
                            </summary>

                            <div className={style.controlBtnWrap}>   
                                <button type='button' onClick={() => handleClickPlace(place)} className={style.btn}>위치 보기</button>                             
                                <div className={style.controlBtnWrap}>
                                    <Link href={`/main/modifyList/${place.id}?id=${place.id}`}>
                                        <button type="button" className={style.btn}>수정</button>
                                    </Link>
                                    <button type='button' className={style.btn} onClick={() => deleteAllLists(place.id)}>삭제</button>
                                </div>
                            </div>
                                <ul className={style.menuWrap}>                                 

                                    {/* place.id와 placelist_id가 일치하는 메뉴만 필터링하여 출력 */}
                                    {menuList
                                        ?.filter((menu) => menu.placelist_id === place.id)
                                        .map((menu) => (
                                            <li key={menu.id} className={style.menuList}>
                                                <div className={style.menuTitle}>
                                                    <div className={style.flex}>
                                                        <p>{menu.name}</p>
                                                        {
                                                            menu.is_good ? 
                                                                <label>
                                                                    <input type="checkbox" id='checkInput' checked={menu.is_good} readOnly />
                                                                    <FontAwesomeIcon icon={faThumbsUp} />
                                                                </label> 
                                                                : null
                                                        }
                                                    </div>
                                                    <button type='submit' onClick={() => deleteMenu(menu.id)} className={style.btn}>
                                                        <FontAwesomeIcon icon={faMinus} />
                                                    </button>
                                                </div>
                                                <p className={style.menuContent}>{menu.description}</p>
                                            </li>                                            
                                    ))}
                                    
                                    <MenuList placelist_id = {place.id} />
                                </ul>
                        </details>
                    ))}
                </div>
            </div>


        </div>
    )
}