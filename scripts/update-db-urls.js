const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function query(text, params) {
  return pool.query(text, params);
}

async function updateDatabase() {
  console.log('Updating Linode URLs to Hetzner URLs in database...');

  const oldUrl = 'https://zexc.in-maa-1.linodeobjects.com';
  const newUrl = 'https://zecurx-web.fsn1.your-objectstorage.com';

  const tables = [
    { name: 'zecurx_admin.blog_posts', columns: ['featured_image_url'] },
    { name: 'zecurx_admin.whitepapers', columns: ['cover_image_url', 'pdf_url'] },
    { name: 'zecurx_admin.products', columns: ['image'] },
    { name: 'public.media', columns: ['url'] },
    { name: 'public.organizations', columns: ['logo'] },
    { name: 'public.topic_related_media', columns: ['url'] },
    { name: 'public.users', columns: ['avatar_url'] },
    { name: 'public.docker_image_metadata', columns: ['image_url'] },
    { name: 'seminar.certificates', columns: ['pdf_url'] },
    { name: 'seminar.seminars', columns: ['image_url', 'brochure_url'] },
  ];

  try {
    for (const table of tables) {
      for (const column of table.columns) {
        console.log(`Updating ${table.name}.${column}...`);
        
        const sql = `
          UPDATE ${table.name} 
          SET ${column} = REPLACE(${column}, $1, $2)
          WHERE ${column} LIKE $3
        `;
        
        const result = await query(sql, [oldUrl, newUrl, `%${oldUrl}%`]);
        console.log(`✅ Updated ${result.rowCount} rows in ${table.name}`);
      }
    }

    // Special handling for array columns
    console.log('Updating zecurx_admin.products.images (array)...');
    const arraySql = `
      UPDATE zecurx_admin.products
      SET images = array(
        SELECT REPLACE(i, $1, $2)
        FROM unnest(images) i
      )
      WHERE array_to_string(images, ',') LIKE $3
    `;
    const arrayResult = await query(arraySql, [oldUrl, newUrl, `%${oldUrl}%`]);
    console.log(`✅ Updated ${arrayResult.rowCount} rows in zecurx_admin.products.images`);
    console.log('\nDatabase update complete!');
  } catch (err) {
    console.error('Database update failed:', err.message);
  }
}

updateDatabase();
