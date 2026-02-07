export async function uploadFileToS3(
  file: File,
  folder: string = 'uploads'
): Promise<string> {
  console.log('DEBUG: Requesting presigned URL for:', file.name, file.type, folder);
  // 1. Get presigned URL
  const presignedRes = await fetch('/api/admin/upload/presigned', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
      folder,
    }),
  });

  if (!presignedRes.ok) {
    const errorBody = await presignedRes.json().catch(() => ({}));
    console.error('DEBUG: Presigned API error response:', errorBody);
    throw new Error(errorBody.error || `Server responded with ${presignedRes.status}`);
  }

  const { uploadUrl, publicUrl } = await presignedRes.json();

  // 2. Upload directly to S3 (PUT)
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error('Failed to upload file to storage');
  }

  return publicUrl;
}
