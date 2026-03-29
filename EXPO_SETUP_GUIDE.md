# Nail'd - Expo Setup & Automated Google Play Console Deployment

## Overview

This guide explains how to convert your Nail'd web project into a mobile app (APK/AAB) using Expo, and automate builds to Google Play Console using GitHub Actions.

**What you'll get:**
- ✅ APK file for testing on Android devices
- ✅ AAB (Android App Bundle) for Google Play Console
- ✅ Automated builds triggered on GitHub push
- ✅ Automatic submission to Google Play Console

---

## OPTION 1: SIMPLE EXPO SETUP (Recommended for Beginners)

### Step 1: Install Expo CLI

```bash
npm install -g eas-cli
npm install -g expo-cli
```

### Step 2: Initialize Expo Project

```bash
cd /home/ubuntu/piggy-nails-gallery
npx create-expo-app nailed-mobile
cd nailed-mobile
```

### Step 3: Create app.json Configuration

Create `app.json` in your project root:

```json
{
  "expo": {
    "name": "Nail'd",
    "slug": "nailed-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTabletMode": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.nailed.app",
      "permissions": [
        "INTERNET"
      ]
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-build-properties",
        {
          "android": {
            "usesCleartextTraffic": true
          }
        }
      ]
    ]
  }
}
```

### Step 4: Create EAS Configuration

