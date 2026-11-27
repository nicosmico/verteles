#!/usr/bin/env node
// Packages, signs and installs the Tizen build on a TV in developer mode.
// Needs the Tizen CLI (`tizen`, `sdb`) on PATH and a Samsung security profile.
// Configuration comes from .env.local (see .env.example). Guide: docs/tizen.md
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, renameSync } from 'node:fs';
import { join } from 'node:path';

const APP_ID = 'XoHlW9z1dM.Verteles';
const BUILD_DIR = 'dist-tizen';
const WGT = 'verteles.wgt';
const SDB_PORT = 26101;

const commands = { package: packageApp, install, run };
const command = process.argv[2];
if (!(command in commands)) fail(`Usage: node scripts/tizen.mjs <${Object.keys(commands).join('|')}>`);
commands[command]();

function packageApp() {
  const profile = env('TIZEN_PROFILE', 'the name of your Samsung security profile');
  requireCli('tizen');
  sh('npm', ['run', 'build:tizen']);
  sh('tizen', ['package', '-t', 'wgt', '-s', profile, '--', BUILD_DIR]);
  const built = readdirSync(BUILD_DIR).find((file) => file.endsWith('.wgt'));
  if (!built) fail(`tizen package did not produce a .wgt in ${BUILD_DIR}/`);
  renameSync(join(BUILD_DIR, built), WGT);
  console.log(`\nSigned package: ${WGT}`);
}

function install() {
  const target = connect();
  if (!existsSync(WGT)) fail(`${WGT} not found. Run "npm run tizen:package" first.`);
  sh('tizen', ['install', '-n', WGT, '-s', target]);
}

function run() {
  sh('tizen', ['run', '-p', APP_ID, '-s', connect()]);
}

function connect() {
  const ip = env('TV_IP', "your TV's IP address");
  requireCli('sdb');
  sh('sdb', ['connect', ip]);
  return `${ip}:${SDB_PORT}`;
}

function env(name, description) {
  const value = process.env[name];
  if (!value) fail(`Missing ${name} (${description}). Set it in .env.local; see .env.example.`);
  return value;
}

function requireCli(name) {
  try {
    execFileSync(name, ['version'], { stdio: 'ignore' });
  } catch {
    fail(`"${name}" is not on PATH. Install the Tizen CLI; see docs/tizen.md.`);
  }
}

function sh(cmd, args) {
  console.log(`$ ${cmd} ${args.join(' ')}`);
  execFileSync(cmd, args, { stdio: 'inherit' });
}

function fail(message) {
  console.error(message);
  process.exit(1);
}
