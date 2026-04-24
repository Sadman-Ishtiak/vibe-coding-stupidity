import axios from 'axios';

const testSearch = async () => {
  try {
    console.log('Testing Search...');
    // Search for "React"
    const res = await axios.get('http://localhost:5000/api/internships', {
      params: { search: 'React' }
    });
    
    console.log(`Found ${res.data.length} results for "React"`);
    if (res.data.length > 0) {
        console.log('First result title:', res.data[0].title);
    }

    // Search for "Marketing" category
    const res2 = await axios.get('http://localhost:5000/api/internships', {
      params: { category: 'Marketing' }
    });
    console.log(`Found ${res2.data.length} results for Category "Marketing"`);

  } catch (error) {
    if (error.response) {
       console.error('Error Status:', error.response.status);
       console.error('Error Data:', JSON.stringify(error.response.data));
    } else {
       console.error('Error Message:', error.message);
    }
  }
};

testSearch();
