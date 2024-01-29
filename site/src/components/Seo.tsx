/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import { Helmet } from 'react-helmet';
import ogImage from '../images/og-image.png';
import logoImage from '../images/capsize-logo.png';

interface Props {
  description?: string;
  lang?: string;
  meta?: any[];
  title?: string;
}

const site = {
  siteMetadata: {
    title: `Capsize`,
    description: `Flipping how we define typography in CSS.`,
    author: `@michaeltaranto`,
  },
};

function SEO({ description = '', lang = 'en', meta = [], title }: Props) {
  const metaDescription = description || site.siteMetadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title || site.siteMetadata.title}
      titleTemplate={title ? `%s | ${site.siteMetadata.title}` : undefined}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: site.siteMetadata.title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: `https://seek-oss.github.io${ogImage}`,
        },
        {
          property: `og:image:width`,
          content: '1200',
        },
        {
          property: `og:image:height`,
          content: '600',
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: `summary_large_image`,
        },
        {
          name: `twitter:image`,
          content: `https://seek-oss.github.io${ogImage}`,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        {
          name: `twitter:title`,
          content: site.siteMetadata.title,
        },
      ].concat(meta)}
      link={[{ rel: 'icon', type: 'image/png', href: logoImage }]}
    />
  );
}

export default SEO;
