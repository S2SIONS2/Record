'use client';

import { useEffect, useState } from 'react';
import style from './page.module.css';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

export default function Page() {
    const supabase = createClient()

    const [email, setEmail] = useState('chasio100@naver.com');
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const [pw, setPw] = useState('123456');
    const handlePw = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPw(e.target.value);
    }

    const router = useRouter();
    const signInBtn = async () => {
        try{
            const {data, error} = await supabase.auth.signInWithPassword({
                email: email,
                password: pw
            })

            if(!error){
                console.log(data);
                return router.push('/main');
            }else {
                alert(`로그인에 실패하였습니다. ${error.message}`);
            }
        }catch(error){
            console.error(error);
        }
    }

    // 엔터 키 누르면 로그인 되게
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if(e.key === 'Enter') {
            signInBtn();
        }
    }
    
    // 카카오톡 회원가입 및 로그인
    const kakaoLogin = async () => {
        console.log(process.env.NEXT_PUBLIC_SUPABASE_URL);
        try {          
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'kakao',
                options: {
                    redirectTo: process.env.NEXT_PUBLIC_SUPABASE_URL
                      ? `https://${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/callback`
                      : "http://localhost:3000/api/auth/callback",
                    // redirectTo: "http://localhost:3000/api/auth/callback"
                  },
            })
            if(error) {
                console.error(error);
            }

        }catch(error) {
            console.error(error);
        }
    }

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === "SIGNED_IN" && session) {
            // 로그인 성공 시 리다이렉트
            router.push("/main");
          }
        });
      }, [router]);

    return (
        <div className={style.wrap}>
            <h3 className={style.title}>Record</h3>
            <div className={style.input_wrap}>
                <p>아이디</p>
                <input type="text" value={email} onChange={handleEmail} onKeyDown={handleKeyDown} placeholder='id@email.com'/>
            </div>
            <div className={style.input_wrap}>
                <p>비밀번호</p>
                <input type="password" value={pw} onChange={handlePw} onKeyDown={handleKeyDown} placeholder='123456'/>
            </div>
            
            <button type="button" onClick={signInBtn} className={style.signInBtn}>로그인</button>
            <button type="button" onClick={kakaoLogin} className={style.kakaoBtn}>카카오톡으로 로그인하기</button>
            <Link href={'/signup'} className={style.link}>회원이 아니신가요? 회원가입하기</Link>
        </div>
    )
}