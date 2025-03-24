"use state";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useBookApi from "@/hooks/useBookApi";
import { cn } from "@/lib/utils";
import Book from "@/types/Books";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const bookDataCatch: { [key: string]: Book } = {};

const AttachBook = ({ bookId, messageMode }: { bookId?: string; messageMode?: boolean }) => {
  const { getBookById } = useBookApi();
  const [data, setData] = useState<Book | null>(null);
  const [bookDataLoading, setBookDataLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();

  const fetchBookData = async () => {
    setBookDataLoading(true);
    if (!bookId) return;
    if (bookDataCatch[bookId]) {
      setBookDataLoading(false);
      return setData(bookDataCatch[bookId]);
    }
    try {
      const data = await getBookById(bookId);
      setData(data);
      bookDataCatch[bookId] = data;
    } catch (error) {
      console.log(error);
      setError(true);
    } finally {
      setBookDataLoading(false);
    }
  };

  useEffect(() => {
    if (bookId) fetchBookData();
  }, [bookId, fetchBookData]);

  return (
    <>
      {!error && !messageMode && (
        <div className="sticky bottom-0 mt-2 bg-muted p-4 rounded-[var(--radius)]">
          <div className="flex flex-row gap-3 md:gap-4">
            {bookDataLoading && <Skeleton className="w-[80px] h-[80px] bg-muted-foreground" />}
            {!bookDataLoading && data?.images?.[0] && (
              <div
                className="relative h-[80px] w-[80px] overflow-hidden rounded-[var(--radius)] cursor-pointer"
                onClick={() => router.push(`/book/${bookId}`)}
              >
                <Image className="object-scale-down" fill src={data?.images?.[0] || ""} alt={data?.title} />
              </div>
            )}
            <div className="flex flex-col justify-between">
              <div className="flex flex-col gap-0 cursor-pointer" onClick={() => router.push(`/book/${bookId}`)}>
                {bookDataLoading && <Skeleton className="w-full h-4 bg-muted-foreground" />}
                {!bookDataLoading && <h1 className="line-clamp-1 font-bold">{data?.title}</h1>}
                {bookDataLoading && <Skeleton className="w-full h-2 bg-muted-foreground mt-2" />}
                {data?.author && <div className="text-muted-foreground line-clamp-2 text-sm">By {data?.author}</div>}
                {bookDataLoading && <Skeleton className="w-full h-2 bg-muted-foreground mt-2" />}
                {data?.description && <div className="text-muted-foreground line-clamp-2">{data?.description}</div>}
              </div>
              <div className="text-muted-foreground line-clamp-2 text-xs italic mt-1">
                This chat is started form book
              </div>
            </div>
          </div>
        </div>
      )}

      {!error && data && messageMode && (
        <div className="pt-1">
          <Separator />
          <div className="p-2 rounded-[var(--radius)]">
            <div
              className="flex flex-row gap-2 cursor-pointer items-center"
              onClick={() => router.push(`/book/${bookId}`)}
            >
              {!bookDataLoading && data?.images?.[0] && (
                <div
                  className={cn(
                    "relative h-[16px] w-[16px] overflow-hidden rounded-[var(--radius)] border",
                    `${
                      data?.bookStatus === "claimed"
                        ? "border-red-500"
                        : data?.bookStatus === "pending"
                        ? "border-yellow-500"
                        : "border-green-500"
                    }`
                  )}
                >
                  <Image className="object-scale-down" fill src={data?.images?.[0] || ""} alt={data?.title} />
                </div>
              )}
              <div className="flex flex-col justify-between">
                <div className="flex flex-col gap-0">
                  <h1 className="line-clamp-1 font-bold text-xs text-muted-foreground">{data?.title}</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AttachBook;
