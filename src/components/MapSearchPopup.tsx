import { Map, MapMarker } from "react-kakao-maps-sdk";
import React, { useEffect, useRef, useState } from "react";
import S from "./MapSearchPopup.module.css";

interface Marker {
  position: { lat: number; lng: number };
  content: string;
}
interface Props {
  onClose: () => void;
}
function MapSearchPopup({ onClose }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [markers, setMarkers] = useState<Marker | null>();
  const [searchText, setSearchText] = useState("");
  const [state, setState] = useState({
    center: { lat: 33.450701, lng: 126.570667 },
  });
  const [searchList, setsearchList] =
    useState<kakao.maps.services.PlacesSearchResult>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const existingScript = document.getElementById("kakao-map-sdk");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "kakao-map-sdk";
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
        import.meta.env.VITE_KAKAO_API_KEY
      }&autoload=false&libraries=services,clusterer`;
      script.async = true;
      script.onload = () => {
        // SDK 로드가 끝나면 kakao.maps.load로 실제 로드
        window.kakao.maps.load(() => {
          setIsLoaded(true);
        });
      };
      document.head.appendChild(script);
    } else {
      const waitForKakao = () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => {
            setIsLoaded(true);
          });
        } else {
          setTimeout(waitForKakao, 100); // 0.1초 후 재확인
        }
      };
      waitForKakao();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded || !map) return;
    const ps = new kakao.maps.services.Places();

    ps.keywordSearch(searchText, (data, status) => {
      console.log("data", data);
      console.log("status", status);
      if (status === kakao.maps.services.Status.OK) {
        setsearchList(data);
      }
    });
  }, [searchText]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      // ref 영역 밖 클릭 시 닫기
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      const target = e.target as HTMLInputElement;
      setSearchText(target.value);
    }
  };

  const handleSearchList = (
    e: React.MouseEvent<HTMLAnchorElement>,
    place: kakao.maps.services.PlacesSearchResultItem
  ) => {
    e.preventDefault();
    if (!map) return;
    const bounds = new kakao.maps.LatLngBounds();
    bounds.extend(new kakao.maps.LatLng(Number(place.y), Number(place.x)));
    map.setBounds(bounds);
    setState((prev) => {
      return { ...prev, lat: Number(place.y), lng: Number(place.x) };
    });
    const marker = {
      position: {
        lat: Number(place.y),
        lng: Number(place.x),
      },
      content: place.place_name,
    };
    setMarkers(marker);
  };
  const handlePlaceSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!markers) {
      alert("장소를 선택해주세요!");
      return;
    }
  };

  if (!isLoaded) return <div>지도를 불러오는 중입니다...</div>;

  return (
    <div className={S.popup} ref={modalRef}>
      <div className={S.searchBar}>
        <button>
          <img src="/icons/Search.svg" alt="검색 버튼" />
        </button>
        <input
          type="text"
          placeholder="검색어를 입력해주세요."
          onKeyDown={handleSearch}
        />
        <button className={S.closeButton} onClick={() => onClose()}>
          <img src="/icons/Close.svg" alt="팝업 닫기 버튼" />
        </button>
      </div>

      <div className={S.contents}>
        <div className={S.mapView}>
          <Map // 로드뷰를 표시할 Container
            center={state.center}
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "8px",
            }}
            level={3}
            onCreate={setMap}
          >
            {markers && (
              <MapMarker
                key={`marker-${markers.content}-${markers.position.lat},${markers.position.lng}`}
                position={markers.position}
              ></MapMarker>
            )}
          </Map>
        </div>
        <div className={S.rightSide}>
          <div className={S.mapList}>
            <ul>
              {searchList &&
                searchList.map((place) => {
                  return (
                    <li key={place.id}>
                      <a
                        href="#"
                        onClick={(e) => {
                          handleSearchList(e, place);
                        }}
                      >
                        <div>
                          <p className={S.address}>{place.place_name}</p>
                          <p className={S.addressDetail}>
                            {place.address_name}
                          </p>
                        </div>
                      </a>
                    </li>
                  );
                })}
            </ul>
          </div>
          <button onClick={handlePlaceSelect}>
            <img src="/icons/check.svg" alt="" />
            장소선택하기
          </button>
        </div>
      </div>
    </div>
  );
}
export default MapSearchPopup;
