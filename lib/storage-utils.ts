import { getBrowserClient, getSupabase } from "./supabase";

// Buckets used in the application
export const STORAGE_BUCKETS = {
  MEMBERS: "members",
  GALLERY: "gallery",
  EVENTS: "events",
  NEWS: "news",
  DONATIONS: "donations",
};

// Function to ensure a bucket exists (client-side)
export async function ensureBucketExists(bucketName: string): Promise<boolean> {
  try {
    const supabase = getBrowserClient();

    console.log("supabase->", supabase);
    // Check if bucket exists
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) throw listError;

    console.log("buckets->", buckets);

    const bucketExists = buckets.some((bucket) => bucket.name === bucketName);

    console.log("bucketExists->", bucketExists);

    if (!bucketExists) {
      // Try to create the bucket
      const { error: createError } = await supabase.storage.createBucket(
        bucketName,
        {
          public: true, // Make files publicly accessible
        }
      );

      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, error);
    return false;
  }
}

// Function to ensure a bucket exists (server-side)
export async function ensureBucketExistsServer(
  bucketName: string
): Promise<boolean> {
  try {
    const supabase = getSupabase();

    // Check if bucket exists
    const { data: buckets, error: listError } =
      await supabase.storage.listBuckets();

    if (listError) throw listError;

    const bucketExists = buckets.some((bucket) => bucket.name === bucketName);

    if (!bucketExists) {
      // Try to create the bucket
      const { error: createError } = await supabase.storage.createBucket(
        bucketName,
        {
          public: true, // Make files publicly accessible
        }
      );

      if (createError) {
        console.error(`Error creating bucket ${bucketName}:`, createError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error(`Error ensuring bucket ${bucketName} exists:`, error);
    return false;
  }
}
