import React, { FC, RefObject, useCallback, useEffect } from "react";
import botPng from "@/assets/robot.png";
import userPng from "@/assets/user.png";
import Image from "next/image";
import { Message } from "@/types/chat";
import { generateAssessmentPDF } from "@/utils/pdfGenerator";

interface Props {
  data: Message[];
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onSuggestionClick?: (text: string) => void;
  isLoading: boolean;
}

const MessageContainer: FC<Props> = ({ data, messagesEndRef, isLoading }) => {
  // Add PDF download handler
  const handleDownload = useCallback(() => {
    const element = document.getElementById("assessment-results");
    if (!element) {
      console.error("Assessment results element not found");
      return;
    }

    // Create a temporary button to handle the download
    const downloadBtn = document.createElement("button");
    downloadBtn.onclick = () => {
      setTimeout(() => {
        generateAssessmentPDF(
          "assessment-results",
          `Health-Report-${new Date().toISOString().slice(0, 10)}`
        );
      }, 300);
    };
    downloadBtn.click();
  }, []);

  // Handle clicks on dynamically created download buttons
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-download-pdf]")) {
        handleDownload();
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [handleDownload]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-6 chatbox-container">
      {data.map((message, index) => {
        if (message.isUser)
          return (
            <UserMessage
              key={index}
              content={message.content}
              timestamp={message.timestamp}
            />
          );
        else
          return (
            <BotMessage
              key={index}
              content={message.content}
              timestamp={message.timestamp}
            />
          );
      })}
      {isLoading && (
        <div className="flex items-end gap-2">
          <Avatar isUser={false} />
          <div className="flex flex-col">
            <div className="max-w-[80%] ml-2 px-4 py-2 rounded-lg bg-slate-700/60 text-white rounded-tl-none">
              <div className="flex space-x-2">
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef as RefObject<HTMLDivElement>} />
    </div>
  );
};

export default MessageContainer;

const UserMessage = ({
  content,
  timestamp,
}: {
  content: string;
  timestamp: string;
}) => {
  return (
    <div className="flex items-end gap-2 justify-end">
      <div className="flex flex-col items-end">
        <div
          className={`max-w-[80%] mr-2 px-4 py-2 rounded-lg bg-indigo-500 text-white rounded-tr-none`}
        >
          {content}
        </div>
        <p className="text-xs text-gray-400 mt-1 mr-2">{timestamp}</p>
      </div>
      <Avatar isUser />
    </div>
  );
};

interface BotMessageProps {
  content: string;
  timestamp: string;
}

const BotMessage = ({ content, timestamp }: BotMessageProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-end gap-2">
        <Avatar isUser={false} />
        <div className="flex flex-col">
          <div
            className="max-w-[80%] ml-2 px-4 py-2 rounded-lg bg-slate-700/60 text-white rounded-tl-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
          <p className="text-xs text-gray-400 mt-1 ml-2">{timestamp}</p>
        </div>
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
