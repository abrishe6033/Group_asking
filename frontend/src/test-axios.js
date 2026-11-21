import axios from 'axios';

// Test GET request
axios.get('https://jsonplaceholder.typicode.com/posts/1')
  .then(response => {
    console.log('✅ Axios is working!');
    console.log('Data:', response.data);
  })
  .catch(error => {
    console.error('❌ Error:', error.message);
  });

// Test POST request
axios.post('https://jsonplaceholder.typicode.com/posts', {
  title: 'Test',
  body: 'Testing axios',
  userId: 1
})
  .then(response => {
    console.log('✅ POST request successful!');
  })
  .catch(error => {
    console.error('❌ POST error:', error.message);
  });
