"use client";

import React, { Suspense, useEffect } from "react";
import InfoBar, { InfoBarFallback } from "./_components/infobar";
import useMetadata from "@/hooks/useMetadata";
import { auth } from "@/lib/firebase";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";

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
    <Suspense
      fallback={
        <div className="flex h-screen relative">
          <div className="w-full">
            <InfoBarFallback />
            <Navbar />
          </div>
        </div>
      }
    >
      <div className="flex h-screen relative">
        {/* <Sidebar /> */}
        <div className="w-full">
          <InfoBar />
          {children}
          <Footer />
          <Navbar />
        </div>
      </div>
    </Suspense>
  );
};

export default Layout;
