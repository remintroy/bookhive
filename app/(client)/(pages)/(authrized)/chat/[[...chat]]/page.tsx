"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useMetadata from "@/hooks/useMetadata";
import server from "@/lib/axios";
import { database } from "@/lib/firebase";
import { UserRecord } from "firebase-admin/auth";
import { onValue, orderByChild, orderByKey, query, ref, set } from "firebase/database";
import { SendHorizonal } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

type Message = {
  id?: string;
  message: string;
  readStatus: "read" | "unread";
  uid: string;
  createdAt: string;
  readAt: string | null;
};

type ChatUser = {
  id?: string;
  lastMessage: string;
  lastMessageAt: number;
  lastMessageReadAt?: string | null;
  userId: string;
  createdAt: string;
  newMessagesCount?: number;
};

const ChatWithUser = () => {
  const uid = useParams().chat;
  const metadata = useMetadata();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const route = useRouter();
  const [userData, setUserData] = useState<{ [key: string]: UserRecord }>({});

  const [initialChatLoading, setInitialChatLoading] = useState(true);
  const [initialMessageLoading, setInitialMessageLoading] = useState(false);

  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

  useEffect(() => {
    inputRef?.current?.focus();
  }, [uid]);

  const fetchUserData = async (userId: string) => {
    try {
      if (userData[userId]) return userData[userId];
      const { data } = await server.get(`/api/users/${userId}`);
      setUserData((prevState) => ({ ...prevState, [userId]: data }));
      return data;
    } catch (error) {
      console.log(error);
    }
  };

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

      const userChatData: ChatUser = {
        lastMessage: messageToSubmit?.message,
        lastMessageAt: Date.now(),
        lastMessageReadAt: null,
        userId: uid2,
        createdAt: new Date().toISOString(),
      };

      await set(ref(database, `messages/${chatId}/${Date.now()}`), messageToSubmit);
      await set(ref(database, `chats/${uid1}/${uid2}`), userChatData); // Update user's chat list
      await set(ref(database, `chats/${uid2}/${uid1}`), userChatData); // Update other user's chat list
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

  useEffect(() => {
    if (!metadata?.uid) return;
    const messagesRef = ref(database, `chats/${metadata?.uid}`);
    const messageQuery = query(messagesRef, orderByChild("lastMessageAt"));

    // Listen for real-time updates
    const unsubscribe = onValue(messageQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const messageList = Object.keys(data)
          .map((key) => {
            fetchUserData(key);
            return {
              id: key,
              ...data[key],
            };
          })
          ?.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
        setChatUsers(messageList);
      } else {
        setChatUsers([]);
      }
      setInitialChatLoading(false);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [metadata?.uid]);

  return (
    <div className="absolute w-full top-16 bottom-1 left-0 right-0 flex flex-row max-sw-7xl m-auto border">
      <div
        className={`flex flex-col p-3 border-r md:w-[50%] md:max-w-[450px] md:min-w-[300px] w-full ${
          uid?.[0] ? "hidden" : "flex"
        } md:flex`}
      >
        {initialChatLoading &&
          Array(3)
            ?.fill(0)
            ?.map((e, i) => (
              <div key={e + i} className={`flex flex-row p-3 gap-3 items-center hover:bg-muted`}>
                <Avatar>
                  <Skeleton className="w-full h-full" />
                </Avatar>
                <div className="flex flex-row items-start justify-between w-full">
                  <div className="w-full flex flex-col gap-1">
                    <Skeleton className="w-full h-7" />
                    <Skeleton className="w-full h-4" />
                  </div>
                </div>
              </div>
            ))}
        {chatUsers?.map((user) => (
          <div
            onClick={() => {
              if (user?.id) {
                route.push(user?.id);
                setInitialMessageLoading(true);
              }
            }}
            key={user?.id}
            className={`flex flex-row p-3 gap-3 items-center hover:bg-muted ${
              user?.id == uid && userData?.[user?.id as string] ? "bg-muted" : ""
            } cursor-pointer`}
          >
            <Avatar>
              {user?.id && userData[user?.id] && <AvatarImage src={userData?.[user?.id]?.photoURL} />}
              <AvatarFallback>
                {userData?.[user?.id as string] ? userData?.[user?.id as string]?.displayName?.charAt?.(0) : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-row items-start justify-between w-full">
              <div>
                <div className="line-clamp-1">
                  {user?.id && userData?.[user?.id] ? (
                    userData?.[user?.id]?.displayName
                  ) : (
                    <Skeleton className="w-[100px] h-6" />
                  )}
                </div>
                <div className="line-clamp-1 text-sm text-muted-foreground">{user?.lastMessage}</div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="text-xs text-muted-foreground">{new Date(user?.createdAt)?.toLocaleString()}</div>
                {user?.newMessagesCount && (
                  <div>
                    <Badge variant={"outline"}>{user?.newMessagesCount}</Badge>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={`relative w-full  ${uid?.[0] ? "block" : "hidden"} md:block mb-20 md:mb-0`}>
        <div className="w-full p-5 border-b flex flex-row items-center gap-3">
          <Avatar>
            {uid?.[0] && userData[uid?.[0]] && <AvatarImage src={userData?.[uid?.[0]]?.photoURL} />}
            <AvatarFallback>
              {uid?.[0] && userData?.[uid?.[0]] ? userData?.[uid?.[0]]?.displayName?.charAt?.(0) : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="line-clamp-1">
            {uid?.[0] && userData?.[uid?.[0]] ? (
              userData?.[uid?.[0]]?.displayName
            ) : (
              <Skeleton className="w-[100px] h-5" />
            )}
          </div>
        </div>
        <div className="w-full absolute top-20 left-0 right-0 bottom-20 overflow-x-hidden p-5 flex flex-col-reverse">
          <div className="flex flex-col gap-2 justify-end">
            {!initialMessageLoading &&
              messages?.map((message) => {
                return (
                  <div
                    key={message.id}
                    className={`p-2 px-3 border rounded-[var(--radius)] w-max ${
                      message.uid === metadata?.uid ? "self-end" : "self-start"
                    } flex-shrink-0`}
                  >
                    <div className="line-clamp-1">{message.message}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(message?.createdAt)?.toLocaleTimeString()}
                    </div>
                  </div>
                );
              })}
            <div ref={messagesEndRef} className="absolute bottom-0" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-5 pb-3 md:pb-5 border-t flex flex-row gap-3">
          <Input
            ref={inputRef}
            placeholder="Your message here"
            value={inputValue}
            onChange={(e) => setInputValue(e?.target?.value)}
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
