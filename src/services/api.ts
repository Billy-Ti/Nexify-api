import axios from 'axios';

export const fetchRecords = async () => {
  try {
    const response = await axios.get(
      'http://nexifytw.mynetgear.com:45000/api/Record/GetRecords',
    );
    if (response.data.Success && Array.isArray(response.data.Data)) {
      return response.data.Data;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Failed to fetch records');
  }
};
