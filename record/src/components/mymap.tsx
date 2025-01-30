'use client';

import Script from "next/script";
import { useEffect, useState } from "react";

export default function MyMap() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const initMap = () => {
            if (typeof naver === 'undefined' || !naver.maps) {
                console.error("Naver Maps API is not loaded yet.");
                return;
            }

            const mapOptions = {
                center: new naver.maps.LatLng(37.3595704, 127.105399),
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
