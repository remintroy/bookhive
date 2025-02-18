import { CirclePlus, Home, MessageCircle, Search } from "lucide-react";
import Link from "next/link";
import React from "react";

const Navbar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full flex flex-row p-4 justify-evenly items-center z-[100] bg-[hsl(var(--background))] border-t md:hidden">
      <Link href={"/"}>
        <Home />
      </Link>
      <Link href={"/"}>
        <Search />
      </Link>
      <Link href={"/book/donate"}>
        <CirclePlus />
      </Link>
      <Link href={"/"}>
        <MessageCircle />
      </Link>
    </div>
  );
};

export default Navbar;
