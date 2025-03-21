"use client";

import Book from "@/types/Books";
import { useEffect, useState } from "react";
import ProductCard, { ProductCardLoading } from "../product-card";
import server from "@/lib/axios";

type Props = {
  search?: string;
  sort?: string;
  lat?: string;
  lon?: string;
  categorys?: string[];
  radius?: number;
  limit?: number;
  showMyBooks?: boolean;
  excludes?: string[];
  userIds?: string[];
  showLoading?: boolean;
  condition?: string;
};

export default function ProductGrid(props?: Props) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  type FetchBookOptions = {
    noCategory?: boolean;
  };

  const fetchBooks = async (options?: FetchBookOptions) => {
    try {
      setLoading(true);
      let searchQuery = `${`&my-books=${!!props?.showMyBooks}`}`;
      if (props?.lat) searchQuery += `&lat=${props?.lat}`;
      if (props?.lon) searchQuery += `&lon=${props?.lon}`;
      if (props?.radius) searchQuery += `&radius=${props?.radius}`;
      if (props?.search) searchQuery += `&search=${props?.search}`;
      if (props?.condition && props?.condition != "all") searchQuery += `&condition=${props?.condition}`;
      if (props?.limit) searchQuery += `&limit=${props?.limit}`;
      if (props?.userIds?.length) searchQuery += `&userIds=${props?.userIds?.join(",")}`;
      if (props?.categorys?.filter?.((e) => e)?.length && !options?.noCategory && !props?.categorys?.includes("All"))
        searchQuery += `&categorys=${props?.categorys?.join(",") || ""}`;
      if (props?.excludes?.length) searchQuery += `&excludes=${props?.excludes?.join(",") || ""}`;
      const response = await server.get(`/api/books?${searchQuery}`);
      setBooks(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (props?.showLoading) return;
    if (!loading && books?.length == 0 && props?.categorys?.includes?.("All") && !props?.search)
      fetchBooks({ noCategory: true });
  }, [loading, books, props?.categorys, props?.showLoading]);

  useEffect(() => {
    if (!props?.showLoading) fetchBooks();
  }, [
    props?.lat,
    props?.lon,
    props?.radius,
    props?.search,
    props?.limit,
    props?.categorys,
    props?.showMyBooks,
    props?.showLoading,
  ]);

  return (
    <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-3 w-full">
      {(props?.showLoading || loading) &&
        Array(4)
          ?.fill(0)
          ?.map((e, i) => <ProductCardLoading key={e + i} />)}
      {!props?.showLoading && !loading && !books?.length && (
        <div className="absolute w-full py-10">
          <h2 className="text-xl text-start">No books found.</h2>
        </div>
      )}
      {!props?.showLoading &&
        !loading &&
        books?.map((book) => <ProductCard key={book?._id} {...book} reFetch={() => fetchBooks()} />)}
    </div>
  );
}
