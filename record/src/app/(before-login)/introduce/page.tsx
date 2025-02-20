import styles from "./page.module.css";
import Image from "next/image";
import intro from "../../../../public/intro.jpg";
import categoryVideo from "../../../../public/category.gif"
import searchVideo from "../../../../public/search.gif"
import Link from "next/link";

export default function Home() {

  return (
    <div className={styles.page}>
      <section className={styles.intro}>
        <Image 
          src={intro}
          alt="인트로 이미지 - 여자가 지도를 보고 있는 모습"
        />
        <p className={styles.titleText}>
          내가 다녀왔던 장소,
          나만의 장소 기록
        </p>
      </section>
      <section className={styles.content}>
        <p className={styles.text1}>❝ 어? 거기 맛있었는데… 어디였더라? ❞</p>
        <p className={styles.text2}>
          세상의 많은 정보 속에서 <br />
          나만의 <span>진짜 보물</span>을 찾자.
        </p>
      </section>
      <section className={styles.feature}>
        <div>
          <p>✔ 가게명, 별점순, 카테고리별 정리</p>
          <p>✔ 나만의 장소를 쉽고 간편하게 기록</p>
        </div>
        <div>
          <Image 
            src={categoryVideo}
            width={300}
            alt="카테고리별 정리"
          />
        </div>
      </section>
      <section className={styles.feature2}>
        <div className={styles.videoWrap}>
          <Image
            src={searchVideo}
            className={styles.searchVideo}
            alt="검색 기능"
          />
        <p className={styles.text3}>
          📍 보다 간단하게 위치 확인! <br />
          필요한 순간, 빠르게 찾아보는 내 리스트
        </p>
        </div>
      </section>
      <footer className={styles.footer}>
        <p>📌 추억이 스쳐 지나가기 전에, 내 리스트에 딱!</p>
        <p>소중한 장소를 잊지 않도록, 오늘부터 기록해보세요!</p>
        <Link href="/login">
          <button type="button" className={styles.btn}>기록하기</button>
        </Link>
      </footer>
    </div>
  );
}
