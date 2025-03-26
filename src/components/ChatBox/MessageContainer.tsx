import React, { FC, RefObject } from "react";
import { Message } from ".";
import botPng from "@/assets/robot.png";
import userPng from "@/assets/user.png";
import Image from "next/image";

interface Props {
  data: Message[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onSuggestionClick?: (text: string) => void;
}

const MessageContainer: FC<Props> = ({ data, messagesEndRef }) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 chatbox-container">
      {data.map((message, index) => {
        if (message.isUser)
          return (
            <UserMessage
              key={index}
              text={message.text}
              timestamp={message.timestamp}
            />
          );
        else
          return (
            <BotMessage
              key={index}
              text={message.text}
              timestamp={message.timestamp}
            />
          );
      })}
      <div ref={messagesEndRef as RefObject<HTMLDivElement>} />
    </div>
  );
};

export default MessageContainer;

const UserMessage = ({
  text,
  timestamp,
}: {
  text: string;
  timestamp: string;
}) => {
  return (
    <div className="flex items-end gap-2 justify-end">
      <div className="flex flex-col items-end">
        <div
          className={`max-w-[80%] mr-2 px-4 py-2 rounded-lg bg-indigo-500 text-white rounded-tr-none`}
        >
          {text}
        </div>
        <p className="text-xs text-gray-400 mt-1 mr-2">{timestamp}</p>
      </div>
      <Avatar isUser />
    </div>
  );
};

const BotMessage = ({
  text,
  timestamp,
}: {
  text: string;
  timestamp: string;
}) => {
  return (
    <div className="flex items-end gap-2">
      <Avatar isUser={false} />
      <div className="flex flex-col">
        <div
          className={`max-w-[80%] ml-2 px-4 py-2 rounded-lg bg-slate-700/60 text-white rounded-tl-none`}
        >
          {text}
        </div>
        <p className="text-xs text-gray-400 mt-1 ml-2">{timestamp}</p>
      </div>
    </div>
  );
};

export const Avatar = ({ isUser }: { isUser: boolean }) => {
  return (
    <div className="flex-shrink-0 w-10 h-10 rounded-md bg-slate-700/30 flex items-center justify-center overflow-hidden">
      <div className="w-6 h-6 relative">
        <Image
          src={isUser ? userPng.src : botPng.src}
          fill
          alt={isUser ? "user" : "bot"}
          className="object-contain"
        />
      </div>
    </div>
  );
};
