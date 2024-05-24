import { NextApiRequest, NextApiResponse } from "next"
import {
  performPubMedSearch,
  performPubMedFetch
} from "../../lib/pubmedService"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { functionName, parameters } = req.body

    if (functionName === "handleUserQuery") {
      const query: string = parameters.userInput

      try {
        const searchResults = await performPubMedSearch(query)
        const articleIds = searchResults.esearchresult.idlist

        if (articleIds.length > 0) {
          const fetchResults = await performPubMedFetch(articleIds)
          res.status(200).json(fetchResults)
        } else {
          res.status(404).json({ message: "No articles found for the query." })
        }
      } catch (error) {
        res
          .status(500)
          .json({
            message: error instanceof Error ? error.message : String(error)
          })
      }
    } else {
      res.status(400).json({ message: "Invalid functionName" })
    }
  } else {
    res.setHeader("Allow", ["POST"])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
