"use client";

import { createClient } from "@/utils/supabase/client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import style from "./page.module.css";
import Link from "next/link";

interface Place {
    id: number | string;
    address: string;
    category: string;
    name: string;
    score: number;
}

interface Menu {
    id: number | string;
    placelist_id: number | string;
    name: string;
    description: string;
    is_good: boolean;
}

export default function Page() {
    const searchParams = useSearchParams();
    const id = searchParams?.get("id");

    const [isLoad, setIsLoad] = useState(false);
    const [place, setPlace] = useState<Place | null>(null);
    const [menuList, setMenuList] = useState<Menu[]>([]);

    const supabase = createClient();

    // list 불러오기
    const fetchData = async () => {
        if (!id) return;

        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;

        const [placeResponse, menuResponse] = await Promise.all([
            fetch(`/api/placelist/${userId}`),
            fetch(`/api/menu/${userId}`)
        ]);

        const placeData: Place[] = await placeResponse.json();
        const menuData: Menu[] = await menuResponse.json();

        // 해당 id의 place와 menu 필터링
        const selectedPlace = placeData.find((item) => item.id == id) || null;
        const selectedMenuList = menuData.filter((item) => item.placelist_id == id);

        setPlace(selectedPlace);
        setMenuList(selectedMenuList);
        setIsLoad(true);
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    // 메뉴 폼
    const [form, setForm] = useState({
        name: "",
        score: 5,
        address: "",
        category: "음식점"
    });

    useEffect(() => {
        if (place) {
            setForm({
                name: place.name || "",
                score: place.score || 5,
                address: place.address || "",
                category: place.category || "음식점"
            });
        }
    }, [place]);

    const categoryList = ["음식점", "카페", "숙소", "여가/테마파크", "기타"];

    // 공통 핸들러
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: name === "score" ? Number(value) : value
        }));
    };

    const handleMenuChange = (index: number, field: keyof Menu, value: string | boolean | number) => {
        setMenuList((prev) =>
            prev.map((menu, i) =>
                i === index ? { ...menu, [field]: value } : menu
            )
        );
    };

    const onModifyMenu = async () => {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user.id;

        const response = await fetch(`/api/menu/all/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(menuList)
        });

        await response.json();
    }

    const onModifyList = () => {

        onModifyMenu();
    }

    if (!isLoad) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {place && (
                <div className={style.inputWrap}>
                    <div>
                        <p>가게 명 & 별점</p>
                        <div className={style.flex}>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                            <select name="score" value={form.score} onChange={handleChange} required>
                                {[5, 4, 3, 2, 1].map((num) => (
                                    <option key={num} value={num}>
                                        {num}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <p>가게 분류</p>
                        <select name="category" value={form.category} onChange={handleChange}>
                            {categoryList.map((item) => (
                                <option value={item} key={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <p>주소</p>
                        <input
                            type="text"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                        />
                    </div>
                    <div>
                        <div className={style.flexBetween}>메뉴</div>
                        {menuList.map((menu, index) => (
                            <div key={menu.id} className={style.menuWrap}>
                                <div className={style.menuSet}>
                                    <input
                                        type="text"
                                        value={menu.name}
                                        onChange={(e) => handleMenuChange(index, "name", e.target.value)}
                                    />
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={menu.is_good}
                                            onChange={(e) => handleMenuChange(index, "is_good", e.target.checked)}
                                        />
                                    </label>
                                </div>
                                <textarea
                                    value={menu.description}
                                    onChange={(e) => handleMenuChange(index, "description", e.target.value)}
                                    className={style.textArea}
                                ></textarea>
                            </div>
                        ))}
                    </div>
                    <div className={style.btn_wrap}>
                        <button type="submit" onClick={onModifyList} className={style.submitBtn}>저장</button>
                        <Link href={'/main'}>
                            <button type="submit" className={style.closeBtn}>닫기</button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}
