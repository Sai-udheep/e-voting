# Node.js Installation Guide for Windows

This guide will help you install Node.js and npm on your Windows device.

## Step 1: Download Node.js

1. Go to the official Node.js website: https://nodejs.org/
2. Download the **LTS (Long Term Support)** version (recommended)
   - Look for the version marked "LTS" - currently Node.js 20.x or 22.x
   - Choose the **Windows Installer (.msi)** for 64-bit
   - File will be named something like: `node-v20.x.x-x64.msi`

## Step 2: Install Node.js

1. **Run the installer** you just downloaded
2. Click **"Next"** on the welcome screen
3. **Accept the license agreement** and click **"Next"**
4. **Choose installation location** (default is fine: `C:\Program Files\nodejs\`)
5. **IMPORTANT**: On the "Custom Setup" screen, make sure:
   - ✅ **"Add to PATH"** is checked (this is usually checked by default)
   - ✅ **"npm package manager"** is selected
   - ✅ **"Automatically install the necessary tools"** is checked
6. Click **"Next"** and then **"Install"**
7. Wait for installation to complete
8. Click **"Finish"**

## Step 3: Verify Installation

### Option A: Using PowerShell (Recommended)
1. **Close and reopen PowerShell** (important - to refresh PATH)
2. Run these commands:

```powershell
node --version
npm --version
```

You should see version numbers like:
```
v20.11.0
10.2.4
```

### Option B: Using Command Prompt
1. Open **Command Prompt** (Win + R, type `cmd`)
2. Run:
```cmd
node --version
npm --version
```

## Step 4: If Installation Doesn't Work

### Problem: Commands still not recognized after installation

**Solution 1: Restart Your Computer**
- Sometimes Windows needs a restart to update PATH variables

**Solution 2: Manually Add to PATH**
1. Find where Node.js was installed (usually `C:\Program Files\nodejs\`)
2. Press **Win + X** and select **"System"**
3. Click **"Advanced system settings"**
4. Click **"Environment Variables"**
5. Under **"System variables"**, find **"Path"** and click **"Edit"**
6. Click **"New"** and add: `C:\Program Files\nodejs\`
7. Click **"OK"** on all windows
8. **Close and reopen PowerShell/Command Prompt**

**Solution 3: Verify Installation Location**
```powershell
# Check if Node.js is installed
Test-Path "C:\Program Files\nodejs\node.exe"
Test-Path "C:\Program Files (x86)\nodejs\node.exe"
```

If either returns `True`, note the path and add it to PATH manually.

## Step 5: Test with a Simple Command

After installation, test npm:
```powershell
npm --help
```

This should show npm help information.

## Alternative: Using Chocolatey (Advanced)

If you have Chocolatey package manager installed:

```powershell
choco install nodejs-lts
```

## Alternative: Using Winget (Windows 11)

If you have Windows 11 with winget:

```powershell
winget install OpenJS.NodeJS.LTS
```

## Troubleshooting

### Error: "npm is not recognized"
- **Solution**: Restart PowerShell/Command Prompt
- If still not working, manually add Node.js to PATH (see Solution 2 above)

### Error: "Access Denied" during installation
- **Solution**: Right-click installer → **"Run as Administrator"**

### Error: "Node.js is already installed"
- **Solution**: Uninstall old version first:
  1. Go to **Settings** → **Apps** → **Apps & features**
  2. Search for "Node.js"
  3. Uninstall old version
  4. Install new version

### Check Current PATH
```powershell
$env:PATH -split ';' | Select-String nodejs
```

This should show Node.js path if it's in PATH.

## Next Steps

After Node.js is installed:

1. **Verify installation:**
   ```powershell
   node --version
   npm --version
   ```

2. **Navigate to your project:**
   ```powershell
   cd C:\Users\hp\e-voting\backend
   ```

3. **Install dependencies:**
   ```powershell
   npm install
   ```

## System Requirements

- **OS**: Windows 10/11 (64-bit recommended)
- **RAM**: 512MB minimum
- **Disk Space**: ~200MB for Node.js installation
- **Internet**: Required for downloading packages

## Additional Resources

- Official Node.js Website: https://nodejs.org/
- Node.js Documentation: https://nodejs.org/docs/
- npm Documentation: https://docs.npmjs.com/

