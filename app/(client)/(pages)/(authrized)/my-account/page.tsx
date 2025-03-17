"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import useMetadata from "@/hooks/useMetadata";
import { BookHeart, EditIcon, Heart, LogOut, MessageSquare, Moon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import useAuthRedirect from "@/hooks/useAuthRedirect";

const MyAccountPage = () => {
  const { setTheme, theme } = useTheme();
  const metadata = useMetadata();
  const redirect = useAuthRedirect();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    redirect.redirectToSignIn();
  };

  return (
    <div className="container max-w-xl mx-auto flex flex-col gap-3 p-5 mb-5">
      <div className="flex flex-col gap-3 items-center">
        <div className="flex flex-col gap-5 w-full border rounded-[var(--radius)] h-full p-5">
          <div className="flex flex-row gap-5">
            <Avatar className="w-24 h-24">
              {metadata?.loading && <Skeleton className="w-full h-full" />}
              {!metadata?.loading && (metadata?.photoURL || metadata?.photoURLCustom) && (
                <AvatarImage src={metadata?.photoURLCustom || metadata?.photoURL} />
              )}
              {!metadata?.loading && <AvatarFallback>{metadata?.displayName?.charAt?.(0) || "U"}</AvatarFallback>}
            </Avatar>
            <div className="flex flex-col gap-1">
              {!metadata?.loading && <h2 className="text-xl font-bold">{metadata?.displayName || "User"}</h2>}
              {metadata?.bio && <p>{metadata?.bio}</p>}
              {!!metadata?.books?.totalBooks && (
                <p className="text-muted-foreground text-sm">
                  {metadata?.books?.totalBooks - metadata?.books?.totalSold} Books Available :{" "}
                  {metadata?.books?.totalSold} Sold
                </p>
              )}
            </div>
          </div>
          <Separator />
          <div className="flex flex-col gap-1">
            <h3 className="text-md font-bold">Account details</h3>
            {metadata?.createdAt && (
              <p className="text-muted-foreground text-sm">
                Account created at : <i>{new Date(metadata?.createdAt)?.toLocaleDateString?.()}</i>
              </p>
            )}
            {metadata?.email && (
              <p className="text-muted-foreground text-sm flex justify-between w-full">Email : {metadata?.email}</p>
            )}
            {metadata?.location?.pincode && (
              <p className="text-muted-foreground text-sm">Pincode : {metadata?.location?.pincode}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2 w-full h-full">
          {/* <h3 className="text-md font-bold">Actions</h3> */}
          <Button
            variant={"outline"}
            className="w-full justify-start p-3 py-6"
            onClick={() => router.push(`/my-account/edit`)}
          >
            <EditIcon /> Edit Profile
          </Button>
          <div className="w-full flex flex-row justify-between p-3 items-center border rounded-[var(--radius)]">
            <div className="flex flex-row items-center gap-2">
              <Moon className="h-[1rem] w-[1rem]" /> Dark Mode
            </div>
            <Switch checked={theme !== "light"} onClick={() => setTheme(theme == "light" ? "dark" : "light")} />
          </div>
          <Button
            variant={"outline"}
            className="w-full justify-start p-3 py-6"
            onClick={() => router.push(`/chat/${metadata?.uid}`)}
          >
            <MessageSquare /> Self messaging
          </Button>
          <Button
            variant={"outline"}
            className="w-full justify-start p-3 py-6"
            onClick={() => router.push(`/user/${metadata?.uid}`)}
          >
            <BookHeart /> My Books & Profile
          </Button>
          <Button
            variant={"outline"}
            className="w-full justify-start p-3 py-6"
            onClick={() => router.push(`/favorites`)}
          >
            <Heart /> Favorites
          </Button>
          <Button variant={"outline"} className="w-full justify-start p-3 py-6" onClick={handleLogout}>
            <LogOut /> Sign out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MyAccountPage;
