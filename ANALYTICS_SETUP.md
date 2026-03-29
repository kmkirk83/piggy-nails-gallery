# Analytics & Tracking Setup Guide

## Overview

Analytics help you understand customer behavior, measure ROI, and optimize your marketing. This guide covers Google Analytics, Stripe analytics, and custom dashboards.

---

## Google Analytics Setup

### Step 1: Create Google Analytics Account

1. Go to https://analytics.google.com
2. Click "Start measuring"
3. Create account:
   - Account name: "Nail'd"
   - Property name: "Nail'd Website"
4. Select industry: "Beauty & Wellness"
5. Business size: "Small"
6. Get tracking ID (format: G-XXXXXXXXXX)

### Step 2: Add Tracking Code to Website

Add to your website's `<head>` section:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

Replace `G-XXXXXXXXXX` with your tracking ID.

### Step 3: Set Up Conversion Tracking

**Track purchases:**

```javascript
// After successful payment
gtag('event', 'purchase', {
  'transaction_id': 'T_12345',
  'affiliation': 'Nail\'d Shop',
  'value': 99.99,
  'currency': 'USD',
  'tax': 0,
  'shipping': 0,
  'items': [
    {
      'item_id': 'SKU_123',
      'item_name': 'Trendsetter Box',
      'item_category': 'Subscription',
      'price': 99.99,
      'quantity': 1
    }
  ]
});
```

**Track email signups:**

```javascript
gtag('event', 'sign_up', {
  'method': 'email'
});
```

**Track design studio access:**

```javascript
gtag('event', 'view_item', {
  'items': [{
    'item_id': 'design_studio',
    'item_name': 'Design Studio',
    'item_category': 'Tool'
  }]
});
```

### Step 4: Create Dashboards

**Dashboard 1: Overview**
- Sessions (daily)
- Users (daily)
- Bounce rate
- Average session duration
- Top pages

**Dashboard 2: E-Commerce**
- Total revenue
- Transactions
- Average order value
- Conversion rate
- Top products

**Dashboard 3: Traffic Sources**
- Organic search
- Direct traffic
- Social media referrals
- Email referrals
- Paid ads (if applicable)

**Dashboard 4: User Behavior**
- Top pages
- Page flow
- Scroll depth
- Time on page
- Exit pages

---

## Stripe Analytics

### Revenue Dashboard

**Location:** https://dashboard.stripe.com/analytics/revenue

**Key Metrics:**
- Total revenue (all-time)
- Monthly recurring revenue (MRR)
- Revenue by product type
- Revenue by subscription tier
- Revenue growth rate

### Customer Dashboard

**Location:** https://dashboard.stripe.com/analytics/customers

**Key Metrics:**
- Total customers
- New customers (this month)
- Returning customers
- Customer lifetime value
- Churn rate

### Subscription Dashboard

**Location:** https://dashboard.stripe.com/analytics/subscriptions

**Key Metrics:**
- Active subscriptions
- New subscriptions (this month)
- Subscription churn rate
- Subscription revenue
- Upgrade/downgrade rate

### Payment Dashboard

**Location:** https://dashboard.stripe.com/analytics/payments

**Key Metrics:**
- Total transactions
- Success rate
- Failed payments
- Refund rate
- Average transaction value

---

## Custom Dashboard Setup

### Create Metrics Spreadsheet

Use Google Sheets to track key metrics:

```
Date | Sessions | Users | Conversions | Revenue | AOV | Churn Rate
```

**Update daily/weekly:**
- Pull data from Google Analytics
- Pull data from Stripe
- Calculate trends
- Identify patterns

### Key Metrics to Track

| Metric | Formula | Target |
|--------|---------|--------|
| Conversion Rate | Purchases / Sessions | 2-3% |
| Average Order Value | Total Revenue / Orders | $50+ |
| Customer Lifetime Value | Total Revenue / Customers | $300+ |
| Churn Rate | Cancelled / Active Subs | < 5% |
| Email Open Rate | Opens / Sent | > 25% |
| Social Engagement | Likes + Comments / Posts | > 2% |

