# 🎵 Neo Audio Player - Deployment Guide

## Option 1: GitHub Pages (Recommended)

### Step 1: Get a New GitHub Token
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Name it "Neo Audio Player Deploy"
4. Select scopes: `repo` (full control)
5. Copy the token

### Step 2: Deploy
```bash
# Set your new token
export GITHUB_TOKEN="ghp_your_new_token_here"

# Run the deploy script
./deploy.sh
```

### Step 3: Enable GitHub Pages
1. Go to your repo: https://github.com/jtjustinktaylor-lgtm/neo-audio-player
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main / root
5. Save

Your player will be at: `https://jtjustinktaylor-lgtm.github.io/neo-audio-player`

---

## Option 2: Vercel (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import `jtjustinktaylor-lgtm/neo-audio-player`
5. Click Deploy

Done! Vercel gives you a URL instantly.

---

## Option 3: Netlify (Drag & Drop)

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag the `neo-audio-player` folder onto the page
4. Done! Get instant URL

---

## Option 4: Local Server

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# Then open http://localhost:8080
```

---

## Option 5: Mobile App (Capacitor)

```bash
# Install Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init "Neo Player" com.neo.player

# Add platforms
npm install @capacitor/android @capacitor/ios
npx cap add android
npx cap add ios

# Build and open
npx cap sync
npx cap open android  # or ios
```

---

## Features

- ✅ Play/Pause/Stop/Seek
- ✅ Next/Previous track
- ✅ Shuffle & Repeat
- ✅ Volume control
- ✅ Bass/Treble EQ
- ✅ Speed control (0.5x-2x)
- ✅ Audio visualizer
- ✅ Drag & drop file loading
- ✅ Playlist management
- ✅ Floating mini-player
- ✅ Local storage persistence
- ✅ PWA support (installable)
- ✅ Mobile responsive

---

## Usage

1. Open the player
2. Drag & drop audio files (WAV, MP3, OGG, etc.)
3. Or click the drop zone to browse files
4. Enjoy your music! 🎵

---

## Troubleshooting

### Files not playing?
- Make sure files are audio format (WAV, MP3, OGG, FLAC, AAC)
- Check browser console for errors

### Mini-player not showing?
- Play a track first - it appears when music is playing
- Can be dragged anywhere on screen

### Want offline support?
- The PWA manifest is included
- Add a service worker for full offline support

---

Built with ❤️ by Neo
