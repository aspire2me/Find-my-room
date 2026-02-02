import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import RunwayML from "@runwayml/sdk";
import { defineSecret } from "firebase-functions/params";

const runwayApiKey = defineSecret("RUNWAY_API_KEY");

export const pollVideoStatus = onCall(
  { secrets: [runwayApiKey], timeoutSeconds: 120, memory: "512MiB" },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Must be logged in");
    }

    const { conversionId } = request.data;

    if (!conversionId) {
      throw new HttpsError("invalid-argument", "Missing conversionId");
    }

    const db = getFirestore();
    const convRef = db.collection("conversions").doc(conversionId);
    const convDoc = await convRef.get();
    const data = convDoc.data();

    if (!convDoc.exists || data?.userId !== request.auth.uid) {
      throw new HttpsError("permission-denied", "Not your conversion");
    }

    if (data.status === "succeeded" || data.status === "failed") {
      return { status: data.status, videoURL: data.generatedVideoURL || undefined };
    }

    const client = new RunwayML({ apiKey: runwayApiKey.value() });
    const task = await client.tasks.retrieve(data.runwayTaskId);

    if (task.status === "SUCCEEDED" && task.output?.[0]) {
      const videoResponse = await fetch(task.output[0]);
      const videoBuffer = Buffer.from(await videoResponse.arrayBuffer());

      const bucket = getStorage().bucket();
      const videoPath = `users/${request.auth.uid}/videos/${conversionId}.mp4`;
      const file = bucket.file(videoPath);
      await file.save(videoBuffer, { contentType: "video/mp4" });
      await file.makePublic();
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${videoPath}`;

      await convRef.update({
        status: "succeeded",
        generatedVideoURL: publicUrl,
        generatedVideoPath: videoPath,
        completedAt: new Date(),
        updatedAt: new Date(),
      });

      return { status: "succeeded", videoURL: publicUrl };
    }

    if (task.status === "FAILED") {
      const errorMsg = task.failure || "Video generation failed";
      await convRef.update({
        status: "failed",
        errorMessage: errorMsg,
        updatedAt: new Date(),
      });
      return { status: "failed", error: errorMsg };
    }

    return { status: "processing", runwayStatus: task.status };
  }
);
