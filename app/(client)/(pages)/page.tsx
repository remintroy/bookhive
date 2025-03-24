"use client";

import ProductGrid from "@/components/product-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SelectContent, SelectItem, Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import server from "@/lib/axios";
import { Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

type Category = {
  category: string;
  count: number;
};

const HomePage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("");

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
    <div className="container flex flex-col items-center m-auto p-3 md:p-5 gap-3 pb-10">
      <div className="w-full py-20 flex flex-col gap-3 rounded-[var(--radius)] bg-muted/0 md:bg-inherit md:border-none">
        <h1 className="text-5xl md:text-6xl text-center font-bold">BookShare</h1>
        <p className="text-lg md:text-2xl text-center text-muted-foreground">
          <span className="text-[hsl(var(--primary))] italic">Discover</span> and share your favorite books
        </p>
        <Link href={"/book/donate"} className="w-max mx-auto">
          <Button>Donate your book now</Button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-2 w-full">
        <div className="relative w-full">
          <Input
            placeholder="Search books by title, author, location"
            value={searchInput}
            onChange={(e) => setSearchInput(e?.target?.value)}
          />
          <div className="absolute top-0 right-1 p-2 text-sm text-muted-foreground">
            <Search className="w-5 h-5" />
          </div>
        </div>
        <div className="flex flex-row gap-2">
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
          <Select value={selectedCondition} onValueChange={(value) => setSelectedCondition(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all"} className="capitalize">
                All
              </SelectItem>
              {["excellent", "good", "fair", "old"]?.map((item) => {
                return (
                  <SelectItem key={item} value={item} className="capitalize">
                    {item}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ProductGrid search={searchInput} categorys={[selectedCategory]} condition={selectedCondition} />
    </div>
  );
};

export default HomePage;
