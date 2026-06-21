import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Sidebar />

      {/* Conteúdo */}
      <main className="md:ml-64 p-4 md:p-8">
        <div
          className="min-h-[calc(100vh-2rem)]  flex justify-center items-center"
          id="conteudo"
        >
          {children}
        </div>
      </main>
    </div>
  );
}