#!/usr/bin/env node

import { Command } from 'commander';
import { execa } from 'execa';
import readline from 'readline';

const program = new Command();

// Function to prompt for user confirmation
function promptConfirmation(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

// Command to clean all Docker containers, images, and volumes
async function cleanAll() {
  const confirmation = await promptConfirmation(
    'Are you sure you want to clean entire Docker? (y/n): '
  );

  if (!confirmation) {
    console.log('Operation cancelled.');
    return;
  }

  try {
    console.log('Cleaning Docker containers...');
    const { stdout: containerIds } = await execa('docker', ['ps', '-aq']);
    if (containerIds) {
      await execa('docker', ['rm', '-f', ...containerIds.trim().split('\n')], { stdio: 'inherit' });
    }

    console.log('Cleaning Docker images...');
    await execa('docker', ['image', 'prune', '-a', '-f'], { stdio: 'inherit' });

    console.log('Cleaning Docker volumes...');
    await execa('docker', ['volume', 'prune', '-f'], { stdio: 'inherit' });

    console.log('Docker cleanup complete.');
  } catch (error) {
    console.error('Error executing Docker cleanup:', error);
  }
}

// Command to clean Docker images
async function cleanImage() {
  try {
    console.log('Cleaning Docker images...');
    await execa('docker', ['image', 'prune', '-a', '-f'], { stdio: 'inherit' });
    console.log('Docker image cleanup complete.');
  } catch (error) {
    console.error('Error executing Docker image cleanup:', error);
  }
}

// Command to clean Docker volumes
async function cleanVolume() {
  try {
    console.log('Cleaning Docker volumes...');
    await execa('docker', ['volume', 'prune', '-f'], { stdio: 'inherit' });
    console.log('Docker volume cleanup complete.');
  } catch (error) {
    console.error('Error executing Docker volume cleanup:', error);
  }
}

async function localDown() {
  try {
    console.log('Bringing down local environment...');
    await execa('docker', ['compose', '-f', 'docker-compose.localdev.yml', 'down'], { stdio: 'inherit' });
    console.log('Docker Compose down complete.');
  } catch (error) {
    console.error('Error executing Docker Compose down:', error);
  }
}

async function populateApp() {
  try {
    console.log('Populating app...');
    await execa('node', ['dockertool/seed.js'], { stdio: 'inherit' });
    console.log('App populated with sample data.');
  } catch (error) {
    console.error('Error executing seed script:', error);
  }
}

program
  .version('1.0.0')
  .description('Docker CLI Tool');




program
  .command('local-up')
  .description('Run local development environment')
  .option('--redo', 'Rebuild and force recreate containers')
  .action(async (cmd, options) => {
    try {
      const additionalArgs = process.argv.slice(program.args.length + 2);
      const args = ['-f', 'docker-compose.localdev.yml', 'up'];

      if (options.clean) {
        args.push('--redo', '--force-recreate');
      }

      args.push(...additionalArgs);

      console.log(`Running: docker compose ${args.join(' ')}`);
      await execa('docker', ['compose', ...args], { stdio: 'inherit' });
    } catch (error) {
      console.error('Error executing Docker command:', error);
    }
  });

  program
  .command('local-down')
  .description('Bring down Docker Compose setup')
  .action(localDown);

program
  .command('clean-all')
  .description('Clean all Docker containers, images, and volumes')
  .action(cleanAll);

program
  .command('clean-image')
  .description('Clean unused Docker images')
  .action(cleanImage);

program
  .command('clean-vol')
  .description('Clean unused Docker volumes')
  .action(cleanVolume);

program
  .command("populate app")
  .description("Populate the application with sample data")
  .action(populateApp)

program.parse(process.argv);
