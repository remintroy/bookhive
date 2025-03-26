"use client";

import FileUpload from "@/components/file-upload";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import useBookApi from "@/hooks/useBookApi";
import useMetadata from "@/hooks/useMetadata";
import server from "@/lib/axios";
import Book from "@/types/Books";
import { getPlaceDataFromPincode } from "@/utils";
import { ChevronsUpDown, CircleX, Dot, Info, Trash } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface CustomBook extends Omit<Book, "condition"> {
  condition: string;
}

const defaultData: CustomBook = {
  _id: "",
  title: "",
  author: "",
  description: "",
  price: undefined,
  condition: "good",
  categories: [],
  location: {
    type: "Point",
    coordinates: [0, 0],
    dataOrigin: "",
    placeId: "",
    googleMapUrl: "",
    boundingBox: null,
    address: "",
    address2: "",
    addressResponse: null,
    pincode: "",
  },
  seller: "",
  sellerData: undefined,
  images: [],
  isSold: false,
  createdAt: "",
  updatedAt: "",
};

type Category = {
  category: string;
  count: number;
};

const categoriesCatch: { [key: string]: Category[] } = {};

const EditBookPage = () => {
  const { bookId } = useParams();
  const router = useRouter();
  const bookApi = useBookApi();
  const metadata = useMetadata();

  const [data, setData] = useState<CustomBook>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saveBookLoading, setSaveBookLoading] = useState(false);

  const [categorys, setCategorys] = useState<Category[]>([]);
  const [categorySearchInput, setCategorySearch] = useState("");
  const [bookDeleteLoading, setBookDeleteLoading] = useState(false);

  const getPlaceData = async () => {
    const pincodeData = await getPlaceDataFromPincode(data?.location?.pincode || "");
    const locationData: CustomBook["location"] = {
      type: "Point",
      coordinates: [Number(pincodeData?.location?.lat), Number(pincodeData?.location?.lon)],
      dataOrigin: pincodeData?.dataOrigin,
      placeId: pincodeData?.placeId,
      googleMapUrl: pincodeData?.googleMapUrl,
      boundingBox: pincodeData?.boundingBox,
      address: pincodeData?.address,
      address2: data?.location?.address2,
      addressResponse: pincodeData?.addressResponse,
    };
    setData((prev) => ({ ...prev, location: { ...prev.location, ...locationData } }));
  };

  const addSelectedCategory = (newCategory: string) => {
    setData((prev) => {
      const categoryString = newCategory?.trim?.()?.toLowerCase?.() || "";
      if (prev?.categories?.length && prev?.categories?.length >= 5) return prev; // maximum categories limit
      if (prev.categories?.includes(categoryString)) return prev;
      const copy = { ...prev };
      copy.categories = [...(copy.categories || []), categoryString];
      return copy;
    });
  };

  const removeSelectedCategory = (category: string) => {
    const categoryString = category?.trim?.()?.toLowerCase?.() || "";
    setData((prev) => {
      const copy = { ...prev };
      copy.categories = copy?.categories?.filter?.((value) => value !== categoryString) || [];
      return copy;
    });
  };

  const deleteBook = async () => {
    try {
      setBookDeleteLoading(true);
      await server.delete(`/api/books/${bookId}`);
      router.push("/");
    } catch (error) {
      console.log(error);
      // alert("Failed to delete book.");
    } finally {
      setBookDeleteLoading(false);
    }
  };

  const fetchCategorys = async () => {
    try {
      if (categoriesCatch[categorySearchInput]) return setCategorys(categoriesCatch[categorySearchInput]);
      const { data } = await server.get(`/api/category?search=${categorySearchInput}`);
      categoriesCatch[categorySearchInput] = data;
      setCategorys(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchBookData = async () => {
    setLoading(true);
    try {
      const { data } = await server.get(`/api/books/${bookId}`);
      setData((prev) => ({ ...prev, ...data }));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const saveDetails = async () => {
    setSaveBookLoading(true);
    try {
      await bookApi.updateBook(bookId as string, data);
      router.push(`/book/${bookId}`);
    } catch (error) {
      console.log(error);
      alert("Failed to save book details.");
    } finally {
      setSaveBookLoading(false);
    }
  };

  useEffect(() => {
    getPlaceData();
  }, [data?.location?.pincode]);

  useEffect(() => {
    fetchCategorys();
  }, [categorySearchInput]);

  useEffect(() => {
    fetchBookData();
  }, []);

  useEffect(() => {
    if (data?.seller && data?.seller !== metadata?.uid) router.push(`/`);
  }, [data, metadata]);

  return (
    <div className="md:container mx-auto md:max-w-2xl md:py-5 flex flex-col gap-5 relative">
      {loading && (
        <div className=" flex flex-col gap-5 w-full p-5">
          <Skeleton className="h-[308px] w-full rounded-[var(--radius)]" />
          <Skeleton className="h-[408px] w-full rounded-[var(--radius)]" />
        </div>
      )}
      {!loading && (
        <div>
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
                  disabled={saveBookLoading || loading}
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
                  disabled={saveBookLoading || loading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="author" className="text-xs text-muted-foreground">
                  Book description
                </Label>
                <Input
                  type="text"
                  value={data?.description || ""}
                  onChange={(e) => setData((pre) => ({ ...pre, description: e.target?.value }))}
                  placeholder="Description"
                  disabled={saveBookLoading || loading}
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
                  disabled={saveBookLoading || loading}
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
                {!!data?.categories?.length && data?.categories?.length >= 5 && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Category limit</AlertTitle>
                    <AlertDescription className="text-muted-foreground">
                      You can only add maximum of 5 categorys.
                    </AlertDescription>
                  </Alert>
                )}
                {data?.categories?.length !== 0 && (
                  <div className="flex flex-row gap-1 py-2 flex-wrap">
                    {data?.categories?.map((category) => (
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

                {(!data?.categories?.length || data?.categories?.length < 5) && (
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
                          disabled={loading}
                          value={categorySearchInput}
                          onValueChange={(value) => setCategorySearch(value)}
                          placeholder="Search category..."
                          onKeyUp={(e) => {
                            if (e?.key == "Enter") {
                              addSelectedCategory(categorySearchInput);
                              setCategorySearch("");
                            }
                          }}
                        />
                        <CommandList>
                          <CommandEmpty className="p-4 text-sm text-center text-muted-foreground">
                            No category found. <br /> press enter to add as new
                          </CommandEmpty>
                          <CommandGroup>
                            {categorys?.map((category) => (
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
                  {["", "", "", ""]?.map((e, i) => {
                    const setURL = (url?: string) => {
                      setData((pre) => {
                        const copy = { ...pre };
                        const images = [...(copy.images || [])];
                        images[i] = url || "";
                        copy.images = images;
                        return copy;
                      });
                    };
                    return <FileUpload key={i} setURL={setURL} imageURL={data?.images?.[i] || ""} />;
                  })}
                </div>
              </div>
            </div>
            <Separator />
            <div className="p-5 flex flex-col gap-4">
              <div>
                <h2 className="text-lg font-bold">Location & Address</h2>
              </div>

              {!data?.location.googleMapUrl && (
                <div className="w-full h-[450px] bg-muted rounded-[var(--radius)] overflow-hidden">
                  {false ? (
                    <Skeleton className="w-full h-full flex bg-muted items-center justify-center text-muted-foreground">
                      Finding your place
                    </Skeleton>
                  ) : (
                    <div className="w-full h-full flex bg-muted items-center justify-center text-muted-foreground">
                      {!data?.location?.pincode
                        ? "Enter pincode to get preview"
                        : "No place found, Try changing pincode"}
                    </div>
                  )}
                </div>
              )}

              {data?.location?.googleMapUrl && (
                <div className="relative rounded-[var(--radius)] overflow-hidden border">
                  <iframe
                    src={data?.location?.googleMapUrl}
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
                    value={data?.location?.pincode || ""}
                    onChange={(e) =>
                      setData((pre) => ({ ...pre, location: { ...pre?.location, pincode: e?.target?.value } }))
                    }
                    type="number"
                    placeholder="Pincode"
                    disabled={saveBookLoading || loading}
                  />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="author" className="text-xs text-muted-foreground">
                    Address from pincode
                  </Label>
                  <Input
                    type="text"
                    disabled
                    value={data?.location?.address || ""}
                    onChange={(e) =>
                      setData((pre) => ({ ...pre, location: { ...pre?.location, address: e?.target?.value } }))
                    }
                    placeholder="Address from pincode"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="author" className="text-xs text-muted-foreground">
                  Address
                </Label>
                <Textarea
                  value={data?.location?.address2 || ""}
                  disabled={saveBookLoading || loading}
                  onChange={(e) =>
                    setData((pre) => ({ ...pre, location: { ...pre?.location, address2: e?.target?.value } }))
                  }
                  placeholder="Address (optional)"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Button
                  onClick={saveDetails}
                  disabled={
                    saveBookLoading ||
                    loading ||
                    !data?.title ||
                    !data?.author ||
                    !data?.location?.address ||
                    !data?.images?.filter((e) => e)?.length ||
                    !data?.condition
                  }
                >
                  {saveBookLoading ? "Updating Details..." : "Save and continue"}
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"destructive"}
                      disabled={
                        saveBookLoading ||
                        loading ||
                        !data?.title ||
                        !data?.author ||
                        !data?.location?.address ||
                        !data?.images?.filter((e) => e)?.length ||
                        !data?.condition
                      }
                    >
                      <Trash /> {saveBookLoading ? "Updating Details..." : "Delete book"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="w-fit min-w-[350px] md:w-auto">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your book and remove your data from
                        our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={deleteBook}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBookPage;
