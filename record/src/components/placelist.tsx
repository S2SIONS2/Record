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
        <ul> 
            {placeList?.map((place) => (
                <li key={place.id}>
                    <h2>{place.name}</h2>
                    <p>{place.score} / 5</p>
                    {/* <p>{place.address}</p> */}
                </li>
            ))}
            {menuList?.map((menu) => (
                <li key={menu.id}>
                    <p>{menu.name}</p>
                    <p>{menu.is_good}</p>
                    <p>{menu.description}</p>
                </li>
            ))}
        </ul>
    )
}