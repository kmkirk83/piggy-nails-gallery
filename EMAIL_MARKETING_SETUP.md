# Email Marketing Setup Guide for Nail'd

## Overview

Email marketing is your most valuable customer acquisition and retention channel. This guide covers platform setup, list building, automation, and campaign strategy.

---

## Email Marketing Platform Comparison

### Mailchimp (Recommended for Beginners)
- **Cost:** Free up to 500 contacts, $20/mo for 1,000 contacts
- **Pros:** Easy to use, free tier, good automation, templates
- **Cons:** Limited advanced features, limited integrations
- **Best for:** Getting started, building initial list

### Klaviyo (Recommended for E-Commerce)
- **Cost:** Free up to 500 contacts, $20/mo for 1,000 contacts
- **Pros:** Built for e-commerce, excellent automation, SMS included
- **Cons:** Steeper learning curve, higher cost at scale
- **Best for:** Subscription businesses, advanced automation

### ConvertKit (Best for Content Creators)
- **Cost:** Free up to 1,000 subscribers, $25/mo for 1,000 subscribers
- **Pros:** Creator-focused, great templates, excellent support
- **Cons:** Higher cost, fewer e-commerce features
- **Best for:** Building personal brand, content creators

### Recommendation
**Start with Mailchimp** (free tier) for initial list building, then migrate to **Klaviyo** when you reach 500 subscribers for better e-commerce automation.

---

## Step 1: Choose & Set Up Platform

### Mailchimp Setup

1. **Go to** https://mailchimp.com
2. **Sign up** with:
   - Email: xxearthx@gmail.com
   - Password: [Strong password]
3. **Create audience** (mailing list):
   - Audience name: "Nail'd Subscribers"
   - Default from email: noreply@nailed.app
   - Default from name: Nail'd
   - Reply-to email: support@nailed.app
4. **Verify email** (Mailchimp sends confirmation)

### Klaviyo Setup (Later)

1. **Go to** https://www.klaviyo.com
2. **Sign up** with business info
3. **Connect Stripe** (automatic order sync)
4. **Create flows** for automation

---

## Step 2: Build Email List

### Homepage Signup Form

**Add to your website homepage:**

```html
<!-- Email signup form -->
<div class="email-signup">
  <h3>Get 10% Off Your First Order</h3>
  <p>Join our community for exclusive designs and special offers</p>
  
  <form id="email-form">
    <input 
      type="email" 
      placeholder="Enter your email" 
      required
    />
    <button type="submit">Get Discount</button>
  </form>
  
  <p class="privacy">We respect your privacy. Unsubscribe anytime.</p>
</div>
```

**Incentive:**
- 10% discount on first purchase
- Exclusive design preview
- Free shipping coupon

### Signup Incentive Strategy

**Option 1: Discount Code**
- Generate unique code: WELCOME10
- 10% off first purchase
- Expires in 7 days
- Tracks conversions

**Option 2: Free Design**
- Email free nail design PDF
- Link to website
- Builds trust

**Option 3: Early Access**
- Early access to new designs
- VIP subscriber benefits
- Exclusive content

**Recommendation:** Use discount code (10% off) - highest conversion rate

### Placement Strategy

**Homepage:**
- Hero section (above fold)
- Mid-page (after product showcase)
- Exit intent popup

**Product Pages:**
- Sidebar form
- Post-purchase recommendation

**Blog Posts:**
- Mid-article form
- End of article form

**Checkout:**
- Checkbox to subscribe
- Post-purchase offer

---

## Step 3: Create Welcome Email Sequence

### Email 1: Welcome + Discount Code

**Send:** Immediately after signup

**Subject Line:** "Welcome to Nail'd! Here's 10% off 💅"

**Content:**
```
Hi [First Name],

Welcome to Nail'd! 🎉

We're thrilled you're here. You're about to discover the most 
beautiful, trending nail designs—handpicked from TikTok and Instagram.

Here's your exclusive welcome gift:

🎁 Use code WELCOME10 for 10% off your first order
Expires in 7 days

[Button: Shop Now]

What You'll Love About Nail'd:
✨ 46+ trending nail designs
✨ Subscription boxes starting at $34.99/month
✨ Custom design studio
✨ Free shipping on all orders

Questions? Reply to this email—we love hearing from you!

Cheers,
The Nail'd Team
```

