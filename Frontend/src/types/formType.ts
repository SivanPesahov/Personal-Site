export type FormItemForRegister = {
  name: "username" | "firstName" | "lastName" | "email" | "password";
  placeholder: string;
  inputType?: "text" | "email" | "password";
  label: string;
};

export type FormItemForLogin = Omit<FormItemForRegister, "name"> & {
  name: "username" | "password";
};
