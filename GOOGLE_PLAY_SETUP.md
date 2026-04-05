# Google Play Console Setup & APK Upload Guide

## Step 1: Create Google Play Developer Account

1. Go to https://play.google.com/console
2. Click "Create account" (if you don't have one)
3. Pay the $25 one-time developer fee
4. Complete your developer profile with:
   - Developer name: Nail'd
   - Contact email
   - Developer website (optional)
   - Phone number

## Step 2: Create Your App

1. In Google Play Console, click "Create app"
2. Fill in app details:
   - **App name:** Nail'd
   - **Default language:** English
   - **App or game:** App
   - **Free or paid:** Free
3. Accept the declaration and click "Create app"

## Step 3: Complete App Store Listing

### 1. App Access
- Leave as default (no special access required)

### 2. Ads
- Select "No" (we're not using ads)

### 3. Content Rating
1. Go to **Content rating** section
2. Fill out the questionnaire:
   - Violence: No
   - Sexual content: No
   - Profanity: No
   - Alcohol/tobacco: No
   - Other: No
3. Submit and get your content rating

### 4. Target Audience
1. Go to **Target audience**
2. Select:
   - Age range: 13+
   - Target audience: Women interested in beauty/nails

### 5. App Details
1. Go to **App details**
2. Fill in:
   - **Short description:** Luxury nail art designs. Hand-painted aesthetics. 18-day wear.
   - **Full description:** 
     ```
     Nail'd brings luxury nail art to your fingertips. 
     
     Features:
     - Premium hand-painted designs
     - 18-day wear guarantee
     - Sustainable luxury press-ons
     - Design studio for custom orders
     - Subscription plans available
     
     Shop our collection of trending nail designs or create custom sets in our Design Studio.
     ```
   - **Screenshots:** Upload 2-5 screenshots of the app
   - **Feature graphic:** 1024x500px image
   - **Icon:** 512x512px PNG
   - **Video:** Optional promo video

### 6. Category & Contact
- **Category:** Beauty
- **Contact email:** your-email@gmail.com
- **Website:** naild.manus.space
- **Privacy policy:** https://naild.manus.space/privacy

## Step 4: Upload APK

1. Go to **Release** → **Production**
2. Click **Create new release**
3. Upload the APK:
   - Click **Browse files**
   - Select `app-release.apk` from GitHub Releases
4. Fill in release notes:
   ```
   Version 1.0.0 - Initial Release
   
   - Launch of Nail'd mobile app
   - Browse and purchase nail designs
   - Subscription management
   - Design studio access
   - Order tracking
   ```
5. Review the app details
6. Click **Save** then **Review release**
7. Click **Start rollout to Production**

## Step 5: Submit for Review

1. Go to **Release overview**
2. Review all sections (they should show green checkmarks)
3. Click **Submit for review**
4. Wait for Google's review (24-48 hours for first submission)

## Step 6: Monitor Review Status

1. Check **Release overview** for status updates
2. You'll receive email notifications about:
   - Review started
   - Review approved
   - Review rejected (if issues found)

## Troubleshooting

### Common Rejection Reasons
- **Incomplete store listing:** Ensure all required fields are filled
- **Low-quality screenshots:** Use high-quality app screenshots
- **Misleading description:** Ensure description matches app functionality
- **Policy violations:** Ensure app follows Google Play policies

### If Rejected
1. Read the rejection reason carefully
2. Fix the issues
3. Upload a new APK or update store listing
4. Resubmit for review

## Version Updates

For future updates:

1. Increment version number in `android/build.gradle`
2. Create a new git tag: `git tag -a v1.0.1 -m "Version 1.0.1"`
3. Push tag: `git push origin v1.0.1`
4. GitHub Actions automatically builds and creates release
5. Download APK from GitHub Releases
6. In Google Play Console:
   - Go to **Release** → **Production**
   - Click **Create new release**
   - Upload new APK
   - Add release notes
   - Submit for review

## Automated Release Process

Our GitHub Actions workflow automates:
- ✅ Building signed APK on version tag
- ✅ Creating GitHub Release with download link
- ✅ Sending email notification with APK ready
- ✅ Providing direct download link

Just create a tag, and everything else happens automatically!

## Support

For issues with:
- **Google Play Console:** https://support.google.com/googleplay/android-developer
- **App rejection:** Check Google Play policies at https://play.google.com/about/developer-content-policy/
- **APK build issues:** Check GitHub Actions logs at https://github.com/kmkirk83/piggy-nails-gallery/actions
