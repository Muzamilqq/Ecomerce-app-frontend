import { useState, useEffect } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  clearError,
} from "../../store/slices/authSlice";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import { useLocation, useParams } from "react-router-dom";
import { resetPassword } from "../../store/slices/authSlice";
import { forgotPassword } from "../../store/slices/authSlice";

const LoginModal = () => {
  const dispatch = useDispatch();
  const { isAuthPopupOpen } = useSelector((s) => s.popup);
  const { Logging, isSigningUp, error } = useSelector((s) => s.auth);
  const location = useLocation();

  const [mode, setMode] = useState("login"); // login | register | forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    dispatch(clearError());
  }, [mode, dispatch]);

  if (!isAuthPopupOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login")
      dispatch(loginUser({ email, password })).then((r) => {
        if (!r.error) dispatch(toggleAuthPopup());
      });
    else if (mode === "register")
      dispatch(registerUser({ name, email, password })).then((r) => {
        if (!r.error) dispatch(toggleAuthPopup());
      });
    else if (mode === "forgot") {
      dispatch(forgotPassword({ email, frontendUrl: window.location.origin }));
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
      onClick={() => dispatch(toggleAuthPopup())}
    >
      <div
        className="glass-panel w-full max-w-md relative animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => dispatch(toggleAuthPopup())}
          className="absolute top-4 right-4 p-1 hover:bg-secondary rounded-lg"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <h2 className="text-2xl font-bold text-foreground mb-1">
          {mode === "login"
            ? "Welcome back"
            : mode === "register"
              ? "Create account"
              : "Reset password"}
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          {mode === "login"
            ? "Sign in to your account"
            : mode === "register"
              ? "Join ShopMate today"
              : "We'll send you a reset link"}
        </p>

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm rounded-lg px-4 py-2 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "register" && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
              />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
            />
          </div>
          {mode !== "forgot" && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-9 pr-4 py-3 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
              />
            </div>
          )}

          {mode === "login" && (
            <button
              type="button"
              onClick={() => setMode("forgot")}
              className="text-xs text-primary hover:underline"
            >
              Forgot password?
            </button>
          )}

          <button
            type="submit"
            disabled={Logging || isSigningUp}
            className="w-full py-3 gradient-primary text-primary-foreground rounded-lg font-semibold text-sm hover:glow-on-hover transition-all disabled:opacity-60"
          >
            {Logging || isSigningUp
              ? "Please wait..."
              : mode === "login"
                ? "Sign In"
                : mode === "register"
                  ? "Create Account"
                  : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setMode("register")}
                className="text-primary hover:underline font-medium"
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setMode("login")}
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default LoginModal;
