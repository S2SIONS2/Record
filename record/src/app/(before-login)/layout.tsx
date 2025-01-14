import LoginNav from "@/components/login-nav";
import { Suspense } from "react";
import style from './page.module.css';

export default function Page({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginNav />
            </Suspense>
            <div className={style.container}>
                {children}
            </div>
        </div>
    )
}