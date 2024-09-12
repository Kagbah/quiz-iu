export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          createdAt: string;
          createdBy: string;
          id: number;
          name: string;
        };
        Insert: {
          createdAt?: string;
          createdBy: string;
          id?: number;
          name: string;
        };
        Update: {
          createdAt?: string;
          createdBy?: string;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      lobbies: {
        Row: {
          createdBy: string;
          id: number;
          maxPlayers: number;
          name: string;
          private: boolean;
        };
        Insert: {
          createdBy?: string;
          id?: number;
          maxPlayers?: number;
          name: string;
          private?: boolean;
        };
        Update: {
          createdBy?: string;
          id?: number;
          maxPlayers?: number;
          name?: string;
          private?: boolean;
        };
        Relationships: [];
      };
      lobbies_user: {
        Row: {
          lobbies_id: number;
          user_id: string;
        };
        Insert: {
          lobbies_id: number;
          user_id: string;
        };
        Update: {
          lobbies_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "lobbies_user_lobbies_id_fkey";
            columns: ["lobbies_id"];
            isOneToOne: false;
            referencedRelation: "lobbies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "lobbies_user_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      questions: {
        Row: {
          categoryId: number;
          correctAnswer: string;
          createdAt: string;
          createdBy: string;
          id: number;
          options: string;
          questionText: string;
          updatedAt: string | null;
          updatedBy: string | null;
        };
        Insert: {
          categoryId: number;
          correctAnswer: string;
          createdAt?: string;
          createdBy: string;
          id?: number;
          options: string;
          questionText: string;
          updatedAt?: string | null;
          updatedBy?: string | null;
        };
        Update: {
          categoryId?: number;
          correctAnswer?: string;
          createdAt?: string;
          createdBy?: string;
          id?: number;
          options?: string;
          questionText?: string;
          updatedAt?: string | null;
          updatedBy?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "questions_categoryId_fkey";
            columns: ["categoryId"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      role: {
        Row: {
          description: string;
          id: number;
        };
        Insert: {
          description: string;
          id?: number;
        };
        Update: {
          description?: string;
          id?: number;
        };
        Relationships: [];
      };
      user_role: {
        Row: {
          id: number;
          role_id: number;
          user_id: string;
        };
        Insert: {
          id?: number;
          role_id: number;
          user_id: string;
        };
        Update: {
          id?: number;
          role_id?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_role_role_id_fkey";
            columns: ["role_id"];
            isOneToOne: false;
            referencedRelation: "role";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_role_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R;
    }
    ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    }
    ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    }
    ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;
