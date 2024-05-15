"use client";

import { FC, useEffect, useState } from "react";
import { ChatbotUIContext } from "@/context/context";
import { performPubMedSearch, PubMedSearchResponse } from "../../pubmedService";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13

interface GlobalStateProps {
  children: React.ReactNode;
}

const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const router = useRouter();

  // PROFILE STORE
  const [profile, setProfile] = useState(null);
  const [pubMedArticles, setPubMedArticles] = useState<string[]>([]);
  const [pubMedWebEnv, setPubMedWebEnv] = useState<string>("");

  const searchPubMed = async (query: string) => {
    const results: PubMedSearchResponse = await performPubMedSearch(query);
    setPubMedArticles(results.esearchresult.idlist);
    setPubMedWebEnv(results.esearchresult.webenv);
    return results;
  };

  useEffect(() => {
    // Initialization logic here...
  }, []);

  return (
    <ChatbotUIContext.Provider
      value={{
        profile,
        setProfile,
        pubMedArticles,
        setPubMedArticles,
        pubMedWebEnv,
        setPubMedWebEnv,
        searchPubMed,
      }}
    >
      {children}
    </ChatbotUIContext.Provider>
  );
};

export default GlobalState;
