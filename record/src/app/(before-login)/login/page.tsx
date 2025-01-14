'use client';

import { useState } from 'react';
import style from './page.module.css';
import Link from 'next/link';

export default function Page() {
    const [email, setEmail] = useState('');
    const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const [pw, setPw] = useState('');
    const handlePw = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPw(e.target.value);
    }

    const signInBtn = () => {

    }
    
    return (
        <div className={style.wrap}>
            <h3 className={style.title}>Record</h3>
            <div className={style.input_wrap}>
                <p>아이디</p>
                <input type="text" value={email} onChange={handleEmail}/>
            </div>
            <div className={style.input_wrap}>
                <p>비밀번호</p>
                <input type="password" value={pw} onChange={handlePw}/>
            </div>
            
            <button type="button" onClick={signInBtn} className={style.signInBtn}>로그인</button>
            <Link href={'/signup'} className={style.link}>회원가입하기</Link>
        </div>
    )
}