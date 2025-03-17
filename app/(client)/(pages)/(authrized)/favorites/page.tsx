"use client";

import ProductCard, { ProductCardLoading } from "@/components/product-card";
import { DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import useBookApi from "@/hooks/useBookApi";
import Book from "@/types/Books";
import { Heart } from "lucide-react";
import React, { useEffect, useState } from "react";

interface CustomResponse {
  bookData: Book;
  bookId: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

const Favorites = () => {
  const { getFromFavorites } = useBookApi();
  const [data, setData] = useState<CustomResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const { deleteFromFavorites } = useBookApi();

  const getData = async () => {
    try {
      setLoading(true);
      const data = await getFromFavorites();
      setData(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="container mx-auto flex flex-col gap-5 py-10 p-5">
      <h1 className="text-xl font-bold">Favorites</h1>
      <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 w-full">
        {(loading || loading) &&
          Array(4)
            ?.fill(0)
            ?.map((e, i) => <ProductCardLoading key={e + i} />)}
        {!loading && !loading && !data?.length && (
          <div className="absolute w-full p-10 border rounded-[var(--radius)]">
            <h2 className="text-xl text-center">No books found.</h2>
          </div>
        )}
        {!loading &&
          !loading &&
          data?.map((data) => (
            <ProductCard
              customMenu={
                <>
                  <DropdownMenuLabel>Manage book</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      deleteFromFavorites(data?.bookId as string);
                      setData((pre) => pre?.filter((val) => val.bookId != data?.bookId));
                    }}
                  >
                    <Heart fill="white" /> Remove From favorites
                  </DropdownMenuItem>
                </>
              }
              key={data?.bookData?._id}
              {...data?.bookData}
              reFetch={() => getData()}
            />
          ))}
      </div>
    </div>
  );
};

export default Favorites;
