import BookItem from "@/components/book-item";
import {BookData} from "@/types";
import {delay} from "@/util/delay";
import { Suspense } from "react";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";
import {Metadata} from "next";


async function SearchResult ({q}: {q:string}) {
  await delay(1500);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${q}`, {cache: "force-cache"});
  if (!response.ok) {
    return <div>오류가 발생하였습니다...</div>
  }
  const books : BookData[] = await response.json();
  return (
      <div>
        {books.map((book) => (
            <BookItem key={book.id} {...book} />
        ))}
      </div>
  );
}

export async function generateMetadata(
    { searchParams }: { searchParams: { q?: string | undefined} }  // ✅ 올바른 타입
): Promise<Metadata> {
    const q = searchParams.q ?? "";

    return {
        title: `${q} : 한입북스 검색`,
        description: `${q} 의 검색 결과입니다.`,
        openGraph: {
            title: `${q} : 한입북스 검색`,
            description: `${q} 의 검색 결과입니다.`,
            images: ["/thumbnail.png"]
        }
    };
}


export default async function Page({
                                       searchParams,
                                   }: {
    searchParams: { q?: string };
}) {
    const q = searchParams.q ?? "";

    return (
        <Suspense key={q} fallback={<BookListSkeleton count={3} />}>
            <SearchResult q={q} />
        </Suspense>
    );
}
