type RecordFormProps<T extends Record<string, unknown>> = {
  record: T;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof T, // 該輸入欄位對應記錄的哪個屬性
  ) => void;
  onSalaryChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onEdit: () => void;
  onDelete: () => void;
};

function formatDate(dateString: string) {
  if (!dateString || new Date(dateString).toString() === 'Invalid Date') {
    return '';
  }

  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

const RecordForm = <T extends Record<string, unknown>>({
  record,
  onInputChange,
  onSalaryChange,
  onEdit,
  onDelete,
}: RecordFormProps<T>) => {
  return (
    <tr>
      <td data-label="Name">
        <input
          type="text"
          value={record['Name'] as string | undefined}
          onChange={(e) => onInputChange(e, 'Name')}
          readOnly={!record.isEditing}
          required
        />
      </td>
      <td data-label="Date Of Birth">
        <input
          type="date"
          value={formatDate(record.DateOfBirth as string)}
          onChange={(e) => onInputChange(e, 'DateOfBirth')}
          readOnly={!record.isEditing}
          required
        />
      </td>
      <td data-label="Salary">
        <input
          type="range"
          min="0"
          max="100000"
          value={record['Salary'] as string | undefined}
          onChange={onSalaryChange}
          disabled={!record.isEditing}
          required
        />
        <span>
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0,
          }).format(record.Salary as number)}
        </span>
      </td>
      <td data-label="Address">
        <input
          type="text"
          value={record['Address'] as string | undefined}
          onChange={(e) => onInputChange(e, 'Address')}
          readOnly={!record.isEditing}
          required
        />
      </td>
      <td>
        <button className="btn btn-edit" onClick={onEdit}>
          {/* 根據是否處於編輯模式顯示不同文字 */}
          {record.isEditing ? 'Save' : 'Edit'}
        </button>
        <button className="btn btn-delete" onClick={onDelete}>
          Delete
        </button>
      </td>
    </tr>
  );
};

export default RecordForm;
