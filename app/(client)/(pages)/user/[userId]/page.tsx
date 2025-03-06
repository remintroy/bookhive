"use client";

import ProductGrid from "@/components/product-grid";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import useMetadata from "@/hooks/useMetadata";
import server from "@/lib/axios";
import { EditIcon, MessageSquare } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getPlaceDataFromPincode, PincodeDataResponse } from "@/utils";
import FileUpload from "@/components/file-upload";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Location {
  googleMapUrl: string;
  address: string;
}

interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  condition: "new" | "excellent" | "good" | "fair";
  categories: string[];
  location: Location;
}

interface BooksCollection {
  totalBooks: number;
  totalSold: number;
  books: Book[];
}

interface User {
  uid: string;
  createdAt: string;
  disabled: boolean;
  displayName: string;
  photoURL: string;
  photoURLCustom: string;
  bio: string;
  books: BooksCollection;
}

interface UserUpdate {
  displayName: string;
  photoURL: string;
  photoURLCustom: string;
  bio: string;
  phoneNumber: string;
  pincode?: string;
  location?: PincodeDataResponse;
}

const defaultDataValue: UserUpdate = {
  displayName: "",
  photoURL: "",
  photoURLCustom: "",
  bio: "",
  phoneNumber: "",
  pincode: "",
};

