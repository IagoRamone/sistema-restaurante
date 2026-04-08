import FloorMap from "@/components/FloorMap";
import { defaultLayout } from "@/data/floor-layout";

export default function Home() {
  return (
    <main className="h-screen flex flex-col">
      <FloorMap layout={defaultLayout} />
    </main>
  );
}
