import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUtensils, faMugSaucer, faBed, faPlaceOfWorship, faLocationDot } from '@fortawesome/free-solid-svg-icons'

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

const checkCategory = (category: string) => {
    if (category === '음식점') {
        return <FontAwesomeIcon icon={faUtensils} />;
    }
    if (category === '카페') {
        return <FontAwesomeIcon icon={faMugSaucer} />;
    }
    if (category === '숙소') {
        return <FontAwesomeIcon icon={faBed} />;
    }
    if (category === '여가/테마파크') {
        return <FontAwesomeIcon icon={faPlaceOfWorship} />;
    }
    if (category === '기타') {
        return <FontAwesomeIcon icon={faLocationDot} />;
    }
    return null; // 기본값 추가 (예외처리)
};

export default function PlaceList({ placeList, menuList }: PlaceListProps) {
    return (
        <div> 
            {placeList?.map((place) => (
                <details key={place.id}>
                    <summary>
                        <h2>{place.name}</h2>
                        <p>{place.score}점</p>
                        <div>{checkCategory(place.category)}</div>
                    </summary>
                        {/* <p>{place.address}</p> */}

                        <ul>
                            {/* place.id와 placelist_id가 일치하는 메뉴만 필터링하여 출력 */}
                            {menuList
                                ?.filter((menu) => menu.placelist_id === place.id)
                                .map((menu) => (
                                    <li key={menu.id}>
                                        <p>{menu.name}</p>
                                        <input type="checkbox" checked={menu.is_good} readOnly />
                                        <p>{menu.description}</p>
                                    </li>
                            ))}
                        </ul>
                </details>
            ))}
        </div>
    )
}