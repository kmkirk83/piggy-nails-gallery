# Nail'd Release Process - Complete End-to-End Workflow

## Automated Release Pipeline

Your GitHub Actions workflow is fully automated. Here's how to release new versions:

### Quick Start (3 Steps)

1. **Create a version tag:**
   ```bash
   git tag -a v1.0.1 -m "Version 1.0.1 - Bug fixes and improvements"
   git push origin v1.0.1
   ```

2. **Automated Actions (GitHub does this):**
   - ✅ Builds web app
   - ✅ Syncs to Capacitor
   - ✅ Builds signed APK
   - ✅ Creates GitHub Release
   - ✅ Sends you email with download link

3. **Upload to Google Play:**
   - Download APK from email link
   - Go to Google Play Console
   - Upload APK to Production
   - Submit for review

## Version Numbering

Use semantic versioning: `vMAJOR.MINOR.PATCH`

Examples:
- `v1.0.0` - Initial release
- `v1.0.1` - Bug fix
- `v1.1.0` - New feature
- `v2.0.0` - Major update

## Full Release Checklist

### Before Creating Tag
- [ ] All features tested
- [ ] No console errors
- [ ] Updated version in `android/build.gradle`
- [ ] Updated release notes

### Create Release
```bash
# Create annotated tag
git tag -a v1.0.1 -m "Release notes here"

# Push tag to GitHub
git push origin v1.0.1
```

### Wait for Build
- GitHub Actions starts automatically
- Takes ~10-15 minutes to build
- You'll receive email when ready

### Download & Test
- Download APK from email link
- Test on Android device (optional)
- Verify app works correctly

### Upload to Google Play
1. Go to https://play.google.com/console
2. Select your app
3. Click Release → Production
4. Click Create new release
5. Upload APK
6. Add release notes
7. Click Submit for review

### Monitor Review
- First submission: 24-48 hours
- Subsequent updates: 2-4 hours
- You'll get email when approved

## Email Notifications

You'll receive emails for:
- ✅ **Build Complete** - APK ready with download link
- ✅ **Release Created** - GitHub Release published
- ✅ **Build Failed** - If something went wrong

## GitHub Releases Page

View all releases: https://github.com/kmkirk83/piggy-nails-gallery/releases

Each release includes:
- APK download
- Release notes
- Build information
- Commit hash

## Troubleshooting

### Build Failed Email
1. Check GitHub Actions: https://github.com/kmkirk83/piggy-nails-gallery/actions
2. Click the failed workflow
3. Scroll to see error details
4. Fix the issue
5. Create new tag to retry

### APK Not Downloading
1. Go to GitHub Releases page
2. Find the version
3. Download APK directly from Assets section

### Google Play Upload Issues
1. Check APK is signed correctly
2. Verify version code is higher than previous
3. Check app store listing is complete
4. Review Google Play policies

## Version Code Management

Android requires incrementing version code for each release:

Edit `android/app/build.gradle`:
```gradle
android {
    defaultConfig {
        versionCode 2  // Increment this for each release
        versionName "1.0.1"  // Match your git tag
    }
}
```

## Continuous Deployment

Your workflow automatically:
1. Builds on every push to main/eas-update
2. Creates release on version tags
3. Sends email notifications
4. Provides download links

No manual steps needed - just push code and let automation handle the rest!

## Support

For issues:
- GitHub Actions: https://github.com/kmkirk83/piggy-nails-gallery/actions
- Google Play: https://support.google.com/googleplay/android-developer
- Build errors: Check GitHub Actions logs
