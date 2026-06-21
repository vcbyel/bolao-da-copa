import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login, register, loginGoogle } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRegister) {
      const error = await register(email, password);

      if (error) {
        alert(error.message);
      } else {
        alert("Conta criada com sucesso!");
      }
    } else {
      const error = await login(email, password);

      if (error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">

      {/* Imagem de fundo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=2070')",
        }}
      />

      {/* Camada escura */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Card Login */}
      <div className="relative z-10 w-full max-w-md p-8">

        <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-3xl p-8 shadow-2xl">

          <div className="text-center mb-8">

            <h1 className="text-5xl font-bold text-white">
              ⚽ Bolão
            </h1>

            <h2 className="text-5xl font-bold text-green-500">
              da Copa
            </h2>

            <p className="text-slate-300 mt-4">
              Faça seus palpites e acompanhe o ranking em tempo real.
            </p>

          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              type="email"
              placeholder="Seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900/70 text-white border border-slate-700 outline-none"
            />

            <input
              type="password"
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-900/70 text-white border border-slate-700 outline-none"
            />

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition"
            >
              {isRegister ? "Criar Conta" : "Entrar"}
            </button>

          </form>

          <div className="my-4 text-center text-slate-400">
            ou
          </div>

          <button
            onClick={loginGoogle}
            className="w-full bg-white hover:bg-slate-100 text-slate-900 py-3 rounded-xl font-semibold transition"
          >
            Entrar com Google
          </button>

          <div className="mt-6 text-center">

            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-green-400 hover:text-green-300"
            >
              {isRegister
                ? "Já possui conta? Entrar"
                : "Criar uma conta"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}