# food-supplier-app

## Get started
1. Navigate to take-home-app directory

   ```bash
   cd take-home-app
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Start the app

   ```bash
    npx expo start
   ```

## Implementation Approach

In a new Firebase project, I created and populated a database with the provided Product Data.

Then I began server-side development by creating a filterByPrice Firebase cloud function
and deployed it via ```firebase deploy --only functions```

The front-end then takes a maxPrice user-input parameter and fetches the filterByPrice function
from its associated https URL to display a list of filtered products from the database.

## Trade-offs

After first deploying my function, it failed to fecth because it didn’t allow cross-origin requests (CORS)
by default. So, I added a new cors node dependency to allow requests from any origin. This however, makes my
cloud function less secure, since anyone, from anywhere can fetch without authentication.

## Challenges

The most difficult aspect of this project was by far configuring my tsconfig files. I was repeatedly running into issues
where I couldn't deploy my function since the ts compiler would complain about some import error in a random dependency file,
and I fixed this issue by explicitly telling the compiler to exclude my node_modules, which hopefully didn't break anything.