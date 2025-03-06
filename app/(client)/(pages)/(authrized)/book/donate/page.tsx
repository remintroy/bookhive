"use client";

import FileUpload from "@/components/file-upload";
import server from "@/lib/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { getPlaceDataFromPincode } from "@/utils";
import { ChevronsUpDown, CircleX, Dot, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type Data = {
  title?: string;
  author?: string;
  description?: string;
  condition?: string;
  categories?: string[];
  location?: {
    lat?: string;
    lon?: string;
  };
  dataOrigin?: string;
  placeId?: string;
  googleMapUrl?: string;
  boundingBox?: string[];
  address?: string;
  address2?: string;
  addressResponse?: string;
  pincode?: string;
  images?: string[];
};

const defaultData: Data = {
  title: "",
  author: "",
  condition: "excellent",
  images: [],
  pincode: "",
  address: "",
  address2: "",
  googleMapUrl: "",
  categories: [],
};

type Category = {
  category: string;
  count: number;
};

const categoriesCatch: { [key: string]: Category[] } = {};

const DonateBook = () => {
  const [data, setData] = useState<Data>(defaultData);
  const [googleMap, setGoogleMap] = useState({ open: false, loading: false, url: "" });
  const [saveBookLoading, setSaveBookLoading] = useState(false);
  const route = useRouter();

  const [category, setCategory] = useState<Category[]>([]);
  const [categorySearch, setCategorySearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);

  const addSelectedCategory = (newCategory: string) => {
    setSelectedCategory((prev) => {
      if (prev?.length >= 5) return prev; // maximum categories limit
      const categoryString = newCategory?.trim?.()?.toLowerCase?.() || "";
      if (prev?.includes(categoryString)) return prev;
      return [...prev, categoryString];
    });
  };

  const removeSelectedCategory = (category: string) => {
    const categoryString = category?.trim?.()?.toLowerCase?.() || "";
    setSelectedCategory((prev) => {
      return prev.filter((value) => value !== categoryString);
    });
  };

  const fetchCategorys = async () => {
    try {
      if (categoriesCatch[categorySearch]) return setCategory(categoriesCatch[categorySearch]);
      const { data } = await server.get(`/api/category?search=${categorySearch}`);
      categoriesCatch[categorySearch] = data;
      setCategory(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategorys();
  }, [categorySearch]);

  const createBook = async () => {
    setSaveBookLoading(true);
    try {
      const { data: responseSavedBookData } = await server.post("/api/books", { ...data, categories: category });
      console.log(responseSavedBookData);
      route.push(`/book/${responseSavedBookData?._id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setSaveBookLoading(false);
    }
  };

  const fetchDataFromPincode = async (pincode: string) => {
    setGoogleMap({ ...googleMap, loading: true, open: false });
    try {
      const data = await getPlaceDataFromPincode(pincode);

      setData((pre) => ({
        ...pre,
        location: data?.location,
        address: data?.address,
        addressResponse: data?.addressResponse,
        boundingBox: data?.boundingBox,
        placeId: data?.placeId,
        dataOrigin: data?.dataOrigin,
        googleMapUrl: data?.googleMapUrl,
        pincode: data?.pincode,
      }));

      if (!data?.address) throw new Error("No place found");

      setGoogleMap({ ...googleMap, loading: false, open: true, url: data?.googleMapUrl as string });
    } catch (error) {
      console.log(error);
      setGoogleMap({ ...googleMap, loading: false, open: false });
    }
  };

  useEffect(() => {
    if (data?.pincode && data?.pincode?.length >= 6) {
      fetchDataFromPincode(data.pincode);
    }
  }, [data?.pincode]);

  return (
    <div className="md:container mx-auto md:max-w-2xl md:py-5 flex flex-col gap-5 relative">
      {/* <h1 className="text-xl text-center font-bold">Donate your book</h1> */}
      <div className="flex flex-col gap-3 px-1 md:p-0 md:border md:rounded-[var(--radius)]">
        <div className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold">Basic details</h2>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs text-muted-foreground">
              Book Title *
            </Label>
            <Input
              type="text"
              value={data?.title}
              onChange={(e) => setData((pre) => ({ ...pre, title: e.target?.value }))}
              placeholder="Book title"
              disabled={saveBookLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author" className="text-xs text-muted-foreground">
              Author of book *
            </Label>
            <Input
              type="text"
              value={data?.author}
              onChange={(e) => setData((pre) => ({ ...pre, author: e.target?.value }))}
              placeholder="Author"
              disabled={saveBookLoading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author" className="text-xs text-muted-foreground">
              Book description
            </Label>
            <Input
              type="text"
              value={data?.description}
              onChange={(e) => setData((pre) => ({ ...pre, description: e.target?.value }))}
              placeholder="Description"
              disabled={saveBookLoading}
            />
          </div>
        </div>
        <Separator />
        <div className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold">Donation details</h2>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs text-muted-foreground">
              Book Condition *
            </Label>
            <Select
              disabled={saveBookLoading}
              value={data?.condition}
              defaultValue="excellent"
              onValueChange={(value) => setData((pre) => ({ ...pre, condition: value }))}
            >
              <SelectTrigger className="w-[200px] capitalize">
                <SelectValue placeholder="Book Condition" />
              </SelectTrigger>
              <SelectContent>
                {["excellent", "good", "fair", "old"].map((condition) => (
                  <SelectItem key={condition} value={condition} className="capitalize">
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author" className="text-xs text-muted-foreground">
              Category of book
            </Label>
            {selectedCategory?.length >= 5 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Category limit</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  You can only add maximum of 5 categorys.
                </AlertDescription>
              </Alert>
            )}
            {selectedCategory?.length !== 0 && (
              <div className="flex flex-row gap-1 py-2 flex-wrap">
                {selectedCategory?.map((category) => (
                  <Badge key={category} variant={"outline"} className="p-2 px-3 flex flex-row gap-2 capitalize">
                    {category}
                    <Button
                      size={"icon"}
                      variant={"secondary"}
                      className="w-5 h-5"
                      onClick={() => removeSelectedCategory(category)}
                    >
                      <CircleX />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}

            {selectedCategory?.length < 5 && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" className="w-[200px] justify-between">
                    Select categorys
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput
                      value={categorySearch}
                      onValueChange={(value) => setCategorySearch(value)}
                      placeholder="Search category..."
                      onKeyUp={(e) => {
                        if (e?.key == "Enter") {
                          addSelectedCategory(categorySearch);
                          setCategorySearch("");
                        }
                      }}
                    />
                    <CommandList>
                      <CommandEmpty className="p-4 text-sm text-center text-muted-foreground">
                        No category found. <br /> press enter to add as new
                      </CommandEmpty>
                      <CommandGroup>
                        {category?.map((category) => (
                          <CommandItem
                            onSelect={(currentValue) => {
                              addSelectedCategory(currentValue);
                            }}
                            key={category.category}
                            value={category?.category}
                          >
                            <Dot className={"mr-2 h-4 w-4"} />
                            {category?.category}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs text-muted-foreground">
              Book Images *
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4  gap-2">
              {Array(4)
                ?.fill(0)
                ?.map((e, i) => {
                  const setURL = (url?: string) => {
                    setData((pre) => {
                      const copy = { ...pre };
                      const images = [...(copy.images || [])];
                      images[i] = url || "";
                      copy.images = images;
                      return copy;
                    });
                  };
                  return <FileUpload key={i} setURL={setURL} />;
                })}
            </div>
          </div>
        </div>
        <Separator />
        <div className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold">Location & Address</h2>
          </div>

          {!googleMap?.open && (
            <div className="w-full h-[450px] bg-muted rounded-[var(--radius)] overflow-hidden">
              {googleMap?.loading ? (
                <Skeleton className="w-full h-full flex bg-muted items-center justify-center text-muted-foreground">
                  Finding your place
                </Skeleton>
              ) : (
                <div className="w-full h-full flex bg-muted items-center justify-center text-muted-foreground">
                  {!data?.pincode ? "Enter pincode to get preview" : "No place found, Try changing pincode"}
                </div>
              )}
            </div>
          )}

          {googleMap?.open && (
            <div className="relative rounded-[var(--radius)] overflow-hidden border">
              <iframe
                src={data?.googleMapUrl}
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: "var(--radius)" }}
                // allowFullScreen=""
                loading="lazy"
                // referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
              <div className="absolute bg-muted/30 pointer-events-none w-full h-full top-0 left-0" />
              <div className="absolute dark:text-white/40 text-black/20 pointer-events-none w-full h-full top-0 left-0 flex items-center justify-center">
                Approximate Preview
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="author" className="text-xs flex justify-between items-center text-muted-foreground">
                <span>Pincode {"(India)"} *</span>
              </Label>
              <Input
                value={data?.pincode || ""}
                onChange={(e) => setData((pre) => ({ ...pre, pincode: e?.target?.value }))}
                type="number"
                placeholder="Pincode"
                disabled={saveBookLoading}
              />
            </div>
            <div className="grid gap-1">
              <Label htmlFor="author" className="text-xs text-muted-foreground">
                Address from pincode
              </Label>
              <Input
                type="text"
                disabled
                value={data?.address}
                onChange={(e) => setData((pre) => ({ ...pre, address: e?.target?.value }))}
                placeholder="Address from pincode"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author" className="text-xs text-muted-foreground">
              Address
            </Label>
            <Textarea
              value={data?.address2}
              disabled={saveBookLoading}
              onChange={(e) => setData((pre) => ({ ...pre, address2: e?.target?.value }))}
              placeholder="Address (optional)"
            />
          </div>
          <Button
            onClick={createBook}
            disabled={
              saveBookLoading ||
              !data?.title ||
              !data?.author ||
              !data?.address ||
              !data?.images?.filter((e) => e)?.length ||
              !data?.condition
            }
          >
            {saveBookLoading ? "Creating book..." : "Save and continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DonateBook;
