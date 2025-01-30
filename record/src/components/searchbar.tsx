'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Searchbar() {
    const [search, setSearch] = useState('');

    const router = useRouter()
    const searchParams = useSearchParams();

    const q = searchParams?.get('q')

    useEffect(() => {
        setSearch(q || '');
    }, [q])

    const onChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };
    
    const onSubmit = () => {
        if (!search || q === search) return;
        router.push(`/search?q=${search}`);
    };

    // 인풋으로 검색
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          onSubmit();
        }
    };
    return (
        <div>
            <input type="text" value={search} onChange={onChangeSearch} onKeyDown={onKeyDown}/>
            <button onClick={onSubmit}>검색</button>
        </div>
    )
}