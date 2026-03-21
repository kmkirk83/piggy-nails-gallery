# Piggy Nails Gallery - Project TODO

## Project Overview
A print-on-demand dropshipping subscription shop featuring nail art designs from Piggy Nails and similar sources. Customers can subscribe to monthly boxes of nail wraps with rotating designs.

---

## Phase 1: Design & Setup
- [x] Project initialized with database and authentication
- [x] Design approach selected (Luxe Minimalist with Playful Accents)
- [x] Update design tokens in client/src/index.css (colors, typography, spacing)
- [x] Add Google Fonts for Playfair Display and Inter
- [x] Create design system documentation

---

## Phase 2: Database Schema & Backend
- [x] Create database tables for products, subscriptions, orders, users
- [x] Design subscription tier system (1-month, 3-month, 6-month, 12-month)
- [x] Create tRPC procedures for subscription management
- [ ] Create tRPC procedures for product gallery queries
- [x] Implement subscription billing logic
- [ ] Write vitest tests for subscription procedures

---

## Phase 3: Product Gallery & Assets
- [x] Gather nail art images from Piggy Nails Instagram and similar sources
- [x] Upload images to CDN using manus-upload-file --webdev
- [x] Create product data structure with images and metadata
- [ ] Seed database with initial nail art designs
- [x] Create product gallery component with filtering

---

## Phase 4: Frontend - Core Pages
- [x] Build landing/home page with hero section and subscription overview
- [x] Create product gallery page with masonry layout
- [x] Build subscription tier comparison page
- [x] Create checkout page with order summary
- [x] Implement category/filter system for nail art designs

---

## Phase 5: Authentication & User Account
- [ ] Implement OAuth login/logout flow (partially done via template)
- [ ] Create user account/dashboard page
- [ ] Build subscription management interface
- [ ] Create order history page
- [ ] Implement shipping address management

---

## Phase 6: Payment Integration
- [x] Add Stripe integration via webdev_add_feature
- [x] Create checkout flow for subscription purchases
- [x] Implement payment processing procedures
- [ ] Create order confirmation page
- [ ] Set up subscription renewal logic
- [ ] Create Stripe webhook handler for payment events

---

## Phase 7: Additional Features
- [ ] Implement gift subscription functionality
- [ ] Create FAQ/Help section
- [ ] Build contact/support form
- [ ] Add email notification system
- [ ] Create admin dashboard for managing products

---

## Phase 8: Testing & Deployment
- [ ] Write comprehensive vitest tests for all procedures
- [ ] Test subscription renewal flow
- [ ] Test payment processing
- [ ] Responsive design testing across devices
- [ ] Create checkpoint before publishing
- [ ] Deploy to production

---

## Design System Details
**Color Palette:**
- Primary: Soft rose pink (oklch(0.8 0.08 10))
- Secondary: Deep charcoal (oklch(0.15 0.01 0))
- Accent: Warm gold (oklch(0.65 0.15 70))
- Neutrals: Cream (oklch(0.98 0.001 0)), Off-white

**Typography:**
- Display: Playfair Display 700
- Body: Inter 400-500
- Accent: Playfair Display 500

**Layout:**
- Asymmetric masonry gallery
- Sticky top navigation
- Generous whitespace
- Soft shadows and hover effects

---

## Completed Features Summary
✅ Homepage with hero, subscription tiers, and featured designs
✅ Gallery page with 12+ nail art products and category filtering
✅ Subscribe page with tier comparison and FAQ
✅ Checkout page with order summary
✅ Stripe integration for payment processing
✅ Database schema for subscriptions and orders
✅ tRPC procedures for checkout and subscription management
✅ Responsive design with Luxe Minimalist aesthetic
