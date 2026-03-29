# Google Play Store Submission Guide for Nail'd

## Overview

Once your APK is built via EAS Build, follow this guide to submit Nail'd to Google Play Store.

## Step 1: Create Google Play Developer Account

1. Visit: https://play.google.com/console
2. Sign in with your Google account
3. Pay $25 one-time registration fee
4. Complete business information
5. Accept agreements

## Step 2: Create App

1. Click **"Create app"**
2. **App name:** Nail'd
3. **Default language:** English
4. **App or game:** App
5. **Free or paid:** Free (with in-app subscriptions)
6. **Category:** Beauty
7. Click **"Create app"**

## Step 3: Add App Details

### Title & Description

**Title:** Nail'd - Luxury Nail Art & Design Studio

**Short description (80 characters max):**
```
Premium nail designs, custom studio, monthly subscriptions
```

**Full description (4000 characters max):**
```
Nail'd brings luxury nail art to your fingertips. Browse 20+ trending designs, 
customize your own in our design studio, or subscribe to monthly boxes curated 
just for you.

✨ FEATURES:
• 20+ trending nail designs
• Custom design studio with color picker
• Monthly subscription boxes (3 tiers)
• Social gallery with ratings and reviews
• Free shipping on all orders
• 30-day satisfaction guarantee
• Secure Stripe payments
• Real-time order tracking

💅 SUBSCRIPTION TIERS:
• Starter: $34.99/month - Perfect for first-time nail enthusiasts
• Trendsetter: $49.99/month - For the nail art enthusiasts (most popular)
• VIP: $69.99/month - The ultimate luxury nail experience

✅ BENEFITS:
• Cancel anytime, no hidden fees
• Pause subscription for up to 3 months
• Free worldwide express shipping on VIP tier
• Exclusive designs for VIP members
• Personal nail stylist chat support
• 20% discount on additional purchases

Engineered for 18-day wear. Hand-painted aesthetics. 
The world's first truly sustainable luxury press-on.
```

**Category:** Beauty

**Content rating:** Complete IARC questionnaire
- Violence: None
- Sexual content: None
- Profanity: None
- Alcohol/Tobacco: None
- Target age: 13+

## Step 4: Add App Icon & Screenshots

### App Icon (512x512 PNG)
- Use your Nail'd logo with pink accent
- No transparency needed
- Play Store will add rounded corners

### Feature Graphic (1024x500 PNG)
- Showcase "Beyond Salon" hero image
- Include subscription tiers
- Add "Available on Google Play" text

### Screenshots (5-8 required, 1080x1920 or 1440x2560)

1. **Home Screen**
   - "Beyond Salon" hero
   - "Shop The Drop" button
   - Design Studio button

2. **Gallery**
   - 20+ nail designs grid
   - Search and filter options
   - Product prices

3. **Design Studio**
   - Color picker interface
   - Brush size slider
   - Save/Clear buttons

4. **Subscriptions Page**
   - 3 subscription tiers
   - Monthly/Quarterly/Annual toggle
   - Subscribe buttons

5. **Product Detail**
   - Full product image
   - Description and price
   - Add to cart button
   - Reviews section

6. **Checkout**
   - Cart summary
   - Stripe payment form
   - Order confirmation

7. **Account/Orders**
   - Order history
   - Subscription management
   - Profile settings

8. **Social Gallery** (optional)
   - User-submitted designs
   - Ratings and comments
   - Share buttons

### Screenshot Tips
- Use actual app UI, not marketing graphics
- Show key features clearly
- Use consistent branding
- Include text overlays explaining features

## Step 5: Privacy Policy

1. Create privacy policy document
2. Host on your website (e.g., naild.manus.space/privacy)
3. Include:
   - Data collection practices
   - How data is used
   - Third-party services (Stripe, SendGrid, Google Analytics)
   - User rights and data deletion
   - Contact information

