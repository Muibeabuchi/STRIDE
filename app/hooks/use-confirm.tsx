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
import { Button, ButtonProps } from "@/components/ui/button";

interface useConfirmProps {
  title: string;
  description: string;
  variant: ButtonProps["variant"];
}

export const useConfirm = ({
  title,
  description,
  variant = "primary",
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
          <CardContent className="pt-8">
            <CardHeader className="p-0">
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <div className="pt-4 w-full gap-y-2 lg:gap-x-2 lg:items-center lg:justify-between  justify-between flex flex-col lg:flex-row ">
              <Button
                onClick={handleClose}
                variant="outline"
                className="w-full lg:w-aut0"
              >
                Close
              </Button>
              <Button
                variant={variant}
                className="w-full lg:w-aut0"
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
