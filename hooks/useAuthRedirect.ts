"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useMetadata from "./useMetadata";

export default function useAuthRedirect() {
  const router = useRouter();
  const search = useSearchParams();
  const path = usePathname();
  const metadata = useMetadata();

  const redirectToSignIn = (redirectPath?: string) => {
    router.push(`/signin?redirect=${redirectPath || path}`);
  };

  const redirectToSingUp = (redirectPath?: string) => {
    router.push(`/signup?redirect=${redirectPath || path}`);
  };

  const redirectAfterAuth = async (redirectPath?: string) => {
    await metadata.fetchData();
    router.push(redirectPath || search?.get("redirect") || "/");
  };

  return {
    redirectToSignIn,
    redirectToSingUp,
    redirectAfterAuth,
  };
}
