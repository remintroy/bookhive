"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Check, Copy } from "lucide-react";

interface ShareBookPopupProps {
  link: string;
  enableInbuldButton?: boolean;
  children?: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}

const ShareBookPopup = ({ children, link, enableInbuldButton, open, setOpen }: ShareBookPopupProps) => {
  const [mOpen, setMOpen] = useState(open || false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  useEffect(() => {
    if (open != undefined) setMOpen(open);
  }, [open]);

  useEffect(() => {
    if (setOpen) setOpen?.(mOpen);
  }, [setOpen, mOpen]);

  return (
    <Dialog open={mOpen} onOpenChange={(open) => setMOpen(open)}>
      <DialogTrigger asChild>
        {children || (enableInbuldButton && <Button variant="outline">Share</Button>)}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>Anyone who has this link will be able to view this.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={link} readOnly />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={handleCopy}>
            <span className="sr-only">Copy</span>
            {copied ? <Check className="text-green-500" /> : <Copy />}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareBookPopup;
