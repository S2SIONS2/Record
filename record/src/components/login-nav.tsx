import Link from "next/link";
import style from './login-nav.module.css';

export default function LoginNav() {
    return (
        <nav className={style.nav}>
            <Link href={'/'}>Record</Link>
            <div className={style.navDiv}>
                <Link href={'/login'}>Login</Link>
                <Link href={'/signup'}>Sign Up</Link>
            </div>
        </nav>
    )
}