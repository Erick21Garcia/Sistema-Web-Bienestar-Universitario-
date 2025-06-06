import React from 'react';
import { Field, ErrorMessage } from 'formik';

interface CustomInputProps {
  name: string;
  placeholder: string;
  type: string;
  values?: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ name, placeholder, type, values }) => {
  return (
    <div className="relative">
      <Field
        type={type}
        name={name}
        value={values}
        placeholder={placeholder}
        className="w-full px-4 py-3 text-gray-700 bg-transparent border-b-2 border-gray-300 focus:outline-none focus:border-blue-500"
      />
      <ErrorMessage name={name} component="div" className="text-sm text-red-600" />
    </div>
  );
};

export default CustomInput;
