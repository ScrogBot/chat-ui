"use client";

import { FC, useEffect, useState } from "react";
import { ChatbotUIContext } from "@/context/context";
import { performPubMedSearch, performPubMedFetch, PubMedSearchResponse, PubMedArticle } from "../../pubmedService";
import { useRouter } from "next/navigation";
import { Tables } from "@/supabase/types";

interface GlobalStateProps {
  children: React.ReactNode;
}

const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const router = useRouter();

  // PROFILE STORE
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [pubMedArticles, setPubMedArticles] = useState<PubMedArticle[]>([]);
  const [pubMedWebEnv, setPubMedWebEnv] = useState<string>("");

  const searchPubMed = async (query: string) => {
    const results: PubMedSearchResponse = await performPubMedSearch(query);
    const articles: PubMedArticle[] = results.esearchresult.idlist.map(id => ({ id })); // Assuming `PubMedArticle` has an `id` field
    setPubMedArticles(articles);
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
        // Provide other context values if necessary...
      }}
    >
      {children}
    </ChatbotUIContext.Provider>
  );
};

export default GlobalState;
