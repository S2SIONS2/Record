import LoginNav from "@/components/login-nav";
import { Suspense } from "react";

export default function Page({children}: Readonly<{children: React.ReactNode}>) {
    return (
        <div>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginNav />
            </Suspense>
            {children}
        </div>
    )
}