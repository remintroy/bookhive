"use client";

import ProductGrid from "@/components/product-grid";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import useMetadata from "@/hooks/useMetadata";
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
  const metadata = useMetadata();

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
    <div className="container max-w-7xl mx-auto p-5 md:py-10 flex flex-col gap-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative flex flex-col gap-4">
          <Carousel>
            <CarouselContent>
              {!data?.images?.length && (
                <CarouselItem>
                  <AspectRatio
                    ratio={1 / 1}
                    className="rounded-[var(--radius)] overflow-hidden border relative bg-muted flex items-center justify-center text-muted-foreground"
                  >
                    {loading ? "" : "No images available"}
                  </AspectRatio>
                </CarouselItem>
              )}
              {data?.images?.map((url) => (
                <CarouselItem key={url}>
                  <AspectRatio
                    ratio={1 / 1}
                    className="rounded-[var(--radius)] overflow-hidden border relative bg-muted"
                  >
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
        </div>
        <div className="w-full bg-red flex flex-col gap-5 md:px-5">
          {loading ? (
            <div className="flex flex-col gap-2.5">
              <Skeleton className="w-full h-7" />
              <Skeleton className="w-full h-5" />
              <Skeleton className="w-[50%] h-4" />
              <div className="flex flex-row gap-2 w-[60%]">
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
                <Skeleton className="w-full h-6" />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl font-bold">{data?.title}</h1>
              <p className="">
                By <span className="">{data?.author}</span>
              </p>
              {data?.createdAt && (
                <div className="text-muted-foreground text-sm">
                  Posted on : {new Date(data?.createdAt).toDateString()}
                </div>
              )}
              {data?.categories?.length !== 0 && (
                <div className="flex flex-wrap flex-row gap-1 mt-2">
                  {data?.categories?.map((e) => (
                    <Badge variant={"outline"} key={e}>
                      #{e}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}

          {data?.seller !== metadata?.uid && (
            <>
              <Separator />
              {loading ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-3 items-center">
                    <Avatar>
                      <Skeleton className="w-full h-full" />
                    </Avatar>
                    <Skeleton className="w-[40%] h-5" />
                  </div>
                  <Skeleton className="w-full h-10" />
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-3 items-center">
                    {data?.sellerData?.photoURL && (
                      <Avatar>
                        <AvatarImage src={data?.sellerData?.photoURL} />
                        <AvatarFallback>{data?.sellerData?.displayName?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <div className="capitalize">{data?.sellerData?.displayName}</div>
                  </div>
                  <Button>
                    Chat with seller
                    <MessageSquareShare />
                  </Button>
                </div>
              )}
            </>
          )}

          {data?.description && (
            <>
              <Separator />
              <div className="flex flex-col gap-2">
                <h2 className="font-bold">Book description</h2>
                <p className="text-xm text-muted-foreground">{data?.description}</p>
              </div>
            </>
          )}

          <Separator />

          {loading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="w-[20%] h-6" />
              <Skeleton className="w-[40%] h-4" />
              <Skeleton className="w-full h-[350px]" />
            </div>
          ) : (
            <div className="flex flex-col gap-2">
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
          )}
        </div>
      </div>
      <Separator />
      <div className="flex flex-col gap-5">
        <h2 className="font-bold">Similar books</h2>
        <ProductGrid categorys={data?.categories} excludes={bookId ? [bookId as string] : []} showLoading={loading} />
      </div>
    </div>
  );
};

export default BookById;
