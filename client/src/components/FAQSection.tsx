import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "How long do Nail'd wraps last?",
    answer: "Our nail wraps are engineered to last up to 18 days with proper application and care. Most customers report 14-18 days of wear before needing replacement. The longevity depends on your daily activities and how well you follow our application guide."
  },
  {
    question: "How do I apply the nail wraps?",
    answer: "Application is simple! Clean and dry your nails, select the correct size for each nail, peel and stick, then trim and file the edges. The entire process takes about 5-10 minutes. We include detailed instructions and a mini file in every kit. Check our Design Studio for video tutorials."
  },
  {
    question: "Are the wraps safe for natural nails?",
    answer: "Yes! Our wraps are made from non-toxic, breathable materials that won't damage your natural nails. They're designed to be gentle and can be removed anytime without causing harm. We recommend taking a break between applications to let your nails breathe."
  },
  {
    question: "Can I customize designs?",
    answer: "Absolutely! Our Design Studio lets you create custom nail wraps. Upload images, choose colors, and design your own patterns. Custom orders typically ship within 5-7 business days. Subscription members get one free custom design per month."
  },
  {
    question: "What's your return policy?",
    answer: "We offer a 30-day money-back guarantee on all purchases. If you're not satisfied for any reason, simply contact us for a full refund. Subscription cancellations can be done anytime with no penalties."
  },
  {
    question: "How do subscriptions work?",
    answer: "Subscribe to receive curated nail wrap collections monthly. Choose from 4 tiers (Starter, Trendsetter, VIP, Elite) with different quantities and perks. You can pause or cancel anytime. Subscribers get exclusive early access to new designs and special discounts."
  },
  {
    question: "Do you ship internationally?",
    answer: "We currently ship to the US, Canada, and select countries in Europe. International orders typically arrive within 10-14 business days. Shipping costs vary by location. Check our shipping page for current rates and delivery estimates."
  },
  {
    question: "How do I remove the wraps?",
    answer: "Gently peel from the edge of your nail, starting at the corner. If they're stubborn, soak your nails in warm water for 2-3 minutes first to soften the adhesive. Never force removal as this can damage your nails. The wraps should come off cleanly with minimal effort."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gradient-to-b from-background to-slate-900/30">
      <div className="container max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Frequently Asked Questions</h2>
          <p className="text-lg text-slate-300">Everything you need to know about Nail'd</p>
        </div>

        <div className="space-y-3">
          {faqItems.map((item, idx) => (
            <div
              key={idx}
              className="border border-rose-500/20 rounded-lg overflow-hidden hover:border-rose-500/50 transition-all duration-300"
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full px-6 py-4 flex items-center justify-between bg-slate-800/30 hover:bg-slate-800/50 transition-colors text-left"
              >
                <span className="font-semibold text-white pr-4">{item.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-rose-400 flex-shrink-0 transition-transform duration-300 ${
                    openIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openIndex === idx && (
                <div className="px-6 py-4 bg-slate-900/50 border-t border-rose-500/10">
                  <p className="text-slate-300 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 p-8 bg-gradient-to-r from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-lg text-center">
          <h3 className="text-xl font-semibold text-white mb-2">Still have questions?</h3>
          <p className="text-slate-300 mb-4">
            Our customer support team is here to help! Reach out anytime.
          </p>
          <a
            href="mailto:support@nailed.com"
            className="inline-block px-6 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
