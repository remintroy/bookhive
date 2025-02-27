"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useMetadata from "@/hooks/useMetadata";
import { database } from "@/lib/firebase";
import { onValue, orderByKey, query, ref, set } from "firebase/database";
import { SendHorizonal } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type Message = {
  id?: string;
  message: string;
  readStatus: "read" | "unread";
  uid: string;
  createdAt: string;
  readAt: string | null;
};

const ChatWithUser = () => {
  const uid = useParams().chat;
  const metadata = useMetadata();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const sendMessage = async (message?: string) => {
    try {
      setSendMessageLoading(true);
      const uid1 = metadata?.uid;
      const uid2 = uid?.[0];
      if (!uid1 || !uid2) return;
      if (!message && !inputValue) return;
      const chatId = uid1 < uid2 ? `${uid1}-${uid2}` : `${uid2}-${uid1}`; // Ensures consistent ordering

      const messageToSubmit: Message = {
        message: (message || inputValue || "")?.trim?.(),
        readStatus: "unread",
        uid: uid1, // always current user
        createdAt: new Date().toISOString(),
        readAt: null,
      };

      await set(ref(database, `messages/${chatId}/${Date.now()}`), messageToSubmit);
      setInputValue("");
      inputRef?.current?.focus(); // Focus back to input field after message sent
    } catch (error) {
      console.log(error);
    } finally {
      setSendMessageLoading(false);
      return;
    }
  };

  useEffect(() => {
    const uid1 = metadata?.uid;
    const uid2 = uid?.[0];
    if (!uid1 || !uid2) return;
    const chatId = uid1 < uid2 ? `${uid1}-${uid2}` : `${uid2}-${uid1}`; // Ensures consistent ordering

    const messagesRef = ref(database, `messages/${chatId}`);
    const messageQuery = query(messagesRef, orderByKey());

    // Listen for real-time updates
    const unsubscribe = onValue(messageQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messageList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMessages(messageList);
        messagesEndRef?.current?.scrollIntoView({ behavior: "smooth" });
      } else {
        setMessages([]);
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [metadata?.uid, uid]);

  return (
    <div className="absolute w-full top-16 bottom-1 left-0 right-0 flex flex-row max-w-7xl m-auto border">
      <div className="flex flex-col p-3 border-r md:max-w-[30%] w-full">
        {Array(10)
          ?.fill(0)
          ?.map((e, i) => (
            <div key={e + i} className="flex flex-row p-3 gap-3 items-center hover:bg-muted">
              <Avatar>
                <AvatarImage src={`https://picsum.photos/id/${i + 1}/200/200`} />
                <AvatarFallback>User {i + 1}</AvatarFallback>
              </Avatar>
              <div className="flex flex-row items-start justify-between w-full">
                <div>
                  <div className="line-clamp-1">User T.</div>
                  <div className="line-clamp-1 text-sm text-muted-foreground">User T.</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs text-muted-foreground">11:11PM</div>
                  <div>
                    <Badge variant={"outline"}>1</Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="relative w-full">
        <div className="w-full p-5 border-b flex flex-row items-center gap-3">
          <Avatar>
            <AvatarImage src={`https://picsum.photos/id/1/200/200`} />
            <AvatarFallback>User </AvatarFallback>
          </Avatar>
          <div className="line-clamp-1">User T.</div>
        </div>
        <div className="w-full absolute top-20 left-0 right-0 bottom-20 overflow-x-hidden p-5 flex flex-col-reverse">
          <div className="flex flex-col gap-2 justify-end">
            {messages?.map((message) => {
              return (
                <div
                  key={message.id}
                  className={`p-2 px-3 border rounded-[var(--radius)] w-max ${
                    message.uid === metadata?.uid ? "self-end" : "self-start"
                  } line-clamp-1 flex-shrink-0`}
                >
                  {message.message}
                </div>
              );
            })}
            <div ref={messagesEndRef} className="absolute bottom-0" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-5 border-t flex flex-row gap-3">
          <Input
            ref={inputRef}
            placeholder="Your message here"
            value={inputValue}
            onChange={(e) => setInputValue(e?.target?.value)}
            // disabled={sendMessageLoading}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <Button onClick={() => sendMessage()} disabled={sendMessageLoading}>
            Send <SendHorizonal />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatWithUser;
