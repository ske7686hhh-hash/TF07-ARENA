import { AppConfig, ProjectFile } from '../types/project';
import { DEFAULT_TF07_GAME_HTML } from './defaultGameHtml';

export const INITIAL_CONFIG: AppConfig = {
  appName: 'TF07 Arena',
  packageName: 'com.tf07arena.app',
  versionName: '1.0.0',
  versionCode: 1,
  orientation: 'sensorLandscape',
  immersiveMode: true,
  hardwareAccelerated: true,
  targetSdk: 34,
  minSdk: 24,
  gitHubRepo: 'tf07-arena-apk',
  gitHubOwner: 'username',
  themeColor: '#070913',
};

export const PROJECT_FILES: ProjectFile[] = [
  {
    path: '.github/workflows/build-apk.yml',
    name: 'build-apk.yml',
    language: 'yaml',
    description: 'GitHub Actions workflow to automatically build the Android APK and attach it to releases/artifacts.',
    getContent: (config) => `name: Build Android APK (${config.appName})

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]
  workflow_dispatch:

concurrency:
  group: \${{ github.workflow }}-\${{ github.ref }}
  cancel-in-progress: true

jobs:
  build-apk:
    name: Build & Package APK
    runs-on: ubuntu-latest
    permissions:
      contents: write

    steps:
      - name: 🚀 1. Checkout Repository
        uses: actions/checkout@v4

      - name: ☕ 2. Set up Java 17 (Temurin)
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: 🐘 3. Setup Gradle
        uses: gradle/actions/setup-gradle@v3

      - name: 📱 4. Set up Android SDK
        uses: android-actions/setup-android@v3

      - name: 🔐 5. Ensure Gradle Wrapper is Executable
        run: |
          chmod +x ./gradlew || true
          if [ ! -f "./gradlew" ]; then
            echo "Generating Gradle wrapper..."
            gradle wrapper --gradle-version 8.4
            chmod +x ./gradlew
          fi

      - name: 🔨 6. Build Debug APK
        run: ./gradlew assembleDebug --stacktrace --no-daemon

      - name: 📦 7. Upload APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: ${config.appName.replace(/\\s+/g, '-')}-v\${{ github.run_number }}-APK
          path: app/build/outputs/apk/debug/app-debug.apk
          retention-days: 14
          if-no-files-found: error

      - name: 🏷️ 8. Auto-Release (Optional on Tags)
        if: startsWith(github.ref, 'refs/tags/')
        uses: softprops/action-gh-release@v2
        with:
          files: app/build/outputs/apk/debug/app-debug.apk
          name: "${config.appName} Release \${{ github.ref_name }}"
          generate_release_notes: true
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
`,
  },
  {
    path: 'app/src/main/java/com/tf07arena/app/MainActivity.java',
    name: 'MainActivity.java',
    language: 'java',
    description: 'Android Native Activity that launches the WebView with hardware acceleration, responsive viewport, and audio support.',
    getContent: (config) => {
      const parts = config.packageName.split('.');
      const packageDecl = `package ${config.packageName};`;

      return `${packageDecl}

import android.annotation.SuppressLint;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.activity.OnBackPressedCallback;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @SuppressLint({"SetJavaScriptEnabled", "WrongViewCast"})
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        ${config.immersiveMode ? `// Fullscreen immersive mode
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);` : ''}

        // Initialize WebView
        webView = new WebView(this);
        setContentView(webView);

        // Configure Background
        webView.setBackgroundColor(Color.parseColor("${config.themeColor}"));
        ${config.hardwareAccelerated ? `webView.setLayerType(View.LAYER_TYPE_HARDWARE, null);` : ''}

        // Configure WebSettings for optimal game performance
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        // Modern User-Agent customization
        String userAgent = settings.getUserAgentString();
        settings.setUserAgentString(userAgent + " ${config.appName}Android/1.0");

        // WebChromeClient for hardware-accelerated rendering and console alerts
        webView.setWebChromeClient(new WebChromeClient());

        // WebViewClient to keep navigation inside the app
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false; // Load all URLs within the local WebView
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
            }
        });

        // Load local asset bundle
        webView.loadUrl("file:///android_asset/index.html");

        // Handle Back Button navigation
        getOnBackPressedDispatcher().addCallback(this, new OnBackPressedCallback(true) {
            @Override
            public void handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack();
                } else {
                    setEnabled(false);
                    getOnBackPressedDispatcher().onBackPressed();
                }
            }
        });
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        ${config.immersiveMode ? `if (hasFocus && Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
            getWindow().getDecorView().setSystemUiVisibility(
                View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            );
        }` : ''}
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
        }
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) {
            webView.onPause();
        }
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
`;
    },
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    name: 'AndroidManifest.xml',
    language: 'xml',
    description: 'Android App Manifest with network and hardware permissions, orientation, and main activity declaration.',
    getContent: (config) => `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    package="${config.packageName}">

    <!-- Permissions required for web assets and audio -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${config.appName}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.AppCompat.NoActionBar"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="${config.hardwareAccelerated ? 'true' : 'false'}"
        tools:targetApi="34">

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden|screenLayout"
            android:screenOrientation="${config.orientation}"
            android:windowSoftInputMode="adjustResize"
            android:theme="@style/Theme.AppCompat.NoActionBar">
            
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

    </application>

</manifest>
`,
  },
  {
    path: 'app/build.gradle',
    name: 'app/build.gradle',
    language: 'groovy',
    description: 'Application Gradle build script targeting Android SDK 34 with Java 17 and AndroidX dependencies.',
    getContent: (config) => `plugins {
    id 'com.android.application'
}

android {
    namespace '${config.packageName}'
    compileSdk ${config.targetSdk}

    defaultConfig {
        applicationId "${config.packageName}"
        minSdk ${config.minSdk}
        targetSdk ${config.targetSdk}
        versionCode ${config.versionCode}
        versionName "${config.versionName}"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
        debug {
            applicationIdSuffix ""
            debuggable true
        }
    }

    compileOptions {
        sourceCompatibility JavaVersion.VERSION_17
        targetCompatibility JavaVersion.VERSION_17
    }
}

dependencies {
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.11.0'
    implementation 'androidx.webkit:webkit:1.10.0'
    implementation 'androidx.activity:activity:1.8.2'
}
`,
  },
  {
    path: 'build.gradle',
    name: 'build.gradle (Root)',
    language: 'groovy',
    description: 'Root Gradle configuration defining Google and Maven repositories and Android Gradle Plugin 8.3.',
    getContent: () => `buildscript {
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:8.3.2'
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`,
  },
  {
    path: 'settings.gradle',
    name: 'settings.gradle',
    language: 'groovy',
    description: 'Gradle project settings linking root project and app module.',
    getContent: (config) => `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "${config.appName}"
include ':app'
`,
  },
  {
    path: 'gradle.properties',
    name: 'gradle.properties',
    language: 'properties',
    description: 'JVM arguments and AndroidX flags for optimized Gradle daemon builds.',
    getContent: () => `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
android.nonTransitiveRClass=true
`,
  },
  {
    path: 'gradle/wrapper/gradle-wrapper.properties',
    name: 'gradle-wrapper.properties',
    language: 'properties',
    description: 'Specifies the official Gradle 8.4 runtime distribution used by GitHub Actions.',
    getContent: () => `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.4-bin.zip
networkTimeout=10000
validateDistributionUrl=true
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`,
  },
  {
    path: 'app/src/main/assets/index.html',
    name: 'index.html (WebView Asset)',
    language: 'html',
    description: 'The core TF07 Arena offline web application loaded inside the Android WebView.',
    getContent: (_, customHtml) => customHtml || DEFAULT_TF07_GAME_HTML,
  },
  {
    path: 'gradlew',
    name: 'gradlew (UNIX)',
    language: 'bash',
    description: 'POSIX shell wrapper script used by GitHub Actions runner to execute Gradle.',
    getContent: () => `#!/bin/sh
# Gradle wrapper execution script for POSIX systems (Linux / GitHub Actions / macOS)

APP_HOME="\$(cd -P -- "\$(dirname -- "\$0")" && pwd -P)"
CLASSPATH="\$APP_HOME/gradle/wrapper/gradle-wrapper.jar"

if [ -n "\$JAVA_HOME" ] ; then
    JAVACMD="\$JAVA_HOME/bin/java"
else
    JAVACMD="java"
fi

if [ ! -x "\$JAVACMD" ] ; then
    echo "ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH." >&2
    exit 1
fi

exec "\$JAVACMD" "-Dorg.gradle.appname=\$0" -classpath "\$CLASSPATH" org.gradle.wrapper.GradleWrapperMain "\$@"
`,
  },
  {
    path: 'gradlew.bat',
    name: 'gradlew.bat (Windows)',
    language: 'bash',
    description: 'Windows batch wrapper script for building locally on Windows.',
    getContent: () => `@rem
@rem Copyright 2015 the original author or authors.
@rem
@if "%DEBUG%"=="" @echo off
@rem ##########################################################################
@rem
@rem  Gradle startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@rem Resolve Java executable
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% equ 0 goto execute

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto execute

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
goto fail

:execute
set CLASSPATH=%APP_HOME%\\gradle\\wrapper\\gradle-wrapper.jar

"%JAVA_EXE%" "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*
if %ERRORLEVEL% equ 0 goto mainEnd

:fail
exit /b 1

:mainEnd
if "%OS%"=="Windows_NT" endlocal
`,
  },
  {
    path: '.gitignore',
    name: '.gitignore',
    language: 'bash',
    description: 'Standard Android Studio & Gradle ignore file.',
    getContent: () => `*.iml
.gradle
/local.properties
/.idea/
.DS_Store
/build
/app/build
/captures
.externalNativeBuild
.cxx
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    description: 'Documentation with GitHub Actions badge, instructions to push, and APK download steps.',
    getContent: (config) => `# ${config.appName} - Android APK Builder (GitHub Actions)

[![Build Android APK](https://github.com/${config.gitHubOwner}/${config.gitHubRepo}/actions/workflows/build-apk.yml/badge.svg)](https://github.com/${config.gitHubOwner}/${config.gitHubRepo}/actions)

This repository automatically builds the **${config.appName}** Android APK using **GitHub Actions CI/CD**.
You **do not need Android Studio or a local build environment** installed on your computer.

---

## ⚡ How to Build & Download Your APK with GitHub

### Step 1: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Name your repository (e.g. \`${config.gitHubRepo}\`).
3. Set visibility to **Public** or **Private**.
4. Click **Create repository**.

### Step 2: Push This Project to GitHub
Open your terminal in the extracted folder and run:

\`\`\`bash
git init
git add .
git commit -m "Initial commit of ${config.appName} with GitHub Actions APK builder"
git branch -M main
git remote add origin https://github.com/${config.gitHubOwner}/${config.gitHubRepo}.git
git push -u origin main
\`\`\`

### Step 3: Automated Build in GitHub Actions
1. Open your repository on GitHub.
2. Click the **Actions** tab at the top.
3. You will see the **Build Android APK** workflow running automatically.
4. The cloud runner installs Java 17, Gradle, Android SDK, and compiles \`app-debug.apk\`.

### Step 4: Download Your APK
1. Click on the completed workflow run (green checkmark ✅).
2. Scroll down to the **Artifacts** section at the bottom.
3. Click **${config.appName.replace(/\\s+/g, '-')}-v1-APK** to download the ZIP.
4. Extract the ZIP to get your **app-debug.apk**.
5. Transfer the APK to your Android device and tap to install!

---

## 📱 App Configuration
- **Package Name:** \`${config.packageName}\`
- **Target SDK:** \`${config.targetSdk}\` (Android 14)
- **Minimum SDK:** \`${config.minSdk}\` (Android 7.0+)
- **Orientation:** \`${config.orientation}\`
- **Fullscreen Immersive:** \`${config.immersiveMode ? 'Enabled' : 'Disabled'}\`
- **Hardware Acceleration:** \`${config.hardwareAccelerated ? 'Enabled' : 'Disabled'}\`

---

## 🛠️ Testing Locally (Optional)
If you have Android Studio installed:
1. Open this directory in **Android Studio**.
2. Let Gradle sync dependencies.
3. Click **Run** (Green Play button) or execute:
   \`\`\`bash
   ./gradlew assembleDebug
   \`\`\`
   Output APK will be located at:
   \`app/build/outputs/apk/debug/app-debug.apk\`
`,
  },
];
