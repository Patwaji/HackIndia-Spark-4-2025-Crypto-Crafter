
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { AIThinkingIndicator } from '@/components/AIThinkingIndicator';

export default function AIRecipeGenerator() {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState<null | {
    name: string;
    ingredients: string[];
    instructions: string[];
    cookingTime: string;
    difficulty: string;
  }>(null);

  const generateRecipe = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/generate-recipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredients, cuisine })
      });
      const data = await response.json();
      setRecipe(data);
    } catch (error) {
      console.error('Failed to generate recipe:', error);
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">AI Recipe Generator</h1>
      
      <div className="grid gap-4 mb-6">
        <Input
          placeholder="Enter ingredients (comma separated)"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <Input
          placeholder="Enter preferred cuisine (optional)"
          value={cuisine}
          onChange={(e) => setCuisine(e.target.value)}
        />
        <Button onClick={generateRecipe} disabled={loading || !ingredients}>
          Generate Recipe
        </Button>
      </div>

      {loading && <AIThinkingIndicator aiThinkingStage="Generating your recipe..." />}

      {recipe && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{recipe.name}</h2>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Cooking Time: {recipe.cookingTime}</p>
            <p className="text-sm text-gray-600">Difficulty: {recipe.difficulty}</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Ingredients:</h3>
            <ul className="list-disc list-inside">
              {recipe.ingredients.map((ing, i) => (
                <li key={i}>{ing}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Instructions:</h3>
            <ol className="list-decimal list-inside">
              {recipe.instructions.map((step, i) => (
                <li key={i} className="mb-2">{step}</li>
              ))}
            </ol>
          </div>
        </Card>
      )}
    </div>
  );
}
