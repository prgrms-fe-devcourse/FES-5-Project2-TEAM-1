
import { useId, useState } from "react";
import S from "./Register.module.css";
import supabase from "@/supabase/supabase";
import { useNavigate } from "react-router-dom";

function Register() {

    const emailId= useId();
    const pwId = useId();
    const pwConfirmId = useId();
    const fileId = useId();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [certificateFile, setCertificateFile] = useState<File | null>(null);
    const [certificatePreview, setCertificatePreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [agree, setAgree] = useState(false);

    const navigate = useNavigate();

    const handleRegister = async(e:React.FormEvent) => {
        e.preventDefault();

        setError(null);

        if(password !== passwordConfirm){
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        if(agree === false){
            setError('모든 이용 약관에 동의해주세요.');
            return;
        }

        if(!certificateFile){
            setError('수료증 파일을 업로드해주세요.');
            return;
        }

        const {data:{user}, error:signUpError} = await supabase.auth.signUp({
            email,
            password,
        });

        if(signUpError || !user){
            console.error('회원가입 실패!');
            setError(signUpError?.message || '회원가입에 실패했습니다.');
            return;
        }

        const fileExt = certificateFile.name.split('.').pop();
        const filePath = `${user.id}.${fileExt}`;

        const {error:uploadError} = await supabase.storage
        .from('certificates')
        .upload(filePath, certificateFile);

        if(uploadError){
            console.error('파일 업로드 실패:', uploadError.message);
            setError('수료증 파일 업로드에 실패했습니다.');
            return;
        }

        alert('회원가입이 성공적으로 완료되었습니다!');
        localStorage.clear();
        navigate("/login");
    }


  return (
    <div className={S.container}>
        <div className={S.registerBox}>
            <div className={S.leftSide}>
                <img className={S.image} src="images/register.png" alt="회원가입 이미지" />
            </div>
            <form onSubmit={handleRegister} className={S.form}>

                <h2>회원가입을 진행해주세요</h2>

                <label htmlFor={emailId}>이메일</label>
                <input  
                type="text" 
                id={emailId} 
                name="username" 
                required 
                onChange={(e)=>setEmail(e.target.value)}
                />

                <label htmlFor={pwId}>비밀번호</label>
                <input 
                type="password" 
                id={pwId}
                name="password" 
                required 
                onChange={(e)=>setPassword(e.target.value)} 
                />

                <label htmlFor={pwConfirmId}>비밀번호 확인</label>
                <input 
                type="password" 
                id={pwConfirmId}
                name="confirm" 
                required 
                onChange={(e)=>setPasswordConfirm(e.target.value)}
                />

                <label htmlFor={fileId}>수료증 인증</label>
                <input  
                type="file" 
                id={fileId} 
                name="file" 
                accept="image/*, .pdf" 
                required 
                onChange={(e)=>{
                    const file = e.target.files?.[0] ?? null;
                    setCertificateFile(file);
                    if(file){
                        const reader = new FileReader();
                        reader.onloadend = () =>{
                            setCertificatePreview(reader.result as string);
                        };

                        reader.readAsDataURL(file);
                    } else {
                        setCertificatePreview(null);
                    }
                }} 
                />

                {certificatePreview && (
                    <div className={S.preview}>
                        {certificateFile?.type.startsWith('image/') ? (
                            <img 
                                src={certificatePreview} 
                                alt="수료증 이미지" 
                                style={{ maxWidth: '200px' }} 
                            />
                        ) : (
                            <p>{''}</p>
                        )}
                    </div>
                )}

                <div className={S.checkbox}>
                    <input 
                    type="checkbox" 
                    id="agree" 
                    checked={agree} 
                    onChange={(e) => setAgree(e.target.checked)}
                    />
                    <label htmlFor="agree">모든 이용 약관에 동의합니다.</label>
                </div>

                <button className={S.register} type="submit">회원가입하기</button>
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
  )
}
export default Register