import { Platform } from '@expo/build-tools';
import { getConfig } from '@expo/config';
import { User, UserManager } from '@expo/xdl';
import { Command } from 'commander';

import log from '../../log';
<<<<<<< Updated upstream
import Builder, { BuilderContext } from './Builder';
||||||| constructed merge base
import Builder, { Options } from './Builder';
=======
import { startBuild, waitForBuildEnd } from './build';
>>>>>>> Stashed changes
import { printBuildTable } from './utils';

<<<<<<< Updated upstream
async function buildAction(
  projectDir: string,
  { platform }: { platform: Platform }
): Promise<void> {
  if (!platform || !Object.values(Platform).includes(platform)) {
    throw new Error('Pass valid platform: [android|ios]');
  }
  const ctx = await createBuilderContextAsync(projectDir);
  const builder = new Builder(ctx);
  const buildArtifactUrl = await builder.buildProjectAsync(platform);
  log(`Artifact url: ${buildArtifactUrl}`);
||||||| constructed merge base
async function buildAction(projectDir: string, options: Options) {
  if (!options.platform || !Object.values(Platform).includes(options.platform)) {
    throw new Error('Pass valid platform: [android|ios]');
  }
  const user: User = await UserManager.ensureLoggedInAsync();
  const builder = new Builder(user);
  const buildArtifactUrl = await builder.buildProject(projectDir, options);
  log(`Artifact url: ${buildArtifactUrl}`);
=======
interface Options {
  credentialsSource: 'local' | 'remote' | 'auto';
  noWait: boolean;
}

async function buildAndroidAction(projectDir: string, options: Options) {
  const user: User = await UserManager.ensureLoggedInAsync();
  const client: ApiV2 = ApiV2.clientForUser(user);

  const credntialsProvider = new AndroidCredentialsProvider(projectDir, options);
  const builder = new Builder(client, credntialsProvider);
  const buildId = await builder.buildProject(projectDir, options);
  if (!options.noWait) {
    const await waitForBuildEnd(client, buildId);
    log(`Artifact url: ${buildArtifactUrl}`);
  }
>>>>>>> Stashed changes
}

async function statusAction(projectDir: string): Promise<void> {
  const ctx = await createBuilderContextAsync(projectDir);
  const builder = new Builder(ctx);
  const result = await builder.getLatestBuildsAsync();
  printBuildTable(result.builds);
}

async function createBuilderContextAsync(projectDir: string): Promise<BuilderContext> {
  const user: User = await UserManager.ensureLoggedInAsync();
  const { exp } = getConfig(projectDir);
  const accountName = exp.owner || user.username;
  const projectName = exp.slug;
  return {
    projectDir,
    user,
    accountName,
    projectName,
    exp,
  };
}

export default function (program: Command) {
  program
    .command('build [project-dir]')
    .description(
      'Build an app binary for your project, signed and ready for submission to the Google Play Store.'
    )
    .option(
      '-s --credentials-source <source>',
      'sources: [local|remote|auto]',
      /^(local|remote|auto)$/i
    )
    .option('--skip-credentials-check', 'Skip checking credentials')
    .option('--no-wait', 'Exit immediately after triggering build.')
    .asyncActionProjectDir(buildAndroidAction, { checkConfig: true });

  program
    .command('build:status')
    .description(`Get the status of the latest builds for your project.`)
    .asyncActionProjectDir(statusAction, { checkConfig: true });
}
