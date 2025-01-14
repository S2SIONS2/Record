'use client'

import Link from "next/link";
import style from './main-nav.module.css';
import { useRouter } from "next/navigation";

export default function MainNav() {
    const router = useRouter();
    const logout = () => {
        router.push('/login');
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