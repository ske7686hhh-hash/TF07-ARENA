# TF07 Arena — APK banane ka project

Is ZIP mein aapki original `index.html` prototype ko Android WebView app mein package kiya gaya hai. Yeh build-ready Android project hai, APK file khud nahi.

## Redmi A3 se APK banane ke steps
1. ZIP ko phone par extract karein.
2. Apni GitHub repository kholen aur is ZIP ke andar ki saari files/folders repository ke root mein upload karein. Root mein `settings.gradle`, `build.gradle`, `app/` aur `.github/` dikhne chahiye.
3. GitHub par **Actions** tab kholen.
4. `Build TF07 Arena APK` workflow select karein. Agar push par khud start na ho, **Run workflow** dabayein.
5. Build complete hone par workflow run kholen. **Artifacts** mein `TF07-Arena-debug-APK` download karein.
6. Artifact ZIP extract karein; usmein `app-debug.apk` hoga. Us file ko tap karke install karein.

## Important
- Yeh debug APK hai, Play Store release/signed production APK nahi.
- App ka data local storage mein rehta hai; phones ke beech sync nahi hota.
- Admin demo secure/login-protected nahi hai. Real room passwords, payments ya personal data use na karein.
- Online database, secure admin access, Google/Facebook login, payments aur real-time sync abhi implement nahi hain.
- GitHub Actions enabled hona chahiye.
