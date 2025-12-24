#!/usr/bin/env node

/**
 * Update Sprint Collection Permissions
 *
 * Updates the sprints collection to allow any authenticated user to create/update sprints
 * (not just admins), as per the UI message: "Anyone on the team can manage sprints"
 */

import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function updateSprintPermissions() {
  try {
    // Authenticate as admin
    console.log('Authenticating as admin...');
    await pb.admins.authWithPassword('mark@sprinklecreative.studio', 'zerro399');
    console.log('✓ Authenticated successfully\n');

    // Get the sprints collection
    console.log('Fetching sprints collection...');
    const collections = await pb.collections.getFullList();
    const sprintsCollection = collections.find(c => c.name === 'sprints');

    if (!sprintsCollection) {
      console.error('✗ Sprints collection not found');
      process.exit(1);
    }

    console.log('Current permissions:');
    console.log(`  createRule: ${sprintsCollection.createRule || '(empty)'}`);
    console.log(`  updateRule: ${sprintsCollection.updateRule || '(empty)'}`);
    console.log(`  deleteRule: ${sprintsCollection.deleteRule || '(empty)'}\n`);

    // Update collection rules to allow any authenticated user
    console.log('Updating collection rules...');
    await pb.collections.update(sprintsCollection.id, {
      createRule: "@request.auth.id != ''",
      updateRule: "@request.auth.id != ''",
      deleteRule: "@request.auth.id != ''",
    });

    console.log('✓ Collection rules updated successfully!\n');
    console.log('New permissions:');
    console.log('  createRule: @request.auth.id != \'\'');
    console.log('  updateRule: @request.auth.id != \'\'');
    console.log('  deleteRule: @request.auth.id != \'\'\n');
    console.log('Any authenticated user can now create, update, and delete sprints.\n');

  } catch (error) {
    console.error('Error:', error);
    if (error.data) {
      console.error('Error details:', error.data);
    }
    process.exit(1);
  }
}

updateSprintPermissions();
