#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const CRITICAL_FILES = [
  'app/page.jsx',
  'components/MusicPlayer.jsx',
  'app/layout.jsx'
];

const BACKUP_DIR = 'backups';

function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(BACKUP_DIR, timestamp);
  
  // Create backup directory if it doesn't exist
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }
  
  if (!fs.existsSync(backupPath)) {
    fs.mkdirSync(backupPath, { recursive: true });
  }
  
  console.log(`🔒 Creating backup at: ${backupPath}`);
  
  CRITICAL_FILES.forEach(file => {
    if (fs.existsSync(file)) {
      const fileName = path.basename(file);
      const backupFile = path.join(backupPath, fileName);
      fs.copyFileSync(file, backupFile);
      console.log(`✅ Backed up: ${file} -> ${backupFile}`);
    } else {
      console.log(`⚠️ File not found: ${file}`);
    }
  });
  
  console.log(`🎉 Backup completed successfully!`);
}

function listBackups() {
  if (!fs.existsSync(BACKUP_DIR)) {
    console.log('📁 No backups found.');
    return;
  }
  
  const backups = fs.readdirSync(BACKUP_DIR);
  console.log('📋 Available backups:');
  backups.forEach(backup => {
    console.log(`  - ${backup}`);
  });
}

function restoreBackup(backupName) {
  const backupPath = path.join(BACKUP_DIR, backupName);
  
  if (!fs.existsSync(backupPath)) {
    console.log(`❌ Backup not found: ${backupName}`);
    return;
  }
  
  console.log(`🔄 Restoring from backup: ${backupName}`);
  
  const backupFiles = fs.readdirSync(backupPath);
  backupFiles.forEach(fileName => {
    const backupFile = path.join(backupPath, fileName);
    
    // Find the original file path
    const originalFile = CRITICAL_FILES.find(f => path.basename(f) === fileName);
    
    if (originalFile) {
      fs.copyFileSync(backupFile, originalFile);
      console.log(`✅ Restored: ${backupFile} -> ${originalFile}`);
    }
  });
  
  console.log(`🎉 Restore completed successfully!`);
}

// Command line interface
const command = process.argv[2];
const argument = process.argv[3];

switch (command) {
  case 'create':
    createBackup();
    break;
  case 'list':
    listBackups();
    break;
  case 'restore':
    if (!argument) {
      console.log('❌ Please provide backup name to restore');
      console.log('Usage: node scripts/backup-critical-files.js restore <backup-name>');
      process.exit(1);
    }
    restoreBackup(argument);
    break;
  default:
    console.log('🔒 Critical Files Backup Tool');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/backup-critical-files.js create    - Create a new backup');
    console.log('  node scripts/backup-critical-files.js list      - List available backups');
    console.log('  node scripts/backup-critical-files.js restore <name> - Restore from backup');
    break;
} 