import { auth, firestore } from "@/config/firebase";
import { AuthContextType, UserType } from "@/types";
import { useRouter } from "expo-router";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const translateFirebaseError = (msg: string) => {
  if (msg.includes("(auth/invalid-credential)"))
    return "Kullanıcı bilgileri yanlış.";
  if (msg.includes("(auth/invalid-email)"))
    return "Geçersiz e-posta adresi.";
  if (msg.includes("(auth/email-already-in-use)"))
    return "Bu e-posta adresi zaten kullanılıyor.";
  if (msg.includes("(auth/weak-password)"))
    return "Şifre en az 6 karakter olmalıdır.";
  if (msg.includes("(auth/network-request-failed)"))
    return "İnternet bağlantısı bulunamadı. Lütfen bağlantınızı kontrol edin.";
  if (msg.includes("(auth/too-many-requests)"))
    return "Çok fazla deneme yaptınız. Lütfen daha sonra tekrar deneyin.";
  if (msg.includes("(auth/user-disabled)"))
    return "Bu hesap devre dışı bırakılmış.";
  if (msg.includes("(auth/user-not-found)"))
    return "Bu e-posta adresine ait bir hesap bulunamadı.";
  if (msg.includes("(auth/wrong-password)"))
    return "Şifre yanlış.";
  if (msg.includes("(auth/internal-error)"))
    return "Sunucuda bir hata oluştu. Lütfen tekrar deneyin.";

  return "Bir hata oluştu. Lütfen tekrar deneyin.";
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<UserType>(null);
  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      console.log("Firebase kullanıcı: ", firebaseUser);
      if (firebaseUser) {
        setUser({
          uid: firebaseUser?.uid,
          email: firebaseUser?.email,
          name: firebaseUser?.displayName,
        });
        updateUserData(firebaseUser.uid);
        router.replace("/(tabs)");
      } else {
        setUser(null);
        router.replace("/(auth)/welcome");
      }
    });
    return () => unsub();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error: any) {
      const msg = translateFirebaseError(error.message);
      console.log("Firebase login hatası:", error.message);
      return { success: false, msg };
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    university?: string
  ) => {
    try {
      let response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await setDoc(doc(firestore, "users", response?.user?.uid), {
        name,
        email,
        uid: response?.user?.uid,
        university: university || "",
      });
      return { success: true };
    } catch (error: any) {
      const msg = translateFirebaseError(error.message);
      console.log("Firebase register hatası:", error.message);
      return { success: false, msg };
    }
  };

  const updateUserData = async (uid: string) => {
    try {
      const docRef = doc(firestore, "users", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const userData: UserType = {
          uid: data?.uid || null,
          email: data.email || null,
          name: data.name || null,
          image: data.profileImage || null,
          department: data.department || null,
          university: data.university || null,
        };
        setUser({ ...userData });
      }
    } catch (error: any) {
      console.log("Kullanıcı verisi güncellenemedi:", error);
    }
  };

  const contextValue: AuthContextType = {
    user,
    setUser,
    login,
    register,
    updateUserData,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth, AuthProvider bileşeni içinde kullanılmalıdır.");
  }
  return context;
};
