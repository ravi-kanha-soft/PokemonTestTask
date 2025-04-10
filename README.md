# 🧹 React Native App - Pokemon

This is a React Native app using the React Native CLI (not Expo). Follow the instructions below to set up and run the app on Android and iOS.

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

Or if you're using Yarn:

```bash
yarn install
```

---

## 📱 Running on Android

### ✅ Prerequisites

- Android Studio installed
- Android SDK & emulator or connected physical device
- Java 11 or higher
- Required environment variables:
  - `ANDROID_HOME`
  - Add `platform-tools` to your system `PATH`

### ▶️ Run the app

```bash
npx react-native run-android
```

> Ensure an emulator is running or a device is connected via USB with USB debugging enabled.

---

## 🍏 Running on iOS

### ✅ Prerequisites

- macOS with Xcode installed
- CocoaPods installed (`sudo gem install cocoapods` or `brew install cocoapods`)
- Apple Developer account (for real device testing)
- Command Line Tools for Xcode

### ▶️ Setup and run

```bash
cd ios
pod install
cd ..
```

Then:

```bash
npx react-native run-ios
```

> This will launch the app in the default iOS Simulator.

### 🛠️ Building with Xcode

For better error visibility or real device deployment, build manually using Xcode:

```bash
open ios/Pokemon.xcworkspace
```

Then select your target device and hit the **Run** button.

---

## 🧼 Troubleshooting

- ❗ **Error code 65**: Open `Pokemon.xcworkspace` in Xcode and build to see detailed errors.
- 🔀 Always run `pod install` after adding new native dependencies.
- 🔐 For Google Sign-In or Firebase setup, ensure `GoogleService-Info.plist` is added and properly configured in Xcode.

---

## 📂 Project Structure

```
/android       -> Android native project
/ios           -> iOS native project
/src           -> Your JS/TS source files
App.tsx        -> App entry point
```

---

## 📌 Notes

- This project uses the native React Native CLI setup (not Expo).
- If you're using TypeScript, make sure all types are defined and up to date.
- For push notifications or sign-in features, additional permissions and cloud setup might be required.

---

Happy coding! 💙

