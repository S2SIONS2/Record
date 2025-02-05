// placelist 테이블 데이터 타입 정의
interface Place {
    id: number;
    latitude: number;
    longitude: number;
    roadAddress: string;
    name: string;
    score: number
}

interface PlaceListProps {
    placeList: Place[] | null;
}

export default function PlaceList({ placeList }: PlaceListProps) {
    return (
        <ul> 
            {placeList?.map((place) => (
                <li key={place.id}>
                    <h2>{place.name}</h2>
                    <p>{place.score} / 5</p>
                </li>
            ))}
        </ul>
    )
}