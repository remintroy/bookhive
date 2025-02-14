"use client";

import React, { useEffect } from "react";
import Sidebar from "./_components/sidebar";
import InfoBar from "./_components/infobar";
import useMetadata from "@/hooks/useMetadata";
import { auth } from "@/lib/firebase";

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
  const metadata = useMetadata();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      metadata.fetchData();
    });
    return () => unsubscribe();
  }, []);

  return (
    <div className="flex h-screen relative">
      {/* <Sidebar /> */}
      <div className="w-full">
        <InfoBar />
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