### Monthly Review Checklist

- [ ] Review website traffic trends
- [ ] Analyze conversion funnel
- [ ] Check email marketing metrics
- [ ] Review social media performance
- [ ] Analyze customer acquisition cost
- [ ] Calculate customer lifetime value
- [ ] Identify top performing products
- [ ] Review customer feedback
- [ ] Plan optimizations for next month

---

## UTM Parameter Strategy

### Track Campaign Performance

Use UTM parameters to track marketing campaigns:

**Format:** `?utm_source=SOURCE&utm_medium=MEDIUM&utm_campaign=CAMPAIGN`

**Examples:**

**Social Media:**
```
https://nailed.app/?utm_source=instagram&utm_medium=social&utm_campaign=launch
https://nailed.app/?utm_source=tiktok&utm_medium=social&utm_campaign=viral_video
https://nailed.app/?utm_source=pinterest&utm_medium=social&utm_campaign=design_pins
```

**Email:**
```
https://nailed.app/?utm_source=email&utm_medium=newsletter&utm_campaign=weekly
https://nailed.app/?utm_source=email&utm_medium=welcome&utm_campaign=welcome_sequence
```

**Paid Ads (if applicable):**
```
https://nailed.app/?utm_source=google&utm_medium=cpc&utm_campaign=search_ads
https://nailed.app/?utm_source=facebook&utm_medium=cpc&utm_campaign=fb_ads
```

### Track in Google Analytics

1. Go to **Acquisition** → **Campaigns**
2. View performance by campaign
3. Compare conversion rates
4. Identify best performing channels

---

## Funnel Analysis

### Define Your Conversion Funnel

**Stage 1: Awareness**
- Website visitors
- Social media impressions
- Email opens

**Stage 2: Interest**
- Product page views
- Design studio visits
- Gallery views

**Stage 3: Consideration**
- Add to cart
- View checkout
- Email signup

**Stage 4: Decision**
- Complete purchase
- Subscribe to box
- Create account

**Stage 5: Retention**
- Repeat purchase
- Subscription renewal
- Social sharing

### Analyze Drop-off Points

1. Identify where users drop off
2. Calculate drop-off rate at each stage
3. Prioritize optimization
4. Test improvements

**Example:**
```
Awareness: 1,000 visitors
↓ (80% drop-off)
Interest: 200 product views
↓ (60% drop-off)
Consideration: 80 add to cart
↓ (50% drop-off)
Decision: 40 purchases
↓ (25% drop-off)
Retention: 30 repeat purchases
```

---

## Cohort Analysis

### Track User Cohorts

**Cohort 1: January Signups**
- Signup date: January 2026
- Track behavior over time
- Measure retention rate
- Calculate lifetime value

**Cohort 2: Social Media Traffic**
- Source: Instagram
- Track conversion rate
- Compare to other sources
- Measure quality

**Cohort 3: Email List**
- Source: Email signup
- Track engagement rate
- Measure purchase rate
- Calculate ROI

### Use in Google Analytics

1. Go to **Audience** → **Cohort Analysis**
2. Select metric (retention, revenue, etc.)
3. Select cohort type (daily, weekly, monthly)
4. Analyze patterns

---

## Customer Acquisition Cost (CAC)

### Calculate CAC

```
CAC = Total Marketing Spend / New Customers Acquired
```

**Example:**
- Marketing spend: $500/month
- New customers: 50
- CAC: $10 per customer

### Track by Channel

| Channel | Spend | Customers | CAC | ROI |
|---------|-------|-----------|-----|-----|
| Email | $0 | 10 | $0 | Infinite |
| Social | $100 | 15 | $6.67 | 15x |
| Paid Ads | $400 | 25 | $16 | 6x |
| **Total** | **$500** | **50** | **$10** | **10x** |

### Optimize CAC

