"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Suspense } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import { Skeleton } from "../ui/skeleton";
import Book from "@/types/Books";

interface BooksCard extends Book {
  loading?: boolean;
}

export const ProductCardLoading = () => {
  return (
    <div className="w-full sm:max-w-[160px] overflow-hidden rounded-[var(--radius)] flex flex-col gap-2 justify-between flex-shrink-0">
      <div className="flex flex-col gap-2">
        <div className="relative">
          <AspectRatio ratio={1 / 1} className="rounded-[var(--radius)] overflow-hidden">
            <Skeleton className="w-full h-full" />
          </AspectRatio>
        </div>
        <Skeleton className="w-full h-3" />
        <div className="space-y-1 w-full mt-1">
          <Skeleton className="w-[100%] h-6" />
          <Skeleton className="w-[70%] h-4" />
        </div>
      </div>
      {/* <div className="pt-0 flex justify-between items-center mt-0.5">
        <Button className="w-full" variant={"outline"} disabled asChild>
          <Skeleton className="bg-muted"></Skeleton>
        </Button>
      </div> */}
    </div>
  );
};

const ProductCard = ({ _id, title, author, condition, images, loading, location }: BooksCard) => {
  return (
    <Suspense fallback={<ProductCardLoading />}>
      {loading ? (
        <ProductCardLoading />
      ) : (
        <div className="w-full overflow-hidden flex flex-col gap-2 justify-between">
          <Link href={`/book/${_id}`} className="h-full w-full">
            <div className="flex flex-col gap-2 p-3 rounded-[var(--radius)] h-full bg-muted/30 hover:bg-muted/50">
              <div className="relative">
                <AspectRatio ratio={1 / 1} className="rounded-[var(--radius)] overflow-hidden bg-muted">
                  <Image
                    loading="lazy"
                    fill
                    alt={title}
                    src={images?.[0] || "/placeholder.svg"}
                    className="object-scale-down w-full h-full"
                  />
                </AspectRatio>
                <Badge variant="secondary" className="absolute right-2 top-2 capitalize">
                  {condition}
                </Badge>
              </div>
              <p className="text-[10px] text-muted-foreground italic line-clamp-1">{location?.address}</p>
              <div className="space-y-1 w-full">
                <h1 className="line-clamp-2">{title}</h1>
                <p className="text-sm text-muted-foreground">{author}</p>
              </div>
            </div>
          </Link>
          {/* <div className="pt-0 flex justify-between items-center">
            <Button className="w-full" variant={"outline"} asChild>
              <Link href={`/book/${_id}`}>View Details</Link>
            </Button>
          </div> */}
        </div>
      )}
    </Suspense>
  );
};

export default ProductCard;
