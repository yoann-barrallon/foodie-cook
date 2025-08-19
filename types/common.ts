export interface SelectOption {
  value: string;
  label: string;
}

export interface LoadingState {
  loading: boolean;
  error: string | null;
}

export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export type Status = "idle" | "loading" | "success" | "error";

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt?: Date;
} 