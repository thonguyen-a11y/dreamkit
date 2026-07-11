import { ADMIN_HOME_PATH, isAdmin } from "./auth";
import type { AuthUser } from "./types";

/**
 * Returns the post-login redirect path for admins.
 * Normal users stay on the current page (handled via router.refresh()).
 */
export function getPostLoginRedirect(user: AuthUser): string | null {
  return isAdmin(user) ? ADMIN_HOME_PATH : null;
}
