import { toast } from "sonner";

type ConfirmationOptions = {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void | Promise<void>;
};

export function requestConfirmation({
  title,
  description,
  confirmLabel = "Confirmer",
  onConfirm,
}: ConfirmationOptions) {
  toast(title, {
    description,
    duration: 10_000,
    action: {
      label: confirmLabel,
      onClick: () => {
        void onConfirm();
      },
    },
  });
}
