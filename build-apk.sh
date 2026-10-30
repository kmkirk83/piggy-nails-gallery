#!/bin/bash

# Nail\'d - Build Signed APK Script
# This script builds a production-ready signed APK for Google Play Store.
# Required: android/keystore.properties (copy from keystore.properties.template)

set -e

echo "Nail\'d APK Build Script"
echo "=========================="

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Step 1: Build web app
echo -e "${BLUE}Step 1: Building web app...${NC}"
pnpm install --no-frozen-lockfile
pnpm build
echo -e "${GREEN}✓ Web app built${NC}"

# Step 2: Sync to Capacitor
echo -e "${BLUE}Step 2: Syncing to Capacitor Android...${NC}"
pnpm exec cap sync android
echo -e "${GREEN}✓ Capacitor synced${NC}"

# Step 3: Verify keystore.properties exists
if [ ! -f "android/keystore.properties" ]; then
    echo -e "${RED}✗ android/keystore.properties not found.${NC}"
    echo -e "${YELLOW}  Copy android/keystore.properties.template to android/keystore.properties"
    echo -e "  and fill in your signing credentials.${NC}"
    exit 1
fi

# Step 4: Build signed APK
echo -e "${BLUE}Step 4: Building signed APK...${NC}"
cd android
chmod +x gradlew
./gradlew assembleRelease
echo -e "${GREEN}✓ APK built successfully${NC}"

# Step 5: Display output
APK_PATH="app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_PATH" ]; then
    APK_SIZE=$(du -h "$APK_PATH" | cut -f1)
    echo -e "${GREEN}✓ Signed APK ready for upload${NC}"
    echo ""
    echo -e "${BLUE}APK Details:${NC}"
    echo "  Path: android/$APK_PATH"
    echo "  Size: $APK_SIZE"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "  1. Go to Google Play Console"
    echo "  2. Create a new app or select existing app"
    echo "  3. Navigate to Release > Production"
    echo "  4. Upload the APK file"
    echo "  5. Fill in release notes and submit for review"
else
    echo -e "${RED}✗ APK not found at expected path${NC}"
    exit 1
fi

cd ..
