import axios from "axios";

const domain = "http://localhost:8080";

interface ResponseUser {
  id: { value: number };
  name: { value: string };
  email: { value: string };
  phone_number: { value: boolean };
}

interface RequestUser {
  id: number | undefined;
  name: string;
  email: string;
  phoneNumber: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone_number: boolean;
}

const fetchUsers = async (): Promise<User[]> => {
  return await axios
    .get(`${domain}/v1/users`)
    .then((response) => {
      return response.data.users.map((todo: ResponseUser) => ({
        id: todo.id.value,
        name: todo.name.value,
        email: todo.email.value,
        phoneNumber: todo.phone_number.value,
      }));
    })
    .catch(() => {
      return [];
    });
};
const registUser = async (payload: RequestUser) => {
  await axios.post(`${domain}/v1/users`, payload).catch((error) => {
    console.error("Error regist user:", error);
  });
};

export const useUserService = () => ({
  fetchUsers,
  registUser,
});
