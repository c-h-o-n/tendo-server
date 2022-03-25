import { Injectable } from '@nestjs/common';
import { DownloadResponse, Storage } from '@google-cloud/storage';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

@Injectable()
export class StorageService {
  private storage: Storage;
  private bucket: string;
  constructor(config: ConfigService) {
    this.storage = new Storage({
      projectId: config.get('gcp.project'),
      credentials: {
        client_email: config.get('gcp.clientEmail'),
        private_key: config.get('gcp.privateKey'),
      },
    });

    this.bucket = config.get('gcp.gcs.bucket');
  }

  async upload(path: string, contentType: string, media: Buffer, metadata: { [key: string]: string }[]) {
    const object = metadata.reduce((obj, item) => Object.assign(obj, item), {});
    const file = this.storage.bucket(this.bucket).file(path);

    return new Promise((resolve, reject) => {
      file
        .createWriteStream({
          contentType: contentType,
          resumable: false,
          gzip: true,
          metadata: { cacheControl: 'no-cache', ...object },
        })
        .on('error', (error) => reject(error))
        .on('finish', () => resolve(this.getStorageUrl(path)))
        .end(media);
    });
  }

  async getFile(path: string): Promise<StorageFile> {
    const fileResponse: DownloadResponse = await this.storage.bucket(this.bucket).file(path).download();
    const [buffer] = fileResponse;
    const storageFile = new StorageFile();
    storageFile.buffer = buffer;
    storageFile.metadata = new Map<string, string>();
    return storageFile;
  }

  getStorageUrl(filename: string, perRequestOptions: any = null) {
    if (perRequestOptions && perRequestOptions.storageBaseUri) {
      return join(perRequestOptions.storageBaseUri, filename);
    }
    return 'https://storage.googleapis.com/' + join(this.bucket, filename);
  }
}

class StorageFile {
  buffer: Buffer;
  metadata: Map<string, string>;
  contentType: string;
}
