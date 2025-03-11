"use client";

import ProductGrid from "@/components/product-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useMetadata from "@/hooks/useMetadata";
import server from "@/lib/axios";
import { EditIcon, MessageSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { BooksCollection } from "@/lib/zustand";

interface User {
  uid: string;
  createdAt: string;
  disabled: boolean;
  displayName: string;
  photoURL: string;
  photoURLCustom: string;
  bio: string;
  books: BooksCollection;
}

const UserDetails = () => {
  const metadata = useMetadata();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const userId = useParams().userId;

  const fetchUserData = async () => {
    if (metadata?.uid === userId) {
      return setUserData({
        displayName: metadata.displayName,
        photoURL: metadata.photoURL,
        photoURLCustom: metadata?.photoURLCustom,
        bio: metadata.bio,
        books: metadata.books,
        createdAt: metadata.createdAt,
        disabled: metadata.disabled,
        uid: metadata?.uid,
      });
    }

    setUserDataLoading(true);
    try {
      if (!userId) return;
      const { data } = await server.get(`/api/users/${userId}`);
      setUserData(data);
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setUserDataLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId, metadata]);

  return (
    <div className="container max-w-7xl mx-auto flex flex-col gap-3 p-5">
      <div className="grid grid-cols-1 gap-5 items-center">
        <div className="flex flex-row gap-5">
          <Avatar className="w-24 h-24">
            {userDataLoading && <Skeleton className="w-full h-full" />}
            {!userDataLoading && (userData?.photoURL || userData?.photoURLCustom) && (
              <AvatarImage src={userData?.photoURLCustom || userData?.photoURL} />
            )}
            {!userDataLoading && <AvatarFallback>{userData?.displayName?.charAt?.(0) || "U"}</AvatarFallback>}
          </Avatar>
          <div className="flex flex-col gap-1">
            {!userDataLoading && <h2 className="text-xl font-bold">{userData?.displayName || "User"}</h2>}
            {userData?.bio && <p>{userData?.bio}</p>}
            {!!userData?.books?.totalBooks && (
              <p className="text-muted-foreground">
                {userData?.books?.totalBooks - userData?.books?.totalSold} Books Available :{" "}
                {userData?.books?.totalSold} Sold
              </p>
            )}
            {userData?.createdAt && (
              <p className="text-muted-foreground text-xs">
                A user since : <i>{new Date(userData?.createdAt)?.toLocaleDateString?.()}</i>
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 w-full">
          <Button className="w-full md:w-auto" variant={"secondary"} onClick={() => router.push(`/chat/${userId}`)}>
            <MessageSquare />
            {metadata?.uid == userId ? "Self message" : "Start chat"}
          </Button>
          {metadata?.uid == userId && (
            <Button variant={"secondary"} onClick={() => router.push(`/my-account/edit`)}>
              <EditIcon /> Edit profile
            </Button>
          )}
        </div>
      </div>

      <Separator />
      <ProductGrid userIds={[userId as string]} />
    </div>
  );
};

export default UserDetails;
