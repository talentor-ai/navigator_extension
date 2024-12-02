import { Select as SelectComponent } from 'antd';

const Select = () => {
  return (
    <div className="">
      <SelectComponent
        className="w-full"
        size="small"
        style={{ height: '2.3rem' }}
        placeholder="Select an option"
        defaultValue="sample1"
        options={[
          { value: 'sample1', label: <span>sample 1</span> },
          { value: 'sample2', label: <span>sample 2</span> },
          { value: 'sample3', label: <span>sample 3</span> },
        ]}
      />
    </div>
  );
};

export default Select;
