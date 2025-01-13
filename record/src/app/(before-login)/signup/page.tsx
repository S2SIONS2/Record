"use client"

import { useState } from 'react';
import style from './page.module.css';
import supabase from '@/utils/supabase/client';

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

    // 가입하기 버튼 클릭 시 
    const signupBtn = async () => {
        const params = {
            email : email,
            password: pw,
            data: {'full_name': name},
        }
        await supabase.auth.signUp(params)
    }
    
    return (
        <div className={style.wrap}>
            <h3 className={style.title}>Record</h3>
            <div>
                <p>아이디</p>
                <input type="text" value={email} onChange={handleEmail}/>
            </div>
            <div>
                <p>비밀번호</p>
                <input type="password" value={pw} onChange={handlePw}/>
            </div>
            <div>
                <p>비밀번호 확인</p>
                <input type="password" value={checkPw} onChange={handleCheckPw}/>
            </div>
            <div>
                <p>이름</p>
                <input type="text" value={name} onChange={handleName}/>
            </div>
            <div>
                <p>본인 확인 이메일</p>
                <input type="text" value={checkEmail} onChange={handleCheckEmail}/>
                <button type='button'>인증하기</button>
            </div>
            <button type="button" onClick={signupBtn}>가입하기</button>
            <button type="button">카카오톡으로 가입하기</button>
        </div>
    )
}