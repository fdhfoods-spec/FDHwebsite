export function StructuredData() {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'FDH - Fresh Delivery Hub',
    url: 'https://freshdeliveryhub.com',
    logo: 'https://freshdeliveryhub.com/fdh-logo.png',
    description: 'Premium meat delivery service with fresh, quality cuts delivered within 24 hours',
    sameAs: [
      'https://facebook.com/freshdeliveryhub',
      'https://instagram.com/freshdeliveryhub',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0123',
      contactType: 'Customer Service',
    },
  }

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'FDH - Fresh Delivery Hub',
    image: 'https://freshdeliveryhub.com/fdh-hero.png',
    description: 'Premium meat delivery service',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Premium Butcher Lane',
      addressLocality: 'Metropolitan Area',
      postalCode: '12345',
      addressCountry: 'US',
    },
    telephone: '+1-555-0123',
    priceRange: '$$',
    ratingValue: '4.9',
    ratingCount: '2400',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
    </>
  )
}
