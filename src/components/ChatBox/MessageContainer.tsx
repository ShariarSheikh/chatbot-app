import React, { FC, RefObject } from "react";
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
  const handleDownloadResults = () => {
    generateAssessmentPDF(
      "assessment-results",
      `health-report-${new Date().toISOString().slice(0, 10)}`
    );
  };

  // Check if the last message contains assessment results
  const hasAssessmentResults =
    data.length > 0 &&
    data[data.length - 1].content.includes("Your Health Assessment Results");

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
              isLast={index === data.length - 1}
              showDownload={hasAssessmentResults && index === data.length - 1}
              onDownload={handleDownloadResults}
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
  isLast?: boolean;
  showDownload?: boolean;
  onDownload?: () => void;
}

const BotMessage = ({
  content,
  timestamp,
  isLast,
  showDownload,
}: BotMessageProps) => {
  const handleDownload = () => {
    // Ensure the content is rendered before capturing
    setTimeout(() => {
      generateAssessmentPDF(
        "assessment-results",
        `health-report-${new Date().toISOString().slice(0, 10)}`
      );
    }, 300);
  };

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

      {isLast && showDownload && (
        <div className="mt-3 ml-14">
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <svg
              data-slot="icon"
              fill="none"
              stroke-width="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9.75v6.75m0 0-3-3m3 3 3-3m-8.25 6a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              ></path>
            </svg>
            Download Full Report (PDF)
          </button>
        </div>
      )}
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
