import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface Props {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      setLoading(false);
      if (error) return toast.error(error.message);
      toast.success("Бүртгэл амжилттай! Имэйлээ шалгана уу.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return toast.error("Нэвтрэх мэдээлэл буруу байна.");
      onLogin();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="font-display text-2xl font-bold tracking-tight">
            ГОЁЛ<sup className="text-xs align-super text-muted-foreground">®</sup>
          </Link>
          <p className="text-muted-foreground text-sm mt-2">Админ нэвтрэх</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Имэйл"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-input px-4 py-3 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            required
          />
          <input
            type="password"
            placeholder="Нууц үг"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-input px-4 py-3 text-sm rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            required
            minLength={6}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 text-sm font-medium rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Уншиж байна..." : isSignUp ? "Бүртгүүлэх" : "Нэвтрэх"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          <button onClick={() => setIsSignUp(!isSignUp)} className="underline hover:text-foreground transition-colors">
            {isSignUp ? "Нэвтрэх" : "Шинэ бүртгэл үүсгэх"}
          </button>
        </p>

        <Link to="/" className="block text-center text-sm text-muted-foreground mt-6 hover:text-foreground transition-colors">
          ← Нүүр хуудас руу буцах
        </Link>
      </div>
    </div>
  );
};

export default AdminLogin;
