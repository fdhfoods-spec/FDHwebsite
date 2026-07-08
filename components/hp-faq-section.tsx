'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export function HpFAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: 'How do you ensure the meat is fresh?',
      answer: 'All our meat is processed on the day of delivery and shipped in temperature-controlled packaging with ice packs. We guarantee freshness for 24-48 hours after delivery when stored properly.',
    },
    {
      question: 'What is your refund policy?',
      answer: "We offer a 100% satisfaction guarantee. If you're not completely satisfied with your order, contact us within 24 hours for a full refund or replacement.",
    },
    {
      question: 'Do you offer subscription orders?',
      answer: 'Yes! Set up recurring deliveries weekly, bi-weekly, or monthly. Subscription customers receive a 10% discount on all orders.',
    },
    {
      question: 'Are your products organic?',
      answer: 'We offer both organic and conventional options. All our meat comes from certified suppliers meeting rigorous quality standards. Check product descriptions for organic certifications.',
    },
    {
      question: 'What areas do you deliver to?',
      answer: 'We currently deliver to metropolitan areas and select suburbs. Enter your zipcode at checkout to confirm availability in your area.',
    },
    {
      question: 'Can I schedule a delivery time?',
      answer: 'Yes, you can choose your preferred delivery window (morning, afternoon, or evening) during checkout. We offer next-day and scheduled delivery options.',
    },
  ]

  return (
    <section id="faq" className="py-16 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
          <p className="text-lg text-foreground/80">
            Find answers to common questions about FDH delivery and our products.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-border rounded-lg overflow-hidden hover:border-secondary transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-card hover:bg-muted/50 transition-colors text-left"
              >
                <span className="font-semibold text-primary pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-secondary flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === index && (
                <div className="px-6 py-4 bg-muted/30 border-t border-border text-foreground/80 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 bg-secondary/10 p-8 rounded-lg border border-secondary/30 text-center">
          <h3 className="text-lg font-bold text-primary mb-2">Still have questions?</h3>
          <p className="text-foreground/80 mb-4">
            Our customer service team is here to help you 7 days a week.
          </p>
          <a
            href="/about"
            className="inline-flex items-center justify-center px-6 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors font-medium text-sm"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  )
}
