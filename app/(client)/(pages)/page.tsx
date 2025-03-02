"use client";

import ProductGrid from "@/components/product-grid";
import { Input } from "@/components/ui/input";
import { SelectContent, SelectItem, Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import server from "@/lib/axios";
import { useEffect, useState } from "react";

type Category = {
  category: string;
  count: number;
};

const HomePage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchCategorys = async () => {
    try {
      const { data } = await server.get(`/api/category`);
      setCategory(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategorys();
  }, []);

  return (
    <div className="container flex flex-col items-center m-auto p-3 md:p-5 gap-3">
      <div className="w-full py-24 flex flex-col md:gap-2">
        <h1 className="text-5xl md:text-6xl text-center font-bold">BookHive</h1>
        <p className="text-lg md:text-2xl text-center text-muted-foreground"><span className="text-[hsl(var(--primary))] italic">Discover</span> and share your favorite books</p>
      </div>
      <div className="flex flex-row gap-2 w-full">
        <Input
          placeholder="Search books by title"
          value={searchInput}
          onChange={(e) => setSearchInput(e?.target?.value)}
        />
        <Select value={selectedCategory} onValueChange={(value) => setSelectedCategory(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"All"} className="capitalize">
              All
            </SelectItem>
            {category?.map((item) => {
              return (
                <SelectItem key={item?.category} value={item?.category} className="capitalize">
                  {item?.category}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <ProductGrid search={searchInput} categorys={[selectedCategory]} />
    </div>
  );
};

export default HomePage;
