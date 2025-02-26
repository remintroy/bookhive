"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import server from "@/lib/axios";
import Book from "@/types/Books";
import { MessageSquareShare } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const BookById = () => {
  const { bookId } = useParams();
  const [data, setData] = useState<Book | null>(null);
  const [loading, SetLoading] = useState(true);

  const fetchBookData = async () => {
    try {
      SetLoading(true);
      const { data } = await server.get(`/api/books/${bookId}`);
      setData(data);
    } catch (error) {
      console.log(error);
    } finally {
      SetLoading(false);
    }
  };

  useEffect(() => {
    fetchBookData();
  }, []);

  return (
    <div className="container max-w-7xl mx-auto p-5 grid md:grid-cols-2 gap-4">
      <div className="relative flex flex-col gap-4">
        <Carousel>
          <CarouselContent>
            {!data?.images?.length && (
              <CarouselItem>
                <AspectRatio
                  ratio={1 / 1}
                  className="rounded-[var(--radius)] overflow-hidden border relative bg-muted flex items-center justify-center text-muted-foreground"
                >
                  {loading ? "Loading..." : "No images available"}
                </AspectRatio>
              </CarouselItem>
            )}
            {data?.images?.map((url) => (
              <CarouselItem key={url}>
                <AspectRatio ratio={1 / 1} className="rounded-[var(--radius)] overflow-hidden border relative bg-muted">
                  {data && (
                    <Image fill src={url} alt={data?.title} className="object-scale-down w-full h-full select-none" />
                  )}
                </AspectRatio>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-5" />
          <CarouselNext className="absolute right-5" />
        </Carousel>
        {data?.description && (
          <div className="flex flex-col gap-2 border p-5 rounded-[var(--radius)] overflow-hidden">
            <h2 className="font-bold">Description</h2>
            <p className="text-xm text-muted-foreground">{data?.description}</p>
          </div>
        )}
      </div>
      <div className="w-full bg-red flex flex-col gap-4">
        <div className="flex flex-col gap-2 border p-5 rounded-[var(--radius)] overflow-hidden">
          <h1 className="text-2xl font-bold">{data?.title}</h1>
          <p className="">By : {data?.author}</p>
          {data?.createdAt && (
            <div className="text-muted-foreground">Posted on : {new Date(data?.createdAt).toDateString()}</div>
          )}
        </div>

        <div className="flex flex-col gap-2 border p-5 rounded-[var(--radius)] overflow-hidden">
          <h2 className="font-bold">Category</h2>
          <p className="text-xm text-muted-foreground">{data?.categories?.join(",")}</p>
        </div>

        <div className="flex flex-col gap-4 border p-5 rounded-[var(--radius)] overflow-hidden">
          <h2 className="font-bold">Seller details</h2>
          <div className="flex flex-row gap-3 items-center">
            {data?.sellerData?.photoURL && (
              <Avatar>
                <AvatarImage src={data?.sellerData?.photoURL} />
                <AvatarFallback>{data?.sellerData?.displayName}</AvatarFallback>
              </Avatar>
            )}
            <div className="capitalize">{data?.sellerData?.displayName}</div>
          </div>
          <Button variant={"outline"}>
            Chat with seller
            <MessageSquareShare />
          </Button>
        </div>

        <div className="flex flex-col gap-2 border p-5 rounded-[var(--radius)] overflow-hidden">
          <h2 className="font-bold">Location</h2>
          {data?.location?.address2 && <p className="text-xs text-muted-foreground">{data?.location?.address2}</p>}
          <p className="text-xs text-muted-foreground">{data?.location?.address}</p>
          {data?.location?.googleMapUrl && (
            <div className="relative rounded-[var(--radius)] overflow-hidden border">
              <iframe
                src={data?.location?.googleMapUrl}
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: "var(--radius)" }}
                // allowFullScreen=""
                loading="lazy"
                // referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute bg-muted/30 pointer-events-none w-full h-full top-0 left-0" />
              <div className="absolute dark:text-white/30 text-black/10 pointer-events-none w-full h-full top-0 left-0 flex items-center justify-center">
                Approximate Preview
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookById;
