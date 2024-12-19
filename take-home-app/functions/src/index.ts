/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import cors from "cors";

admin.initializeApp();

const corsMiddleware = cors({ origin: true });

export const filterByPrice = onRequest(async (request, response) => {
  corsMiddleware(request, response, async () => {
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
      const documents = snapshot.docs;

      const scale = 100; // Scale factor for 2 decimal places
      const prices: number[] = documents.map(doc => Math.round(scale * doc.get("price")));
      const targetSum = Math.round(scale * Number(maxPrice));

      const dp: number[] = Array(targetSum + 1).fill(0);
      for (let i = 0; i <= prices.length; i++) {
        for (let j = targetSum; j >= prices[i]; j--) {
          dp[j] = Math.max(dp[j], dp[j - prices[i]] + prices[i]);
        }
      }
      
      const data: { id: string }[] = [];
      let k = targetSum;
      for (let i = prices.length - 1; i >= 0; i--) {
        if (k >= prices[i] && dp[k] === dp[k - prices[i]] + prices[i]) {
          data.push({ id: documents[i].id, ...documents[i].data() });
          k -= prices[i];
        }
      }

      response.status(200).json(data);
    } catch (error) {
      console.error("Error querying Firestore:", error);
      response.status(500).send("Internal Server Error");
    }
  })
});