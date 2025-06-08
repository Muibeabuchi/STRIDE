"use client";

import { useState } from "react";

import { ResponsiveModal } from "@/components/responsive-modal";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, ButtonVariants } from "@/components/ui/button";

interface useConfirmProps {
  title: string;
  description: string;
  variant: ButtonVariants["variant"];
}

export const useConfirm = ({
  title,
  description,
  variant = "default",
}: useConfirmProps) => {
  const [promise, setPromise] = useState<{
    resolve: (value: unknown) => void;
  } | null>(null);

  const confirm = () => {
    return new Promise((resolve) => {
      setPromise({ resolve });
    });
  };

  const handleClose = () => {
    setPromise(null);
  };
  const handleConfirm = async () => {
    promise?.resolve(true);
    handleClose();
  };

  const ConfirmationDialog = () => {
    return (
      <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
        <Card className="w-full h-full border-none shadow-none">
          <CardContent className="pt-4">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <div className="pt-4 w-full gap-y-2 lg:gap-x-2 lg:items-center lg:justify-end    flex flex-col lg:flex-row ">
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full lg:w-[30%] "
              >
                Close
              </Button>
              <Button
                variant={variant}
                className="w-full lg:w-[30%]"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>
      </ResponsiveModal>
    );
  };

  return [confirm, ConfirmationDialog] as const;
};
