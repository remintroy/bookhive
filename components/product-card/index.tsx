import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

type Props = {
  title?: string;
  description?: string;
  category?: string[];
};

const ProductCard = (props: Props) => {
  return (
    <Card className="relative w-max overflow-hidden max-w-[300px]">
      <Image width={400} height={300} alt="product" src={"https://picsum.photos/400/300"} />
      <CardHeader>
        <CardTitle>Atomic habits</CardTitle>
        <CardDescription>Lorem ipsum dolor sit amet</CardDescription>
        <div className="flex flex-row flex-wrap gap-1">
          <Badge variant={"secondary"}>motivation</Badge>
          <Badge variant={"secondary"}>biography</Badge>
          <Badge variant={"secondary"}>well being</Badge>
        </div>
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
  );
};

export default ProductCard;
