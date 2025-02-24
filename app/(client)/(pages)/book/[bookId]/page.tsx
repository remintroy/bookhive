"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Book from "@/types/Books";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const BookById = () => {
  const { bookId } = useParams();
  const [data, setData] = useState<Book | null>(null);

  const fetchBookData = async () => {
    const response = await fetch(`/api/books/${bookId}`);
    const data = await response.json();
    console.log(data);
    setData(data);
  };

  useEffect(() => {
    fetchBookData();
  }, []);

  return (
    <div className="container mx-auto p-5 grid grid-cols-2">
      <div className="max-w-[500px] relative">
        <Carousel>
          <CarouselContent>
            {!data?.images?.length && (
              <CarouselItem>
                <AspectRatio
                  ratio={1 / 1}
                  className="rounded-[var(--radius)] overflow-hidden border relative bg-muted flex items-center justify-center text-muted-foreground"
                >
                  No images available
                </AspectRatio>
              </CarouselItem>
            )}
            {data?.images?.map((url) => {
              return (
                <CarouselItem key={url}>
                  <AspectRatio
                    ratio={1 / 1}
                    className="rounded-[var(--radius)] overflow-hidden border relative bg-muted"
                  >
                    {data && <Image fill src={url} alt={data?.title} />}
                  </AspectRatio>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
      <div className="w-full">hai</div>
    </div>
  );
};

export default BookById;
