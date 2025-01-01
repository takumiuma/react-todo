// components/Modal.tsx
import React from "react";

interface ModalProps {
  isOpen: boolean; // モーダル表示のリアクティブなpropsを受け取る
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null; // モーダルおよび子要素は非表示

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="relative bg-white p-6 rounded-md w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          ✖️
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
