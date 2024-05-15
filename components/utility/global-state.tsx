"use client";

import { FC, useEffect, useState } from "react";
import { ChatbotUIContext, Profile } from "@/context/context"; // Update import
import { performPubMedSearch, PubMedSearchResponse } from "../../pubmedService";
import { useRouter } from "next/navigation"; // Correct import for Next.js 13
import { Tables } from "@/supabase/types"; // Import the correct type

interface GlobalStateProps {
  children: React.ReactNode;
}

const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const router = useRouter();

  // PROFILE STORE
  const [profile, setProfile] = useState<Tables<"profiles"> | null>(null);
  const [pubMedArticles, setPubMedArticles] = useState<string[]>([]);
  const [pubMedWebEnv, setPubMedWebEnv] = useState<string>("");

  const searchPubMed = async (query: string) => {
    const results: PubMedSearchResponse = await performPubMedSearch(query);
    setPubMedArticles(results.esearchresult.idlist.map(id => ({ id }))); // Assuming `PubMedArticle` has an `id` field
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
