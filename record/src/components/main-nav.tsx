'use client'

import Link from "next/link";
import style from './main-nav.module.css';
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function MainNav() {
    const supabase = createClient()
    const router = useRouter();
    const logout = async () => {
        try{
            const { error } = await supabase.auth.signOut();
            if(!error){
                return router.push('/login');
            }else {
                alert('로그아웃에 실패하였습니다.');
            }
        }catch(error){
            console.error(error)
        }
        
    }
    return (
        <nav className={style.nav}>
            <Link href={'/main'} className={style.logo}>Record</Link>
            <div className={style.navDiv}>
                <Link href={'/main/mypage'}>마이페이지</Link>
                <button onClick={logout} className={style.logoutBtn}>로그아웃</button>
            </div>
        </nav>
    )
}