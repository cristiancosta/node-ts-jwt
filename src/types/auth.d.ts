export type SignUpDto = {
  username: string;
  password: string;
};

export type SignUpResponse = {
  id: number;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

export type AuthService = {
  signUp: (signUpDto: SignUpDto) => Promise<SignUpResponse>;
};
