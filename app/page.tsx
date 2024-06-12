import dynamic from "next/dynamic";

const ProjectList = dynamic(() => import("@/components/project/ProjectList"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="container flex min-h-screen max-w-2xl flex-col items-center py-24 font-medium text-white">
      <ProjectList />
    </main>
  );
}
