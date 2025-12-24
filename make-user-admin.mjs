#!/usr/bin/env node

/**
 * Make User Admin Script
 *
 * Updates a user's role to 'admin' in PocketBase.
 * Usage: node make-user-admin.mjs <email>
 */

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function makeUserAdmin(email) {
  try {
    // Authenticate as admin first
    console.log('Authenticating as admin...');
    await pb.admins.authWithPassword('mark@sprinklecreative.studio', 'zerro399');
    console.log('✓ Authenticated as admin\n');

    // Find the user by email
    console.log(`Looking for user with email: ${email}`);
    const users = await pb.collection('users').getFullList({
      filter: `email = "${email}"`,
    });

    if (users.length === 0) {
      console.error(`✗ User with email "${email}" not found`);
      process.exit(1);
    }

    const user = users[0];
    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`Current role: ${user.role}\n`);

    if (user.role === 'admin') {
      console.log('✓ User is already an admin!');
      process.exit(0);
    }

    // Update user role to admin
    console.log('Updating user role to admin...');
    await pb.collection('users').update(user.id, {
      role: 'admin',
    });

    console.log('✓ User role updated successfully!');
    console.log(`\n${user.name} is now an admin and can create sprints.\n`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Get email from command line arguments
const email = process.argv[2];

if (!email) {
  console.error('Usage: node make-user-admin.mjs <email>');
  process.exit(1);
}

makeUserAdmin(email);
