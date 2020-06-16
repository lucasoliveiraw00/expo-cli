import { ProjectPrivacy } from '@expo/config';
import { ApiV2, User } from '@expo/xdl';

interface ProjectData {
  accountName: string;
  projectName: string;
  privacy?: ProjectPrivacy;
}

async function ensureProjectExistsAsync(
  user: User,
  { accountName, projectName, privacy }: ProjectData
): Promise<string> {
  const client = ApiV2.clientForUser(user);
  try {
    const experienceName = `@${accountName}/${projectName}`;
    const [{ id }] = await client.getAsync('projects', { experienceName });
    return id;
  } catch (err) {
    if (err.code !== 'EXPERIENCE_NOT_FOUND') {
      throw err;
    }
  }

  const { id } = await client.postAsync('projects', {
    accountName,
    projectName,
    privacy: privacy || ProjectPrivacy.PUBLIC,
  });
  return id;
}

export { ensureProjectExistsAsync };
