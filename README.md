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
that responds with all products whose price falls at or below the given maxPrice, in json format,
which is then deployed via ```firebase deploy --only functions```
Update: filterByPrice now returns a list of products whose sum of its prices are as close to or equal to maxPrice.


The front-end then takes a maxPrice user-input parameter and fetches the filterByPrice function
from its associated https URL to display a list of filtered products from the function response.

## Trade-offs

After first deploying my function, it failed to fetch because it didn’t allow cross-origin requests (CORS)
by default. So, I added a new CORS node dependency to allow requests from any origin. This however, makes my
cloud function less secure, since anyone, from anywhere can fetch without authentication.

## Challenges

The most difficult aspect of this project was by far configuring my tsconfig files. I was repeatedly running into issues
where I couldn't deploy my function since the ts compiler would complain about some import error in a random dependency file,
and I fixed this issue by explicitly telling the compiler to exclude my node_modules, which hopefully didn't break anything.

## Changes

If I had unlimited time to make changes, I would start by adding user authentication to provide more security for my database by not allowing arbitrary fetch requests. I would also create a way for users to populate the database with products of their own, since it currently only has the products I initially populated it with. Another thing I would consider is removing my cloud function altogether, and instead prefer to read from the database on the client side, which would remove the need to continually deploy my function to firebase whenever updates are needed.
With regards to optimizations, I would consider disallowing the user to input a maxPrice so large that it impacts performance, since memory usage scales linearly with the maxPrice in my algorithm. 