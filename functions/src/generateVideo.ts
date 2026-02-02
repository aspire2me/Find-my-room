import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import RunwayML from "@runwayml/sdk";
import { defineSecret } from "firebase-functions/params";

const runwayApiKey = defineSecret("RUNWAY_API_KEY");

export const generateVideo = onCall(
  { secrets: [runwayApiKey], timeoutSeconds: 60, memory: "256MiB" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const { conversionId, photoURL, promptText, duration } = request.data;

    if (!conversionId || !photoURL) {
      throw new HttpsError("invalid-argument", "Missing required fields");
    }

    const db = getFirestore();
    const convRef = db.collection("conversions").doc(conversionId);
    const convDoc = await convRef.get();

    if (!convDoc.exists || convDoc.data()?.userId !== request.auth.uid) {
      throw new HttpsError("permission-denied", "Not your conversion");
    }

    const client = new RunwayML({ apiKey: runwayApiKey.value() });

    const task = await client.imageToVideo.create({
      model: "gen3a_turbo",
      promptImage: photoURL,
      promptText: promptText || "Gentle cinematic motion, nostalgic warm tones, subtle animation",
      ratio: "1280:768",
      duration: duration || 5,
    });

    await convRef.update({
      status: "processing",
      runwayTaskId: task.id,
      model: "gen3a_turbo",
      updatedAt: new Date(),
    });

    return { taskId: task.id, status: "processing" };
  }
);
