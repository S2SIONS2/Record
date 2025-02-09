// placelist 테이블 데이터 타입 정의
interface Place {
    id: number;
    latitude?: number;
    longitude?: number;
    address: string;
    name: string;
    score: number
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
    return (
        <div> 
            {placeList?.map((place) => (
                <details key={place.id}>
                    <summary>
                        <h2>{place.name}</h2>
                        <p>{place.score}점</p>
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