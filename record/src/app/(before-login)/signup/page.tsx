"use client"

import { useEffect, useRef, useState } from 'react';
import style from './page.module.css';
import supabase from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

export default function Page() {
    const [email, setEmail] = useState('');
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const [pw, setPw] = useState('');
    const handlePw = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPw(e.target.value);
    }

    const[checkPw, setCheckPw] = useState('');
    const handleCheckPw = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckPw(e.target.value)
    }

    const[name, setName] = useState('');
    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }

    const[checkEmail, setCheckEmail] = useState('');
    const handleCheckEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCheckEmail(e.target.value);
    }

    // 비밀번호 확인
    const [pwStatus, setPwStatus] = useState('');
    useEffect(() => {
        if(pw != checkPw) {
            setPwStatus('비밀번호가 일치하지 않습니다.');
        }
        if(pw == checkPw) {
            setPwStatus('')
        }
    }, [checkPw])

    // 가입하기 버튼 클릭 시 
    const router = useRouter();
    const [errorStatus, setErrorStatus] = useState(0);
    const checkPwInputRef = useRef<HTMLInputElement>(null);
    const pwInputRef = useRef<HTMLInputElement>(null)

    const signupBtn = async () => {
        try {
            // 비밀번호가 일치하지 않을 때
            if(pw != checkPw){ 
                return checkPwInputRef.current?.focus();
            }
            // 이름이 없을 때
            if(name == '') {
                return pwInputRef.current?.focus();
            }
            // 회원가입 파라미터
            const params = {
                email : email,
                password: pw,
                options: {
                    data: {
                        name: name,
                        // user_type: ,
                        // phone: ,
                    },
                },
            }
            // 회원가입 요청
            const { error } = await supabase.auth.signUp(params)

            if(error?.status === 422){ // 비밀번호 형식이 충족되지 않을 때
                setErrorStatus(422)
            }else if(error?.status === 400){ // 아이디 포맷 형식 불일치 등의 오류
                setErrorStatus(400)
            }else if(!error){ // 성공적으로 signUp 후 로그인 페이지로 이동
                alert('회원가입이 되었습니다.');
                router.push('/login');
            }
        }catch(error) {
            console.error(error)
        }
    }
    
    return (
        <div className={style.wrap}>
            <h3 className={style.title}>Record</h3>
            <div className={style.input_wrap}>
                <p><span className={style.red}>*</span> 아이디</p>
                {
                    errorStatus === 400 ? (
                        <p className={`${style.annotation} ${style.red}`}>아이디는 id@email.com 형식으로 적어주세요.</p>
                    ) : (
                        <p className={`${style.annotation}`}>아이디는 id@email.com 형식으로 적어주세요.</p>
                    )
                }
                <input type="text" value={email} onChange={handleEmail}/>
            </div>
            <div className={style.input_wrap}>
                <p><span className={style.red}>*</span> 비밀번호</p>
                {
                    errorStatus === 422 ? (
                        <p className={`${style.annotation} ${style.red}`}>비밀번호는 6자리 이상으로 적어주세요.</p>
                    ) : (
                        <p className={`${style.annotation}`}>비밀번호는 6자리 이상으로 적어주세요.</p>
                    )
                }
                <input type="password" value={pw} onChange={handlePw}/>
            </div>
            <div className={style.input_wrap}>
                <p>비밀번호 확인</p>
                <p className={`${style.annotation} ${style.red}`}>
                    {pwStatus}
                </p>
                <input type="password" ref={checkPwInputRef} value={checkPw} onChange={handleCheckPw}/>
            </div>
            <div className={style.input_wrap}>
                <p><span className={style.red}>*</span> 이름</p>
                <input type="text" ref={pwInputRef} value={name} onChange={handleName}/>
            </div>
            <div className={style.input_wrap}>
                <p>본인 확인 이메일</p>
                <input type="text" value={checkEmail} onChange={handleCheckEmail}/>
                <button type='button'>인증하기</button>
            </div>
            <button type="button" onClick={signupBtn} className={style.signupBtn}>가입하기</button>
            <button type="button" className={style.kakaoBtn}>카카오톡으로 가입하기</button>
        </div>
    )
}