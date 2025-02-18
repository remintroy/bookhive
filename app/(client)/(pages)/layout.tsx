"use client";

import React, { Suspense, useEffect } from "react";
import InfoBar from "./_components/infobar";
import useMetadata from "@/hooks/useMetadata";
import { auth } from "@/lib/firebase";
import Navbar from "./_components/navbar";

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
  const metadata = useMetadata();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      metadata.fetchData();
    });
    return () => unsubscribe();
  }, [metadata.fetchData]);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex h-screen relative">
        {/* <Sidebar /> */}
        <div className="w-full">
          <InfoBar />
          {children}
          <div className="h-[100px]"/>
          <Navbar />
        </div>
      </div>
    </Suspense>
  );
};

export default Layout;
