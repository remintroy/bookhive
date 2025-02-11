import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpenIcon } from "lucide-react";
import Link from "next/link";

type Props = {
  id: number;
  title: string;
  author: string;
  condition: string;
  imageUrl: string;
};

const ProductCard = ({ id, title, author, condition, imageUrl }: Props) => {
  return (
    <Card className="w-full max-w-[400px] overflow-hidden">
      <div className="relative">
        <Image
          width={400}
          height={200}
          alt={title}
          src={imageUrl || "/placeholder.svg"}
          className="object-cover h-[200px]"
        />
        <Badge variant="secondary" className="absolute right-2 top-2">
          {condition}
        </Badge>
      </div>
      <CardHeader className="p-4 space-y-1">
        <CardTitle className="text-lg line-clamp-1">{title}</CardTitle>
        <CardDescription className="text-sm">{author}</CardDescription>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <Button className="w-full" variant={"secondary"} asChild>
          <Link href={`/book/${id}`}>
            <BookOpenIcon className="h-4 w-4 mr-2" />
            View Details
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
