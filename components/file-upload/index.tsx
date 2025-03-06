"use client";

import { useRef, useState } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import axios from "axios";
import server from "@/lib/axios";

type Props = {
  previewAspectRatio?: number;
  setURL?: (url: string) => void;
  imageURL?: string;
};

const FileUpload = (props: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>(props?.imageURL || "");
  const [status, setStatus] = useState<"uploading" | "uploaded" | "idle" | "preparing">("idle");
  const [uploadProgress, setUploadProgress] = useState("0");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      //
      const file = e.target.files?.[0];

      const fileURL = URL.createObjectURL(file);
      setImage(fileURL);

      const upload = async () => {
        try {
          setStatus("preparing");

          const formData = new FormData();
          formData.append("file", file);

          const { data: uploadUrlResponse } = await server.post("/api/upload-url", {
            name: file.name,
            type: file.type,
          });
          const uploadURL = uploadUrlResponse?.url;

          setStatus("uploading");

          const workerURL = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_WORKER_URL}?signedUrl=${encodeURIComponent(
            uploadURL
          )}`;

          await axios.put(workerURL, formData, {
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: (progressEvent) => {
              const percentComplete = (progressEvent.loaded / (progressEvent.total || 1)) * 100;
              setUploadProgress(percentComplete.toFixed(0));
            },
          });

          setStatus("uploaded");
          props?.setURL?.(`${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL}/${uploadUrlResponse?.key}`);
        } catch (error) {
          setStatus("idle");
          console.error(error);
        }
      };

      upload();
    }
  };

  return (
    <div
      className="border border-dashed rounded-[var(--radius)] overflow-hidden cursor-pointer relative"
      onClick={() => fileRef.current?.click()}
    >
      <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleFileChange} />
      <AspectRatio ratio={props?.previewAspectRatio || 1 / 1} className="bg-muted relative overflow-hidden">
        {!image && (
          <small className="text-muted-foreground w-full h-full absolute flex items-center justify-center">
            Click to upload
          </small>
        )}
        {image && (
          <Image
            src={image}
            alt="product-pic"
            fill
            className="h-full w-full object-scale-down dark:bg-black bg-white"
          />
        )}
        {status != "uploaded" && status != "idle" && (
          <>
            <div className="absolute bg-muted/70 h-full w-full"></div>
            <small className="absolute text-white bottom-4 text-center w-full">{uploadProgress}% uploaded</small>
          </>
        )}
      </AspectRatio>
    </div>
  );
};

export default FileUpload;
