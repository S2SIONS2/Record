'use client';

import Script from "next/script";
import { useEffect, useState } from "react";

// 현재 위치 타입 정의
interface Location {
    lat: number;
    lng: number;
}

export default function MyMap() {
    // script가 읽히기 전에 페이지 로드 됨을 방지
    const [isLoaded, setIsLoaded] = useState(false);

    // 현재 위치 알아내기
    const [currentLocation, setCurrentLocation] = useState<Location>({ lat: 37.5665, lng: 126.978 });
    const getLocation = () => {
        if (navigator.geolocation) {
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
    }, []);

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
                src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`}
                onReady={() => setIsLoaded(true)}
            />

            <div id="map" style={{width: '100%', height: 'calc(100vh - 52px)'}}></div>
        </>
    );
}
