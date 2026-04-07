export default function SchemaMarkup() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": "https://splitit.com.au/#business",
        name: "Split It Gold Coast",
        description: "Hydraulic log splitter hire on the Gold Coast, QLD. Book online.",
        url: "https://splitit.com.au",
        telephone: "+61400000000",
        email: "hello@splitit.com.au",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Mudgeeraba",
          addressRegion: "QLD",
          postalCode: "4213",
          addressCountry: "AU",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -28.0875,
          longitude: 153.3636,
        },
        openingHours: "Mo-Su 00:00-23:59",
        priceRange: "$$",
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: -28.0875,
            longitude: 153.3636,
          },
          geoRadius: "30000",
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Log Splitter Hire",
          itemListElement: [
            {
              "@type": "Offer",
              name: "Daily Log Splitter Hire",
              price: "150.00",
              priceCurrency: "AUD",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Weekend Log Splitter Hire (Fri–Sun)",
              price: "350.00",
              priceCurrency: "AUD",
              availability: "https://schema.org/InStock",
            },
            {
              "@type": "Offer",
              name: "Weekly Log Splitter Hire (7 days)",
              price: "600.00",
              priceCurrency: "AUD",
              availability: "https://schema.org/InStock",
            },
          ],
        },
      },
      {
        "@type": "Product",
        name: "30-Tonne Hydraulic Log Splitter",
        description:
          "30-tonne petrol-powered hydraulic log splitter for hire. Handles hardwood and softwood logs up to 550mm length and 600mm diameter.",
        brand: {
          "@type": "Brand",
          name: "Split It Gold Coast",
        },
        offers: {
          "@type": "AggregateOffer",
          lowPrice: "150",
          highPrice: "600",
          priceCurrency: "AUD",
          availability: "https://schema.org/InStock",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
