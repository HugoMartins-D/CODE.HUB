import { Account, Client, Storage, TablesDB } from "appwrite";

export const APPWRITE_ENDPOINT =
  import.meta.env.VITE_APPWRITE_ENDPOINT ?? "https://fra.cloud.appwrite.io/v1";
export const APPWRITE_PROJECT_ID =
  import.meta.env.VITE_APPWRITE_PROJECT_ID ?? "6a9967ac003755930956";
export const APPWRITE_DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID ?? "codehub";
export const APPWRITE_POST_MEDIA_BUCKET_ID =
  import.meta.env.VITE_APPWRITE_POST_MEDIA_BUCKET_ID ?? "post-media";
// O plano atual permite um bucket; mídias de perfil usam o mesmo bucket com permissões por arquivo.
export const APPWRITE_PROFILE_MEDIA_BUCKET_ID = APPWRITE_POST_MEDIA_BUCKET_ID;

export const appwriteClient = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(appwriteClient);
export const tables = new TablesDB(appwriteClient);
export const storage = new Storage(appwriteClient);