Create `eas.json` in your project root:

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "serviceAccount": "./google-play-key.json",
        "track": "internal"
      }
    }
  }
}
```

### Step 5: Create Expo Account

1. Go to https://expo.dev
2. Sign up for free account
3. Create new project called "Nail'd"

### Step 6: Login to Expo CLI

```bash
eas login
# Enter your Expo credentials
```

### Step 7: Generate Android Keystore

```bash
eas credentials
# Follow prompts to create Android keystore
# Save the keystore information securely
```

### Step 8: Build APK (Testing)

```bash
eas build --platform android --profile preview
```

This will:
- Build your app in the cloud
- Generate APK file
- Provide download link
- Takes ~10-15 minutes

### Step 9: Build AAB (Production)

```bash
eas build --platform android --profile production
```

This will:
- Build AAB for Google Play Console
- Provide download link
- Takes ~10-15 minutes

---

## OPTION 2: AUTOMATED GITHUB ACTIONS SETUP (Recommended for Continuous Deployment)

### Step 1: Set Up GitHub Repository

```bash
cd /home/ubuntu/piggy-nails-gallery
git init
git add .
git commit -m "Initial commit"
gh repo create nailed-app --private
git push -u origin main
```

### Step 2: Create Google Play Service Account

1. Go to https://console.cloud.google.com
2. Create new project "Nail'd"
3. Enable Google Play Developer API
4. Create Service Account:
   - Go to "Service Accounts"
   - Click "Create Service Account"
   - Name: "nail-d-github"
   - Grant "Editor" role
5. Create JSON key:
   - Click service account
   - Go to "Keys" tab
   - Create new JSON key
   - Download and save as `google-play-key.json`

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:

```
EXPO_TOKEN: [Your Expo token from https://expo.dev/settings/tokens]
GOOGLE_PLAY_KEY: [Contents of google-play-key.json - paste entire JSON]
ANDROID_KEYSTORE_PASSWORD: [Your keystore password]
ANDROID_KEY_ALIAS: [Your key alias]
ANDROID_KEY_PASSWORD: [Your key password]
```

### Step 4: Create GitHub Actions Workflow

Create `.github/workflows/build-and-deploy.yml`:

```yaml
name: Build and Deploy to Google Play

on:
  push:
    branches: [main]
    paths:
      - 'client/**'
      - 'server/**'
      - 'app.json'
      - 'eas.json'
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install -g eas-cli expo-cli
      
      - name: Login to Expo
        run: eas login --username ${{ secrets.EXPO_USERNAME }} --password ${{ secrets.EXPO_PASSWORD }}
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Build AAB for Google Play
        run: eas build --platform android --profile production --non-interactive
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
      
      - name: Download build artifact
        run: |
          BUILD_ID=$(eas build list --json | jq -r '.[0].id')
          eas build:download --id $BUILD_ID --path ./app.aab
      
      - name: Deploy to Google Play Console
        uses: r0adkll/upload-google-play@v1
        with:
          serviceAccountJsonPlainText: ${{ secrets.GOOGLE_PLAY_KEY }}
          packageName: com.nailed.app
          releaseFiles: './app.aab'
          track: internal
          status: completed
```

### Step 5: Push to GitHub

```bash
git add .github/workflows/build-and-deploy.yml
git commit -m "Add GitHub Actions workflow"
git push origin main
```

Now every push to main will:
1. Build APK/AAB in cloud
2. Upload to Google Play Console
3. Automatically submit for review

---

## OPTION 3: MANUAL BUILD & PUSH (No Automation)

### Build Locally

```bash
# Install EAS CLI
npm install -g eas-cli

# Login
eas login

# Build APK (for testing)
eas build --platform android --profile preview

# Build AAB (for production)
eas build --platform android --profile production
```

### Push to Google Play Console Manually

1. Go to https://play.google.com/console
2. Select your app
3. Go to "Release" → "Production"
4. Click "Create new release"
5. Upload AAB file
6. Add release notes
7. Review and submit

---

## COMPLETE SETUP CHECKLIST

### Prerequisites
- [ ] Expo account created (https://expo.dev)
- [ ] Google Play Developer account ($25 one-time fee)
- [ ] GitHub account with repository
- [ ] Node.js 16+ installed

### Expo Setup
- [ ] EAS CLI installed globally
- [ ] Expo CLI installed globally
- [ ] Logged into Expo CLI
- [ ] app.json configured
- [ ] eas.json configured
- [ ] Android keystore created

### Google Play Setup
- [ ] Google Cloud project created
- [ ] Service account created
- [ ] JSON key downloaded
- [ ] Google Play Developer account set up
- [ ] App created in Google Play Console

### GitHub Setup
- [ ] Repository created
- [ ] Secrets added (EXPO_TOKEN, GOOGLE_PLAY_KEY, etc.)
- [ ] GitHub Actions workflow created
- [ ] Workflow tested

---

## QUICK START (5 MINUTES)

### Option A: Cloud Builds (Easiest)

```bash
# 1. Install
npm install -g eas-cli

# 2. Login
eas login

# 3. Build APK
eas build --platform android --profile preview

# 4. Get download link from terminal
```

### Option B: Automated (GitHub)

```bash
# 1. Create GitHub repo
gh repo create nailed-app --private

# 2. Add secrets to GitHub Settings
# EXPO_TOKEN, GOOGLE_PLAY_KEY, etc.

# 3. Create .github/workflows/build-and-deploy.yml
# (Use template from Option 2 above)

# 4. Push to GitHub
git push origin main

# 5. Builds run automatically on every push
```

---

## TROUBLESHOOTING

### Build Fails with "No credentials"
```bash
eas credentials
# Regenerate credentials
```

### APK Won't Install
- Make sure you're using correct Android version
- Check package name matches Google Play Console
- Verify signing certificate

### GitHub Actions Fails
- Check EXPO_TOKEN is valid
- Check GOOGLE_PLAY_KEY JSON is properly formatted
- Check GitHub secrets are set correctly

### Google Play Submission Rejected
- Check app name, description, screenshots
- Ensure privacy policy is provided
- Verify app content rating

---

## PRICING

| Service | Cost | Notes |
|---------|------|-------|
| Expo (Free Tier) | Free | 30 builds/month, 1GB storage |
| Expo (Pro) | $99/month | Unlimited builds, priority support |
| Google Play Developer | $25 | One-time fee |
| GitHub Actions | Free | 2,000 minutes/month free |

---

## NEXT STEPS

1. **Choose your approach:**
   - Option 1: Simple Expo (manual builds)
   - Option 2: Automated GitHub Actions (recommended)
   - Option 3: Manual push to Google Play

2. **Set up Expo account** at https://expo.dev

3. **Create Google Play Developer account** at https://play.google.com/console

4. **Run first build:**
   ```bash
   eas build --platform android --profile preview
   ```

5. **Test APK on Android device**

6. **Set up GitHub Actions** for automation

7. **Push to Google Play Console**

---

## SUPPORT

- Expo Docs: https://docs.expo.dev
- EAS Build: https://docs.expo.dev/build/introduction/
- Google Play Console Help: https://support.google.com/googleplay/android-developer

---

**Document Created:** March 2026
**Status:** Ready for Implementation