**Template:**
```
PRIVACY POLICY

Last updated: [DATE]

1. INFORMATION WE COLLECT
- Account information (email, name)
- Payment information (processed by Stripe)
- Design studio creations
- Order history
- Device information

2. HOW WE USE YOUR INFORMATION
- Process orders and subscriptions
- Send order confirmations and shipping updates
- Improve app features
- Respond to customer support requests
- Prevent fraud

3. THIRD-PARTY SERVICES
- Stripe: Payment processing
- SendGrid: Email notifications
- Google Analytics: Usage analytics

4. DATA SECURITY
We use industry-standard encryption and security measures.

5. CONTACT US
Email: support@naild.app
```

## Step 6: Upload APK

1. Navigate to **"Release"** → **"Production"**
2. Click **"Create new release"**
3. Click **"Upload APK"**
4. Select your signed APK from EAS Build
5. Add release notes:
   ```
   Initial launch! 🎉
   
   • 20+ trending nail designs
   • Custom design studio
   • 3 subscription tiers
   • Social gallery with reviews
   • Secure Stripe payments
   
   We're excited to bring luxury nail art to your fingertips!
   ```

## Step 7: Content Rating

1. Click **"Content rating"**
2. Complete IARC questionnaire
3. Answers:
   - Violence: None
   - Sexual content: None
   - Profanity: None
   - Alcohol/Tobacco: None
   - Gambling: None
   - Target age: 13+

## Step 8: Target Audience

1. Click **"Target audience"**
2. Select:
   - **Primary category:** Beauty
   - **Target age:** 13+
   - **Restrictions:** None

## Step 9: Pricing & Distribution

1. Click **"Pricing & distribution"**
2. Select:
   - **Free:** Yes
   - **Countries:** All countries
   - **Device categories:** Phones and Tablets
   - **Minimum Android version:** 8.0 (API 26)

## Step 10: Review & Submit

1. Review all information for accuracy
2. Accept Play Store policies
3. Click **"Submit for review"**

**Review time:** Usually 24-48 hours

## Post-Launch Monitoring

### In Play Console:

1. **Crashes & ANRs** - Monitor and fix bugs
2. **Ratings & Reviews** - Respond to user feedback
3. **Install metrics** - Track downloads and retention
4. **User feedback** - Read reviews and suggestions

### Actions:

- Fix crashes within 24 hours
- Respond to 1-star reviews professionally
- Plan updates with new designs monthly
- Monitor user retention metrics
- A/B test subscription pricing

## Common Rejection Reasons & Fixes

| Reason | Fix |
|--------|-----|
| Missing privacy policy | Add privacy policy URL |
| Incomplete app listing | Fill all required fields |
| Low-quality screenshots | Use actual app UI screenshots |
| Misleading description | Ensure description matches app |
| Crashes on launch | Test on multiple Android versions |
| Requires unnecessary permissions | Remove unused permissions |

## First Update Checklist

After launch, plan your first update (2-4 weeks):

- [ ] Add 5-10 new nail designs
- [ ] Fix any reported bugs
- [ ] Improve design studio UI
- [ ] Add customer testimonials
- [ ] Implement referral program
- [ ] Add push notifications
- [ ] Optimize performance

## Support Resources

- **Play Store Help:** https://support.google.com/googleplay/android-developer
- **App Review Policy:** https://play.google.com/about/developer-content-policy/
- **Stripe Integration:** https://stripe.com/docs
- **Capacitor Docs:** https://capacitorjs.com/docs

## Timeline

| Task | Time |
|------|------|
| Build APK via EAS | 5-10 min |
| Create Play Store account | 15 min |
| Complete app listing | 30-45 min |
| Upload APK & screenshots | 15 min |
| Submit for review | 1 min |
| **Review & approval** | **24-48 hours** |
| **Live on Play Store** | **48-72 hours** |

## Next Steps

1. ✅ Build APK via EAS Build
2. ✅ Create Play Store developer account
3. ✅ Complete app listing (this guide)
4. ✅ Upload APK and screenshots
5. ✅ Submit for review
6. 📊 Monitor metrics and reviews
7. 🚀 Plan first update
