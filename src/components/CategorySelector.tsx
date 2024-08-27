"use client";

import React from "react";
import { Tables } from "@/types/database.types";

let categoriesType: Tables<"categories">;

type Props = {
  categories: Array<typeof categoriesType>;
  selectedCategory: typeof categoriesType | null;
  onCategoryChange: (category: typeof categoriesType) => void;
};

export function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
}: Props) {
  return (
    <div className="input-group">
      <label>Kategorie auswählen</label>
      <select
        value={selectedCategory?.name || ""}
        onChange={(e) =>
          onCategoryChange(categories.find((el) => el.name === e.target.value)!)
        }
      >
        <option value="">Kategorie wählen</option>
        {categories.map((category, index) => (
          <option key={index} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
