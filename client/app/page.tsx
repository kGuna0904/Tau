import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-surface rounded-lg p-6 border border-border-default items-center justify-center ">
      <main className="p-8 items-center justify-between ">
        <h1 className="text-4xl text-accent-primary font-display">Tau</h1>
        <p className="text-text-primary">Hello worlds</p>
      </main>
    </div>
  );
}
