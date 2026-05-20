import { isFirebaseConfigured, firestore } from './firebase';
import { 
  collection, doc, getDoc, setDoc, getDocs, 
  addDoc, query, where, updateDoc, orderBy 
} from 'firebase/firestore';

export interface User {
  uid: string;
  name: string;
  email: string;
  role: 'ENTREPRENEUR' | 'INVESTOR' | 'SPECIALIST' | 'ADMIN';
  avatar?: string;
  bio?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  entrepreneurId: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  targetAudience: string;
  competitiveAdvantage?: string;
  revenueModel: string;
  stage?: string;
  fundingNeeded: string;
  location: string;
  status: 'DRAFT' | 'SUBMITTED' | 'ANALYZING' | 'NEEDS_ADJUSTMENTS' | 'APPROVED' | 'MATCHED' | 'FUNDED';
  investmentScore?: number;
  aiAnalysis?: any;
  createdAt: string;
  updatedAt: string;
}

export interface Match {
  id: string;
  projectId: string;
  investorId: string;
  status: 'PENDING' | 'INTERESTED' | 'REJECTED' | 'MEETING_SCHEDULED';
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  projectId: string;
  createdAt: string;
  otherUser?: User;
  lastMessage?: Message;
  projectTitle?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
  attachments?: string[];
}

// Session Management (LocalStorage)
const SESSION_KEY = 'nexa_user_session';

