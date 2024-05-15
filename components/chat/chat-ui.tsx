import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { ChatbotUIContext } from "@/context/context";
import { searchPubMed, PubMedSearchResponse } from "../../pubmedService"; // Ensure the correct import path

const ChatUI = () => {
  const { setPubMedArticles } = useContext(ChatbotUIContext);

  const [searchQuery, setSearchQuery] = useState(""); // Adjust based on actual implementation

  useEffect(() => {
    const fetchPubMedArticles = async () => {
      try {
        const results: PubMedSearchResponse = await searchPubMed(searchQuery);
        setPubMedArticles(results.esearchresult.idlist); // Access the correct property
      } catch (error) {
        toast.error("Failed to fetch PubMed articles.");
      }
    };

    if (searchQuery) {
      fetchPubMedArticles();
    }
  }, [searchQuery, setPubMedArticles]);

  return (
    <div>
      {/* Render chat UI components here */}
    </div>
  );
};

export default ChatUI;
