import style from "./page.module.css";
import {notFound} from "next/navigation";
import {ReviewData} from "@/types";
import ReviewItem from "@/components/review-item";
import {ReviewEditor} from "@/components/review-editer";

export const dynamicParams = true;
export function generateStaticParams() {
    return [{id: "1"}, {id: "2"}, {id: "3"}]
}

async function ReviewList ( {bookId} : {bookId : string}) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`
        , {next : {tags: [`review-${bookId}`]}});

    if (!response.ok) {
        throw new Error(`Review fetch failed : ${response.statusText}`);
    }

    const reviews: ReviewData[] = await response.json();

    return (
        <section>
            {reviews.map((review) => {
                return <ReviewItem key={`review-item-${review.id}`} {...review} />;
            })}
        </section>
    );
}

async function BookDetail ({BookId} : {BookId:string}) {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/${BookId}`,
        {cache : "force-cache"});
    if (!response.ok) {
        if (response.status === 404) {
            notFound();
        }
        return <div> 오류가 발생했습니다... </div>
    }
    const book = await response.json();

    const { title, subTitle, description, author, publisher, coverImgUrl } = book;

    return (
        <section>
            <div
                className={style.cover_img_container}
                style={{ backgroundImage: `url('${coverImgUrl}')` }}
            >
                <img src={coverImgUrl} />
            </div>
            <div className={style.title}>{title}</div>
            <div className={style.subTitle}>{subTitle}</div>
            <div className={style.author}>
                {author} | {publisher}
            </div>
            <div className={style.description}>{description}</div>
        </section>
    );
}




export default async function Page({
  params,
}: {
  params: { id: string};
}) {
    const { id } = await params; // ✅ await 사용

  return(
      <div className={style.container}>
          <BookDetail BookId={id}/>
          <ReviewEditor bookId={id} />
          <ReviewList bookId={id} />
      </div>
  )
}
