# Nail'd Android APK Build & Google Play Store Deployment Guide

## Overview

This guide provides three approaches to build and deploy the Nail'd mobile app to Google Play Store:

1. **EAS Build (Recommended)** - Cloud-based, no local SDK required
2. **Local Build** - Full control, requires Android SDK setup
3. **GitHub Actions** - Automated CI/CD pipeline

---

## Approach 1: EAS Build (Recommended) ⭐

### Why EAS Build?
- ✅ No local Android SDK installation required
- ✅ Automatic code signing
- ✅ Faster builds (cached dependencies)
- ✅ Easy integration with Google Play Console
- ✅ Free tier available

### Prerequisites
- Expo account (create at https://expo.dev)
- Google Play Developer account ($25 one-time fee)
- Nail'd project with valid `app.json` and `eas.json`

### Step 1: Authenticate with Expo

```bash
cd /home/ubuntu/piggy-nails-gallery
eas login
# Follow browser prompts to authenticate
```

### Step 2: Configure EAS Build Profile

Your `eas.json` is already configured with:
- **development**: Internal testing build
- **preview**: APK for testing (internal distribution)
- **production**: App Bundle for Google Play Store

### Step 3: Build for Google Play Store

```bash
# Build production app bundle (for Google Play Store)
eas build --platform android --profile production --wait

# Or build APK for testing
eas build --platform android --profile preview --wait
```

The build will:
1. Upload your code to EAS servers
2. Build the APK/App Bundle
3. Sign with your credentials (auto-generated first time)
4. Download to `./dist/` directory

### Step 4: Download Build Artifacts

After build completes:
```bash
# The APK/App Bundle will be in ./dist/
ls -lah dist/
```

### Step 5: Submit to Google Play Console

See **Google Play Console Submission** section below.

---

## Approach 2: Local Android Build

### Prerequisites

#### System Requirements
- **Java 17+** (required for Android Gradle plugin)
- **Android SDK** (API 36 minimum)
- **Android Build Tools** (35.0.0+)
- **Gradle** (8.0+)

#### Installation (macOS/Linux)

**1. Install Java 17**

```bash
# macOS (using Homebrew)
brew install openjdk@17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Linux (Ubuntu/Debian)
sudo apt-get install openjdk-17-jdk
```

**2. Install Android SDK**

Download Android Studio from https://developer.android.com/studio

Or use command-line tools:
```bash
# Download Android SDK Command-line Tools
# https://developer.android.com/studio#command-tools

# Extract and set ANDROID_HOME
export ANDROID_HOME=~/Android/sdk
export PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$PATH

# Accept licenses
yes | sdkmanager --licenses

# Install required components
sdkmanager "platforms;android-36" "build-tools;35.0.0"
```

**3. Install Node.js & npm**

```bash
# Already installed in sandbox, but ensure latest
node --version  # Should be 18+
npm --version   # Should be 9+
```

### Step 1: Install Dependencies

```bash
cd /home/ubuntu/piggy-nails-gallery
npm install
```

### Step 2: Build Web App

```bash
npm run build
```

This creates optimized web files in `dist/public/`.

### Step 3: Generate Keystore (First Time Only)

```bash
# Generate Android keystore for signing
keytool -genkey -v -keystore ~/nailed-release.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias nailed-key \
  -storepass your_store_password \
  -keypass your_key_password \
  -dname "CN=Nail'd App, O=Nail'd, L=City, ST=State, C=US"

# Store the passwords securely - you'll need them for Google Play Console
```

### Step 4: Create Capacitor Android Project

```bash
# Initialize Capacitor
npx cap init "Nail'd" "com.nailed.app"

# Add Android platform
npx cap add android

# Copy web build to Android
npx cap copy android

# Sync Capacitor config
npx cap sync android
```

### Step 5: Build APK

```bash
cd android

# Debug APK (for testing)
./gradlew assembleDebug
# Output: app/build/outputs/apk/debug/app-debug.apk

# Release APK (for Google Play Store)
./gradlew assembleRelease
# Output: app/build/outputs/apk/release/app-release-unsigned.apk
```

### Step 6: Sign Release APK

```bash
# Sign the release APK
jarsigner -verbose -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore ~/nailed-release.keystore \
  app/build/outputs/apk/release/app-release-unsigned.apk \
  nailed-key

# Verify signature
jarsigner -verify -verbose -certs \
  app/build/outputs/apk/release/app-release-unsigned.apk

# Align APK (required for Play Store)
zipalign -v 4 \
  app/build/outputs/apk/release/app-release-unsigned.apk \
  app/build/outputs/apk/release/app-release.apk
```

### Step 7: Verify APK

```bash
# Check APK integrity
aapt dump badging app/build/outputs/apk/release/app-release.apk
```

---

## Approach 3: GitHub Actions (Automated)

### Setup

1. **Store Keystore in GitHub Secrets**

```bash
# Encode keystore as base64
base64 ~/nailed-release.keystore > keystore.b64

# Copy content and add to GitHub Secrets:
# ANDROID_KEYSTORE_BASE64 = <content>
# ANDROID_KEYSTORE_PASSWORD = <your_password>
# ANDROID_KEY_ALIAS = nailed-key
# ANDROID_KEY_PASSWORD = <your_password>
```

2. **GitHub Actions Workflow**

Your `.github/workflows/android-build.yml` is already configured for automated builds.

3. **Trigger Build**

```bash
git push origin main
# Workflow automatically builds and uploads to releases
```

---

## Google Play Console Submission

### Step 1: Create Google Play Developer Account

1. Go to https://play.google.com/console
2. Sign in with your Google account
3. Pay $25 one-time registration fee
4. Complete business information

### Step 2: Create New App

1. Click **Create app**
2. Enter app name: `Nail'd`
3. Select **Apps** as app type
4. Accept declaration (content rating, etc.)

### Step 3: Set Up App Store Listing

Navigate to **Store Listing** section:

**Basic Info**
- **App name**: Nail'd
- **Short description**: Premium nail art subscription box service
- **Full description**: 
  ```
  Nail'd is your ultimate destination for premium nail art designs. 
  Choose from our curated subscription boxes, one-time purchases, or 
  create custom designs in our AI-powered studio.
  
  Features:
  - Premium subscription tiers (Starter, Trendsetter, VIP, Elite)
  - 46+ trending nail art designs
  - Custom design studio with AI assistance
  - Social gallery with ratings and comments
  - Secure Stripe payment processing
  - Aftercare kits and accessories
  ```

**Category**: Beauty

**Content Rating**: Complete questionnaire at https://play.google.com/console

**Screenshots** (minimum 2, max 8):
- Upload 5-6 screenshots showing:
  1. Home page with featured designs
  2. Shop with subscription tiers
  3. Design studio interface
  4. Gallery with social features
  5. Account dashboard
  6. Checkout process

**Feature Graphic** (1024x500 PNG):
- Create promotional banner with Nail'd branding

**Icon** (512x512 PNG):
- Use `client/public/icon.png`

**Privacy Policy**: 
- Add link to your privacy policy
- Required for apps collecting user data

### Step 4: Upload APK/App Bundle

Navigate to **Release** → **Production**:

1. Click **Create new release**
2. Upload signed APK or App Bundle
3. Review app details
4. Add release notes:
   ```
   Version 1.0.0 - Initial Launch
   
   - Full e-commerce platform with subscription management
   - Custom nail art design studio
   - Social gallery with ratings and comments
   - Secure payment processing
   - Email notifications
   - Admin dashboard
   ```

### Step 5: Content Rating

1. Go to **Content Rating**
2. Complete questionnaire
3. Google generates rating (PEGI, ESRB, etc.)

### Step 6: Pricing & Distribution

1. **Pricing**: Select **Free** (monetization via in-app purchases)
2. **Distribution**: 
   - Select all countries (or specific regions)
   - Check **Google Play** as distribution channel

### Step 7: Review & Submit

1. Review all sections (green checkmarks required)
2. Click **Review release**
3. Accept declaration
4. Click **Rollout to Production**

**Note**: First submission requires Google review (24-48 hours)

---

## Post-Launch Configuration

### Activate Stripe Live Keys

1. Go to **Stripe Dashboard** → **Settings** → **API Keys**
2. Copy **Live Secret Key** and **Live Publishable Key**
3. Update environment variables:

```bash
# In your deployment/production environment
STRIPE_SECRET_KEY=sk_live_...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

4. Restart your server
5. Test with real payment (use test card 4242 4242 4242 4242 first)

### Configure Email Provider

Choose SendGrid or Mailgun:

**SendGrid Setup**
```bash
# Get API key from https://app.sendgrid.com/settings/api_keys
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=SG.xxxxx
```

**Mailgun Setup**
```bash
# Get API key from https://app.mailgun.com/app/account/security/api_keys
EMAIL_PROVIDER=mailgun
MAILGUN_API_KEY=key-xxxxx
MAILGUN_DOMAIN=mail.nailed.app
```

### Enable Push Notifications

```bash
# In app.json, uncomment push notification setup
"plugins": [
  ["expo-notifications", {
    "icon": "./client/public/icon.png"
  }]
]
```

---

## Testing Checklist

### Pre-Launch Testing

- [ ] **Authentication**: Login/logout works
- [ ] **Shop**: Browse all products, filtering works
- [ ] **Subscriptions**: Subscribe to all tiers
- [ ] **One-time Purchases**: Buy individual designs
- [ ] **Design Studio**: Create custom designs
- [ ] **Gallery**: View, rate, and comment on designs
- [ ] **Checkout**: Complete payment flow
- [ ] **Account**: View orders and subscriptions
- [ ] **Admin Dashboard**: Revenue metrics display correctly
- [ ] **Email**: Confirmation emails received
- [ ] **Mobile**: App responsive on various screen sizes
- [ ] **Performance**: App loads quickly (< 3 seconds)
- [ ] **Offline**: App gracefully handles no connection

### Device Testing

Test on:
- [ ] Android 10 (minimum supported)
- [ ] Android 12 (mid-range)
- [ ] Android 14+ (latest)
- [ ] Various screen sizes (4.5", 5.5", 6.5")

---

## Troubleshooting

### Build Fails with "Java 17 Required"
```bash
# Set JAVA_HOME to Java 17
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
./gradlew assembleRelease
```

### APK Won't Install on Device
```bash
# Check minimum API level
aapt dump badging app-release.apk | grep "minSdkVersion"

# Ensure device is API 24+
```

### Stripe Payments Not Working
- Verify API keys are correct
- Check webhook URL is accessible
- Test with Stripe test cards first

### Email Not Sending
- Verify API key is correct
- Check sender email is verified
- Review email logs in provider dashboard

---

## Rollback & Updates

### Publish Update

1. Increment version in `app.json`:
```json
{
  "expo": {
    "version": "1.0.1"  // Changed from 1.0.0
  }
}
```

2. Rebuild APK:
```bash
eas build --platform android --profile production --wait
```

3. Upload to Google Play Console
4. Submit for review

### Rollback to Previous Version

In Google Play Console:
1. Go to **Release** → **Production**
2. Click **Manage release**
3. Select previous version
4. Click **Rollback**

---

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [EAS Build Guide](https://docs.expo.dev/build/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android Build System](https://developer.android.com/build)
- [Capacitor Documentation](https://capacitorjs.com)

---

## Support

For issues during build/deployment:
1. Check build logs in EAS console
2. Review Android Gradle plugin documentation
3. Test locally before submitting to Play Store
4. Contact Expo support for EAS Build issues
