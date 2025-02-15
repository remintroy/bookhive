import React from "react";
import ProductCard from "@/components/product-card";

const books = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    condition: "Good",
    imageUrl: "https://picsum.photos/seed/book1/400/200",
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    condition: "Fair",
    imageUrl: "https://picsum.photos/seed/book2/400/200",
  },
  {
    id: 3,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    condition: "Excellent",
    imageUrl: "https://picsum.photos/seed/book3/400/200",
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    condition: "Good",
    imageUrl: "https://picsum.photos/seed/book4/400/200",
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    condition: "Very Good",
    imageUrl: "https://picsum.photos/seed/book5/400/200",
  },
  {
    id: 6,
    title: "Moby-Dick",
    author: "Herman Melville",
    condition: "Fair",
    imageUrl: "https://picsum.photos/seed/book6/400/200",
  },
];

const page = () => {
  return (
    <div className="container flex flex-col items-center m-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <ProductCard key={book.id} {...book} />
        ))}
      </div>
    </div>
  );
};

export default page;
