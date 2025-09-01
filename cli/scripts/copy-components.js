#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");

async function copyComponents() {
  const sourceDir = path.join(__dirname, "../../demo-app/craftrn-ui");
  const targetDir = path.join(__dirname, "../craftrn-ui");

  try {
    // Remove existing components directory
    if (await fs.pathExists(targetDir)) {
      await fs.remove(targetDir);
    }

    // Copy components from demo-app
    await fs.copy(sourceDir, targetDir);

    console.log("✅ Components copied successfully");
    console.log(`   From: ${sourceDir}`);
    console.log(`   To: ${targetDir}`);
  } catch (error) {
    console.error("❌ Failed to copy components:", error.message);
    process.exit(1);
  }
}

copyComponents();
