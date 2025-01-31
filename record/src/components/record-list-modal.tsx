'use client'

import { useState } from "react";

export default function RecordListModal() {
    // search input
    const [search, setSearch] = useState('');
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }
    const onSubmit = async () => {
        const response = await fetch(
            `/api/naver?query=${search}`,
            { cache: "force-cache" }
        );
        console.log(response)
    }
    // 인풋에서 검색
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
        onSubmit();
        }
    };
    return (
        <div>
            <h1>Record List Modal</h1>
            <div>
                <input type="text" value={search} onChange={handleSearch} onKeyDown={onKeyDown}/>
                <button onClick={onSubmit}>검색</button>
            </div>
            
        </div>
    )
}