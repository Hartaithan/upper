"use client";
import { FC } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const UpButton: FC = () => {
  const manualUp = async () => {
    if (!API_URL) {
      alert("Unable to get ENV variables");
      return;
    }
    const upRequest = await fetch(API_URL + "/up");
    if (!upRequest.ok) {
      const response = await upRequest.text();
      alert(response);
      return;
    }
    const upResponse = upRequest.json();
    console.log("upResponse", upResponse);
  };

  return (
    <button
      className="bg-neutral-900 hover:bg-neutral-950 text-xs font-bold py-2 px-4 rounded"
      onClick={() => manualUp()}
    >
      Manual up!
    </button>
  );
};

export default UpButton;