### Email 2: Introduce Subscription Boxes

**Send:** 2 days after welcome

**Subject Line:** "The easiest way to get fresh nails every month"

**Content:**
```
Hi [First Name],

Tired of the same old nails? 

Our subscription boxes deliver trending nail designs right to your 
door every month. No commitment, cancel anytime.

Choose your tier:

💅 Starter - $34.99/month
   3 nail wrap kits + mini files

💅 Trendsetter - $99/month
   3 nail wrap kits + exclusive access

💅 VIP - $180/6 months
   4 nail wrap kits + priority support

💅 Elite - $360/year
   4 nail wrap kits + free aftercare kit

[Button: See All Tiers]

Still have questions? Check out our FAQ or reply to this email.

Cheers,
The Nail'd Team
```

### Email 3: Showcase Design Studio

**Send:** 4 days after welcome

**Subject Line:** "Create your own custom nail designs (it's free!)"

**Content:**
```
Hi [First Name],

Want to design your own nails?

Our custom design studio lets you create unique nail art—no 
design experience needed. Use our AI-powered tools or upload 
your own designs.

Try it free:
- Free tier: Basic designs
- Premium: Advanced tools ($9.99/month)
- Lifetime: Unlimited designs ($99 one-time)

[Button: Open Design Studio]

Your custom designs can be:
✨ Printed on nail wraps
✨ Added to your subscription box
✨ Shared in our community gallery
✨ Sold to other customers (coming soon!)

Ready to create? Let's go!

Cheers,
The Nail'd Team
```

### Email 4: Social Proof + Reviews

**Send:** 6 days after welcome

**Subject Line:** "See what our customers are creating 💅"

**Content:**
```
Hi [First Name],

Don't just take our word for it—see what our customers are creating:

[Customer testimonial 1]
"I've never seen nail designs this beautiful. The quality is amazing!"
- Sarah M.

[Customer testimonial 2]
"The subscription box is worth every penny. I get excited every month!"
- Jessica T.

[Customer testimonial 3]
"The design studio is so easy to use. I created my first design in 5 minutes!"
- Maria L.

Join 1,000+ happy customers:

[Button: Shop Now]

Questions? We're here to help. Reply to this email anytime.

Cheers,
The Nail'd Team
```

### Email 5: Last Chance + Bonus Offer

**Send:** 7 days after welcome (before discount expires)

**Subject Line:** "Your discount expires tomorrow! 🚨"

**Content:**
```
Hi [First Name],

Quick reminder: Your 10% discount code (WELCOME10) expires 
tomorrow at midnight.

Don't miss out!

[Button: Use My Discount]

Bonus: If you subscribe to a monthly box today, we'll throw in 
a free aftercare kit (value $14.99).

This offer expires tomorrow too.

[Button: Subscribe Now]

See you soon!

Cheers,
The Nail'd Team
```

---

## Step 4: Set Up Automation Workflows

### Workflow 1: Post-Purchase Follow-Up

**Trigger:** Customer completes purchase

**Email 1 (Day 0):** Order confirmation
- Order details
- Tracking info
- Thank you message

**Email 2 (Day 3):** Shipping notification
- Package shipped
- Tracking link
- Estimated delivery

**Email 3 (Day 7):** Delivery confirmation
- Package delivered
- Request for review
- Aftercare tips

**Email 4 (Day 14):** Review request
- "How do you like your nails?"
- Link to leave review
- Exclusive discount for review

### Workflow 2: Subscription Renewal Reminder

**Trigger:** 3 days before subscription renewal

**Email 1 (Day -3):** Renewal reminder
- "Your subscription renews in 3 days"
- Amount to be charged
- Manage subscription link

**Email 2 (Day 0):** Renewal confirmation
- "Your subscription has renewed!"
- What's included
- Thank you message

**Email 3 (Day 7):** Upsell email
- "Upgrade your subscription"
- Show higher tiers
- Special upgrade discount

### Workflow 3: Abandoned Cart

**Trigger:** Customer adds item to cart but doesn't checkout

