import React from "react";
import Sidebar from "./_components/sidebar";
import InfoBar from "./_components/infobar";

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
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
