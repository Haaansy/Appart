import { View, Text, Button, TextInput, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '@/app/Firebase/FirebaseConfig';

const AITest = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');

  const searchApartments = async () => {
    if (!query.trim()) {
      setResponse('Please enter a search query');
      return;
    }
    
    try {
      setLoading(true);
      
      // Initialize Firebase if not already initialized
      const app = initializeApp(firebaseConfig);
      const functions = getFunctions(app);
      
      // Call the cloud function
      const searchFunction = httpsCallable(functions, 'searchApartments');
      const result = await searchFunction({ query });
      
      // Format the response for display
      const data = result.data as { success: boolean, results?: any[], error?: string };
      
      if (data.success && data.results) {
        if (data.results.length === 0) {
          setResponse('No matching apartments found');
        } else {
          const formattedResults = data.results.map((apt, index) => 
            `${index + 1}. ${apt.title || 'Unnamed'} - Similarity: ${(apt.similarity * 100).toFixed(2)}%`
          ).join('\n\n');
          
          setResponse(`Found ${data.results.length} matching apartments:\n\n${formattedResults}`);
        }
      } else {
        setResponse(`Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error calling search function:', error);
      setResponse(`Error: ${error.message || 'Failed to search apartments'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Apartment Search Test</Text>
      
      <TextInput
        placeholder="Enter search query (e.g. 'modern apartment with pool')"
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: '#ccc',
          borderRadius: 5,
          padding: 10,
          marginBottom: 20
        }}
      />
      
      <Button 
        title={loading ? "Searching..." : "Search Apartments"} 
        onPress={searchApartments}
        disabled={loading}
      />
      
      {loading && (
        <View style={{ marginTop: 20, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Searching apartments...</Text>
        </View>
      )}
      
      {response && (
        <ScrollView 
          style={{ 
            marginTop: 20, 
            padding: 10, 
            backgroundColor: '#f0f0f0', 
            borderRadius: 5,
            maxHeight: 400
          }}
        >
          <Text>{response}</Text>
        </ScrollView>
      )}
    </View>
  );
};

export default AITest;