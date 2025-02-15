import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React from "react";

type Props = {};

const DonateBook = (props: Props) => {
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
              <div className="border border-dashed rounded-[var(--radius)] p-3">hai</div>
              <div className="border border-dashed rounded-[var(--radius)] p-3">hai</div>
              <div className="border border-dashed rounded-[var(--radius)] p-3">hai</div>
              <div className="border border-dashed rounded-[var(--radius)] p-3">hai</div>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="author" className="text-xs text-gray-500 dark:text-gray-300">
              Author of book *
            </Label>
            <Input type="text" placeholder="Author" />
          </div>

          <iframe
            src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d13829.26094093424!2d76.55280091407298!3d11.068268907387628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTHCsDAzJzQyLjciTiA3NsKwMzInNDkuNiJF!5e0!3m2!1sen!2sin!4v1739609431019!5m2!1sen!2sin"
            width="100%"
            height="450"
            style={{ border: 0, borderRadius: "var(--radius)" }}
            // allowFullScreen=""
            loading="lazy"
            // referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>{" "}
      </Card>
    </div>
  );
};

export default DonateBook;
