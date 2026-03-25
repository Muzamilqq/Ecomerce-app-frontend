import { useState } from "react";
import { X, LogOut, Upload, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleAuthPopup } from "../../store/slices/popupSlice";
import {
  logoutUser,
  updateProfile,
  updatePassword,
} from "../../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const ProfilePanel = () => {
  const dispatch = useDispatch();
  const { authUser, isUpdatingProfile, isUpdatingPassword } = useSelector(
    (s) => s.auth,
  );
  const { isAuthPopupOpen } = useSelector((s) => s.popup);

  const [tab, setTab] = useState("profile");
  const [name, setName] = useState(authUser?.name || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [avatarFile, setAvatarFile] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  if (!isAuthPopupOpen || !authUser) return null;

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append("name", name);
    fd.append("email", email);
    if (avatarFile) fd.append("avatar", avatarFile);
    dispatch(updateProfile(fd));
  };

  const handlePasswordUpdate = (e) => {
    e.preventDefault();
    dispatch(
      updatePassword({ currentPassword, newPassword, confirmNewPassword }),
    ).then((r) => {
      if (!r.error) {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
      }
    });
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

        <div className="flex items-center gap-4 mb-6">
          <img
            src={
              authUser.avatar?.url ||
              "https://ui-avatars.com/api/?name=" + authUser.name
            }
            alt="avatar"
            className="w-14 h-14 rounded-full object-cover border-2 border-primary"
          />
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {authUser.name}
            </h2>
            <p className="text-sm text-muted-foreground">{authUser.email}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {["profile", "password", "orders"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? "gradient-primary text-primary-foreground"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "profile" && (
          <form onSubmit={handleProfileUpdate} className="space-y-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatarFile(e.target.files[0])}
              className="w-full text-sm text-muted-foreground file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-secondary file:text-foreground"
            />
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-2.5 gradient-primary text-primary-foreground rounded-lg font-semibold text-sm disabled:opacity-60"
            >
              {isUpdatingProfile ? "Updating..." : "Update Profile"}
            </button>
          </form>
        )}

        {tab === "password" && (
          <form onSubmit={handlePasswordUpdate} className="space-y-3">
            {[
              ["Current Password", currentPassword, setCurrentPassword],
              ["New Password", newPassword, setNewPassword],
              [
                "Confirm New Password",
                confirmNewPassword,
                setConfirmNewPassword,
              ],
            ].map(([label, val, setter]) => (
              <input
                key={label}
                type="password"
                placeholder={label}
                value={val}
                onChange={(e) => setter(e.target.value)}
                className="w-full px-3 py-2.5 bg-secondary border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
              />
            ))}
            <button
              type="submit"
              disabled={isUpdatingPassword}
              className="w-full py-2.5 gradient-primary text-primary-foreground rounded-lg font-semibold text-sm disabled:opacity-60"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {tab === "orders" && (
          <div className="text-center py-4">
            <Link
              to="/orders"
              onClick={() => dispatch(toggleAuthPopup())}
              className="inline-block px-6 py-3 gradient-primary text-primary-foreground rounded-lg font-semibold text-sm hover:glow-on-hover transition-all"
            >
              View My Orders
            </Link>
          </div>
        )}

        <button
          onClick={() => dispatch(logoutUser())}
          className="mt-4 w-full py-2.5 border border-destructive/30 text-destructive hover:bg-destructive/10 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePanel;
