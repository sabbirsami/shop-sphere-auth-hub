export type User = {
  _id: string;
  username: string;
  email: string;
  shops: Shop[];
  role: string;
};

export type Shop = {
  name: string;
  displayName: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  data: {
    user: User;
    accessToken: string;
  };
};

export type RegisterFormData = {
  username: string;
  password: string;
  shops: { name: string }[];
};

export type LoginFormData = {
  username: string;
  password: string;
  rememberMe: boolean;
};
