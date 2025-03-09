import { View, Text, Button } from 'react-native';
import { useState } from 'react';

// Mock AI service to replace Genkit implementation
const mockAiResponse = async (prompt: string) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Return a mock response based on the input
  return `Hello! I received your message: "${prompt}". How can I assist you today?`;
};

const AITest = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateResponse = async () => {
    setLoading(true);
    try {
      const name = 'Chris';
      const text = await mockAiResponse(`Hello Gemini, my name is ${name}`);
      setResponse(text);
    } catch (error) {
      console.error('Error generating response:', error);
      setResponse('Error generating response');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>AITest</Text>
      <Button title="Say Hello to AI (Mock)" onPress={handleGenerateResponse} />
      
      {loading && <Text>Loading response...</Text>}
      
      {response && (
        <View style={{ marginTop: 20, padding: 10, backgroundColor: '#f0f0f0', borderRadius: 5 }}>
          <Text>{response}</Text>
        </View>
      )}
    </View>
  );
};

export default AITest;