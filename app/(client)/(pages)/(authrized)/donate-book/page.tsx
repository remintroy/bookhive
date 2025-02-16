"use client";

import FileUpload from "@/components/file-upload";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import server from "@/lib/axios";
import React, { useEffect } from "react";

const DonateBook = () => {
  // function generateGoogleMapEmbedUrl(lat: string, lng: string) {
  //   return `https://www.google.com/maps/embed?pb=!1m13!1m8!1m3!1d3915.708867336044!2d${lng}!3d${lat}!3m2!1i1024!2i768!4f13.1!3m2!1m1!2z${btoa(
  //     `${lat}, ${lng}`
  //   ).replace(/=+$/, "")}!5e0!3m2!1sen!2sin!4v${Date.now()}!5m2!1sen!2sin`;
  // }

  useEffect(() => {
    (async () => {
      const { data } = await server.post("/api/upload-url", { type: "image/jpeg" });
      console.log(data);
    })();
  }, []);

  return (
    <div className="container mx-auto max-w-2xl py-5 flex flex-col gap-5 relative">
      {/* <h1 className="text-xl text-center font-bold">Donate your book</h1> */}
      <Card className="flex flex-col gap-3">
        <div className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold">Basic details</h2>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs text-gray-500 dark:text-gray-300">
              Book Title *
            </Label>
            <Input type="text" placeholder="Book title" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author" className="text-xs text-gray-500 dark:text-gray-300">
              Author of book *
            </Label>
            <Input type="text" placeholder="Author" />
          </div>
        </div>
        <Separator />
        <div className="p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-lg font-bold">Donation details</h2>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="title" className="text-xs text-gray-500 dark:text-gray-300">
              Book Condition *
            </Label>
            <Select>
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
            <Label htmlFor="title" className="text-xs text-gray-500 dark:text-gray-300">
              Book Images *
            </Label>
            <div className="grid grid-cols-4 gap-2">
              <FileUpload />
              <FileUpload />
              <FileUpload />
              <FileUpload />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="author" className="text-xs text-gray-500 dark:text-gray-300">
              Author of book *
            </Label>
            <Input type="text" placeholder="Author" />
          </div>
          {/* <iframe
            src={generateGoogleMapEmbedUrl("10.965829", "76.439096")}
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: "var(--radius)" }}
            // allowFullScreen=""
            loading="lazy"
            // referrerpolicy="no-referrer-when-downgrade"
          ></iframe> */}
        </div>{" "}
      </Card>
    </div>
  );
};

export default DonateBook;
