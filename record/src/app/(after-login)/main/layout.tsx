import MainNav from "@/components/main-nav";
import { Suspense } from "react";
import style from './page.module.css';

export default function Page({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <MainNav />
            </Suspense>
            <div className={style.container}>
                {children}
            </div>
        </div>
    )
}