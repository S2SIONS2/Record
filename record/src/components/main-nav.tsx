import Link from "next/link";
import style from './main-nav.module.css';

export default function MainNav() {
    return (
        <nav className={style.nav}>
            <Link href={'/main'} className={style.logo}>Record</Link>
            <div className={style.navDiv}>
                <Link href={'/main/mypage'}>마이페이지</Link>
            </div>
        </nav>
    )
}