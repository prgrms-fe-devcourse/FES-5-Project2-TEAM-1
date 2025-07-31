import { useKakaoReady } from "@/components/context/useKakaoLoaderProvider";
import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk"

interface Props {
  address:string;
}

function KakaoMap({address}:Props) {
  const isKakaoReady = useKakaoReady();
  const [lat, setLat] = useState<number|null>(null);
  const [lng, setLng] = useState<number|null>(null);

  useEffect(()=>{
    if(!isKakaoReady) return;
    const geocoder = new kakao.maps.services.Geocoder();
    geocoder.addressSearch(address, function(result, status){
      if(status === kakao.maps.services.Status.OK) {
  
        setLat(Number(result[0].y));
        setLng(Number(result[0].x));
      }
    })
  },[isKakaoReady, address])

  return (
    <>
    {
     lat && lng && 
     <Map
        center={{ lat, lng }}
        style={{width:"240px", height:'140px', borderRadius:'0.7rem'}}
        level={4}
      >
        <MapMarker
          position={{ lat, lng }}
          image={{
            src:'https://zugionbtbljfyuybihxk.supabase.co/storage/v1/object/public/assets//marker.png',
            size:{ width: 70, height: 70, }}}
        />
      </Map>

    }
    </>
  )
}
export default KakaoMap