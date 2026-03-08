"use client";

import { useEffect, useRef } from "react";
import Script from "next/script";

export default function NaverMap() {
    const mapElement = useRef<HTMLDivElement | null>(null);

    const initMap = () => {
        if (!mapElement.current || !window.naver) return;

        const location = new window.naver.maps.LatLng(36.3741, 127.3178);

        const mapOptions = {
            center: location,
            zoom: 16,
            minZoom: 10,
            scaleControl: false,
            mapDataControl: false,
            zoomControl: true,
        };

        const map = new window.naver.maps.Map(mapElement.current, mapOptions);

        new window.naver.maps.Marker({
            position: location,
            map,
            icon: {
                content: `
                    <div style="background-color: white; border: 2px solid #3B82F6; border-radius: 20px; padding: 6px 14px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); display: flex; align-items: center; justify-content: center; transform: translate(-50%, -100%); margin-top: -10px; cursor: pointer;">
                        <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 8px solid #3B82F6;"></div>
                        <div style="position: absolute; bottom: -5px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid white;"></div>
                        <span style="color: #3B82F6; font-weight: 800; font-size: 14px; white-space: nowrap; font-family: Pretendard, sans-serif;">우리들소아청소년과의원</span>
                    </div>
                `,
                anchor: new window.naver.maps.Point(0, 0),
            }
        });
    };

    return (
        <>
            <Script
                strategy="afterInteractive"
                src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID}`}
                onReady={initMap}
            />
            <div ref={mapElement} className="w-full h-full min-h-[300px] outline-none" />
        </>
    );
}

// 전역 window.naver 타입 선언
declare global {
    interface Window {
        naver: any;
    }
}
