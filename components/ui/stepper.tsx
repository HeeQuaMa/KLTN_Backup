import React from "react";
import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number;
}

const steps = ["Giỏ hàng", "Thanh toán", "Hoàn tất"];

export function Stepper({ currentStep }: StepperProps) {
  return (
    <div className="hidden items-center text-sm font-semibold md:flex">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isActive = stepNum === currentStep;
        const isCompleted = stepNum < currentStep;

        return (
          <React.Fragment key={step}>
            <div
              className={cn(
                "flex items-center gap-2 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <span
                className={cn(
                  "flex items-center justify-center rounded-full text-xs transition-colors",
                  // checkout style used h-5 w-5 or h-6 w-6, let's normalize to h-6 w-6
                  "h-6 w-6",
                  isActive || isCompleted
                    ? "bg-primary text-white"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {stepNum}
              </span>
              {step}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mx-4 h-px w-10 md:w-12 transition-colors",
                  isCompleted ? "bg-primary" : "bg-border"
                )}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
