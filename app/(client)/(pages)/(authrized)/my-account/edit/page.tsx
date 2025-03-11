"use client";

import { Button } from "@/components/ui/button";
import useMetadata from "@/hooks/useMetadata";
import server from "@/lib/axios";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getPlaceDataFromPincode, PincodeDataResponse } from "@/utils";
import FileUpload from "@/components/file-upload";
import { useRouter } from "next/navigation";

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

const EditProfile = () => {
  const metadata = useMetadata();
  const userId = metadata?.uid;
  const [data, setData] = useState<UserUpdate>(defaultDataValue);
  const [updateDataLoading, setUpdateDataLoading] = useState(false);
  const [pincode, setPincode] = useState("");
  const router = useRouter();

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

  const updateUserData = async () => {
    if (updateDataLoading) return;
    setUpdateDataLoading(true);
    try {
      const { data: responseData } = await server.put(`/api/users/${userId}`, data);
      await metadata?.fetchData();
      setData(responseData);
      router.push(`/user/${metadata?.uid}`);
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

  return (
    <div className="container max-w-xl mx-auto flex flex-col gap-3 p-3">
      <div className="flex flex-col gap-4 text-start py-5 px-3 md:px-0 mb-10">
        <div className="font-bold">Edit your profile</div>
        <div className="flex flex-col gap-2">
          <FileUpload setURL={setImage} imageURL={data?.photoURLCustom || data?.photoURL} />
          <Label htmlFor="name-edit-input" className="text-muted-foreground">
            Name
          </Label>
          <Input
            disabled={updateDataLoading || metadata?.loading}
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
            disabled={updateDataLoading || metadata?.loading}
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
            disabled={updateDataLoading || metadata?.loading}
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
            disabled={updateDataLoading || metadata?.loading}
            id="pincode-edit-input"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e?.target?.value)}
          />
        </div>
        <Button type="button" onClick={() => updateUserData()} disabled={updateDataLoading || metadata?.loading}>
          Save changes
        </Button>
      </div>
    </div>
  );
};

export default EditProfile;
