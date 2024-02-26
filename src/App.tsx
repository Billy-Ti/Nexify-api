import axios from 'axios';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import RecordForm from './components/RecordForm';
import { fetchRecords } from './services/api';
import { showNotification } from './utils/notifications';

type Record = {
  Name: string;
  DateOfBirth: string;
  Salary: number;
  Address: string;
  isEditing?: boolean;
};

const App: React.FC = () => {
  const [records, setRecords] = useState<Record[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // 取得 API 資料
  const fetchInitialRecords = async () => {
    setLoading(true);
    try {
      const data = await fetchRecords();
      setRecords(data);
    } catch (error: unknown) {
      console.error('Error of save:', (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: keyof Record,
  ) => {
    const newRecords = [...records];
    newRecords[index] = { ...newRecords[index], [field]: e.target.value };
    setRecords(newRecords);
  };

  const handleSalaryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newSalary = e.target.value;
    setRecords(
      records.map((record, idx) =>
        idx === index ? { ...record, Salary: parseFloat(newSalary) } : record,
      ),
    );
  };

  const handleAdd = () => {
    const newRecord: Record = {
      Name: '',
      DateOfBirth: '',
      Salary: 0,
      Address: '',
      isEditing: true, // 新記錄應該要能編輯
    };
    setRecords([newRecord, ...records]);
  };

  const handleEdit = (index: number) => {
    setRecords(
      records.map((record, idx) =>
        idx === index ? { ...record, isEditing: !record.isEditing } : record,
      ),
    );
  };

  const handleDelete = (index: number) => {
    setRecords((prevRecords) => prevRecords.filter((_, i) => i !== index));
    showNotification('記錄已成功刪除！', 'success', { position: 'top-center' });
  };

  // 儲存 Save & 驗證是否為空
  const handleSave = async () => {
    try {
      const isEmptyField = records.some(
        (record) =>
          !record.Name ||
          !record.DateOfBirth ||
          !record.Salary ||
          !record.Address,
      );

      if (isEmptyField) {
        showNotification('請填寫所有欄位！', 'error');
        return;
      }

      // 發送給 API 的資料
      const requestData = records.map(
        ({ Name, DateOfBirth, Salary, Address }) => ({
          Name,
          DateOfBirth: DateOfBirth.split('T')[0], // 只取日期部分
          Salary,
          Address,
        }),
      );

      console.log('Post Data:', requestData);
      const response = await axios.post(
        'http://nexifytw.mynetgear.com:45000/api/Record/SaveRecords',
        records, // 將當前輸入的資料作為參數傳送
      );
      if (response.data.Success) {
        console.log('Saved successfully');
        showNotification('記錄已保存成功！', 'success');
      } else {
        console.error('Save failed:', response.data.Msg);
        showNotification('記錄保存失敗！', 'error');
      }
    } catch (error) {
      console.error('An error occurred while saving:', error);
    }
  };

  return (
    <div className="container">
      <div className="button-group">
        <button className="add-btn" onClick={handleAdd}>
          Add
        </button>
        <button className="save-btn" onClick={handleSave}>
          Save
        </button>
        <button className="update-btn" onClick={fetchInitialRecords}>
          Update
        </button>
        <Toaster />
      </div>
      <div className="loading">{loading}</div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Birthday</th>
            <th>Salary</th>
            <th>Address</th>
            <th>Option</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record, index) => (
            <RecordForm
              key={index}
              record={record}
              onInputChange={(e, field) => handleInputChange(e, index, field)}
              onSalaryChange={(e) => handleSalaryChange(e, index)}
              onEdit={() => handleEdit(index)}
              onDelete={() => handleDelete(index)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
