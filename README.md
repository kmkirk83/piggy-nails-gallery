# Piggy Nails Gallery

A full-stack luxury nail art e-commerce platform with gallery showcase, subscription service, studio booking, and mobile app support via Capacitor/Expo.

## Features

- **Luxury Gallery** — Curated nail art showcase with high-quality imagery
- **E-Commerce Shop** — Full product catalog with detail pages, cart, and checkout
- **Subscription Service** — Recurring nail box subscriptions with management dashboard
- **Studio Booking** — Appointment scheduling for in-person nail services
- **Admin Dashboard** — Product management, orders, analytics, and financial dashboard
- **Mobile App** — Android/iOS via Capacitor with Expo deployment support
- **Stripe Payments** — Full payment integration with live keys and webhook handling
- **CJ Dropshipping** — Integrated fulfillment via CJ Dropshipping with curated product catalog
- **Email Marketing** — SendGrid-powered transactional and marketing emails
- **Notifications** — In-app notification center with user preference management
- **Analytics** — Built-in analytics tracking and reporting
- **SEO & Social** — Social media integration and marketing campaign tools

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite, Radix UI, Tailwind CSS |
| Backend | Node.js, Express (TSX), TypeScript |
| Database | PostgreSQL via Drizzle ORM |
| Payments | Stripe (live integration) |
| Mobile | Capacitor, Expo (Android + iOS) |
| Email | SendGrid |
| Fulfillment | CJ Dropshipping |
| Storage | AWS S3 |
| Testing | Vitest |
| Package Manager | pnpm |

## Pages

| Page | Description |
|------|-------------|
| Home / LuxuryHome | Landing page with featured products and gallery |
| Gallery | Nail art showcase and inspiration |
| Shop | Product catalog with filtering |
| Product Detail | Individual product pages |
| Checkout | Cart and payment flow |
| Subscribe | Subscription box signup |
| Subscriptions | Subscription management |
| Studio | Booking and services |
| Account | User profile and order history |
| Admin | Product, order, and analytics management |
| Financial Dashboard | Revenue and business metrics |
| FAQ | Frequently asked questions |
| Notification Center | In-app notifications |

## Project Structure

```
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/          # All page components
│   │   └── components/     # Reusable UI components
├── server/                 # Express backend
│   ├── routers/            # API routes
│   └── db.ts               # Database connection
├── drizzle/                # Database schema and migrations
├── android/                # Capacitor Android project
├── scripts/                # Build and automation scripts
└── docs (*.md)             # Extensive documentation
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Configure environment
cp .env.example .env
# Set: DATABASE_URL, STRIPE_SECRET_KEY, SENDGRID_API_KEY, AWS credentials, CJ API keys

# Run database migrations
pnpm db:push

# Start development server
pnpm dev

# Build for production
pnpm build && pnpm start
```

## Mobile Development

See the detailed guides:
- [Expo Quick Start](./EXPO_QUICK_START.md)
- [Expo Setup Guide](./EXPO_SETUP_GUIDE.md)
- [Android Build Guide](./ANDROID_BUILD_GUIDE.md)
- [Google Play Setup](./GOOGLE_PLAY_SETUP.md)
- [EAS Build Setup](./EAS_BUILD_SETUP.md)

## Documentation

| Guide | Description |
|-------|-------------|
| [Quick Start](./QUICK_START.md) | Get up and running fast |
| [Launch Roadmap](./LAUNCH_ROADMAP.md) | Full launch plan |
| [Stripe Live Setup](./STRIPE_LIVE_KEYS_SETUP.md) | Payment configuration |
| [CJ Dropshipping](./CJ_DROPSHIPPING_INTEGRATION_GUIDE.md) | Fulfillment setup |
| [Email Marketing](./EMAIL_MARKETING_SETUP.md) | SendGrid configuration |
| [Analytics Setup](./ANALYTICS_SETUP.md) | Tracking and reporting |
| [Marketing Campaign](./MARKETING_CAMPAIGN.md) | Growth strategy |
| [Privacy Policy](./PRIVACY_POLICY.md) | User data policy |
| [Terms of Service](./TERMS_OF_SERVICE.md) | Legal terms |

## License

MIT
