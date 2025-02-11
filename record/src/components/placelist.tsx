import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils, faMugSaucer, faBed, faPlaceOfWorship, faLocationDot, faStar } from '@fortawesome/free-solid-svg-icons'
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons'
import style from './placelist.module.css';

// placelist 테이블 데이터 타입 정의
interface Place {
    id: number;
    latitude?: number;
    longitude?: number;
    address: string;
    name: string;
    score: number
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

// 별점 순 별 표시
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

export default function PlaceList({ placeList, menuList }: PlaceListProps) {
    return (
        <div className={style.listWrap}>
            <div className={style.btnWrap}>
                <button type='button' className={style.analysisBtn}>별점</button>
                <button type='button' className={style.analysisBtn}>가게명</button>
                <button type='button' className={style.analysisBtn}>근처</button>
            </div>
            <div className={style.tabWrap}>
                <button type='button' className={style.categorysTab}>카테고리</button>
                <button type='button' className={style.categorysTab}>All</button>
            </div>

            <div className={style.listArea}>
                <div className={style.btnWrap}>
                    <button type='button' className={style.categorysBtn}>음식점</button>    
                    <button type='button' className={style.categorysBtn}>카페</button>
                    <button type='button' className={style.categorysBtn}>숙소</button>
                    <button type='button' className={style.categorysBtn}>여가/테마파크</button>
                    <button type='button' className={style.categorysBtn}>기타</button>
                </div>
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
                            </summary>
                                {/* <p>{place.address}</p> */}

                                <ul className={style.menuWrap}>
                                    {/* place.id와 placelist_id가 일치하는 메뉴만 필터링하여 출력 */}
                                    {menuList
                                        ?.filter((menu) => menu.placelist_id === place.id)
                                        .map((menu) => (
                                            <li key={menu.id} className={style.menuList}>
                                                <div className={style.menuTitle}>
                                                    <p>{menu.name}</p>
                                                    {
                                                        menu.is_good ? 
                                                            <label>
                                                                <input type="checkbox" id='checkInput' checked={menu.is_good} readOnly />
                                                                <FontAwesomeIcon icon={faThumbsUp} />
                                                            </label> 
                                                            : null
                                                    }
                                                    {/* <label>
                                                        {
                                                            menu.is_good ? <input type="checkbox" id='checkInput' checked={menu.is_good} readOnly /> : null
                                                        }
                                                        <input type="checkbox" id='checkInput' checked={menu.is_good} readOnly />
                                                    </label> */}
                                                </div>
                                                <p>{menu.description}</p>
                                            </li>
                                    ))}
                                </ul>
                        </details>
                    ))}
                </div>
            </div>


        </div>
    )
}