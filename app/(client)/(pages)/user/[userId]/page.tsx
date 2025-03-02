"use client";

import ProductGrid from "@/components/product-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import useMetadata from "@/hooks/useMetadata";
import server from "@/lib/axios";
import { EditIcon, MessageSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";

type User = {
  photoURL: string;
  displayName: string;
  description: string;
  books: string[];
  createdAt: string;
};

const UserDetails = () => {
  const metadata = useMetadata();
  const router = useRouter();
  const [userData, setUserData] = React.useState<User | null>(null);
  const userId = useParams().userId;

  const fetchUserData = async () => {
    try {
      if (!userId) return;
      const { data } = await server.get(`/api/users/${userId}`);
      setUserData(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return (
    <div className="container mx-auto flex flex-col gap-3 p-3">
      <div className="flex flex-row gap-5 bg-muted/30 p-5 md:p-7 rounded-[var(--radius)] border items-center">
        <Avatar className="w-24 h-24">
          {userData?.photoURL && <AvatarImage src={userData?.photoURL} />}
          <AvatarFallback>{userData?.displayName?.charAt?.(0) || "U"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-between gap-1">
          <h2 className="text-xl font-bold">{userData?.displayName || "User"}</h2>
          <p>{userData?.description}</p>
          {userData?.books?.length && <p className="text-muted-foreground">{userData?.books?.length} Books</p>}
          {userData?.createdAt && (
            <p className="text-muted-foreground text-xs">
              A user since : <i>{new Date(userData?.createdAt)?.toLocaleDateString?.()}</i>
            </p>
          )}
          <div className="flex flex-row items-center gap-2">
            <Button variant={"secondary"} onClick={() => router.push(`/chat/${userId}`)}>
              <MessageSquare />
              {metadata?.uid == userId ? "Self message" : "Start chat"}
            </Button>
            {metadata?.uid == userId && (
              <Button variant={"secondary"}>
                <EditIcon /> Edit profile
              </Button>
            )}
          </div>
        </div>
      </div>
      <ProductGrid userIds={[userId as string]} />
    </div>
  );
};

export default UserDetails;
