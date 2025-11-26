import PocketBase from 'pocketbase';
import { env } from '@/env';

const pb = new PocketBase(env.NEXT_PUBLIC_POCKETBASE_URL);

export default pb;
