import ProjectList from "@/components/Project/ProjectList";

export default function Home() {
  return (
    <main className="container flex min-h-screen max-w-2xl flex-col items-center py-24 font-medium text-white">
      <ProjectList />
    </main>
  );
}
