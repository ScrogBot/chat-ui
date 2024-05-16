import { FC, useContext, useEffect, useState } from "react";
import { ChatbotUIContext } from "@/context/context";
import { performPubMedSearch, performPubMedFetch, PubMedSearchResponse, PubMedFetchResponse } from "../../pubmedService";
import { toast } from "sonner";
import { ChatInput } from "./chat-input";
import { ChatMessages } from "./chat-messages";

const ChatUI: FC = () => {
  const { chatMessages, selectedChat, searchPubMed, setPubMedArticles, pubMedArticles, setChatMessages } = useContext(ChatbotUIContext);

  useEffect(() => {
    if (selectedChat) {
      const systemPrompt = selectedChat.prompt || "";
      if (systemPrompt.startsWith("pubmed:")) {
        const searchQuery = systemPrompt.slice(7).trim(); // Extract search term
        if (searchQuery) {
          searchPubMed(searchQuery)
            .then((results) => {
              const articles = results.esearchresult.idlist.map(id => ({ id })); // Transform to PubMedArticle[]
              setPubMedArticles(articles);
            })
            .catch((error) => {
              toast.error("Failed to fetch PubMed articles.");
            });
        }
      }
    }
  }, [selectedChat, searchPubMed, setPubMedArticles]);

  return (
    <div className="chat-ui">
      <ChatMessages messages={chatMessages} />
      <ChatInput onUserInput={async (input) => {
        const query = input.trim();
        const systemPrompt = selectedChat?.prompt || "";
        const shouldSearchPubMed = systemPrompt.startsWith("pubmed:");

        if (shouldSearchPubMed) {
          const searchQuery = query;
          if (searchQuery) {
            try {
              const results = await searchPubMed(searchQuery);
              const articles = results.esearchresult.idlist.map(id => ({ id })); // Transform to PubMedArticle[]
              setPubMedArticles(articles);
            } catch (error) {
              toast.error("Failed to fetch PubMed articles.");
            }
          }
        } else {
          const newMessage = {
            id: `msg-${Date.now()}`, // Generate a unique ID for the message
            role: "user",
            content: input,
            timestamp: Date.now(),
          };
          setChatMessages([...chatMessages, newMessage]);
        }
      }} />
    </div>
  );
};

export default ChatUI;
