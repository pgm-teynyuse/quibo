"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useUser } from "../../contexts/UserContext";
import React from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import Webcam from "react-webcam";
import { IconSearch, IconBarcode } from "../Icon/Icon";
import { ButtonIcon } from "components/Button/button";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface BookData {
  id: any;
  title: string;
  authors: string[];
  publishedDate?: string;
  description?: string;
  pageCount?: number;
  categories?: string[];
  thumbnail?: string;
  isbn: string;
}

const AddBook: React.FC = () => {
  const [isbn, setIsbn] = useState<string>("");
  const [book, setBook] = useState<BookData | null>(null);
  const [message, setMessage] = useState<string>("");
  const [swap, setSwap] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const [severity, setSeverity] = useState<"success" | "error">("success");
  const [useFrontCamera, setUseFrontCamera] = useState<boolean>(true);
  const { user } = useUser();
  const webcamRef = useRef<Webcam>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL environment variable is not defined");
  }

  const searchBook = async (isbnToSearch: string) => {
    try {
      const response = await axios.get<BookData>(
        `${apiUrl}/search-book/${isbnToSearch}`
      );
      setBook(response.data);
      setMessage("");
    } catch (error) {
      console.error("Error searching for book:", error);
      setMessage("Error searching for book");
      setSeverity("error");
      setOpen(true);
    }
  };

  const addBookToShelf = async () => {
    if (!book) return;

    try {
      const bookResponse = await axios.post<BookData>(
        `${apiUrl}/add-book`,
        book
      );
      const bookId = bookResponse.data.id;

      await axios.post(
        `${apiUrl}/add-to-shelf`,
        { bookId, swap },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Book added to your shelf!");
      setSeverity("success");
      setOpen(true);
    } catch (error) {
      console.error("Error adding book to shelf:", error);
      setMessage("Error adding book to shelf");
      setSeverity("error");
      setOpen(true);
    }
  };

  useEffect(() => {
    if (isbn) {
      searchBook(isbn);
    }
  }, [isbn]);

  const handleScan = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        const codeReader = new BrowserMultiFormatReader();
        try {
          const result = await codeReader.decodeFromImage(undefined, imageSrc);
          setIsbn(result.getText());
          setScanning(false);
        } catch (error) {
          if (error instanceof NotFoundException) {
            console.error("Error decoding barcode: No barcode found in image");
            setMessage("Error decoding barcode: No barcode found in image");
          } else {
            console.error("Error decoding barcode:", error);
            setMessage("Error decoding barcode");
          }
          setSeverity("error");
          setOpen(true);
        }
      } else {
        console.error("Error capturing image from webcam");
        setMessage("Error capturing image from webcam");
        setSeverity("error");
        setOpen(true);
      }
    }
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleCameraSwitch = () => {
    setUseFrontCamera((prev) => !prev);
  };

  return (
    <div
      className="flex flex-col w-full overflow-auto"
      style={{ maxHeight: "70vh" }}
    >
      <h1 className="text-q_primary-100 font-semibold text-titleNormal">
        Boeken toevoegen
      </h1>
      <p className="text-q_primary-100 text-label mb-5">
        Zodat je boeken kunt ruilen en beheren
      </p>
      <form className="flex h-11 items-center w-full max-w-lg bg-gray-200 rounded-full p-2 mb-4">
        <input
          type="text"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
          placeholder="Geef de ISBN nummer"
          className="bg-gray-200 w-full border-none focus:outline-none p-2"
        />
        <button
          type="button"
          onClick={() => searchBook(isbn)}
          className="ml-2 p-2 "
        >
          <IconSearch className="fill-q_primary-100" />
        </button>
      </form>
      <ButtonIcon
        content={scanning ? "Stop Scanning" : "Scan Barcode"}
        onClick={() => setScanning(!scanning)}
        className="mb-4"
        type={"button"}
        subtext="Scan de barcode van het boek"
        icon={<IconBarcode className={"fill-q_primary-100 ml-2 mt-2"} />}
      />
      {scanning && (
        <>
          <button
            onClick={handleCameraSwitch}
            className="mb-4 w-60 p-2 bg-q_primary-100 text-white rounded-full"
          >
            {useFrontCamera ? "Achter" : "Voor"} Camera
          </button>
          <div className="w-full max-w-lg">
            <div className="webcam-small">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={{
                  facingMode: useFrontCamera ? "user" : "environment",
                }}
                className="w-full h-full rounded-md"
              />
            </div>
            <button
              type="button"
              onClick={handleScan}
              className="mt-2 p-2 bg-q_primary-100 text-white rounded-full w-full"
            >
              Scan
            </button>
          </div>
        </>
      )}
      {book && (
        <div className="shadow-md rounded-lg p-4 w-full max-w-lg">
          <div className="flex">
            {book.thumbnail && (
              <img
                src={book.thumbnail}
                alt={book.title}
                className="w-24 h-32 mt-2 rounded-md"
              />
            )}
            <div className="ml-2">
              <h2 className="text-lg font-bold">{book.title}</h2>
              <p className="text-gray-600">{book.authors.join(", ")}</p>
            </div>
          </div>
          <label className="flex items-center mt-4">
            <input
              type="checkbox"
              checked={swap}
              onChange={(e) => setSwap(e.target.checked)}
              className="mr-2"
            />
            Beschikbaar voor ruilen
          </label>
          <button
            onClick={addBookToShelf}
            className="mt-4 p-2 bg-q_primary-100 text-white rounded-full w-full"
          >
            Toevoegen
          </button>
        </div>
      )}

      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddBook;
