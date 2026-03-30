# Nail'd - Google Play Console Upload Guide

## Overview
This guide walks you through building and uploading the Nail'd Android app to Google Play Console.

## Prerequisites
- Java 17+ installed
- Android SDK installed
- Gradle installed
- Google Play Developer account ($25 one-time fee)
- Nail'd app created in Google Play Console

## Step 1: Build the Signed APK

### Option A: Using the Build Script (Recommended)
```bash
./build-apk.sh
```

This script will:
1. Install dependencies
2. Build the web app
3. Sync assets to Capacitor
4. Generate/use signing keystore
5. Build the signed APK

### Option B: Manual Build
```bash
# Install dependencies
pnpm install --frozen-lockfile

# Build web app
pnpm build

# Sync to Capacitor
pnpm exec cap sync android

# Build signed APK
cd android
./gradlew assembleRelease \
  -Pandroid.injected.signing.store.file=app/nailed-release-key.keystore \
  -Pandroid.injected.signing.store.password=NailedApp2024! \
  -Pandroid.injected.signing.key.alias=nailed-key \
  -Pandroid.injected.signing.key.password=NailedApp2024!
```

## Step 2: Locate the APK
After successful build, the signed APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Step 3: Upload to Google Play Console

### 3.1 Create App (if not already created)
1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in app details:
   - **App name**: Nail'd
   - **Default language**: English
   - **App or game**: App
   - **Free or paid**: Free
4. Complete store listing

### 3.2 Upload APK
1. In Google Play Console, go to your app
2. Navigate to **Release** > **Production**
3. Click **Create new release**
4. Click **Upload APK** and select `app-release.apk`
5. Review the APK details (should auto-populate)

### 3.3 Fill Release Information
1. **Release notes** (required):
   ```
   Initial release of Nail'd - Luxury nail art designs
   
   Features:
   - Browse premium nail designs
   - Subscribe to monthly collections
   - Secure checkout with Stripe
   - Offline support with PWA
   ```

2. **Content rating** (required):
   - Complete questionnaire
   - Select appropriate rating

3. **Privacy policy** (required):
   - Add link to your privacy policy

4. **Target audience** (required):
   - Select appropriate age groups

### 3.4 Review and Submit
1. Review all information
2. Accept Google Play policies
3. Click **Review release**
4. Click **Start rollout to Production**

## Step 4: Monitor Release
1. Check **Release dashboard** for deployment status
2. Release typically takes 2-4 hours to appear on Play Store
3. Monitor **Crashes and ANRs** for any issues

## App Signing Certificate Details
```
Keystore: android/app/nailed-release-key.keystore
Alias: nailed-key
Store Password: NailedApp2024!
Key Password: NailedApp2024!
Validity: 10,000 days (27+ years)
Algorithm: RSA 2048-bit
```

⚠️ **IMPORTANT**: Keep the keystore file safe! You'll need it for future app updates.

## Troubleshooting

### APK Build Fails
- Ensure Java 17+ is installed: `java -version`
- Ensure Android SDK is installed and ANDROID_HOME is set
- Run `./gradlew clean` and try again

### Upload Fails
- Ensure APK is signed correctly
- Check that version code is higher than previous release
- Verify app bundle ID matches in Google Play Console

### App Crashes After Upload
- Check **Crashes and ANRs** section in Play Console
- Review logs in `.manus-logs/` directory
- Test thoroughly on device before uploading

## Version Updates

For future updates:
1. Update `android/app/build.gradle` version code
2. Run `./build-apk.sh`
3. Upload new APK to Google Play Console
4. Follow same release process

## Support
For issues with the app, check:
- GitHub Issues: https://github.com/kmkirk83/piggy-nails-gallery/issues
- Manus Documentation: https://docs.manus.im
