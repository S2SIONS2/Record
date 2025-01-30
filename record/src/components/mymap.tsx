'use client';

import Script from "next/script";
import { useEffect, useState } from "react";

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

    useEffect(() => {
        const initMap = () => {
            if (typeof naver === 'undefined' || !naver.maps) {
                console.error("Naver Maps API is not loaded yet.");
                return;
            }

            const mapOptions = {
                center: new naver.maps.LatLng(currentLocation),
                zoom: 15
            };
            new naver.maps.Map('map', mapOptions);   
        };

        if (!isLoaded) return;

        initMap();
    }, [isLoaded]);

    return (
        <>
            <Script 
                strategy="afterInteractive"
                type="text/javascript"
                src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}`}
                onLoad={() => setIsLoaded(true)}
            />
            <h1>MyMap</h1>
            <div id="map" style={{width: '100%', height: '400px'}}></div>
        </>
    );
}
