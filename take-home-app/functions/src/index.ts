/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import admin from "firebase-admin";

admin.initializeApp();

export const filterByPrice = onRequest(async (request, response) => {
  const {maxPrice} = request.query;
  try {
    if (!maxPrice) {
      response.status(400).send("Missing required query param: maxPrice");
      return;
    }

    const snapshot = await admin.firestore()
      .collection("products")
      .where("price", "<=", Number(maxPrice))
      .get();

    const data = snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));
    response.status(200).json(data);
  } catch (error) {
    console.error("Error querying Firestore:", error);
    response.status(500).send("Internal Server Error");
  }
});