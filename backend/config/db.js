import mongoose from "mongoose";

/**
 * Fails fast instead of hanging for 30s when Atlas is unreachable. The most
 * common causes, in order: this machine's IP missing from Network Access, a
 * wrong database user/password, or the cluster still waking up (M0 shared tier
 * pauses after inactivity). A short timeout turns a silent hang into a
 * readable error within ~8 seconds.
 */
const CONNECT_OPTIONS = {
  serverSelectionTimeoutMS: 8000,
  socketTimeoutMS: 45000,
};

/** Hides credentials so the URI stays safe to print in logs. */
function redact(uri) {
  return uri.replace(/\/\/[^@]*@/, "//<credentials>@");
}

export async function connectDB() {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is not set. Add it to backend/.env");
    process.exit(1);
  }

  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    console.error(`[db] MONGO_URI is not a MongoDB URI: ${redact(uri)}`);
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri, CONNECT_OPTIONS);
    const { host, name } = conn.connection;
    console.log(`[db] MongoDB connected — database "${name}" on ${host}`);
  } catch (err) {
    console.error("[db] MongoDB connection failed:", err.message);
    console.error(`[db] URI tried: ${redact(uri)}`);

    if (err.name === "MongoServerSelectionError" || /timed out/i.test(err.message)) {
      console.error(
        "[db] Likely cause: this IP is not in Atlas Network Access, or the " +
          "cluster is paused. Check cloud.mongodb.com -> Network Access, and " +
          "resume the cluster."
      );
    }
    if (/authentication failed|invalid credential|not authorized|AuthenticationFailed/i.test(err.message)) {
      console.error(
        "[db] Likely cause: wrong database user/password, or a password " +
          "containing characters that need URL-encoding (%40 for @, %3A for :, " +
          "%23 for #, %25 for %)."
      );
    }
    if (/querySrv|EAI_AGAIN|ENOTFOUND|getaddrinfo/i.test(err.message)) {
      console.error(
        "[db] Likely cause: the DNS SRV lookup for the Atlas hostname failed — " +
          "re-check the hostname in MONGO_URI, or a firewall/VPN blocking DNS."
      );
    }

    process.exit(1);
  }
}
