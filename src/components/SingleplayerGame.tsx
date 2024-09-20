"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";
import { useRouter } from "next/navigation";

interface Category {
  id: number;
  name: string;
}

export default function SingleplayerGame() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(Number(categoryId));
  };

  const startGame = () => {
    if (selectedCategory) {
      router.push(
        `/app/play/ingame?mode=singleplayer&category=${selectedCategory}`
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Einzelspieler</h1>
      <p>Wähle eine Kategorie.</p>
      <Select onValueChange={handleCategorySelect}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Wähle eine Kategorie" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.id.toString()}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="p-6"
        onClick={startGame}
        disabled={selectedCategory === null}
      >
        Quiz starten
      </Button>
    </div>
  );
}
