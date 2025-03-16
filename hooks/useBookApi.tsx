"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import server from "@/lib/axios";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

const statusText: { [key: string]: string } = {
  available: "This will mark the book as available to claim",
  pending: "This means some on is requiested and book is under transfer",
  claimed: "This will mark book as claimed and remove from listing. You can revert also revert this",
};

export default function useBookApi() {
  const addToFavorites = async (bookId: string) => {
    const { data } = await server.post(`/api/favorites/${bookId}`);
    return data;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateBook = async (bookId: string, bookData: any) => {
    const { data } = await server.put(`/api/books/${bookId}`, bookData);
    return data;
  };

  const deleteBook = async (bookId: string) => {
    const { data } = await server.delete(`/api/books/${bookId}`);
    return { data };
  };

  const getBookById = async (bookId: string) => {
    const { data } = await server.get(`/api/books/${bookId}`);
    return data;
  };

  const updateStatus = async (bookId: string, status: string) => {
    await server.put(`/api/books/${bookId}/status`, { status });
    return { status };
  };

  const UpdateStatus = ({
    bookId,
    bookStatus,
    open: defaultOpen,
    setOpen: defaultSetOpen,
    onComplete,
  }: {
    bookId: string;
    bookStatus?: string;
    open?: boolean;
    setOpen?: (open: boolean) => void;
    onComplete?: () => void;
  }) => {
    const [open, setOpen] = useState(defaultOpen || false);
    const [selectedStatus, setSelectedStatus] = useState(bookStatus || "available");
    const [statusChangeLoading, setStatusChangeLoading] = useState(false);

    const handleMarkAsSold = async () => {
      try {
        setStatusChangeLoading(true);
        await updateStatus(bookId, selectedStatus);
        defaultSetOpen?.(false);
        setOpen(false);
        onComplete?.();
      } catch (error) {
        console.log(error);
      }
      setStatusChangeLoading(false);
    };

    useEffect(() => {
      if (defaultOpen != undefined) setOpen(defaultOpen);
    }, [defaultOpen]);

    useEffect(() => {
      if (defaultSetOpen) defaultSetOpen?.(open);
    }, [defaultSetOpen, open]);

    return (
      <AlertDialog open={open} onOpenChange={(open) => setOpen(open)}>
        <AlertDialogContent>
          <AlertDialogHeader className="flex flex-col gap-2">
            <AlertDialogTitle>Update book status</AlertDialogTitle>
            <div className="flex flex-col gap-3">
              <p className="text-muted-foreground">{statusText?.[selectedStatus]}</p>
              <Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value)}>
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="Select book status" />
                </SelectTrigger>
                <SelectContent>
                  {["available", "pending", "claimed"]?.map((value) => {
                    return (
                      <SelectItem key={value} value={value} className="capitalize">
                        {value}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="button" onClick={handleMarkAsSold} disabled={statusChangeLoading}>
              {statusChangeLoading ? "Updating status..." : "Update status"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  };

  return {
    addToFavorites,
    updateBook,
    deleteBook,
    getBookById,
    updateStatus,
    UpdateStatus,
  };
}
