---
title: Installation
description: How to install Jazzy CLI with a single command.
---

# Installation

To start building with Jazzy, you need to install the **Jazzy CLI**. Choose the command for your operating system below to install Jazzy and automatically set up your PATH.

## Quick Install (One-Liner)

### Windows (PowerShell)
Run this command in your PowerShell:

```powershell
nimble install jazzy -y; $nimbleBin = "$HOME\.nimble\bin"; if (-not ($env:Path -split ';' -contains $nimbleBin)) { [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$nimbleBin", "User"); Write-Host "Jazzy installed! Please restart your terminal." }
```

### macOS (Zsh)
Run this command in your terminal:

```bash
nimble install jazzy -y && echo 'export PATH=$PATH:$HOME/.nimble/bin' >> ~/.zshrc && source ~/.zshrc && echo "Jazzy installed!"
```

### Linux (Bash)
Run this command in your terminal:

```bash
nimble install jazzy -y && echo 'export PATH=$PATH:$HOME/.nimble/bin' >> ~/.bashrc && source ~/.bashrc && echo "Jazzy installed!"
```

---

## Verifying the Installation

After running the command and **restarting your terminal**, verify the installation:

```bash
jazzy --version
```

If you see the Jazzy version number, you are ready to go!

## Creating Your First Project

Now you can use the `new` command to start a project:

```bash
jazzy new my_awesome_app
cd my_awesome_app
nim c -r app.nim
```

---

## Manual Installation

If you prefer to do it manually:

1. Install the package: `nimble install jazzy`
2. Add Nimble's bin directory to your PATH:
   - **Windows:** `%USERPROFILE%\.nimble\bin`
   - **macOS/Linux:** `$HOME/.nimble/bin`
