import React from "react";

interface TextInput {
  value?: string;
  labelText: string;
  onTextChange: (text: string) => void;
  labelProps?: React.LabelHTMLAttributes<HTMLLabelElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}

export function LabelAndInput(props: TextInput) {
  return (
    <div>
      <label
        {...props.labelProps}
        className='block mb-2 text-sm font-medium text-gray-900'
      >
        {props.labelText}
      </label>
      <Input
        value={props.value}
        onTextChange={props.onTextChange}
        inputProps={props.inputProps}
      />
    </div>
  );
}

export function Input(props: {
  value?: string;
  onTextChange: (text: string) => void;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
}) {
  return (
    <input
      {...props.inputProps}
      value={props.value ?? ""}
      onChange={(e) => {
        e.preventDefault();
        props.onTextChange(e.target.value);
      }}
      className='bg-gray-50 border-1 border-gray-300 text-gray-900 text-base rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
    />
  );
}
