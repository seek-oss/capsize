import React from 'react';
import { Helmet } from 'react-helmet-async';

import ogImage from '../images/og-image.png';
import logoImage from '../images/capsize-logo.png';

interface Props {
  description?: string;
  lang?: string;
  meta?: any[];
  title?: string;
}

const site = {
  metadata: {
    title: `Capsize`,
    description: `Flipping how we define typography in CSS.`,
    author: `@michaeltaranto`,
  },
};

// Perhaps? https://vike.dev/head
function SEO({ description = '', lang = 'en', meta = [], title }: Props) {
  const metaDescription = description || site.metadata.description;

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title || site.metadata.title}
      titleTemplate={title ? `%s | ${site.metadata.title}` : undefined}
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: site.metadata.title,
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
          content: site.metadata.title,
        },
      ].concat(meta)}
      link={[{ rel: 'icon', href: logoImage, type: 'image/png' }]}
    />
  );
}

export default SEO;
