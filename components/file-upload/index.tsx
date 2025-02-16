"use client";

import { useRef, useState } from "react";
import { AspectRatio } from "../ui/aspect-ratio";
import Image from "next/image";
import server from "@/lib/axios";

type Props = {
  previewAspectRatio?: number;
};

const FileUpload = (props: Props) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState<string>("");
  const [status, setStatus] = useState<"uploading" | "uploaded" | "idle" | "preparing">("idle");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      //
      const file = e.target.files?.[0];

      const fileURL = URL.createObjectURL(file);
      setImage(fileURL);

      const upload = async () => {
        setStatus("preparing");

        const formData = new FormData();
        formData.append("file", file);

        const { data: uploadUrlResponse } = await server.post("/api/upload-url", { name: file.name, type: file.type });
        const uploadURL = uploadUrlResponse?.url;

        setStatus("uploading");

        const workerURL = `${process.env.NEXT_PUBLIC_CLOUDFLARE_R2_WORKER_URL}?signedUrl=${encodeURIComponent(
          uploadURL
        )}`;

        const { data: uploadFileResponse } = await server.put(workerURL, formData, {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percentComplete = (progressEvent.loaded / (progressEvent.total || 1)) * 100;
            console.log(`Upload Progress: ${percentComplete.toFixed(2)}%`);
          },
        });

        console.log(uploadFileResponse);

        setStatus("uploaded");
      };

      upload();
    }
  };

  return (
    <div
      className="border border-dashed rounded-[var(--radius)] cursor-pointer relative"
      onClick={() => fileRef.current?.click()}
    >
      <input type="file" ref={fileRef} accept="image/*" className="hidden" onChange={handleFileChange} />
      <AspectRatio ratio={props?.previewAspectRatio || 1 / 1} className="bg-muted rounded-md">
        {!image && (
          <small className="text-muted-foreground w-full h-full absolute flex items-center justify-center">
            Click to upload {status}
          </small>
        )}
        {image && <Image src={image} alt="product-pic" fill className="h-full w-full rounded-md object-cover" />}
      </AspectRatio>
    </div>
  );
};

export default FileUpload;
