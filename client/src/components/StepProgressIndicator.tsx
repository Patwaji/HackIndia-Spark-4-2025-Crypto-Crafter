import React from "react";
import { StepProgressIndicatorProps, FormStep } from "@/types/mealplanner";

const StepProgressIndicator = ({ currentStep }: StepProgressIndicatorProps) => {
  const steps = [
    { number: 1, label: "Preferences" },
    { number: 2, label: "Health Goals" },
    { number: 3, label: "Budget" },
    { number: 4, label: "Results" }
  ];

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center w-full max-w-3xl mx-auto">
        {/* Step circles with connecting lines */}
        {steps.map((step, index) => [
          <div key={`circle-${index}`} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full ${
                index <= currentStep 
                  ? "bg-primary text-white" 
                  : "bg-neutral-medium text-white"
              } flex items-center justify-center font-medium text-sm`}
            >
              {step.number}
            </div>
            <span className={`mt-2 text-sm font-medium ${
              index <= currentStep 
                ? "text-primary" 
                : "text-neutral-dark"
            }`}>
              {step.label}
            </span>
          </div>,
          
          index < steps.length - 1 && (
            <div key={`line-${index}`} className="relative flex-1 h-1 bg-neutral-medium mx-2">
              <div 
                className="absolute top-0 left-0 bottom-0 bg-primary transition-all duration-500"
                style={{ 
                  width: index < currentStep ? '100%' : '0%',
                  height: '100%'
                }}
              />
            </div>
          )
        ].filter(Boolean))}
      </div>
    </div>
  );
};

export default StepProgressIndicator;