export const dbService = {
  getCurrentUser(): User | null {
    const data = localStorage.getItem(SESSION_KEY);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  },

  logout() {
    this.setCurrentUser(null);
  },

  // AUTH / USERS
  async login(email: string): Promise<User> {
    if (isFirebaseConfigured && firestore) {
      // Firebase implementation
      const q = query(collection(firestore, 'users'), where('email', '==', email));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) {
        throw new Error("Utilizador não encontrado. Registe-se primeiro.");
      }
      const userData = querySnapshot.docs[0].data() as User;
      this.setCurrentUser(userData);
      return userData;
    } else {
      // Express Local API implementation
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao fazer login");
      }
      const user = await res.json();
      this.setCurrentUser(user);
      return user;
    }
  },

  async register(userData: Omit<User, 'createdAt'>): Promise<User> {
    const newUser: User = {
      ...userData,
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && firestore) {
      // Firebase Firestore implementation
      await setDoc(doc(firestore, 'users', newUser.uid), newUser);
      this.setCurrentUser(newUser);
      return newUser;
    } else {
      // Express Local API implementation
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao registar");
      }
      const user = await res.json();
      this.setCurrentUser(user);
      return user;
    }
  },

  async getUserProfile(uid: string): Promise<User> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) throw new Error("Utilizador não encontrado");
      return docSnap.data() as User;
    } else {
      const res = await fetch(`/api/users/${uid}`);
      if (!res.ok) throw new Error("Utilizador não encontrado");
      return await res.json();
    }
  },

  async updateUserProfile(uid: string, updates: Partial<User>): Promise<User> {
    if (isFirebaseConfigured && firestore) {
      const docRef = doc(firestore, 'users', uid);
      await updateDoc(docRef, updates);
      const updated = await this.getUserProfile(uid);
      const current = this.getCurrentUser();
      if (current && current.uid === uid) {
        this.setCurrentUser(updated);
      }
      return updated;
    } else {
      const res = await fetch(`/api/users/${uid}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (!res.ok) throw new Error("Erro ao atualizar utilizador");
      const updated = await res.json();
      const current = this.getCurrentUser();
      if (current && current.uid === uid) {
        this.setCurrentUser(updated);
      }
      return updated;
    }
  },

  // PROJECTS
  async getProjects(): Promise<Project[]> {
    if (isFirebaseConfigured && firestore) {
      const querySnapshot = await getDocs(collection(firestore, 'projects'));
      return querySnapshot.docs.map(d => d.data() as Project);
    } else {
      const res = await fetch('/api/projects');
      if (!res.ok) throw new Error("Erro ao carregar projetos");
      return await res.json();
    }
  },

  async getUserProjects(uid: string): Promise<Project[]> {
    if (isFirebaseConfigured && firestore) {
      const q = query(collection(firestore, 'projects'), where('entrepreneurId', '==', uid));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(d => d.data() as Project);
    } else {
      const res = await fetch(`/api/projects/user/${uid}`);
      if (!res.ok) throw new Error("Erro ao obter projetos do utilizador");
      return await res.json();
    }
  },

  async getProject(id: string): Promise<Project> {
    if (isFirebaseConfigured && firestore) {
      const docSnap = await getDoc(doc(firestore, 'projects', id));
      if (!docSnap.exists()) throw new Error("Projeto não encontrado");
      return docSnap.data() as Project;
    } else {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) throw new Error("Projeto não encontrado");
      return await res.json();
    }
  },

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Promise<Project> {
    if (isFirebaseConfigured && firestore) {
      const id = 'proj_' + Math.random().toString(36).substr(2, 9);
      const newProj: Project = {
        ...project,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(doc(firestore, 'projects', id), newProj);
      return newProj;
    } else {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      if (!res.ok) throw new Error("Erro ao salvar projeto");
      return await res.json();
    }
  },

  // MATCHES
  async getMatches(): Promise<Match[]> {
    if (isFirebaseConfigured && firestore) {
      const querySnapshot = await getDocs(collection(firestore, 'matches'));
      return querySnapshot.docs.map(d => d.data() as Match);
    } else {
      const res = await fetch('/api/matches');
      if (!res.ok) throw new Error("Erro ao carregar matches");
      return await res.json();
    }
  },

  async createMatch(projectId: string, investorId: string): Promise<Match> {
    if (isFirebaseConfigured && firestore) {
      const id = 'match_' + Math.random().toString(36).substr(2, 9);
      const newMatch: Match = {
        id,
        projectId,
        investorId,
        status: 'INTERESTED',
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(firestore, 'matches', id), newMatch);
      
      // Auto-create conversation
      const projSnap = await getDoc(doc(firestore, 'projects', projectId));
      if (projSnap.exists()) {
        const proj = projSnap.data() as Project;
        const convId = `conv_${investorId}_${proj.entrepreneurId}_${projectId.substring(0, 5)}`;
        await setDoc(doc(firestore, 'conversations', convId), {
          id: convId,
          participantIds: [investorId, proj.entrepreneurId],
          projectId,
          createdAt: new Date().toISOString()
        });
      }
      
      return newMatch;
    } else {
      const res = await fetch('/api/matches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, investorId, status: 'INTERESTED' })
      });
      if (!res.ok) throw new Error("Erro ao demonstrar interesse");
      return await res.json();
    }
  },

  // CONVERSATIONS
  async getConversations(uid: string): Promise<Conversation[]> {
    if (isFirebaseConfigured && firestore) {
      const q = query(collection(firestore, 'conversations'), where('participantIds', 'array-contains', uid));
      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(d => d.data() as Conversation);

      const enriched = await Promise.all(list.map(async conv => {
        const otherId = conv.participantIds.find(id => id !== uid) || "";
        
        // Get other user profile
        let otherUser: User | undefined;
        try {
          const userSnap = await getDoc(doc(firestore, 'users', otherId));
          if (userSnap.exists()) otherUser = userSnap.data() as User;
        } catch {}

        // Get last message
        let lastMessage: Message | undefined;
        try {
          const msgQ = query(
            collection(firestore, `conversations/${conv.id}/messages`),
            orderBy('createdAt', 'desc')
          );
          const msgSnap = await getDocs(msgQ);
          if (!msgSnap.empty) {
            lastMessage = msgSnap.docs[0].data() as Message;
          }
        } catch {}

        // Get project title
        let projectTitle = "Projeto";
        try {
          const projSnap = await getDoc(doc(firestore, 'projects', conv.projectId));
          if (projSnap.exists()) projectTitle = (projSnap.data() as Project).title;
        } catch {}

        return {
          ...conv,
          otherUser,
          lastMessage,
          projectTitle
        };
      }));

      return enriched;
    } else {
      const res = await fetch(`/api/conversations/${uid}`);
      if (!res.ok) throw new Error("Erro ao obter conversas");
      return await res.json();
    }
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    if (isFirebaseConfigured && firestore) {
      const q = query(
        collection(firestore, `conversations/${conversationId}/messages`),
        orderBy('createdAt', 'asc')
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(d => d.data() as Message);
    } else {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!res.ok) throw new Error("Erro ao carregar mensagens");
      return await res.json();
    }
  },

  async sendMessage(conversationId: string, senderId: string, text: string): Promise<Message> {
    if (isFirebaseConfigured && firestore) {
      const id = 'msg_' + Math.random().toString(36).substr(2, 9);
      const newMsg: Message = {
        id,
        conversationId,
        senderId,
        text,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(firestore, `conversations/${conversationId}/messages`, id), newMsg);
      return newMsg;
    } else {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderId, text })
      });
      if (!res.ok) throw new Error("Erro ao enviar mensagem");
      return await res.json();
    }
  }
};
