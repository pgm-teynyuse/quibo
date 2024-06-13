import React, { useState } from "react";
import { NockBarBack } from "../NockBar/nock-bar";
import { ButtonIconSmall } from "../../components/Button/button";
import { IconSave } from "../../components/Icon/Icon";
import { Alert } from "@mui/material";

interface BookSettingsProps {
  onClose: () => void;
  booksPerRow: number;
  onBooksPerRowChange: (newBooksPerRow: number) => void;
  onSavePreferences: () => Promise<void>; // Veranderde functiehandtekening om met async functies om te gaan
}

const BookSettings: React.FC<BookSettingsProps> = ({
  onClose,
  booksPerRow,
  onBooksPerRowChange,
  onSavePreferences,
}) => {
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSave = async () => {
    try {
      await onSavePreferences();
      setShowSuccessAlert(true);
      setShowErrorAlert(false);
      setTimeout(() => setShowSuccessAlert(false), 3000); // Verberg de alert na 3 seconden
    } catch (error) {
      setShowErrorAlert(true);
      setShowSuccessAlert(false);
      setErrorMessage(
        "Er is iets misgegaan bij het opslaan van uw voorkeuren."
      );
      setTimeout(() => setShowErrorAlert(false), 3000); // Verberg de alert na 3 seconden
    }
  };

  return (
    <div className="fixed inset-0 mt-12 flex justify-center items-center z-50">
      <div className="bg-q_bright shadow-lg w-full h-full max-w-screen-lg max-h-screen-lg overflow-y-auto">
        <div className="p-4">
          <NockBarBack onClose={onClose} />
        </div>
        <div className="p-4">
          <div className="flex justify-between">
            <div className="w-5">
              <h1 className="text-titleNormal text-q_tertiairy mb-5">
                Bewerk <strong>boekenkast</strong>
              </h1>
            </div>
            <ButtonIconSmall
              content="Opslaan"
              icon={<IconSave className={""} />}
              onClick={handleSave}
              className="mb-4 text-q_tertiairy fill-q_tertiairy"
              type={"button"}
              borderColor="border-q_tertiairy"
            />
          </div>
          <div className="mb-4">
            <button
              onClick={() => onBooksPerRowChange(Math.max(booksPerRow - 1, 1))}
              className="mr-2 p-2 bg-q_primary-100 text-white rounded"
            >
              -
            </button>
            <span className="p-2">{booksPerRow} boeken per rij</span>
            <button
              onClick={() => onBooksPerRowChange(booksPerRow + 1)}
              className="ml-2 p-2 bg-q_primary-100 text-white rounded"
            >
              +
            </button>
          </div>
          {showSuccessAlert && (
            <div className="fixed top-4 right-6">
              <Alert
                severity="success"
                variant="filled"
                onClose={() => setShowSuccessAlert(false)}
              >
                Voorkeuren succesvol opgeslagen!
              </Alert>
            </div>
          )}
          {showErrorAlert && (
            <div className="fixed top-4  right-6">
              <Alert
                variant="filled"
                severity="error"
                onClose={() => setShowErrorAlert(false)}
              >
                {errorMessage}
              </Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookSettings;
