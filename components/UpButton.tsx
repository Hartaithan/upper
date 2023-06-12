"use client";

import { manualUp } from "@/actions/manualUp";
import { FC, useTransition } from "react";

const UpButton: FC = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="submit"
      className="bg-neutral-900 hover:bg-neutral-950 text-xs font-bold py-2 px-4 rounded min-w-[6rem]"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          const res = await manualUp();
          alert(res);
        });
      }}
    >
      {isPending ? "Pending..." : "Manual up!"}
    </button>
  );
};

export default UpButton;
