'use client';

import Script from "next/script";
import { useEffect, useState } from "react";

// 현재 위치 타입 정의
interface Location {
    lat: number;
    lng: number;
}

interface Place {
    name: string;
    score: number;
    roadAddress: string;
    mapx: number;
    mapy: number;
}

export default function MyMap({ place }: { place: Place | null}) {
    // script가 읽히기 전에 페이지 로드 됨을 방지
    const [isLoaded, setIsLoaded] = useState(false);

    // 현재 위치 알아내기
    const [currentLocation, setCurrentLocation] = useState<Location>({ lat: 37.5665, lng: 126.978 });

    const getLocation = async () => {
        if(place) {
            // 네이버 검색 떄 가져온 주소로 위도, 경도 값 변경
            naver.maps.Service.geocode({
                query: place.roadAddress
            }, function(status, response) {
                if (status !== naver.maps.Service.Status.OK) {
                    return alert('Something wrong!');
                }

                const result = response.v2
                const item = result.addresses[0]

                setCurrentLocation({
                    lat: Number(item.y), 
                    lng: Number(item.x)
                })
            })
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    useEffect(() => {
        getLocation()
    }, [place]);

     // 네이버 지도 초기 설정
     const initMap = () => {
        if (typeof naver === 'undefined' || !naver.maps) {
            console.error("Naver Maps API is not loaded yet.");
            return;
        }

        const mapOptions = {
            center: new naver.maps.LatLng(currentLocation),
            zoom: 15,
            minZoom: 6,
            // 지도 확대 / 축소 컨트롤러
            scaleControl: false,
            logoControl: false,
            mapDataControl: false,
            zoomControl: true,
            zoomControlOptions: {
                style: naver.maps.ZoomControlStyle.SMALL,
                position: naver.maps.Position.TOP_RIGHT
            }
        };

        new naver.maps.Map('map', mapOptions);
    };

    useEffect(() => {
        if (!isLoaded) return;
        initMap();
    }, [currentLocation, isLoaded]);

    return (
        <>
            <Script 
                strategy="afterInteractive"
                type="text/javascript"
                src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`}
                onReady={() => setIsLoaded(true)}
            />

            <div id="map" style={{width: '100%', height: 'calc(100vh - 52px)'}}></div>
        </>
    );
}
