
import { useState } from "react";
import S from "./Login.module.css";
import supabase from "@/supabase/supabase";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";




function login() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogin = async (e:React.FormEvent)=>{
        e.preventDefault();
        setError(null);

       const {data, error} = await supabase.auth.signInWithPassword({
        email,
        password:password,
        });
        

        if(error){
            console.error(error.message);
            setError('아이디 또는 비밀번호가 일치하지 않습니다.');
            
        } else {
            alert('로그인 성공!');
            navigate("/")
        }

    }




  return (
    <div className={S.container}>
        <div className={S.content}>
            <div className={S.logo}>
                <img src="images/loginbanner.png" alt="모여봐요 프둥이숲" />
            </div>

            <div className={S.loginBox}>
                <form className={S.form} onSubmit={handleLogin}>
                    <label htmlFor="username">이메일</label>
                    <input 
                    type="text" 
                    id="username" 
                    name="username" 
                    required 
                    onChange={(e)=>setEmail(e.target.value)}
                    />

                    <label htmlFor="password">비밀번호</label>
                    <input 
                    type="password" 
                    id="password" 
                    name="password" 
                    required 
                    onChange={(e)=>setPassword(e.target.value)}
                    />

                    <div className={S.link}>
                        <Link to="/register">아직 프둥이숲 주민이 아니신가요?</Link>
                    </div>

                        <button className={S.login} type="submit">로그인하기</button>
                        {error && 
                        <p className={S.p}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14px" height="14px" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                            </svg>
                            {error}
                        </p>
                    }
                </form>
            </div>
        </div>
    </div>
  )
}
export default login