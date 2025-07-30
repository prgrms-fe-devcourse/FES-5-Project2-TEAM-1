import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk"

interface Props {
  address:string;
}

function KakaoMap({address}:Props) {
  const [lat, setLat] = useState<number|null>(null);
  const [lng, setLng] = useState<number|null>(null);
  const geocoder = new kakao.maps.services.Geocoder();

  useEffect(()=>{
    if(!window.kakao) return;
    geocoder.addressSearch(address, function(result, status){
      if(status === kakao.maps.services.Status.OK) {
  
        setLat(Number(result[0].y));
        setLng(Number(result[0].x));
      }
    })
  }, [address])

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