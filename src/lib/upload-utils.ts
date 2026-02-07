export async function uploadFileToS3(
  file: File,
  folder: string = 'uploads'
): Promise<string> {
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
    const error = await presignedRes.json();
    throw new Error(error.error || 'Failed to get upload URL');
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
