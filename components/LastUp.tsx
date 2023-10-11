"use client";

import { FC } from "react";

interface LastUpProps {
  date: string | null;
}

const LastUp: FC<LastUpProps> = (props) => {
  const { date } = props;
  return (
    <>
      <h1 className="text-sm font-bold">Last up:</h1>
      <p className="text-sm">
        {date ? new Date(date).toString() : "[Not Found]"}
      </p>
    </>
  );
};

export default LastUp;
