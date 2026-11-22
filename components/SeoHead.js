import Head from "next/head"
import { createContext, useContext } from "react"
import { DEFAULT_TITLE_SUFFIX, SITE_NAME } from "../lib/site"

// The Site Settings document from Prismic, provided by _app
export const SiteSettingsContext = createContext(null)

const text = (field) => field?.[0]?.text?.trim()

// Title, meta description and social tags from a Prismic document's SEO tab.
// Every title ends with the Site Title Suffix from Site Settings; a blank meta
// title uses the page's own name instead. Blank descriptions and social fields
// are left out rather than generated.
export const SeoHead = ({ data, pageName }) => {
  const settings = useContext(SiteSettingsContext)
  const suffix = settings?.site_title_suffix?.trim() || DEFAULT_TITLE_SUFFIX
  const name = text(data?.meta_title) || pageName?.trim()
  const title = name ? `${name} ${suffix}` : SITE_NAME
  const description = text(data?.meta_description)
  const socialTitle = text(data?.social_meta_title)
  const socialDescription = text(data?.social_meta_description)
  const socialImage = data?.social_meta_image?.url

  return (
    <Head>
      <title>{title}</title>
      {description && (
        <meta name="description" content={description} key="desc" />
      )}
      {socialTitle && (
        <meta property="og:title" content={socialTitle} key="og:title" />
      )}
      {socialDescription && (
        <meta
          property="og:description"
          content={socialDescription}
          key="og:description"
        />
      )}
      {socialImage && (
        <meta property="og:image" content={socialImage} key="og:image" />
      )}
    </Head>
  )
}
