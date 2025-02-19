'use client';

import Script from "next/script";
import { useEffect, useState } from "react";
import style from './mymap.module.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons'

// 현재 위치 타입 정의
interface Location {
    lat: number;
    lng: number;
}

interface Place {
    name: string;
    score: number;
    address: string;
    mapx: number;
    mapy: number;
}

interface MyMapProps {
    selectedPlace: Place | null;
    placeList: Place[] | null;
}

export default function MyMap({ selectedPlace, placeList }: MyMapProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [map, setMap] = useState<naver.maps.Map | null>(null);

    // 현재 위치가 없을 때 기본 위치 및 현재 위치 상태 
    const [currentLocation, setCurrentLocation] = useState<Location>({ lat: 37.5665, lng: 126.978 });

    // 검색한 위치의 위도, 경도 가져오기
    const getLocation = async () => {
        if (!isLoaded || typeof naver === "undefined" || !naver.maps) {
            return;
        }

        if (selectedPlace) {
            naver.maps.Service.geocode({
                query: selectedPlace.address
            }, function (status, response) {
                if (status !== naver.maps.Service.Status.OK) {
                    return alert('주소 검색에 실패했습니다.');
                }

                const result = response.v2;
                const item = result.addresses[0];

                setCurrentLocation({
                    lat: Number(item.y),
                    lng: Number(item.x)
                });

                updateMapCenter(Number(item.y), Number(item.x));
            });
        } else if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setCurrentLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });

                updateMapCenter(position.coords.latitude, position.coords.longitude);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    // 현재 위치 보는 버튼
    const handleMyLocation = () => {
        navigator.geolocation.getCurrentPosition((position) => {
            setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            });

            updateMapCenter(position.coords.latitude, position.coords.longitude);
        });
    };

    // 지도 중심 업데이트
    const updateMapCenter = (lat: number, lng: number) => {
        if (map) {
            map.setCenter(new naver.maps.LatLng(lat, lng));
            map.setOptions({ zoom: 16 });
        }
    };

    // 네이버 지도 초기화
    const initMap = async () => {
        if (typeof naver === 'undefined' || !naver.maps) {
            console.error("Naver Maps API is not loaded yet.");
            return;
        }

        const mapOptions = {
            center: new naver.maps.LatLng(currentLocation.lat, currentLocation.lng),
            zoom: 15,
            minZoom: 6,
            scaleControl: false,
            logoControl: false,
            mapDataControl: false,
            zoomControl: true,
            zoomControlOptions: {
                style: naver.maps.ZoomControlStyle.SMALL,
                position: naver.maps.Position.TOP_RIGHT
            }
        };

        const newMap = new naver.maps.Map('map', mapOptions);
        setMap(newMap);
        renderMarkers(newMap);
    };

    // 마커 렌더링
    const renderMarkers = (mapInstance: naver.maps.Map) => {
        placeList?.forEach((place) => {
            naver.maps.Service.geocode({
                query: place.address
            }, function (status, response) {
                if (status !== naver.maps.Service.Status.OK) {
                    console.warn(`주소 변환 실패: ${place.address}`);
                    return;
                }

                const result = response.v2;
                const item = result.addresses[0];

                const marker = new naver.maps.Marker({
                    position: new naver.maps.LatLng(Number(item.y), Number(item.x)),
                    map: mapInstance,
                });

                // 마커 클릭 시 정보창 표시
                const infoWindow = new naver.maps.InfoWindow({
                    content: (
                        `<div style="padding:5px; cursor:pointer;">
                            <p> ${place.name} [${place.score}점]  </p>
                        </div>
                        `
                    )
                });

                naver.maps.Event.addListener(marker, "click", function () {
                    infoWindow.open(mapInstance, marker);
                });
            });
        });
    };

    useEffect(() => {
        if (isLoaded) {
            getLocation();
        }
    }, [selectedPlace, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            initMap();
        }
    }, [isLoaded, placeList]);

    return (
        <>
            <Script
                strategy="afterInteractive"
                type="text/javascript"
                src={`https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&submodules=geocoder`}
                onReady={() => setIsLoaded(true)}
            />

            <div id="map" className={style.map} style={{ width: '100%', height: 'calc(100vh - 52px)' }}>
                <button type="button" onClick={handleMyLocation} className={style.myLocationBtn}>
                    <FontAwesomeIcon icon={faLocationArrow} />
                </button>
            </div>
        </>
    );
}
