#!/usr/bin/env node

import PocketBase from 'pocketbase';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const pb = new PocketBase('http://localhost:8090');

async function importSeedData() {
  try {
    // Authenticate as admin
    console.log('Authenticating with PocketBase...');
    await pb.admins.authWithPassword('mark@sprinklecreative.studio', 'zerro399');
    console.log('✓ Authenticated successfully\n');

    // Load seed data files
    const badges = JSON.parse(readFileSync(join(__dirname, 'seed-data/badges.json'), 'utf8'));
    const skills = JSON.parse(readFileSync(join(__dirname, 'seed-data/skills.json'), 'utf8'));
    const challenges = JSON.parse(readFileSync(join(__dirname, 'seed-data/challenges.json'), 'utf8'));

    // Import badges
    console.log(`Importing ${badges.length} badges...`);
    let badgeCount = 0;
    for (const badge of badges) {
      try {
        await pb.collection('badges').create(badge);
        badgeCount++;
        process.stdout.write(`\r  Progress: ${badgeCount}/${badges.length}`);
      } catch (error) {
        console.error(`\n  ✗ Failed to import badge "${badge.name}":`, error.message);
      }
    }
    console.log(`\n✓ Imported ${badgeCount} badges\n`);

    // Import skills
    console.log(`Importing ${skills.length} skills...`);
    let skillCount = 0;
    for (const skill of skills) {
      try {
        await pb.collection('skills').create(skill);
        skillCount++;
        process.stdout.write(`\r  Progress: ${skillCount}/${skills.length}`);
      } catch (error) {
        console.error(`\n  ✗ Failed to import skill "${skill.name}":`, error.message);
      }
    }
    console.log(`\n✓ Imported ${skillCount} skills\n`);

    // Import challenges
    console.log(`Importing ${challenges.length} challenges...`);
    let challengeCount = 0;
    for (const challenge of challenges) {
      try {
        await pb.collection('challenges').create(challenge);
        challengeCount++;
        process.stdout.write(`\r  Progress: ${challengeCount}/${challenges.length}`);
      } catch (error) {
        console.error(`\n  ✗ Failed to import challenge #${challenge.challenge_number}:`, error.message);
      }
    }
    console.log(`\n✓ Imported ${challengeCount} challenges\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Seed data import complete!');
    console.log(`  Badges: ${badgeCount}/${badges.length}`);
    console.log(`  Skills: ${skillCount}/${skills.length}`);
    console.log(`  Challenges: ${challengeCount}/${challenges.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  } catch (error) {
    console.error('Error during import:', error);
    process.exit(1);
  }
}

importSeedData();
