import ScrollAnimate from "../../../components/ScrollAnimate"
import { useEffect, useState } from "react"
import { createClient } from "../../../prismicio"
import * as prismicH from "@prismicio/helpers"
import { PrismicLink, PrismicRichText } from "@prismicio/react"
import Link from "next/link"
import { Lines } from "../../../components/Lines"
import { BackArrow } from "../../../components/BackArrow"
import { SeoHead } from "../../../components/SeoHead"

export async function getStaticProps({ params, previewData }) {
  const client = createClient({ previewData })

  // getByUIDs returns an empty list for a removed or unknown article (a 404),
  // where getByUID would throw and cause a server error
  const {
    results: [article],
  } = await client.getByUIDs("article", [params.uid])

  if (!article) {
    return { notFound: true }
  }

  const footer = await client.getSingle("footer")
  const navigation = await client.getSingle("navigation")
  const settings = await client
    .getSingle("site_settings")
    .catch(() => null)

  return {
    props: { article, footer, navigation, settings }, // Will be passed to the sectors component as props
  }
}

// Define Paths
export async function getStaticPaths() {
  const client = createClient()

  const pages = await client.getAllByType("article")

  return {
    paths: pages.map((page) => prismicH.asLink(page)),
    fallback: "blocking",
  }
}

export default function Article(props) {
  const { article } = props
  const date = new Date(article?.first_publication_date)
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    if (process.browser) {
      document.body.classList.remove("homepage")
      document.body.classList.remove("dark-mode")
      document.body.classList.remove("projects-page")
      document.body.classList.remove("single-project")
      document.body.classList.remove("sector")
    }
    setLoaded(true)
  }, [])

  return (
    <>
      <SeoHead
        data={article?.data}
        pageName={article?.data?.title?.[0]?.text}
      />
      <Lines loaded={loaded} />
      <div className="container mx-auto mt-20 md:mt-40 article px-4 md:px-0 relative z-10 mb-60">
        <div className="breadcrumb flex col-span-4 relative">
          <BackArrow className="mr-2" />
          <Link href="/insights/articles">Back</Link>
        </div>
        <div className="grid grid-cols-4">
          <div className="col-span-4 md:col-span-2 flex content-end flex-wrap mt-10 md:mt-0">
            <div className="w-full">
              <ScrollAnimate>
                <h1>{article?.data?.title[0]?.text}</h1>
              </ScrollAnimate>
            </div>
            <div className="mt-16 mb-10 md:mb-10">
              <ScrollAnimate>
                <h4>
                  {`${
                    article?.data?.author.length > 0
                      ? `By ${article?.data?.author[0]?.text} | `
                      : ""
                  }`}{" "}
                  {article?.data?.published_date}
                </h4>
              </ScrollAnimate>
            </div>
          </div>
          <div className="col-span-4 md:col-span-2">
            <ScrollAnimate className="article-hero">
              <img
                src={article?.data?.hero_image?.url}
                alt={
                  article?.data?.hero_image?.alt ||
                  article?.data?.hero_image_caption[0]?.text ||
                  article?.data?.title[0]?.text ||
                  ""
                }
              />
              <p className="image-caption">
                {article?.data?.hero_image_caption[0]?.text}
              </p>
            </ScrollAnimate>
          </div>
        </div>
        <div className="grid grid-cols-4 mt-10 md:mt-40">
          <div className="col-start-1 md:col-start-2 col-span-4 md:col-span-2 article-body ml-4 mr-4">
            <PrismicRichText
              field={article?.data?.content}
              components={{
                // Prismic's default image markup, except images without alt
                // text fall back to the article title
                image: ({ node, key }) => {
                  const img = (
                    <img
                      src={node.url}
                      alt={node.alt || article?.data?.title[0]?.text || ""}
                      data-copyright={node.copyright || undefined}
                    />
                  )
                  return (
                    <p className="block-img" key={key}>
                      {node.linkTo ? (
                        <PrismicLink field={node.linkTo}>{img}</PrismicLink>
                      ) : (
                        img
                      )}
                    </p>
                  )
                },
              }}
            />
          </div>
        </div>
      </div>
    </>
  )
}
