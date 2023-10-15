import LastUp from "@/components/LastUp";
import UpButton from "@/components/UpButton";
import { getLastLog } from "@/helpers/logs";
import { NextPage } from "next";

export const dynamic = "force-dynamic";

const Home: NextPage = async () => {
  const log = await getLastLog();

  return (
    <main className="flex flex-col items-center justify-center p-5">
      <div className="bg-neutral-950 p-2 rounded-md mb-5">
        {log ? (
          <LastUp date={log.created_at} />
        ) : (
          <p>something went wrong ¯\_(ツ)_/¯</p>
        )}
      </div>
      <UpButton />
    </main>
  );
};

export default Home;
