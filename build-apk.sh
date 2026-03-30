#!/bin/bash

# Nail'd - Build Signed APK Script
# This script builds a production-ready signed APK for Google Play Console

set -e

echo "🔨 Nail'd APK Build Script"
echo "=========================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Build web app
echo -e "${BLUE}Step 1: Building web app...${NC}"
pnpm install --frozen-lockfile
pnpm build
echo -e "${GREEN}✓ Web app built${NC}"

# Step 2: Sync to Capacitor
echo -e "${BLUE}Step 2: Syncing to Capacitor Android...${NC}"
pnpm exec cap sync android
echo -e "${GREEN}✓ Capacitor synced${NC}"

# Step 3: Build signed APK
echo -e "${BLUE}Step 3: Building signed APK...${NC}"
cd android

# Check if keystore exists
if [ ! -f "app/nailed-release-key.keystore" ]; then
    echo -e "${YELLOW}⚠ Keystore not found. Generating new keystore...${NC}"
    keytool -genkey -v -keystore app/nailed-release-key.keystore \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -alias nailed-key -storepass "NailedApp2024!" \
        -keypass "NailedApp2024!" \
        -dname "CN=Nail'd,OU=Development,O=Nail'd Inc,L=San Francisco,S=California,C=US"
fi

# Build release APK
./gradlew assembleRelease \
    -Pandroid.injected.signing.store.file=app/nailed-release-key.keystore \
    -Pandroid.injected.signing.store.password=NailedApp2024! \
    -Pandroid.injected.signing.key.alias=nailed-key \
    -Pandroid.injected.signing.key.password=NailedApp2024!

echo -e "${GREEN}✓ APK built successfully${NC}"

# Step 4: Display output
APK_PATH="app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo -e "${GREEN}✓ Signed APK ready for upload${NC}"
    echo ""
    echo -e "${BLUE}APK Details:${NC}"
    echo "  Path: $APK_PATH"
    echo "  Size: $APK_SIZE"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "  1. Go to Google Play Console"
    echo "  2. Create a new app or select existing app"
    echo "  3. Navigate to Release > Production"
    echo "  4. Upload the APK file"
    echo "  5. Fill in release notes and submit for review"
else
    echo -e "${RED}✗ APK build failed${NC}"
    exit 1
fi

cd ..
