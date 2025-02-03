'use client'

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";

export default function RecordListModal() {
    // search input
    const [search, setSearch] = useState('');
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    // db에 저장 할 가게 정보
    const [placeName, setPlaceName] = useState(''); // 가게 이름
    const [placeScore, setPlaceScore] = useState<number>(5); // 가게 점수
    const [placeAddress, setPlaceAddress] = useState(''); // 가게 주소

    const handlePlaceName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceName(e.target.value);
    }
    const handlePlaceScore = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlaceScore(Number(e.target.value));
    }
    const handlePlaceAddress = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlaceAddress(e.target.value);
    }

    // api 제공 map x, y 값
    const [mapx, setMapx] = useState<number>();
    const [mapy, setMapy] = useState<number>();

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
            setPlaceName(noTags)
            setMapx(parseFloat(data.items[0].mapx))
            setMapy(parseFloat(data.items[0].mapy))
          })
          .catch(error => {
            console.error('API 호출 중 오류가 발생했습니다: ', error);
          });

          console.log(response)
    }
    // 인풋에서 엔터 입력으로 검색
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        onSubmit();
        }
    };

    const supabase = createClient()

    const onRecord = async () => {
        try {
            const session = await supabase.auth.getSession()
            const user_id = session.data.session?.user.id;

            const list = {
                name: placeName,
                score: placeScore,
                address: placeAddress,
                mapx: mapx,
                mapy: mapy,
                user_id: user_id
            }

            // put 요청
            const response = await fetch(`/api/placelist/${session.data.session?.user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(list)
            });

            if (!response.ok) {
                throw new Error('가게 저장에 실패했습니다.');
            }

            const result = await response.json();
            console.log('Successfully added:', result);

        }catch(err) {
            console.error(err)
        }
    }

    return (
        <div>
            <div>
                <input type="text" value={search} onChange={handleSearch} onKeyDown={onKeyDown} placeholder="가게 이름을 검색해주세요."/>
                <button onClick={onSubmit}>검색</button>
            </div>
            <div>
                <div>
                    <p>가게 명</p>
                    <div>
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
                    <p>주소</p>
                    <input type="text" value={placeAddress} onChange={handlePlaceAddress} />
                </div>
                <div>
                    <button type="submit" onClick={onRecord}>저장</button>
                </div>
            </div>
        </div>
    )
}