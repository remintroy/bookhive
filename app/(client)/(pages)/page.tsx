"use client";

import React, { useEffect, useState } from "react";
import ProductCard, { ProductCardLoading } from "@/components/product-card";
import server from "@/lib/axios";
import Book from "@/types/Books";

const HomePage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await server.get("/api/books?my-books=true");
      setBooks(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="container flex flex-col items-center m-auto p-5 gap-5">
      {/* <div>hai</div> */}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-6 w-full">
        {loading
          ? Array(3)
              ?.fill(0)
              ?.map((e, i) => <ProductCardLoading key={e + i} />)
          : books.map((book) => <ProductCard key={book?._id} {...book} />)}
      </div>
    </div>
  );
};

export default HomePage;