**Email 1 (1 hour later):** "You left something behind"
- Show abandoned items
- Remind of discount code
- Urgency ("Only 2 left in stock")

**Email 2 (24 hours later):** "Still thinking about it?"
- Customer testimonials
- Benefits of product
- Free shipping offer

**Email 3 (48 hours later):** "Last chance!"
- "This design is going fast"
- Limited time offer
- Direct checkout link

### Workflow 4: Subscription Cancellation

**Trigger:** Customer cancels subscription

**Email 1 (Day 0):** Cancellation confirmation
- Confirm cancellation
- Final billing date
- Reactivation instructions

**Email 2 (Day 7):** "We miss you"
- Ask for feedback
- Offer to pause instead of cancel
- Special win-back offer (20% off)

**Email 3 (Day 30):** Win-back offer
- "Come back for 20% off"
- Highlight new designs
- Limited time offer

### Workflow 5: Inactive Customer

**Trigger:** No purchase in 60 days

**Email 1 (Day 60):** "We haven't seen you in a while"
- "Check out what's new"
- Highlight new designs
- 15% discount code

**Email 2 (Day 75):** "Here's what you're missing"
- New designs since last purchase
- Customer testimonials
- Exclusive offer

**Email 3 (Day 90):** Final re-engagement
- "One last thing..."
- 25% off code
- "This offer expires tomorrow"

---

## Step 5: Create Regular Campaign Templates

### Weekly Newsletter

**Send:** Every Friday at 9 AM

**Content:**
- Featured design of the week
- Customer spotlight
- Nail care tip
- Special offer (10% off for subscribers)
- Link to blog/resources

**Subject Line Ideas:**
- "Your Friday nail inspo 💅"
- "This week's trending design"
- "What's new at Nail'd"

### Monthly Promotion

**Send:** First day of month

**Content:**
- Monthly theme (e.g., "Spring Nails")
- New designs released this month
- Best sellers
- Special monthly offer (free shipping, buy 2 get 1, etc.)

**Subject Line Ideas:**
- "March Madness Nails - 20% Off"
- "Spring Collection Drops Today"
- "Your April nail inspo is here"

### Product Launch

**Send:** When new product/design launches

**Content:**
- Announcement of new product
- Why it's special
- Exclusive pre-order offer
- Limited time (24-48 hours)

**Subject Line Ideas:**
- "NEW: [Design Name] - Exclusive Pre-Order"
- "You asked, we delivered!"
- "Limited edition drops today"

### Seasonal Campaign

**Send:** Before holidays/seasons

**Content:**
- Seasonal nail designs
- Gift guides (for gifting subscriptions)
- Holiday special offers
- Limited edition collections

**Subject Line Ideas:**
- "Holiday Nails 🎄 - 25% Off"
- "Give the gift of beautiful nails"
- "Valentine's Day Nail Inspo"

---

## Step 6: Email Design Best Practices

### Template Structure

```
Header (Logo + Navigation)
├─ Hero Image (Design showcase)
├─ Main Content (Email body)
├─ Call-to-Action Button
├─ Secondary Content (Additional info)
├─ Social Links
└─ Footer (Unsubscribe, address, etc.)
```

### Design Tips

**Colors:**
- Use brand colors (soft pink, charcoal, gold)
- Keep text readable (dark text on light background)
- Use color for CTAs (gold buttons)

**Typography:**
- Playfair Display for headlines
- Inter for body text
- Keep font sizes readable (14-16px body)

**Images:**
- Use high-quality nail design photos
- Include alt text for accessibility
- Optimize for mobile (images should be responsive)

**Call-to-Action:**
- Use action words ("Shop Now", "Get Discount", "Learn More")
- Make buttons large and clickable
- Use contrasting colors
- Include 1-2 CTAs per email

### Mobile Optimization

- Single column layout
- Large buttons (44x44px minimum)
- Short paragraphs
- Readable font sizes
- Test on mobile devices

---

## Step 7: Segmentation Strategy

### Segment by Behavior

**Subscribers (No Purchase):**
- Send product education
- Highlight bestsellers
- Offer incentives to convert

**One-Time Buyers:**
- Encourage subscription
- Recommend complementary products
- Build loyalty

