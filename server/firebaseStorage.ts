import { getFirebaseStorage } from './firebase';
import { nanoid } from 'nanoid';

export async function uploadToFirebaseStorage(
  filePath: string,
  data: Buffer,
  contentType: string = 'application/pdf'
): Promise<{ key: string; url: string }> {
  try {
    const storage = getFirebaseStorage();
    const bucket = storage.bucket();
    
    const file = bucket.file(filePath);
    
    await file.save(data, {
      contentType,
      metadata: {
        contentType,
      },
    });
    
    // Make file publicly accessible
    await file.makePublic();
    
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;
    
    return {
      key: filePath,
      url: publicUrl,
    };
  } catch (error) {
    console.error('[Firebase Storage] Upload failed:', error);
    throw error;
  }
}

export async function getDownloadUrl(filePath: string): Promise<string> {
  try {
    const storage = getFirebaseStorage();
    const bucket = storage.bucket();
    const file = bucket.file(filePath);
    
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return url;
  } catch (error) {
    console.error('[Firebase Storage] Get URL failed:', error);
    throw error;
  }
}
