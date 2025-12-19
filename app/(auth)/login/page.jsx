"use client";
// src/pages/auth/LoginPage.jsx
import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Phone, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { handleSubmitLogin } from "../../../lib/features/authSlice";
import { configs } from "../../../configs";
import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const { loading, login_data  } = useSelector((s) => s?.auth || {});

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const onChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));


  const submit = async () => {
    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      toast.warn("Please enter your user name and password.");
      return;
    }
    try {
      const action = await dispatch(
        handleSubmitLogin({ body: { phone : email, password } })
      ).unwrap?.()
      
      console.log(action?.error?.response?.data?.message);

      const status =
        action?.status||
        action?.data?.status ||
        action?.data?.data?.status ||
        action?.payload?.status;

      const token =
        action?.token ||
        action?.data?.message?.token ||
        action?.data?.token ||
        action?.payload?.token;

      const user =
        action?.user ||
        action?.data?.message ||
        action?.data?.data?.user ||
        action?.payload?.user;
       
        console.log(status)
      if (status === "success" || token) {
        const cookieName = configs?.AUTH_COOKIE_NAME || "token";
        Cookies.set(cookieName, token, {
          expires: 7,
          secure: true,
          sameSite: "Lax",
        });
        try {
          localStorage.setItem(configs.userKey, JSON.stringify(user || {}));
          localStorage.setItem(configs.tokenKey , token );
          // Dispatch custom event to notify LayoutProvider of auth state change
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("auth-state-changed"));
          }
        } catch {}

        toast.success("Welcome back 👋");
        router.push("/");
      } else {
        toast.error(
          action?.error?.response?.data?.message ||
            action?.data?.message ||
            "Login failed. Please check your credentials."
        );
      }
    } catch (e) {
      const msg =
        typeof e === "string"
          ? e
          : action?.error?.response?.data?.message ||
            e?.data?.message ||
            "Login failed. Please try again.";
      toast.error(msg);
    }
  };



  const onKeyDown = (e) => {
    if (e.key === "Enter") submit();
  };

  useEffect(() => {
    const token =
      login_data?.token ||
      login_data?.data?.token ||
      login_data?.data?.data?.token;
    if (token) {
      const cookieName = configs?.AUTH_COOKIE_NAME || "token";
      Cookies.set(cookieName, token, { expires: 7, secure: true, sameSite: "Lax" });
      try {
        const user =
          login_data?.user ||
          login_data?.data?.user ||
          login_data?.data?.data?.user;
        localStorage.setItem(configs.userKey, JSON.stringify(user || {}));
        localStorage.setItem(configs.tokenKey, token);
        // Dispatch custom event to notify LayoutProvider of auth state change
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth-state-changed"));
        }
      } catch {}
      router.push(configs?.AFTER_LOGIN_PATH || "/");
    }
  }, [login_data, router]);

  const disabled = loading || !formData.email.trim() || !formData.password;

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
      {/* Background with new brand colors */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #F97316 0%, #3B82F6 55%, #F97316 100%)",
        }}
      >
        {/* Soft radial lights in orange/blue */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(249,115,22,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(59,130,246,0.3) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Floating particles (blue-tinted) */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: "rgba(59,130,246,0.15)",
            animation: `float ${p.duration}s ease-in-out infinite ${p.delay}s`,
            boxShadow: "0 0 10px rgba(59,130,246,0.3)",
          }}
        />
      ))}

      {/* Decorative orbs (orange + blue) */}
      <div
        className="absolute top-10 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-pulse-slow"
        style={{ background: "#F97316" }}
      />
      <div
        className="absolute bottom-10 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-pulse-slow"
        style={{ background: "#3B82F6", animationDelay: "1s" }}
      />

      {/* Main login card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Heading */}
        <div className="text-center mb-8 animate-fade-in-down">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            Welcome Back
          </h1>
          <p className="text-white/80 text-sm">Sign in to access your dashboard</p>
        </div>

        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
          <div className="p-8 space-y-6">
            {/* Logo */}
            <div className="flex h-[40px] mx-auto w-full justify-center items-center">
              <img
                src="/images/logo.svg"
                className="w-24 h-24 mx-auto drop-shadow-2xl animate-float"
                alt="الشعار"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold"
                style={{ color: "#F97316" }}
              >
                اسم المستخدم 
              </label>
              <div className="relative group">
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#3B82F6" }}
                >
                  <User className="w-5 h-5 opacity-60 group-focus-within:opacity-100" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 text-gray-800 placeholder-gray-400 outline-none focus:border-[#3B82F6] focus:[box-shadow:0_0_0_3px_rgba(59,130,246,0.12)]"
                  placeholder="ex: john Doe"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label
                className="block text-sm font-semibold"
                style={{ color: "#F97316" }}
              >
                كلمة السر
              </label>
              <div className="relative group">
                <div
                  className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#3B82F6" }}
                >
                  <Lock className="w-5 h-5 opacity-60 group-focus-within:opacity-100" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={onChange}
                  onKeyDown={onKeyDown}
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 rounded-xl transition-all duration-300 text-gray-800 placeholder-gray-400 outline-none focus:border-[#3B82F6] focus:[box-shadow:0_0_0_3px_rgba(59,130,246,0.12)]"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={submit}
              disabled={disabled}
              className="w-full relative text-white py-4 rounded-xl font-semibold focus:ring-4 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden group shadow-lg"
              style={{
                background: "linear-gradient(135deg, #F97316 0%, #3B82F6 100%)",
                boxShadow: "0 4px 20px rgba(59,130,246,0.4)",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3" />
                  <span>Signing you in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">Sign In</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </button>

            {/* {error ? (
              <p className="text-sm text-red-600 text-center">
                {typeof error === "string" ? error : error?.message || "Login failed"}
              </p>
            ) : null} */}
          </div>
        </div>
      </div>

      {/* Single global styled-jsx for animations (avoids nesting errors) */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-15px) rotate(5deg); }
          66%      { transform: translateY(-5px) rotate(-5deg); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50%      { opacity: 0.3; transform: scale(1.1); }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out; }
        .animate-fade-in-down { animation: fade-in-down 0.6s ease-out; }
      `}</style>
    </div>
  );
}