**Subscription Customers:**
- Renewal reminders
- Exclusive content
- Upgrade opportunities

**Inactive Customers:**
- Win-back campaigns
- Special offers
- Ask for feedback

### Segment by Interest

**Design Preferences:**
- Geometric designs
- Floral designs
- Minimalist designs
- Glitter designs

**Product Interest:**
- Subscriptions
- One-time purchases
- Aftercare kits
- Design studio

### Segment by Engagement

**Highly Engaged:**
- Open rates > 50%
- Click rates > 10%
- Send exclusive content
- Ask for referrals

**Low Engaged:**
- Open rates < 20%
- No clicks
- Send re-engagement campaigns
- Consider removing

---

## Step 8: Analytics & Optimization

### Key Metrics to Track

| Metric | Target | Action |
|--------|--------|--------|
| Open Rate | > 25% | Improve subject lines |
| Click Rate | > 5% | Improve CTAs |
| Conversion Rate | > 2% | Optimize landing pages |
| Unsubscribe Rate | < 0.5% | Reduce email frequency |
| Bounce Rate | < 2% | Clean email list |

### A/B Testing

**Test subject lines:**
- "10% off your first order" vs "Your welcome gift"
- Emoji vs no emoji
- Personalization vs generic

**Test send times:**
- Tuesday 9 AM vs Thursday 1 PM
- Morning vs evening
- Test for your audience

**Test content:**
- Short vs long emails
- Images vs text
- Multiple CTAs vs single CTA

### Monthly Review

1. Analyze open rates by email type
2. Identify best-performing subject lines
3. Review click-through rates
4. Check conversion rates
5. Adjust strategy based on data

---

## Step 9: Compliance & Best Practices

### CAN-SPAM Compliance

- ✅ Include company address in footer
- ✅ Include unsubscribe link
- ✅ Honor unsubscribe requests within 10 days
- ✅ Use accurate subject lines
- ✅ Identify as advertisement if applicable

### GDPR Compliance

- ✅ Get explicit consent before sending
- ✅ Include unsubscribe link
- ✅ Honor unsubscribe requests immediately
- ✅ Store consent records
- ✅ Allow data deletion requests

### Best Practices

- **Frequency:** 1-2 emails per week (not daily)
- **Personalization:** Use first name, segment by behavior
- **Mobile:** 50%+ of opens are on mobile
- **Testing:** A/B test subject lines and send times
- **List cleaning:** Remove inactive subscribers monthly
- **Deliverability:** Monitor bounce rates and complaints

---

## Implementation Timeline

### Week 1
- [ ] Choose email platform (Mailchimp)
- [ ] Set up account and audience
- [ ] Create signup form for website
- [ ] Add incentive (10% discount code)
- [ ] Design welcome email template

### Week 2
- [ ] Create 5-email welcome sequence
- [ ] Set up automation workflows
- [ ] Design newsletter template
- [ ] Create first newsletter
- [ ] Launch signup form

### Week 3+
- [ ] Send regular newsletters (weekly)
- [ ] Monitor analytics
- [ ] A/B test subject lines
- [ ] Segment audience
- [ ] Create seasonal campaigns

---

## Expected Results

### Month 1
- Email list: 100-200 subscribers
- Open rate: 20-30%
- Click rate: 3-5%
- Conversion rate: 1-2%

### Month 3
- Email list: 500-1,000 subscribers
- Open rate: 25-35%
- Click rate: 5-8%
- Conversion rate: 2-3%

### Month 6
- Email list: 1,000-2,000 subscribers
- Open rate: 30-40%
- Click rate: 8-12%
- Conversion rate: 3-5%

---

## Tools & Resources

- [Mailchimp](https://mailchimp.com)
- [Klaviyo](https://www.klaviyo.com)
- [ConvertKit](https://convertkit.com)
- [Email Marketing Best Practices](https://mailchimp.com/resources/)
- [Email Design Inspiration](https://www.reallygoodemails.com)
- [Stripo Email Builder](https://stripo.email)

---

## Next Steps

1. Sign up for Mailchimp today
2. Create your first audience
3. Add signup form to website
4. Create welcome email sequence
5. Set up automation workflows
6. Start building your email list!
