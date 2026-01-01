import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthService } from "../../services/api/services";

interface User {
  id: string;
  zaloId: string;
  name: string;
  phone: string;
  avatar?: string;
  verified: boolean;
  verificationMethod: string;
}

const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user info from storage
    const userData = AuthService.getUser();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = async () => {
    AuthService.clearTokens();
    AuthService.clearUser();
    navigate("/login");
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.content}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to SportHub!</h1>

        <div style={styles.userInfo}>
          {user.avatar && (
            <img
              src={user.avatar}
              alt="Avatar"
              style={styles.avatar}
            />
          )}
          <h2 style={styles.userName}>{user.name}</h2>
          <p style={styles.userPhone}>{user.phone}</p>
          <p style={styles.verified}>
            {user.verified ? "✅ Verified" : "❌ Not Verified"}
          </p>
          <p style={styles.method}>
            Method: {user.verificationMethod}
          </p>
        </div>

        <button
          onClick={handleLogout}
          style={styles.logoutButton}
        >
          Logout
        </button>

        <p style={styles.note}>
          This is a minimal home screen. More features will be implemented.
        </p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },
  content: {
    textAlign: "center",
  },
  title: {
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#333",
  },
  userInfo: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  avatar: {
    width: "80px",
    height: "80px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "15px",
  },
  userName: {
    fontSize: "20px",
    fontWeight: "bold",
    margin: "10px 0",
    color: "#333",
  },
  userPhone: {
    fontSize: "16px",
    color: "#666",
    margin: "5px 0",
  },
  verified: {
    fontSize: "14px",
    margin: "10px 0",
    color: "#666",
  },
  method: {
    fontSize: "12px",
    color: "#999",
    marginTop: "5px",
  },
  logoutButton: {
    backgroundColor: "#ff4757",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 30px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  note: {
    fontSize: "14px",
    color: "#999",
    marginTop: "30px",
    fontStyle: "italic",
  },
};

export default HomeScreen;
