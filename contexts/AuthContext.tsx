
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { toast } from 'sonner-native';

// Definição da interface para o usuário
interface User {
  id: string;
  name: string;
  email: string;
}

// Definição da interface para o contexto de autenticação
interface AuthContextData {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provedor de autenticação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Efeito para carregar o usuário do AsyncStorage ao iniciar o app
  useEffect(() => {
    async function loadUserFromStorage() {
      try {
        const storedUser = await AsyncStorage.getItem('@user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Failed to load user from storage", error);
        toast.error("Falha ao carregar sessão");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserFromStorage();
  }, []);

  // Função de login
  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      // Simulação de uma chamada de API para autenticação
      // Substitua isso pela sua lógica de autenticação real
      if (email === 'fiap@fiap.com.br' && pass === '123456') {
        const userData: User = {
          id: '1',
          name: 'Aluno FIAP',
          email: 'fiap@fiap.com.br',
        };
        await AsyncStorage.setItem('@user', JSON.stringify(userData));
        setUser(userData);
        toast.success("Login bem-sucedido!");
      } else {
        throw new Error("Credenciais inválidas");
      }
    } catch (error: any) {
      console.error("Login failed", error);
      toast.error(error.message || "Erro ao fazer login");
      // Garantir que o usuário não fique "preso"
      setUser(null);
      await AsyncStorage.removeItem('@user');
    } finally {
      setIsLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem('@user');
      setUser(null);
      toast.info("Você foi desconectado.");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Erro ao fazer logout");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
