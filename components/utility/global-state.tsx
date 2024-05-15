import { FC, useEffect, useState } from "react";
import { ChatbotUIContext } from "@/context/context";
import { performPubMedSearch, PubMedSearchResponse } from "../../pubmedService";
import { useRouter } from "next/router";

interface GlobalStateProps {
  children: React.ReactNode;
}

export const GlobalState: FC<GlobalStateProps> = ({ children }) => {
  const router = useRouter();

  // Define your state variables here...
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
    // Your initialization code here...
  }, []);

  return (
    <ChatbotUIContext.Provider
      value={{
        profile,
        setProfile,
        // Other context values...
        pubMedArticles,
        setPubMedArticles,
        pubMedWebEnv, // Add this line
        setPubMedWebEnv, // Add this line
        searchPubMed,
      }}
    >
      {children}
    </ChatbotUIContext.Provider>
  );
};

export default GlobalState;
