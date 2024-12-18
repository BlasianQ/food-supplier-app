import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

interface Produce {
  id: string;
  name: string;
  price: number;
  description: string;
  quantity: number;
}

const App: React.FC = () => {
  const [maxPrice, setMaxPrice] = useState<string>(''); // Holds user input
  const [data, setData] = useState<Produce[]>([]); // Holds API data
  const [loading, setLoading] = useState<boolean>(false); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state

  // Function to fetch data from the Firebase Cloud Function
  const fetchFilteredData = async (): Promise<void> => {
    if (!maxPrice || !/^(?:[1-9]\d*|0)?(?:\.\d+)?$/.test(maxPrice)) {
      setError('Please enter a valid max price.');
      return;
    }
    setError(null); // Clear previous errors
    setLoading(true); // Start loading

    try {
      const response = await fetch(
        `https://us-central1-food-supplier-e5421.cloudfunctions.net/filterByPrice?maxPrice=${maxPrice}`
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const result: Produce[] = await response.json();
      setData(result); // Set the data
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Max Price:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter max price"
        value={maxPrice}
        keyboardType="numeric"
        onChangeText={setMaxPrice} // Update maxPrice state
      />
      <Button title="Filter Products" onPress={fetchFilteredData} />
      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.price}>Price: ${item.price}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
        ListEmptyComponent={() =>
          !loading && !error ? (
            <Text style={styles.emptyText}>No products found.</Text>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: 'green',
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  errorText: {
    color: 'red',
    marginVertical: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    color: '#555',
  },
});

export default App;


// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }
