# Focus Guard

A simple Chrome extension I built to reduce distractions and avoid mindless scrolling.

The idea is not to completely block access to distracting websites, but to introduce just enough friction to make usage intentional.

---

## 🧠 What it does

### 🔒 Blocks distracting websites
- Instagram  
- Twitter / X  
- TikTok  
- Other custom sites (e.g. JetPunk, Pedantix)

Access is blocked by default.

---

### ⏳ Delayed unlock (intentional access)

When you click "Unlock":

- You have to wait **3 minutes**
- Then you get access for **5 minutes**
- After that, the site is blocked again

This prevents impulsive “just 2 minutes” usage.

---

### YouTube focus mode

When you open YouTube:

- The homepage is replaced by a **minimal search screen**
- No recommendations, no feed
- You can:
  - search directly
  - or choose to access the normal homepage

Shorts are completely removed.

---

### 📊 Usage feedback

The extension keeps track of how often you unlock:

- today
- last 7 days
- last 30 days

This helps build awareness of your habits.

---

## ⚙️ Installation

1. Clone or download this repository

git clone https://github.com/your-username/focus-guard.git

2. Open Chrome and go to:

chrome://extensions/

3. Enable **Developer mode** (top right)

4. Click **"Load unpacked"**

5. Select the project folder

---

## Project structure
```bash
Focus_Guard_Extension/
├── manifest.json
├── content.js
├── popup.html
├── popup.js
```
---

## Why I built this

I realized most of my time wasn’t lost on long sessions, but on small, repeated distractions:

- opening YouTube without a reason  
- checking Twitter out of habit  
- “just 2 minutes” turning into 20  

Instead of blocking everything, I wanted something that:

- slows me down  
- makes me think before acting  
- still lets me stay connected when needed  

---

## 🚀 Possible improvements

- daily unlock limits  
- stricter focus mode  
- customizable blocked sites UI  
- better analytics  

---

## ⚠️ Notes

- Everything runs locally  
- No data is collected or sent anywhere  
- No external APIs  

---

## Status

This is a personal tool, still evolving based on real usage.
