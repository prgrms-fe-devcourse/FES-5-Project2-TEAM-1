import { createContext, useContext, useEffect, useState} from "react";
import { Loader } from "react-kakao-maps-sdk";


const KakaoContext = createContext(false);

export const useKakaoReady = () => useContext(KakaoContext);

export function KakaoLoaderProvider ({children} : {children:React.ReactNode}) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(()=>{
    const loadKakao = async() => {
      try{
        const loader = new Loader({
          appkey: import.meta.env.VITE_KAKAOMAP_API_KEY,
          libraries: ['clusterer', 'drawing', 'services'],
        });
        await loader.load();
        setIsLoaded(true);
      } catch(error){
        console.error('kakao sdk 로딩 실패', error)
      } 
    }
    loadKakao();
  },[])


  return (
    <KakaoContext.Provider value={isLoaded}>
      {children}
    </KakaoContext.Provider>
  )
}
