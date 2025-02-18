"use client";

import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";
import { useEffect, useState } from "react";

type Data = {
  title?: string;
  author?: string;
  condition?: string;
  images?: string[];
  location?: {
    lat: string;
    lon: string;
  };
  pincode?: string;
  address?: string;
  address2?: string;
  addressResponse?: string;
  googleMapUrl?: string;
  boundingBox?: string[];
  placeId?: string;
  dataOrigin?: "OpenStreetMap";
};

const defaultData: Data = {
  title: "",
  author: "",
  condition: "",
  images: [],
  pincode: "",
  address: "",
  address2: "",
  googleMapUrl: "",
};

function generateGoogleMapEmbedUrl(lat: string, lng: string) {
  if (!lat || !lng) return "";
  const baseURL = "https://www.google.com/maps/embed";
  const encodedLocation = btoa(`${lat}, ${lng}`).replace(/=+$/, "");
  // return `${baseURL}?pb=!1m13!1m8!1m3!1d3915.708867336044!2d${lng}!3d${lat}!3m2!1i1024!2i768!4f13.1!3m2!1m1!2z${encodedLocation}!5e0!3m2!1sen!2sin!4v${Date.now()}!5m2!1sen!2sin`;
  return `${baseURL}?pb=!1m13!1m8!1m3!1d200000!2d${lng}!3d${lat}!3m2!1i1024!2i768!4f13.1!3m2!1m1!2z${encodedLocation}!5e0!3m2!1sen!2sin!4v${Date.now()}!5m2!1sen!2sin`;
}

const DonateBook = () => {
  const [data, setData] = useState<Data>(defaultData);
  const [googleMap, setGoogleMap] = useState({ open: false, loading: false, url: "" });

  const getPlaceDataFromPincode = async (pincode: string) => {
    setGoogleMap({ ...googleMap, loading: true, open: false });
    try {
      const url = `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json`;

      const { data } = await axios.get(url);

      const placeData = data?.[0];
      const dataToSave: Data = {
        location: {
          lat: placeData?.lat || "",
          lon: placeData?.lon || "",
        },
        address: placeData?.display_name || "",
        addressResponse: placeData || {},
        boundingBox: placeData?.boundingbox || [],
        placeId: placeData?.place_id || "",
        dataOrigin: "OpenStreetMap",
        googleMapUrl: generateGoogleMapEmbedUrl(placeData?.lat, placeData?.lon),
        // pincode: pincode,
      };

      setData((pre) => ({ ...pre, ...dataToSave }));

      if (data?.length === 0) throw new Error("No place found");

      setGoogleMap({ ...googleMap, loading: false, open: true, url: dataToSave.googleMapUrl as string });
    } catch (error) {
      console.log(error);
      setGoogleMap({ ...googleMap, loading: false, open: false });
    }
  };

  useEffect(() => {
    if (data?.pincode && data?.pincode?.length >= 6) {
      getPlaceDataFromPincode(data.pincode);
    }
  }, [data?.pincode]);

  return (
    <div className="container mx-auto max-w-2xl py-5 flex flex-col gap-5 relative">
      {/* <h1 className="text-xl text-center font-bold">Donate your book</h1> */}
      <Card className="flex flex-col gap-3">
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
            <Select value={data?.condition} onValueChange={(value) => setData((pre) => ({ ...pre, condition: value }))}>
              <SelectTrigger className="w-[180px] capitalize">
                <SelectValue placeholder="Book Condition" />
              </SelectTrigger>
              <SelectContent>
                {["new", "excellent", "good", "fair", "old"].map((condition) => (
                  <SelectItem key={condition} value={condition} className="capitalize">
                    {condition}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs text-muted-foreground">
              Book Images *
            </Label>
            <div className="grid grid-cols-4 gap-2">
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
          <div className="grid grid-cols-2 gap-2">
            <div className="grid gap-2">
              <Label htmlFor="author" className="text-xs text-muted-foreground">
                Pincode *
              </Label>
              <Input
                value={data?.pincode || ""}
                onChange={(e) => setData((pre) => ({ ...pre, pincode: e?.target?.value }))}
                type="number"
                placeholder="Pincode"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="author" className="text-xs text-muted-foreground">
                Country
              </Label>
              <Input type="text" placeholder="Address" value={"India"} disabled />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author" className="text-xs text-muted-foreground">
              Address
            </Label>
            <Input
              type="text"
              disabled
              value={data?.address}
              onChange={(e) => setData((pre) => ({ ...pre, address: e?.target?.value }))}
              placeholder="Address"
            />
            <Input
              type="text"
              value={data?.address2}
              onChange={(e) => setData((pre) => ({ ...pre, address2: e?.target?.value }))}
              placeholder="Address (optional)"
            />
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
          <Button>Save and continue</Button>
        </div>
      </Card>
    </div>
  );
};

export default DonateBook;
