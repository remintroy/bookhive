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
import { BookHeart, BookUser, ListOrdered, LogOut, Settings } from "lucide-react";
import Image from "next/image";
import React from "react";

type Props = {};

const InfoBar = (props: Props) => {
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
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[210px]">
              <DropdownMenuLabel>
                <div className="flex flex-col items-center gap-2">
                  <Avatar className="cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <p>Name</p>
                    <small>email.com</small>
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
              <DropdownMenuItem className="text-red-400">
                <LogOut />
                <span>Log out</span>
                <DropdownMenuShortcut>1.1</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="h-[64px]" />
    </>
  );
};

export default InfoBar;