- Focus on low-CAC channels (email, organic social)
- Reduce spend on high-CAC channels
- Test new channels
- Improve conversion rates

---

## Customer Lifetime Value (CLV)

### Calculate CLV

```
CLV = (Average Order Value × Purchase Frequency × Customer Lifespan)
```

**Example:**
- Average order value: $100
- Purchase frequency: 2x per year
- Customer lifespan: 3 years
- CLV: $600

### Improve CLV

- Increase average order value (upsell, cross-sell)
- Increase purchase frequency (email, loyalty program)
- Increase customer lifespan (reduce churn, improve retention)

### CLV to CAC Ratio

```
CLV:CAC Ratio = Customer Lifetime Value / Customer Acquisition Cost
```

**Target:** 3:1 or higher

**Example:**
- CLV: $600
- CAC: $10
- Ratio: 60:1 (excellent!)

---

## Retention Metrics

### Track Retention

**Email List Retention:**
- Unsubscribe rate (target: < 0.5%)
- Engagement rate (target: > 25%)

**Subscription Retention:**
- Churn rate (target: < 5%)
- Retention rate (target: > 95%)

**Customer Retention:**
- Repeat purchase rate (target: > 30%)
- Customer lifetime value

### Improve Retention

- Send regular emails (weekly newsletter)
- Offer loyalty rewards
- Provide excellent customer service
- Ask for feedback
- Create exclusive member benefits

---

## Real-Time Monitoring

### Set Up Alerts

**Google Analytics Alerts:**
1. Go to **Admin** → **Alerts**
2. Create alerts for:
   - Traffic drops > 50%
   - Conversion rate drops
   - Bounce rate increases

**Stripe Alerts:**
1. Go to **Settings** → **Notifications**
2. Enable alerts for:
   - Failed payments
   - High refund rate
   - Suspicious activity

### Daily Monitoring

**Morning (5 min):**
- Check website traffic
- Review new orders
- Check customer support emails

**Weekly (30 min):**
- Analyze conversion funnel
- Review top pages
- Check email metrics
- Review social media engagement

**Monthly (2 hours):**
- Full analytics review
- Cohort analysis
- CAC and CLV calculation
- Plan optimizations

---

## Tools & Resources

### Free Tools
- [Google Analytics](https://analytics.google.com)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Google Data Studio](https://datastudio.google.com) - Create custom reports
- [Google Sheets](https://sheets.google.com) - Track metrics

### Paid Tools
- [Mixpanel](https://mixpanel.com) - Advanced analytics ($999/mo)
- [Amplitude](https://amplitude.com) - Cohort analysis ($995/mo)
- [Segment](https://segment.com) - Data collection ($120/mo)

### Dashboarding
- [Metabase](https://www.metabase.com) - Open source
- [Tableau](https://www.tableau.com) - Enterprise
- [Looker](https://looker.com) - Google Cloud native

---

## Implementation Timeline

### Week 1
- [ ] Set up Google Analytics
- [ ] Add tracking code to website
- [ ] Set up conversion tracking
- [ ] Create initial dashboards

### Week 2
- [ ] Set up Stripe analytics
- [ ] Create UTM parameter strategy
- [ ] Start tracking campaigns
- [ ] Create metrics spreadsheet

### Week 3+
- [ ] Daily monitoring
- [ ] Weekly reviews
- [ ] Monthly analysis
- [ ] Optimize based on data

---

## Success Metrics

### Track These KPIs

| KPI | Week 1 | Month 1 | Month 3 |
|-----|--------|---------|---------|
| Website Sessions | 100+ | 500+ | 2,000+ |
| Conversion Rate | 1% | 2% | 3% |
| Average Order Value | $50 | $75 | $100 |
| Email Open Rate | 20% | 25% | 30% |
| Customer Retention | 50% | 60% | 70% |

---

## Next Steps

1. Set up Google Analytics today
2. Add tracking code to website
3. Create initial dashboards
4. Start tracking campaigns with UTM parameters
5. Review metrics weekly
