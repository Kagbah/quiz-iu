// types.ts
export type Category = {
    id: number;
    name: string;
    createdAt: string;
    createdBy: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
  };
  
  export type Question = {
    id: number;
    categoryId: number;
    questionText: string;
    options: string | string[]; // options kann entweder ein String oder ein Array von Strings sein
    correctAnswer: string;
    createdAt: string;
    createdBy: string;
    updatedAt?: string | null;
    updatedBy?: string | null;
  };