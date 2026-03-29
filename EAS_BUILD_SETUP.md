# EAS Build Setup for Nail'd Android APK

## Quick Start

EAS Build will compile your Nail'd web app into a native Android APK in the cloud. No local Android SDK needed.

## Step 1: Authenticate with Expo

```bash
cd /home/ubuntu/piggy-nails-gallery
export EXPO_TOKEN=your_expo_token_here
eas login
```

## Step 2: Configure EAS for Capacitor

Update `eas.json`:

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## Step 3: Build APK

### Preview Build (for testing):
```bash
eas build --platform android --profile preview
```

### Production Build (for Play Store):
```bash
eas build --platform android --profile production
```

## Step 4: Download APK

EAS will provide a download link. The signed APK is ready for Google Play Store submission.

## What Happens Next

1. EAS compiles your web app with Capacitor
2. Builds native Android APK
3. Signs with Expo's certificate
4. Provides download link (valid for 30 days)

## Google Play Store Submission

1. Create Play Store account: https://play.google.com/console
2. Create app listing
3. Upload the APK
4. Add screenshots, description, and privacy policy
5. Submit for review (24-48 hours)

## Troubleshooting

**Build fails with "Project not found":**
- Ensure `app.json` has correct `expo.name` and `expo.slug`

**Build hangs:**
- Check internet connection
- Try again (sometimes temporary)

**APK won't install:**
- Ensure device has Android 8.0+ (API 26+)
- Clear app cache: `adb shell pm clear com.nailed.app`

## Next Steps

1. Run EAS build command above
2. Download signed APK
3. Test on Android device
4. Submit to Google Play Store
