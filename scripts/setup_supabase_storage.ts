import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBlogImagesStorage() {
  console.log('🔧 Setting up Supabase Storage for blog images...\n');

  const bucketName = 'blog-images';

  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('❌ Error listing buckets:', listError);
      return;
    }

    const bucketExists = buckets.some(b => b.name === bucketName);

    if (!bucketExists) {
      console.log(`📦 Creating bucket: ${bucketName}...`);
      
      const { data, error } = await supabase.storage.createBucket(bucketName, {
        public: true,
        fileSizeLimit: 5242880,
        allowedMimeTypes: [
          'image/jpeg',
          'image/jpg',
          'image/png',
          'image/gif',
          'image/webp'
        ]
      });

      if (error) {
        console.error('❌ Error creating bucket:', error);
        return;
      }

      console.log('✅ Bucket created successfully!');
    } else {
      console.log(`✅ Bucket "${bucketName}" already exists.`);
    }

    console.log('\n📋 Recommended RLS Policies (set these in Supabase Dashboard):');
    console.log('1. INSERT policy: Allow authenticated users with "blog" permission');
    console.log('2. SELECT policy: Allow public reads (for blog visitors)');
    console.log('3. DELETE policy: Allow authenticated users with "blog" permission');
    
    console.log('\n🎉 Storage setup complete!');
    console.log(`\n📍 Bucket URL: ${supabaseUrl}/storage/v1/object/public/${bucketName}/`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

setupBlogImagesStorage();
