import { useId, useState } from "react";
import S from "./Register.module.css";
import supabase from "@/supabase/supabase";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "@/components/PasswordInput";
import {
  showErrorAlert,
  showInfoAlert,
  showSuccessAlert,
} from "@/utils/sweetAlert";
import { useAuth } from "@/auth/AuthProvider";

function Register() {
  const nameId = useId();
  const emailId = useId();
  const pwId = useId();
  const pwConfirmId = useId();
  const fileId = useId();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [certificateFile, setCertificateFile] = useState<File | null>(null);
  const {logout} = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [agree, setAgree] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);

    if (password !== passwordConfirm) {
      await showErrorAlert(
        "비밀번호 불일치",
        "비밀번호가 일치하지 않습니다. 다시 확인해주세요."
      );
      setError("비밀번호가 일치하지 않습니다. 다시 확인해주세요.");
      return;
    }

    if (!certificateFile) {
      await showInfoAlert(
        "수료증 업로드 누락",
        "수료증 파일을 업로드해주세요."
      );
      setError("수료증 파일을 업로드해주세요.");
      return;
    }

    if (agree === false) {
      await showInfoAlert("약관 동의 필요", "모든 이용 약관에 동의해주세요.");
      setError("모든 이용 약관에 동의해주세요.");
      return;
    }

    const {
      data: { user },
      error: signUpError,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (signUpError || !user) {
      console.error("회원가입 실패!", signUpError?.message);
      showErrorAlert("회원가입 실패", "회원가입에 실패했습니다.");
      setError(signUpError?.message || "회원가입에 실패했습니다.");
      return;
    }

    const fileExt = certificateFile.name.split(".").pop();
    const filePath = `${user.id}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("certificates")
      .upload(filePath, certificateFile);

    if (uploadError) {
      console.error("파일 업로드 실패:", uploadError.message);
      setError("수료증 파일 업로드에 실패했습니다.");
      return;
    }

    const uploadCertificatieFile = async() => {
      const {error} = await supabase
        .from('certification')
        .insert({
          image:filePath,
          email:email
        })
      if(error) console.error('수료증 등록 실패');
    }
    uploadCertificatieFile();

    await showSuccessAlert(
      "회원가입 성공!",
      "프둥이숲에 오신 걸 환영합니다!🎉"
    );
    setTimeout(() => {
      localStorage.clear();
      navigate("/login");
      logout();

    }, 1600);
  };

  return (
    <div className={S.container}>
      <div className={S.registerBox}>
        <img src="/images/nail.png" className={`${S.nail} ${S["top-left"]}`} />
        <img src="/images/nail.png" className={`${S.nail} ${S["top-right"]}`} />
        <img
          src="/images/nail.png"
          className={`${S.nail} ${S["bottom-left"]}`}
        />
        <img
          src="/images/nail.png"
          className={`${S.nail} ${S["bottom-right"]}`}
        />

        <div className={S.leftSide}>
          <img
            className={S.image}
            src="images/register.png"
            alt="회원가입 이미지"
          />
          <Link to="/" className={S.toMain}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16px"
              height="16px"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
            메인으로 돌아가기
          </Link>
        </div>
        <form onSubmit={handleRegister} className={S.form}>
          <h2>회원가입을 진행해주세요</h2>

          <label htmlFor={nameId}>성함</label>
          <input
            type="text"
            id={nameId}
            name="userName"
            required
            placeholder="수료증과 동일한 성명을 입력해주세요"
            onChange={(e) => setName(e.target.value)}
          />

          <label htmlFor={emailId}>이메일</label>
          <input
            type="text"
            id={emailId}
            name="email"
            required
            placeholder="이메일을 입력해주세요"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor={pwId}>비밀번호</label>
          <PasswordInput
            id={pwId}
            name="password"
            value={password}
            placeholder="6자 이상 입력해주세요"
            onChange={(e) => setPassword(e.target.value)}
          />

          <label htmlFor={pwConfirmId}>비밀번호 확인</label>
          <PasswordInput
            id={pwConfirmId}
            name="confirm"
            placeholder="비밀번호를 다시 입력해주세요"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
          />

          <label htmlFor={fileId}>수료증 인증</label>
          <input
            type="file"
            id={fileId}
            name="file"
            accept="image/*, .pdf"
            // required
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              setCertificateFile(file);
            }}
          />

          <div className={S.checkbox}>
            <input
              type="checkbox"
              id="agree"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <label htmlFor="agree">모든 이용 약관에 동의합니다.</label>
          </div>

          <button className={S.register} type="submit">
            회원가입하기
          </button>
          {error && (
            <p className={S.p}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14px"
                height="14px"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              {error}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
export default Register;