const UserDetails = () => {
  const metadata = useMetadata();
  const router = useRouter();
  const [userData, setUserData] = useState<User | null>(null);
  const [userDataLoading, setUserDataLoading] = useState(true);
  const userId = useParams().userId;
  const [data, setData] = useState<UserUpdate>(defaultDataValue);
  const [updateDataLoading, setUpdateDataLoading] = useState(false);
  const [pincode, setPincode] = useState("");
  const [m1Open, setM1Open] = useState(false);
  const [m2Open, setM2Open] = useState(false);

  const setImage = (url: string) => {
    setData((prev) => ({ ...prev, photoURLCustom: url }));
  };

  const setPincodeValue = async (pincode: string) => {
    try {
      const data = await getPlaceDataFromPincode(pincode);
      if (!data) {
        setData((prev) => {
          const copy = { ...prev };
          delete copy.location;
          copy.pincode = "";
          return copy;
        });
      }
      setData((prev) => ({ ...prev, location: data, pincode: data?.pincode }));
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUserData = async () => {
    setUserDataLoading(true);
    try {
      if (!userId) return;
      const { data } = await server.get(`/api/users/${userId}`);
      setUserData(data);
      setData({
        displayName: data?.displayName,
        photoURL: data?.photoURL,
        photoURLCustom: data?.photoURLCustom,
        bio: data?.bio,
        phoneNumber: data?.phoneNumber,
      });
      return data;
    } catch (error) {
      console.log(error);
    } finally {
      setUserDataLoading(false);
    }
  };

  const updateUserData = async () => {
    if (updateDataLoading) return;
    setUpdateDataLoading(true);
    try {
      const { data: responseData } = await server.put(`/api/users/${userId}`, data);
      await metadata?.fetchData();
      await fetchUserData();
      setData(responseData);
      setM2Open(false);
      setM1Open(false);
    } catch (error) {
      console.log(error);
    } finally {
      setUpdateDataLoading(false);
    }
  };

  useEffect(() => {
    if (pincode) setPincodeValue(pincode);
  }, [pincode]);

  useEffect(() => {
    if (metadata?.uid)
      setData({
        displayName: metadata.displayName,
        photoURL: metadata.photoURL,
        photoURLCustom: metadata?.photoURLCustom,
        bio: metadata.bio,
        phoneNumber: metadata.phoneNumber,
      });
  }, [metadata]);

  useEffect(() => {
    fetchUserData();
  }, [userId]);

  return (
    <div className="container max-w-7xl mx-auto flex flex-col gap-3 p-5">
      <div className="grid grid-cols-1 gap-5 items-center">
        <div className="flex flex-row gap-5">
          <Avatar className="w-24 h-24">
            {userDataLoading && <Skeleton className="w-full h-full" />}
            {!userDataLoading && (userData?.photoURL || userData?.photoURLCustom) && (
              <AvatarImage src={userData?.photoURLCustom || userData?.photoURL} />
            )}
            {!userDataLoading && <AvatarFallback>{userData?.displayName?.charAt?.(0) || "U"}</AvatarFallback>}
          </Avatar>
          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">{userData?.displayName || "User"}</h2>
            {userData?.bio && <p>{userData?.bio}</p>}
            {!!userData?.books?.totalBooks && (
              <p className="text-muted-foreground">
                {userData?.books?.totalBooks - userData?.books?.totalSold} Books Available :{" "}
                {userData?.books?.totalSold} Sold
              </p>
            )}
            {userData?.createdAt && (
              <p className="text-muted-foreground text-xs">
                A user since : <i>{new Date(userData?.createdAt)?.toLocaleDateString?.()}</i>
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 w-full">
          <Button className="w-full md:w-auto" variant={"secondary"} onClick={() => router.push(`/chat/${userId}`)}>
            <MessageSquare />
            {metadata?.uid == userId ? "Self message" : "Start chat"}
          </Button>
          {metadata?.uid == userId && (
            <Dialog open={m1Open} onOpenChange={(value) => setM1Open(value)}>
              <DialogTrigger className="hidden md:flex" asChild>
                <Button className="" variant={"secondary"}>
                  <EditIcon /> Edit profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit your profile</DialogTitle>
                  <DialogDescription>update & customize</DialogDescription>
                  <div className="flex flex-col gap-4 text-start py-5 px-3 md:px-0">
                    <div className="flex flex-col gap-2">
                      <FileUpload setURL={setImage} imageURL={data?.photoURLCustom || data?.photoURL} />
                      <Label htmlFor="name-edit-input" className="text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        disabled={updateDataLoading}
                        id="name-edit-input"
                        placeholder="Name"
                        value={data?.displayName || ""}
                        onChange={(e) => setData((pre) => ({ ...pre, displayName: e?.target?.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="bio-edit-input" className="text-muted-foreground">
                        Bio
                      </Label>
                      <Input
                        disabled={updateDataLoading}
                        id="bio-edit-input"
                        placeholder="Bio"
                        value={data?.bio || ""}
                        onChange={(e) => setData((pre) => ({ ...pre, bio: e?.target?.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone-edit-input" className="text-muted-foreground">
                        Phone number
                      </Label>
                      <Input
                        disabled={updateDataLoading}
                        id="phone-edit-input"
                        placeholder="Phone Number"
                        value={data?.phoneNumber || ""}
                        onChange={(e) => setData((pre) => ({ ...pre, phoneNumber: e?.target?.value }))}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label htmlFor="pincode-edit-input" className="text-muted-foreground">
                        Pincode <small>{data?.location?.address ? `- ${data?.location?.address}` : "(address)"}</small>
                      </Label>
                      <Input
                        type="number"
                        disabled={updateDataLoading}
                        id="pincode-edit-input"
                        placeholder="Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e?.target?.value)}
                      />
                    </div>
                  </div>
                </DialogHeader>
                <DialogFooter className="sm:justify-end">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>
                  <Button type="button" onClick={() => updateUserData()} disabled={updateDataLoading}>
                    Save changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {metadata?.uid == userId && (
            <Drawer open={m2Open} onOpenChange={(value) => setM2Open(value)}>
              <DrawerTrigger className="md:hidden w-full" asChild>
                <Button className="w-full md:w-auto" variant={"secondary"}>
                  <EditIcon /> Edit profile
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[98%]">
                <DrawerHeader>
                  <DrawerTitle>Edit your profile</DrawerTitle>
                  <DrawerDescription>update & customize</DrawerDescription>
                </DrawerHeader>
                <ScrollArea className="p-3 mx-3 bg-muted/50 rounded-[var(--radius)]">
                  <div className="flex flex-col gap-4 text-start py-5 px-3 md:px-0">
                    <div className="flex flex-col gap-2">
                      <FileUpload setURL={setImage} imageURL={data?.photoURLCustom || data?.photoURL} />
                      <Label htmlFor="name-edit-input" className="text-muted-foreground">
                        Name
                      </Label>
                      <Input
                        disabled={updateDataLoading}
                        id="name-edit-input"
                        placeholder="Name"
                        value={data?.displayName || ""}
                        onChange={(e) => setData((pre) => ({ ...pre, displayName: e?.target?.value }))}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="bio-edit-input" className="text-muted-foreground">
                        Bio
                      </Label>
                      <Input
                        disabled={updateDataLoading}
                        id="bio-edit-input"
                        placeholder="Bio"
                        value={data?.bio || ""}
                        onChange={(e) => setData((pre) => ({ ...pre, bio: e?.target?.value }))}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="phone-edit-input" className="text-muted-foreground">
                        Phone number
                      </Label>
                      <Input
                        disabled={updateDataLoading}
                        id="phone-edit-input"
                        placeholder="Phone Number"
                        value={data?.phoneNumber || ""}
                        onChange={(e) => setData((pre) => ({ ...pre, phoneNumber: e?.target?.value }))}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <Label htmlFor="pincode-edit-input" className="text-muted-foreground">
                        Pincode <small>{data?.location?.address ? `- ${data?.location?.address}` : "(address)"}</small>
                      </Label>
                      <Input
                        type="number"
                        disabled={updateDataLoading}
                        id="pincode-edit-input"
                        placeholder="Pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e?.target?.value)}
                      />
                    </div>
                  </div>
                </ScrollArea>
                <DrawerFooter className="mb-5">
                  <Button onClick={() => updateUserData()} disabled={updateDataLoading}>
                    Save changes
                  </Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
        </div>
      </div>

      <Separator />
      <ProductGrid userIds={[userId as string]} />
    </div>
  );
};

export default UserDetails;
