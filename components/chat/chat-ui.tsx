"use client";

import { FC, useContext, useEffect, useState } from "react";
import { ChatbotUIContext } from "@/context/context";
import { performPubMedSearch, performPubMedFetch, PubMedSearchResponse, PubMedFetchResponse } from "../../pubmedService";
import { toast } from "sonner";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";
import { ChatSettings } from "./chat-settings";
import { QuickSettings } from "./quick-settings";
import { Brand } from "../ui/brand";

const ChatUI: FC = () => {
  const {
    chatMessages,
    setPubMedArticles,
  } = useContext(ChatbotUIContext);

  const [detailedArticles, setDetailedArticles] = useState<PubMedFetchResponse["result"]>({});

  const handlePubMedSearch = async (searchQuery: string) => {
    try {
      const searchResults: PubMedSearchResponse = await performPubMedSearch(searchQuery);
      const { webenv, querykey } = searchResults.esearchresult;
      setPubMedArticles(searchResults.esearchresult.idlist);

      const fetchResults: PubMedFetchResponse = await performPubMedFetch(webenv, querykey);
      setDetailedArticles(fetchResults.result);
    } catch (error) {
      toast.error("Failed to fetch PubMed articles.");
    }
  };

  useEffect(() => {
    const searchQuery = "example query"; // Replace with actual query
    handlePubMedSearch(searchQuery);
  }, []);

  return (
    <>
      {chatMessages.length === 0 ? (
        <div className="relative flex h-full flex-col items-center justify-center">
          <div className="top-50% left-50% -translate-x-50% -translate-y-50% absolute mb-20">
            <Brand />
          </div>

          <div className="absolute left-2 top-2">
            <QuickSettings />
          </div>

          <div className="absolute right-2 top-2">
            <ChatSettings />
          </div>

          <div className="flex grow flex-col items-center justify-center" />

          <div className="w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
            <ChatInput onUserInput={handlePubMedSearch} />
          </div>
        </div>
      ) : (
        <ChatMessages />
      )}

      {/* Display Detailed PubMed Search Results */}
      {Object.keys(detailedArticles).length > 0 && (
        <div className="mt-4">
          <h2>PubMed Search Results</h2>
          {Object.values(detailedArticles).map((article, index) => (
            <div key={index} className="article">
              <h3>{article.title}</h3>
              <p>{article.abstract}</p>
              <p>Authors: {article.authors.join(", ")}</p>
              <p>Source: {article.source}</p>
              <p>Published Date: {article.pubdate}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ChatUI;
