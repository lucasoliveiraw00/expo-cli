import os from 'os';
import path from 'path';

import { Platform, prepareJob } from '@expo/build-tools';
import { ExpoConfig } from '@expo/config';
import { ApiV2, User } from '@expo/xdl';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';

import { makeProjectTarballAsync, waitForBuildEndAsync } from './utils';
import log from '../../log';
import { UploadType, uploadAsync } from '../../uploads';
import { createProgressTracker } from '../utils/progress';

export interface StatusResult {
  builds: BuildInfo[];
}

export interface BuildInfo {
  status: string;
  platform: Platform;
  createdAt: string;
  artifacts?: BuildArtifacts;
}

interface BuildArtifacts {
  buildUrl?: string;
  logsUrl: string;
}

interface PresignedPost {
  url: string;
  fields: object;
}

<<<<<<< Updated upstream:packages/expo-cli/src/commands/build-native/Builder.ts
export interface BuilderContext {
  projectDir: string;
  user: User;
  accountName: string;
  projectName: string;
  exp: ExpoConfig;
}

export default class Builder {
  client: ApiV2;
  ctx: BuilderContext;

  constructor(ctx: BuilderContext) {
    this.ctx = ctx;
    this.client = ApiV2.clientForUser(ctx.user);
  }

  async buildProjectAsync(platform: Platform): Promise<string> {
    const projectId = await this.ensureProjectExistsAsync();
    return await this.buildAsync(platform, projectId);
  }

  async getLatestBuildsAsync(): Promise<StatusResult> {
    throw new Error('not implemented yet');
    // return await this.client.getAsync('builds');
  }

  private async ensureProjectExistsAsync(): Promise<string> {
    const { accountName, projectName } = this.ctx;
||||||| constructed merge base:packages/expo-cli/src/commands/build-native/Builder.ts
export default class Builder {
  client: ApiV2;

  constructor(user: User) {
    this.client = ApiV2.clientForUser(user);
  }

  async buildProject(projectDir: string, options: Options) {
    const tarPath = path.join(os.tmpdir(), `${uuid()}.tar.gz`);
    try {
      await makeProjectTarball(tarPath);

      const spinner = ora('Uploading project to server.').start();
      const checksum = await md5File(tarPath);
      const { presignedUrl } = await this.client.postAsync('upload-sessions', {
        type: 'turtle-project-sources',
        checksum,
      });
      const publicUrl = await uploadWithPresignedURL(presignedUrl, tarPath);
      spinner.succeed('Project uploaded.');

      const job = await prepareJob(options.platform, publicUrl, projectDir);
      const { buildId } = await this.client.postAsync('builds', { job: job as any });
=======
interface Builder {
  ensureCredentials(): Promise<void>;
  prepareJob(): Promise<Job>;
}
>>>>>>> Stashed changes:packages/expo-cli/src/commands/build-native/build.ts

<<<<<<< Updated upstream:packages/expo-cli/src/commands/build-native/Builder.ts
    try {
      const [{ id }] = await this.client.getAsync('projects', {
        experienceName: `@${accountName}/${projectName}`,
      });
      return id;
    } catch (err) {
      if (err.code !== 'EXPERIENCE_NOT_FOUND') {
        throw err;
      }
    }
||||||| constructed merge base:packages/expo-cli/src/commands/build-native/Builder.ts
      return await waitForBuildEnd(this.client, buildId);
    } finally {
      await fs.remove(tarPath);
    }
  }
=======
async function startBuild(builder: Builder): Promise<string> {
  const tarPath = path.join(os.tmpdir(), `${uuid()}.tar.gz`);
  try {
    await makeProjectTarball(tarPath);
>>>>>>> Stashed changes:packages/expo-cli/src/commands/build-native/build.ts

<<<<<<< Updated upstream:packages/expo-cli/src/commands/build-native/Builder.ts
    const { id } = await this.client.postAsync('projects', {
      accountName,
      projectName,
      privacy: this.ctx.exp.privacy || 'public',
    });
    return id;
||||||| constructed merge base:packages/expo-cli/src/commands/build-native/Builder.ts
  async getLatestBuilds(): Promise<StatusResult> {
    return await this.client.getAsync('builds');
=======
    const spinner = ora('Uploading project to server.').start();
    const checksum = await md5File(tarPath);
    const { presignedUrl } = await client.postAsync('upload-sessions', {
      type: 'turtle-project-sources',
      checksum,
    });
    const publicUrl = await uploadWithPresignedURL(presignedUrl, tarPath);
    spinner.succeed('Project uploaded.');

    const job = await prepareJob(options.platform, publicUrl, projectDir);
    const { buildId } = await client.postAsync('builds', { job: job as any });
    return buildId;
  } finally {
    await fs.remove(tarPath);
>>>>>>> Stashed changes:packages/expo-cli/src/commands/build-native/build.ts
  }

  private async buildAsync(platform: Platform, projectId: string): Promise<string> {
    const tarPath = path.join(os.tmpdir(), `${uuidv4()}.tar.gz`);
    try {
      const fileSize = await makeProjectTarballAsync(tarPath);

      log('Uploading project to AWS S3');
      const archiveUrl = await uploadAsync(
        UploadType.TURTLE_PROJECT_SOURCES,
        tarPath,
        createProgressTracker(fileSize)
      );

      const job = await prepareJob(platform, archiveUrl, this.ctx.projectDir);
      const { buildId } = await this.client.postAsync(`projects/${projectId}/builds`, {
        job: job as any,
      });

      return await waitForBuildEndAsync(this.client, projectId, buildId);
    } finally {
      await fs.remove(tarPath);
    }
  }
}
