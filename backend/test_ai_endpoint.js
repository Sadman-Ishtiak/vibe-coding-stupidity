import axios from 'axios';

const testAI = async () => {
  try {
    console.log('Testing AI Endpoint...');
    // Login to get token
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'john.doe@example.com', // Assuming this user exists from previous steps, or we might need to register
      password: 'password123'
    });
    
    const token = loginRes.data.token;
    console.log('Got Token:', token ? 'Yes' : 'No');

    // Call AI Endpoint
    const aiRes = await axios.post('http://localhost:5000/api/ai/analyze', 
      { resumeText: "I am a React developer with 2 years of experience." },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log('AI Response:', JSON.stringify(aiRes.data, null, 2));

  } catch (error) {
    if (error.response) {
       console.error('Error Status:', error.response.status);
       console.error('Error Data:', JSON.stringify(error.response.data));
    } else {
       console.error('Error Message:', error.message);
       console.error('Full Error:', error);
    }
  }
};

testAI();
