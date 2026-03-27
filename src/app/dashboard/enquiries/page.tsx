/**
 * /dashboard/enquiries — server component entry point.
 * Auth is enforced by middleware.ts — by the time this renders, the session is valid.
 * Reads the admin identity from the cookie to pass to the client component.
 */

import { cookies } from 'next/headers';
import { verifyToken, COOKIE_NAME } from '@/lib/auth';
import EnquiriesClient from './EnquiriesClient';

export default async function EnquiriesPage() {
  // Cookie already verified by middleware — this is just to extract the adminId
  // for display in the UI. Falls back gracefully if something unexpected happens.
  let adminId = 'admin';
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (token) {
      const payload = await verifyToken(token);
      if (payload) adminId = payload.adminId;
    }
  } catch {
    // Non-critical — middleware already ensured auth
  }

  return <EnquiriesClient adminId={adminId} />;
}
