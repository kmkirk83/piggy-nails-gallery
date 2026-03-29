# Expo Deployment Guide for Nail'd Mobile App

## Overview

Nail'd is configured for deployment via Expo Application Services (EAS). This guide covers building and publishing the Android APK to Google Play Store and iOS to Apple App Store.

---

## Prerequisites

1. **Expo Account** - Create at https://expo.dev
2. **EAS CLI** - Install with `npm install -g eas-cli`
3. **Xcode** (for iOS) - Available on macOS only
4. **Android Studio** (optional) - For testing on Android emulator
5. **Google Play Developer Account** - $25 one-time fee
6. **Apple Developer Account** - $99/year (for iOS)

---

## Quick Start: Build for Android

### Step 1: Authenticate with EAS

```bash
eas login
# Follow the browser prompt to sign in with your Expo account
```

### Step 2: Build APK for Testing (Preview)

```bash
cd /home/ubuntu/piggy-nails-gallery
eas build --platform android --profile preview
```

This creates an APK you can install on Android devices for testing. The build will take 5-10 minutes.

### Step 3: Download and Install APK

Once the build completes:
1. Download the APK from the EAS dashboard
2. Transfer to your Android device
3. Install via file manager or `adb install app.apk`

---

## Production Build: Google Play Store

### Step 1: Create Signing Key

```bash
eas credentials
# Select "Android"
# Choose "Create new" for signing key
# Follow prompts to generate keystore
```

### Step 2: Build for Production

```bash
eas build --platform android --profile production
```

This creates an App Bundle (.aab) optimized for Google Play Store.

### Step 3: Upload to Google Play Console

1. Go to https://play.google.com/console
2. Create new app (name: "Nail'd")
3. Fill in app details:
   - Category: Lifestyle
   - Content rating: Complete questionnaire
   - Privacy policy: Add your privacy policy URL
   - Target audience: 13+

4. Upload App Bundle:
   - Go to "Release" > "Production"
   - Upload the .aab file from EAS
   - Add release notes
   - Submit for review (takes 2-4 hours)

---

## Production Build: Apple App Store

### Step 1: Create Apple Developer Account

1. Go to https://developer.apple.com
2. Enroll in Apple Developer Program ($99/year)
3. Create App ID: "com.nailed.app"
4. Create provisioning profiles

### Step 2: Create Signing Credentials

```bash
eas credentials
# Select "iOS"
# Choose "Create new" for signing certificate
# Follow prompts
```

### Step 3: Build for iOS

```bash
eas build --platform ios --profile production
```

### Step 4: Upload to App Store

1. Go to https://appstoreconnect.apple.com
2. Create new app
3. Upload build via Xcode or Transporter
4. Submit for review (takes 1-3 days)

---

## Build Profiles Explained

### Development
- **Use Case**: Local testing with Expo Go app
- **Command**: `eas build --platform android --profile development`
- **Result**: Installable on Expo Go app

### Preview
- **Use Case**: Testing full APK before production
- **Command**: `eas build --platform android --profile preview`
- **Result**: Standalone APK for testing

### Production
- **Use Case**: Publishing to app stores
- **Command**: `eas build --platform android --profile production`
- **Result**: Optimized App Bundle for Google Play / IPA for App Store

---

## Current Configuration

**app.json:**
- App Name: Nail'd
- Slug: nailed-app
- Version: 1.0.0
- Android Package: com.nailed.app
- iOS Bundle: com.nailed.app
- EAS Project ID: dad5b5d5-7965-4919-ab70-9dc067cb1545

**eas.json:**
- Development: Internal distribution
- Preview: APK format for testing
- Production: App Bundle for Google Play

---

## Troubleshooting

### Build Fails with "Credentials not found"
```bash
eas credentials
# Regenerate credentials for the platform
```

### "Project not found" Error
```bash
eas project:info
# Verify EAS project ID matches app.json
```

### Build Timeout
- Check internet connection
- Try again (builds sometimes fail due to temporary issues)
- Check EAS dashboard for detailed logs

### App Won't Start After Installation
- Ensure all environment variables are set
- Check that API endpoints are reachable
- Review logs in EAS dashboard

---

## Version Management

To update version for new releases:

```json
// app.json
{
  "expo": {
    "version": "1.1.0"  // Increment this
  }
}

// android section
{
  "versionCode": 2  // Increment this for each Android build
}
```

---

## Monitoring & Analytics

After publishing:

1. **Google Play Console** - View downloads, ratings, crashes
2. **App Store Connect** - View downloads, ratings, crashes
3. **Expo Dashboard** - View build history and logs

---

## Next Steps

1. ✅ Set up Expo account
2. ✅ Install EAS CLI
3. ✅ Build preview APK for testing
4. ✅ Create Google Play Developer account
5. ✅ Build production APK
6. ✅ Submit to Google Play Store
7. ✅ Create Apple Developer account (optional)
8. ✅ Build for iOS (optional)
9. ✅ Submit to App Store (optional)

---

## Support

- **Expo Docs**: https://docs.expo.dev
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Google Play Console Help**: https://support.google.com/googleplay/android-developer
- **App Store Connect Help**: https://help.apple.com/app-store-connect
