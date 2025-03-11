"use client";

import { ModeToggle } from "@/components/mode-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useMetadata from "@/hooks/useMetadata";
import { app } from "@/lib/constants";
import { BookHeart, MessageSquareText } from "lucide-react";
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
  const path = usePathname();

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
            <Avatar className="cursor-pointer" onClick={() => router.push("/my-account")}>
              <AvatarImage src={metadata?.photoURLCustom || metadata?.photoURL} />
              <AvatarFallback>
                {metadata?.displayName?.charAt(0) || metadata?.email?.charAt?.(0)?.toUpperCase?.()}
              </AvatarFallback>
            </Avatar>
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
            <Avatar className="cursor-pointer" onClick={() => router.push("/my-account")}>
              <AvatarImage src={metadata?.photoURLCustom || metadata?.photoURL} />
              <AvatarFallback>
                {metadata?.displayName?.charAt(0) || metadata?.email?.charAt?.(0)?.toUpperCase?.()}
              </AvatarFallback>
            </Avatar>
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
