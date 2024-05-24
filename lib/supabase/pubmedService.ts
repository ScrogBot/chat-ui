import fetch from "node-fetch"
import { XMLParser } from "fast-xml-parser"

export interface PubMedArticle {
  id: string
  title: string
  abstract: string
}

export interface PubMedSearchResponse {
  esearchresult: {
    count: string
    retmax: string
    retstart: string
    querykey: string
    webenv: string
    idlist: string[]
  }
}

export interface PubMedFetchResponse {
  articles: PubMedArticle[]
}

const fetchArticles = async (
  querykey: string,
  webenv: string
): Promise<PubMedArticle[]> => {
  try {
    const response = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&query_key=${querykey}&WebEnv=${webenv}&retmode=xml`
    )
    const xmlData = await response.text()

    const parser = new XMLParser()
    const data = parser.parse(xmlData)

    // Log the data to understand the structure
    console.log("Fetched data:", data)

    // Map the response to an array of PubMedArticle
    const articles = data.PubmedArticleSet.PubmedArticle.map(
      (article: any) => ({
        id: article.MedlineCitation.PMID,
        title: article.MedlineCitation.Article.ArticleTitle,
        abstract:
          article.MedlineCitation.Article.Abstract?.AbstractText ||
          "No abstract available"
      })
    )

    return articles
  } catch (error) {
    console.error("Error fetching articles:", error)
    throw error
  }
}

export const performPubMedSearch = async (
  query: string
): Promise<PubMedSearchResponse> => {
  try {
    const response = await fetch(
      `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${query}&usehistory=y&retmode=json&retmax=20&rettype=abstract`
    )
    const data = (await response.json()) as PubMedSearchResponse
    return data
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in performPubMedSearch: ${error.message}`)
      throw new Error(`Failed to perform PubMed search: ${error.message}`)
    } else {
      console.error(`Error in performPubMedSearch: ${String(error)}`)
      throw new Error(`Failed to perform PubMed search: ${String(error)}`)
    }
  }
}

export const performPubMedFetch = async (
  querykey: string,
  webenv: string
): Promise<PubMedFetchResponse> => {
  try {
    const articles = await fetchArticles(querykey, webenv)
    console.log(`performPubMedFetch articles: ${JSON.stringify(articles)}`)
    return { articles }
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error in performPubMedFetch: ${error.message}`)
      throw new Error(`Failed to fetch articles: ${error.message}`)
    } else {
      console.error(`Error in performPubMedFetch: ${String(error)}`)
      throw new Error(`Failed to fetch articles: ${String(error)}`)
    }
  }
}
