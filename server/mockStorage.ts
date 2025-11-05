// Mock storage service for demonstration
// Stores files as base64 data URLs

const storage = new Map<string, string>();

export async function storagePut(
  relKey: string,
  data: Buffer | Uint8Array | string,
  contentType = "application/octet-stream"
): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  
  // Convert to base64
  let base64Data: string;
  if (typeof data === 'string') {
    base64Data = Buffer.from(data).toString('base64');
  } else if (data instanceof Uint8Array) {
    base64Data = Buffer.from(data).toString('base64');
  } else {
    base64Data = data.toString('base64');
  }
  
  // Create data URL
  const dataUrl = `data:${contentType};base64,${base64Data}`;
  
  storage.set(key, dataUrl);
  
  console.log(`[MockStorage] Stored file: ${key} (${Math.round(base64Data.length / 1024)}KB)`);
  
  return { key, url: dataUrl };
}

export async function storageGet(
  relKey: string,
  _expiresIn = 300
): Promise<{ key: string; url: string }> {
  const key = relKey.replace(/^\/+/, "");
  const url = storage.get(key);
  
  if (!url) {
    throw new Error(`File not found: ${key}`);
  }
  
  return { key, url };
}

console.log('[MockStorage] In-memory storage initialized - No external storage required!');
