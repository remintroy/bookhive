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
import { Skeleton } from "@/components/ui/skeleton";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import useMetadata from "@/hooks/useMetadata";
import { app } from "@/lib/constants";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { BookHeart, ListOrdered, LogOut, MessageSquareText, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export const InfoBarFallback = () => {
  return (
    <div className="flex flex-row p-3 justify-between items-center fixed w-full z-[100] bg-[hsl(var(--background))] border-b">
      <Link href={"/"} className="flex-shrink-0">
        <Image
          width={150}
          height={32}
          src="/Icon-large-dark.svg"
          className="hidden dark:block"
          alt={`${app?.name} Logo`}
        />
        <Image width={150} height={32} src="/Icon-large-light.svg" className="dark:hidden" alt={`${app?.name} Logo`} />
      </Link>
      <div className="flex items-center justify-end gap-3 md:hidden">
        <ModeToggle />
        <Avatar>
          <Skeleton className="w-full h-full" />
        </Avatar>
      </div>
    </div>
  );
};

const InfoBar = () => {
  const metadata = useMetadata();
  const router = useRouter();
  const redirect = useAuthRedirect();
  const path = usePathname();

  const handleLogout = async () => {
    await signOut(auth);
    redirect.redirectToSignIn();
  };

  const Menu = () => {
    return (
      <DropdownMenuContent className="min-w-[210px] p-5">
        <DropdownMenuLabel>
          <div className="flex flex-col items-center gap-2">
            <Avatar className="cursor-pointer">
              <AvatarImage src={metadata?.photoURLCustom || metadata?.photoURL} />
              <AvatarFallback>
                {metadata?.displayName?.charAt(0) || metadata?.email?.charAt?.(0)?.toUpperCase?.()}{" "}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <p>{metadata?.displayName}</p>
              <small>{metadata.email}</small>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => metadata?.uid && router.push(`/user/${metadata?.uid}`)}>
          <Settings /> My account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <BookHeart /> My Books
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
    );
  };

  return (
    <>
      <div className="flex flex-row p-3 justify-between items-center fixed w-full z-[50] bg-[hsl(var(--background)/0.8)] backdrop-blur-md">
        <Link href={"/"} className="flex-shrink-0">
          <Image
            width={150}
            height={32}
            src="/Icon-large-dark.svg"
            className="hidden dark:block"
            alt={`${app?.name} Logo`}
          />
          <Image
            width={150}
            height={32}
            src="/Icon-large-light.svg"
            className="dark:hidden"
            alt={`${app?.name} Logo`}
          />
        </Link>

        <div className="flex items-center justify-end gap-3 md:hidden">
          <ModeToggle />
          <Link href={"/chat"}>
            <Button variant="outline" size="icon">
              <MessageSquareText className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
          {!!metadata?.loading ? (
            <Avatar>
              <Skeleton className="w-full h-full" />
            </Avatar>
          ) : metadata?.loggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={metadata?.photoURLCustom || metadata?.photoURL} />
                  <AvatarFallback>
                    {metadata?.displayName?.charAt(0) || metadata?.email?.charAt?.(0)?.toUpperCase?.()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <Menu />
            </DropdownMenu>
          ) : (
            <Button onClick={() => router.push("/signin")}>Login</Button>
          )}
        </div>

        <div className="w-full flex-row items-center justify-end gap-3 [&_*]:flex-shrink-0 hidden md:flex">
          {/* <Input className="max-w-[300px]" placeholder="Search books" /> */}
          <Link href="/book/donate">
            <Button disabled={path?.includes("/book/donate")}>
              Donate books <BookHeart />
            </Button>
          </Link>
          <ModeToggle />
          <Link href={"/chat"}>
            <Button variant="outline" size="icon">
              <MessageSquareText className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </Link>
          {metadata?.loading ? (
            <Avatar>
              <Skeleton className="w-full h-full" />
            </Avatar>
          ) : metadata?.loggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src={metadata?.photoURLCustom || metadata?.photoURL} />
                  <AvatarFallback>
                    {metadata?.displayName?.charAt(0) || metadata?.email?.charAt?.(0)?.toUpperCase?.()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <Menu />
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
