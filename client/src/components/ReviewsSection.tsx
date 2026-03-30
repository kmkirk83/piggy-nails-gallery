import { Star } from 'lucide-react';

interface Review {
  name: string;
  rating: number;
  text: string;
  image: string;
}

const reviews: Review[] = [
  {
    name: "Sarah M.",
    rating: 5,
    text: "Absolutely obsessed! The quality is incredible and they last way longer than I expected. Best purchase ever.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah"
  },
  {
    name: "Jessica L.",
    rating: 5,
    text: "The designs are so unique and trendy. I get compliments every single time I wear them. Worth every penny!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica"
  },
  {
    name: "Amanda K.",
    rating: 5,
    text: "Finally found nail art that actually stays on! The application is easy and they look salon-quality. Highly recommend!",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amanda"
  },
  {
    name: "Michelle R.",
    rating: 5,
    text: "The subscription box is amazing value. Every month I'm excited to see what new designs they've curated.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michelle"
  },
  {
    name: "Taylor N.",
    rating: 5,
    text: "Customer service is top-notch and the product quality speaks for itself. This is my go-to for nail art now.",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor"
  }
];

export function ReviewsSection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-slate-900/50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-white">Loved by Nail'd Fans</h2>
          <p className="text-lg text-slate-300">Join thousands of customers who've transformed their nails</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="bg-slate-800/50 backdrop-blur border border-rose-500/20 rounded-lg p-6 hover:border-rose-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-rose-500/10"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-3">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={16} className="fill-rose-400 text-rose-400" />
                ))}
              </div>

              {/* Review text */}
              <p className="text-slate-300 text-sm mb-4 leading-relaxed italic">
                "{review.text}"
              </p>

              {/* Reviewer info */}
              <div className="flex items-center gap-3">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-10 h-10 rounded-full border border-rose-400/30"
                />
                <div>
                  <p className="text-white text-sm font-semibold">{review.name}</p>
                  <p className="text-rose-400/70 text-xs">Verified Customer</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust indicators */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-rose-400 mb-2">4.9★</p>
            <p className="text-slate-400 text-sm">Average Rating</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-rose-400 mb-2">2,847+</p>
            <p className="text-slate-400 text-sm">Happy Customers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-rose-400 mb-2">98%</p>
            <p className="text-slate-400 text-sm">Would Recommend</p>
          </div>
        </div>
      </div>
    </section>
  );
}
