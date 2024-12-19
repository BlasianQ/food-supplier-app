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

      const scale = 100; // Used to scale up decimal numbers to integers
      const prices: number[] = documents.map(doc => Math.round(scale * doc.get("price")));
      const targetSum = Math.round(scale * Number(maxPrice));

      const dp: number[][] = Array.from({ length: prices.length + 1 }, () => Array(targetSum + 1).fill(0));
      for (let i = 1; i <= prices.length; i++) {
        for (let j = 0; j <= targetSum; j++) {
          if (prices[i - 1] > j) {
            dp[i][j] = dp[i - 1][j];
          } else {
            dp[i][j] = Math.max(
                dp[i - 1][j],
                dp[i - 1][j - prices[i - 1]] + prices[i - 1]
            );
          }
        }
      }
      
      const data: { id: string }[] = [];
      let k = targetSum;
      for (let i = prices.length; i > 0; i--) {
        if (dp[i][k] !== dp[i - 1][k]) {
          data.push({ id: documents[i - 1].id, ...documents[i - 1].data() });
          k -= prices[i - 1];
        }
      }

      response.status(200).json(data);
    } catch (error) {
      console.error("Error querying Firestore:", error);
      response.status(500).send("Internal Server Error");
    }
  })
});