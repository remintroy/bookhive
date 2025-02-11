import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="container">
      <Card className="relative w-max overflow-hidden max-w-[300px]">
        <Image width={400} height={300} alt="product" src={"https://picsum.photos/400/300"} />
        <CardHeader>
          <CardTitle>Atomic habits</CardTitle>
          <CardDescription>motivation . biography . well being</CardDescription>
          <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row gap-2 items-center">
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <small>John Doe</small>
          </div>
        </CardContent>

        <CardFooter className="flex flex-row gap-2">
          <Button className="w-full">Buy now</Button>
          <Button className="w-full" variant={"secondary"}>
            View details
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default page;
