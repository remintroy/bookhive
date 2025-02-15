"use client";

import useAuthRedirect from "@/hooks/useAuthRedirect";
import useMetadata from "@/hooks/useMetadata";
import { useEffect } from "react";

type Props = { children: React.ReactNode };

const Layout = (props: Props) => {
  const metadata = useMetadata();
  const redirect = useAuthRedirect();

  useEffect(() => {
    if (!metadata?.loading && !metadata?.loggedIn) redirect.redirectToSignIn();
  }, [metadata, redirect]);

  return <div>{props?.children}</div>;
};

export default Layout;
