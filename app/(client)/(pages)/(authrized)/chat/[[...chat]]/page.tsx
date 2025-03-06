"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import useMetadata from "@/hooks/useMetadata";
import server from "@/lib/axios";
import { database } from "@/lib/firebase";
import { CustomUser } from "@/types/Books";
import { onValue, orderByChild, orderByKey, query, ref, set } from "firebase/database";
import Image from "next/image";
import Link from "next/link";
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
  const [userUrlId, setUserUrlId] = useState<string | undefined>(uid?.[0]);
  const metadata = useMetadata();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [sendMessageLoading, setSendMessageLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [userData, setUserData] = useState<{ [key: string]: CustomUser }>({});

  const [initialChatLoading, setInitialChatLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);

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
      const uid2 = userUrlId;
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
    const uid2 = userUrlId;
    if (!uid1 || !uid2) return;
    const chatId = uid1 < uid2 ? `${uid1}-${uid2}` : `${uid2}-${uid1}`; // Ensures consistent ordering

    const messagesRef = ref(database, `messages/${chatId}`);
    const messageQuery = query(messagesRef, orderByKey());
    fetchUserData(uid2);
    setMessagesLoading(true);

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
      setMessagesLoading(false);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [metadata?.uid, userUrlId]);

  useEffect(() => {
    if (!metadata?.uid) return;

    const messagesRef = ref(database, `chats/${metadata?.uid}`);
    const messageQuery = query(messagesRef, orderByChild("lastMessageAt"));

    // Listen for real-time updates
    const unsubscribe = onValue(messageQuery, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const usersList = Object.keys(data)
          .map((key) => {
            fetchUserData(key);
            return {
              id: key,
              ...data[key],
            };
          })
          ?.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
        setChatUsers(usersList);
      } else {
        setChatUsers([]);
      }
      setInitialChatLoading(false);
    });
    return () => unsubscribe(); // Cleanup listener on unmount
  }, [metadata?.uid]);

  return (
    <>
      <div className="fixed w-full top-[4rem] border-t bottom-7 left-0 right-0 flex flex-row max-sw-7xl m-auto">
        <div
          className={`flex flex-col p-3 md:border-r md:w-[50%] md:max-w-[450px] md:min-w-[300px] w-full ${
            userUrlId ? "hidden" : "flex"
          } md:flex gap-1`}
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
          {!initialChatLoading && !chatUsers?.length && (
            <div className="w-full h-full flex items-center justify-center">Send message to see users list</div>
          )}
          {chatUsers?.map((user) => (
            <div
              onClick={() => {
                if (user?.id) {
                  window.history.pushState(null, "", `/chat/${user?.id}`);
                  setUserUrlId(user?.id);
                }
              }}
              key={user?.id}
              className={`flex flex-row p-3 gap-3 items-center hover:bg-muted ${
                user?.id == userUrlId && userData?.[user?.id as string] ? "bg-muted" : ""
              } cursor-pointer rounded-[var(--radius)]`}
            >
              <Avatar className="border">
                {user?.id && (userData[user?.id]?.photoURL || userData[user?.id]?.photoURLCustom) && (
                  <AvatarImage src={userData?.[user?.id]?.photoURLCustom || userData?.[user?.id]?.photoURL || ""} />
                )}
                <AvatarFallback>{userData?.[user?.id as string]?.displayName?.charAt?.(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-row items-start justify-between w-full">
                <div>
                  <div className="line-clamp-1">
                    {user?.id && userData?.[user?.id]?.displayName ? userData?.[user?.id]?.displayName : "User"}
                  </div>
                  <div className="line-clamp-1 text-sm text-muted-foreground">{user?.lastMessage}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="text-xs text-muted-foreground">{new Date(user?.createdAt)?.toLocaleString()}</div>
                  {user?.id == metadata?.uid && (
                    <div>
                      <Badge>self message</Badge>
                    </div>
                  )}
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

        <div
          className={`relative w-full hidden md:${
            userUrlId ? "hidden" : "flex"
          } mb-20 md:mb-0 flex flex-col items-center justify-center`}
        >
          <Image
            src="/images/cat-sitting.png"
            alt="Illustration"
            width={300}
            height={300}
            className="object-scale-down dark:invert"
          />
          <div className="text-2xl font-d">Open a chat to see messages</div>
          <div className="flex flex-row gap-3 items-center text-muted-foreground">Chat with the seller with ease</div>
        </div>

        <div className={`relative w-full ${userUrlId ? "block" : "hidden"} mbd-[2.2rem] md:mb-0 bg-muted/30`}>
          <div className="w-full p-3 md:p-3 border-b flex flex-row items-center gap-3">
            <Link href={`/user/${userUrlId}`} className="flex flex-row gap-3 w-max cursor-pointer items-center">
              <Avatar className="border">
                {userUrlId && (userData[userUrlId]?.photoURL || userData[userUrlId]?.photoURLCustom) && (
                  <AvatarImage src={userData[userUrlId]?.photoURLCustom || userData?.[userUrlId]?.photoURL || ""} />
                )}
                <AvatarFallback>{userData?.[userUrlId as string]?.displayName?.charAt?.(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="line-clamp-1">{userData?.[userUrlId as string]?.displayName || "User"}</div>
            </Link>
          </div>
          <div className="w-full absolute top-[4rem] left-0 right-0 bottom-[3.5rem] overflow-x-hidden p-5 flex flex-col-reverse">
            <div className="flex flex-col pt-3 md:pt-0 gap-2 justify-end">
              {!messagesLoading &&
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
          <div className="absolute bottom-0 left-0 w-full p-2 pb-2 border-t flex flex-row gap-3">
            <Input
              className="border-none bg-inherit"
              ref={inputRef}
              placeholder="Type your message here"
              value={inputValue}
              onChange={(e) => setInputValue(e?.target?.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <Button onClick={() => sendMessage()} disabled={sendMessageLoading}>
              Send
            </Button>
          </div>
        </div>
      </div>
      <div className="bottom-0 left-0 right-0 w-full p-1.5 border-t fixed flex flex-row gap-1 bg-muted/20 justify-center text-xs text-muted-foreground/50">
        Powered by
        <Link href="https://mastrovia.com" target="_blank" rel="noopener noreferrer">
          Mastrovia
        </Link>
      </div>
    </>
  );
};

export default ChatWithUser;
