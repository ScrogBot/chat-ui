import {
  performPubMedSearch,
  performPubMedFetch
} from "@/lib/supabase/pubmedService"

export const handleUserQuery = async (userInput: string) => {
  try {
    // Perform the PubMed search
    const searchResults = await performPubMedSearch(userInput)
    console.log("Search Results:", searchResults)

    const { querykey, webenv } = searchResults.esearchresult
    if (querykey && webenv) {
      // Fetch the articles using the query key and web environment
      const fetchResults = await performPubMedFetch(querykey, webenv)
      console.log("Fetch Results:", fetchResults)
      return fetchResults
    } else {
      console.log("No query key or web environment found for the query.")
      return { error: "No query key or web environment found for the query." }
    }
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : String(error)
    )
    return { error: error instanceof Error ? error.message : String(error) }
  }
}
