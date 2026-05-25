/**
 * One source of truth for translating Firebase / Firestore errors into
 * user-friendly messages. Every place we display an error to the user
 * (toast, alert, error boundary) MUST go through `friendlyError()`.
 *
 * This guarantees the UI never leaks the raw "Missing or insufficient
 * permissions." string, regardless of which code path throws.
 */

const FIRESTORE_PERMISSION_RE = /missing or insufficient permissions/i;

export function isFirestorePermissionError(e: unknown): boolean {
  const code = (e as { code?: string } | null | undefined)?.code ?? "";
  const message = (e as { message?: string } | null | undefined)?.message ?? "";
  return (
    code === "permission-denied" ||
    code.includes("insufficient") ||
    FIRESTORE_PERMISSION_RE.test(message)
  );
}

export function friendlyError(e: unknown, fallback = "Something went wrong."): string {
  if (!e) return fallback;
  const err = e as { code?: string; message?: string };
  const code = err.code ?? "";
  const message = err.message ?? "";

  // Firestore: rules not deployed
  if (isFirestorePermissionError(e)) {
    return "Firestore rules aren't published yet. Open /help/firestore-rules to publish them — takes 30 seconds.";
  }

  // Firebase Auth — common errors
  switch (code) {
    case "auth/email-already-in-use":
      return "That email is already registered.";
    case "auth/invalid-email":
      return "That email address looks invalid.";
    case "auth/weak-password":
      return "That password is too weak (use 8+ characters).";
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Invalid email or password.";
    case "auth/user-not-found":
      return "No account with that email.";
    case "auth/user-disabled":
      return "This account has been disabled.";
    case "auth/too-many-requests":
      return "Too many attempts. Wait a moment and try again.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "Sign-in cancelled.";
    case "auth/popup-blocked":
      return "Popup blocked. Allow popups for this site and try again.";
    case "auth/unauthorized-domain":
      return "This domain isn't authorized for Firebase Auth. Add it in Firebase Console → Authentication → Settings → Authorized domains.";
    case "auth/operation-not-allowed":
      return "This sign-in provider isn't enabled. Enable it in Firebase Console → Authentication → Sign-in method.";
    case "auth/account-exists-with-different-credential":
      return "An account already exists with this email under a different sign-in method.";
    case "auth/network-request-failed":
      return "Network error. Check your connection and try again.";
    case "auth/requires-recent-login":
      return "Please sign in again before performing this action.";
  }

  // Firestore: other codes
  if (code === "unavailable" || code === "deadline-exceeded") {
    return "Couldn't reach the database. Check your connection and try again.";
  }
  if (code === "not-found") {
    return "We couldn't find that record.";
  }
  if (code === "already-exists") {
    return "That record already exists.";
  }

  // Last resort: never leak the raw "Missing or insufficient permissions"
  if (FIRESTORE_PERMISSION_RE.test(message)) {
    return "Firestore rules aren't published yet. Open /help/firestore-rules to publish them — takes 30 seconds.";
  }

  return message || fallback;
}
