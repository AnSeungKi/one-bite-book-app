"use server";

import { revalidateTag} from "next/cache";
import {delay} from "@/util/delay";

export async function createReviewAction (_: unknown, formData: FormData) {

    console.log("server action")
    const bookId = formData.get("bookId")?.toString();
    const content = formData.get('content')?.toString();
    const author = formData.get('author')?.toString();

    if (!bookId || !content || !author) {
        return {
            status: false,
            error: "리뷰 내용과 작성자를 입력해주세요."
        }
    }

    try {
        await delay(2000);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review`,{
                method: "POST",
                body : JSON.stringify({bookId, content, author})
            }
        )
        if (!response.ok) {
            throw new Error(response.statusText);
        }
        // 제일 효율적 해당 태그로 호출된 fetch 는 재검증
        revalidateTag(`review-${bookId}`);
        return {
            status : true,
            error : ""
        }
    } catch (err) {
        return {
            status: false,
            error: `리뷰 저장에 실패했습니다. : ${err}`
        }
    }
}