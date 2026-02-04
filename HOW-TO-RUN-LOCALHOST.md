# How to Run Ascent to PMP on Localhost

Your PMP Prep app is a **pure client-side application** (no backend required), so it's super easy to run locally!

## 🚀 Quick Start (Easiest Methods)

### Option 1: Python Simple Server (Recommended)
**Best for:** Most reliable, works on any OS

```bash
# Navigate to the project folder
cd C:\Users\Lenovo\Desktop\PMP_Prep

# Python 3 (most common)
python -m http.server 8000

# OR Python 2 (if you have older Python)
python -m SimpleHTTPServer 8000
```

Then open: **http://localhost:8000**

---

### Option 2: Node.js HTTP Server (Fast & Simple)
**Best for:** If you have Node.js installed

```bash
# Install http-server globally (one time only)
npm install -g http-server

# Navigate to project folder
cd C:\Users\Lenovo\Desktop\PMP_Prep

# Start server
http-server -p 8000

# OR use npx (no install needed)
npx http-server -p 8000
```

Then open: **http://localhost:8000**

---

### Option 3: Live Server (VS Code)
**Best for:** If you use VS Code

1. Install "Live Server" extension in VS Code
2. Open `PMP_Prep` folder in VS Code
3. Right-click `index.html` → "Open with Live Server"
4. Automatically opens at **http://127.0.0.1:5500**

**Bonus:** Auto-refreshes when you make changes!

---

### Option 4: PHP Built-in Server
**Best for:** If you have PHP installed

```bash
cd C:\Users\Lenovo\Desktop\PMP_Prep
php -S localhost:8000
```

Then open: **http://localhost:8000**

---

### Option 5: Direct File Opening ⚠️
**Quick test only, NOT recommended for full use**

```bash
# Just double-click index.html
# OR
start index.html
```

**Why not recommended?**
- ❌ ES6 modules won't load (CORS issues)
- ❌ Some features may not work
- ❌ localStorage might behave differently

**Only use this for a quick preview!**

---

## 📋 Step-by-Step Guide (Python Method)

### 1. Check if Python is Installed
```bash
python --version
# Should show: Python 3.x.x
```

**Don't have Python?** Download from: https://www.python.org/downloads/

### 2. Navigate to Project
```bash
# Open Command Prompt or Terminal
cd C:\Users\Lenovo\Desktop\PMP_Prep
```

### 3. Start Server
```bash
python -m http.server 8000
```

You should see:
```
Serving HTTP on :: port 8000 (http://[::]:8000/) ...
```

### 4. Open Browser
Open your browser and go to:
```
http://localhost:8000
```

### 5. Stop Server
Press `Ctrl + C` in the terminal to stop the server.

---

## 🎯 Recommended Setup

**For Development/Testing:**
```bash
# Option 1: Python (most reliable)
python -m http.server 8000

# Option 2: Live Server in VS Code (auto-refresh)
# Install extension, then right-click index.html
```

**For Production:**
- Deploy to GitHub Pages (free!)
- Deploy to Netlify (free!)
- Deploy to Vercel (free!)

---

## 🔧 Troubleshooting

### Problem: "python: command not found"
**Solution:** Python not installed or not in PATH
- Windows: Download from python.org, check "Add to PATH" during install
- Mac: `brew install python3`
- Linux: `sudo apt install python3`

### Problem: "Port 8000 already in use"
**Solution:** Use a different port
```bash
python -m http.server 8080
# Then open http://localhost:8080
```

### Problem: Blank page or errors
**Solution:** Check browser console (F12)
- Make sure you're using `http://localhost:8000` NOT `file:///`
- Check for CORS errors
- Try a different browser

### Problem: "Module not found" errors
**Solution:** You opened index.html directly (file:///)
- Must use a web server (localhost)
- ES6 modules require HTTP protocol

---

## ✅ How to Know It's Working

When you open **http://localhost:8000**, you should see:

1. 🏔️ **Header**: "Ascent to PMP" logo
2. 🔥 **Streak counter**: "0-day streak"
3. 📊 **XP bar**: "0 / 500 XP"
4. 🗺️ **Mission Map**: 7 missions displayed
5. ✅ **Mission 1**: Unlocked (not grayed out)
6. 🔒 **Missions 2-7**: Locked (grayed out)

**Click on Mission 1** → Should show 4 topics:
- 12 Project Management Principles
- 8 Performance Domains
- Ethics & Professional Responsibility
- Exam Format & Strategy

**Click on any topic** → Should show:
- Learn tab with content
- Flashcards tab
- Quiz tab

If you see all this, **it's working perfectly!** 🎉

---

## 🌐 Deploy to Production (Free Options)

### GitHub Pages (Easiest)
```bash
# 1. Create GitHub repo
# 2. Push your code
# 3. Settings → Pages → Deploy from main branch
# 4. Live at: https://yourusername.github.io/PMP_Prep
```

### Netlify (Auto-deploy)
```bash
# 1. Drag and drop PMP_Prep folder to netlify.com
# 2. Live instantly!
# 3. Get custom domain or use: https://random-name.netlify.app
```

### Vercel (Fast & Free)
```bash
# 1. Install Vercel CLI: npm i -g vercel
# 2. cd PMP_Prep
# 3. Run: vercel
# 4. Follow prompts
# 5. Live at: https://pmp-prep.vercel.app
```

---

## 📝 Quick Reference

| Method | Command | URL | Best For |
|--------|---------|-----|----------|
| **Python** | `python -m http.server 8000` | http://localhost:8000 | Most reliable |
| **Node.js** | `npx http-server -p 8000` | http://localhost:8000 | Fast & simple |
| **VS Code** | Right-click → Live Server | http://127.0.0.1:5500 | Development |
| **PHP** | `php -S localhost:8000` | http://localhost:8000 | If you have PHP |

---

## 🎓 Next Steps

1. **Start server** (use Python method above)
2. **Open browser** → http://localhost:8000
3. **Test the app**:
   - Click Mission 1
   - Read a topic (Learn tab)
   - Try flashcards
   - Take a quiz
4. **Check console** (F12) for any errors
5. **Ready to deploy** when everything works!

---

## 💡 Pro Tips

- **Dev Mode**: Use VS Code Live Server for auto-refresh
- **Testing**: Use Python server for most reliable testing
- **Production**: Deploy to Netlify or GitHub Pages
- **Port Conflicts**: If 8000 is busy, use 8080, 3000, or any other port
- **Mobile Testing**: Use `http://YOUR-IP:8000` on same network

---

## 🆘 Need Help?

**Check console errors:**
```
F12 → Console tab
Look for red errors
```

**Common fixes:**
- Clear cache: Ctrl + Shift + R
- Try incognito mode
- Use different port
- Restart server
- Check firewall

---

**You're all set! Your PMP Prep app should run perfectly on localhost!** 🚀

Questions? Check the browser console (F12) for any errors.
