# Nail'd - Expo & GitHub Actions Quick Start

## 🚀 5-Minute Setup

### Step 1: Create Expo Account
1. Go to https://expo.dev
2. Sign up for free account
3. Create new project called "Nail'd"

### Step 2: Install EAS CLI
```bash
npm install -g eas-cli
npm install -g expo-cli
```

### Step 3: Login to Expo
```bash
eas login
# Enter your Expo credentials
```

### Step 4: Generate Android Keystore
```bash
eas credentials
# Follow prompts to create Android keystore
# Select "Android"
# Select "Production"
# Let EAS generate keystore
```

### Step 5: Build APK (Testing)
```bash
cd /home/ubuntu/piggy-nails-gallery
eas build --platform android --profile preview
```

**Result:** APK download link in terminal (takes ~10-15 minutes)

### Step 6: Build AAB (Google Play)
```bash
eas build --platform android --profile production
```

**Result:** AAB download link in terminal (takes ~10-15 minutes)

---

## 🤖 Automated GitHub Actions Setup (Optional)

### Step 1: Create GitHub Repository
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
   - Download and save locally

### Step 3: Add GitHub Secrets
1. Go to your GitHub repository
2. Settings → Secrets and variables → Actions
3. Add these secrets:

| Secret Name | Value |
|------------|-------|
| `EXPO_TOKEN` | Get from https://expo.dev/settings/tokens |
| `EXPO_USERNAME` | Your Expo username |
| `EXPO_PASSWORD` | Your Expo password |
| `GOOGLE_PLAY_KEY` | Paste entire JSON key file contents |
| `SLACK_WEBHOOK_URL` | (Optional) For build notifications |

### Step 4: GitHub Actions Workflow Ready
The workflow file is already created at:
```
.github/workflows/build-and-deploy.yml
```

Just push to GitHub:
```bash
git add .github/workflows/build-and-deploy.yml
git commit -m "Add GitHub Actions workflow"
git push origin main
```

### Step 5: Automatic Builds
Now every push to `main` will:
1. Build APK/AAB in cloud
2. Upload to Google Play Console
3. Submit for review

---

## 📱 Testing the APK

### Download APK from Expo
1. After `eas build --platform android --profile preview` completes
2. Click the download link in terminal
3. Transfer APK to Android device
4. Install and test

### Or Use Android Emulator
```bash
# Download APK
eas build:download --id <BUILD_ID> --path ./app.apk

# Install on emulator
adb install app.apk
```

---

## 🎯 Push to Google Play Console

### Manual Upload
1. Go to https://play.google.com/console
2. Select your app
3. Go to "Release" → "Production"
4. Click "Create new release"
5. Upload AAB file from Expo
6. Add release notes
7. Review and submit

### Automatic Upload (GitHub Actions)
1. Push code to GitHub `main` branch
2. GitHub Actions automatically:
   - Builds AAB
   - Uploads to Google Play Console
   - Submits for review

---

## 🔑 Important Files

| File | Purpose |
|------|---------|
| `app.json` | Expo app configuration |
| `eas.json` | Build profiles (preview, production) |
| `.github/workflows/build-and-deploy.yml` | GitHub Actions automation |
| `google-play-key.json` | Google Play service account (keep secret!) |

---

## ⚠️ Important Notes

1. **Keep `google-play-key.json` secret** - Never commit to GitHub
2. **Store keystore password securely** - You'll need it for updates
3. **Test APK before production** - Use preview profile first
4. **Monitor Google Play Console** - Check for submission issues

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Regenerate credentials
eas credentials
```

### APK Won't Install
- Check Android version compatibility
- Verify package name: `com.nailed.app`
- Check signing certificate

### GitHub Actions Fails
- Verify EXPO_TOKEN is valid
- Check GOOGLE_PLAY_KEY JSON format
- Ensure GitHub secrets are set

---

## 📊 Build Status

Check build status:
```bash
eas build list
```

Download specific build:
```bash
eas build:download --id <BUILD_ID>
```

---

## 💡 Next Steps

1. ✅ Create Expo account
2. ✅ Run first build: `eas build --platform android --profile preview`
3. ✅ Test APK on device
4. ✅ Create Google Play Developer account
5. ✅ Set up GitHub Actions (optional)
6. ✅ Push to Google Play Console

---

**Status:** Ready to Build
**Last Updated:** March 2026
