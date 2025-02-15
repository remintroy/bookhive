import React, { Suspense } from "react";

type Props = { children: React.ReactNode };

const Layout = ({ children }: Props) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>{children}</div>
    </Suspense>
  );
};

export default Layout;
