"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { app } from "@/lib/constants";
import { auth } from "@/lib/firebase";
import { signOut, User } from "firebase/auth";
import { BookHeart, ListOrdered, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const InfoBar = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/signin");
  };

  return (
    <>
      <div className="flex flex-row p-3 justify-between items-center fixed w-full z-[100] bg-[hsl(var(--background))] border-b">
        <Image
          width={150}
          height={10}
          src="/Icon-large-dark.svg"
          className="hidden dark:block"
          alt={`${app?.name} Logo`}
        />
        <Image width={150} height={10} src="/Icon-large-light.svg" className="dark:hidden" alt={`${app?.name} Logo`} />

        <div className="w-full flex flex-row items-center justify-end gap-3 [&_*]:flex-shrink-0">
          <Input className="max-w-[300px]" placeholder="Search books" />
          <Button>
            Donate books <BookHeart />
          </Button>
          <ModeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={user.photoURL || "https://via.placeholder.com/40"} />
                  <AvatarFallback>
                    {user?.displayName?.charAt(0) || user?.email?.charAt?.(0)?.toUpperCase?.()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="min-w-[210px] p-5">
                <DropdownMenuLabel>
                  <div className="flex flex-col items-center gap-2">
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={user.photoURL || "https://via.placeholder.com/40"} />
                      <AvatarFallback>
                        {user?.displayName?.charAt(0) || user?.email?.charAt?.(0)?.toUpperCase?.()}{" "}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <p>{user.displayName}</p>
                      <small>{user.email}</small>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Settings /> Manage account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <BookHeart /> Donation's
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ListOrdered /> Orders <DropdownMenuShortcut>1 upcoming</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-400" onClick={handleLogout}>
                  <LogOut />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push("/signin")}>Login</Button>
          )}
        </div>
      </div>
      <div className="h-[64px]" />
    </>
  );
};

export default InfoBar;
