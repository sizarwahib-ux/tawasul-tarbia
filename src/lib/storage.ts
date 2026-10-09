import { ConcernItem, makeTicket, makeQueueNumber } from './concernConfig';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  user_type: 'citizen' | 'employee';
  national_id?: string;
  rank?: string;
  institution?: string;
  role: 'user' | 'admin';
  created_at?: string;
}

const STORAGE_KEYS = {
  CONCERNS: 'tiaret_edu_concerns_v1',
  CURRENT_USER: 'tiaret_edu_user_v1',
  REGISTERED_USERS: 'tiaret_edu_users_list_v1',
  ADMIN_CONFIG: 'tiaret_edu_admin_config_v1',
};

const SEED_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'أحمد بن علي (المشرف العام)',
    email: 'admin@tiaret-edu.dz',
    phone: '046421520',
    user_type: 'employee',
    rank: 'رئيس مصلحة التنظيم والوسائل',
    institution: 'مديرية التربية لولاية تيارت',
    role: 'admin',
    created_at: '2025-01-01'
  },
  {
    id: 'user-teacher-1',
    name: 'عبد القادر بن عيسى',
    email: 'kader.teacher@gmail.com',
    phone: '0661234567',
    user_type: 'employee',
    national_id: '1984141200341',
    rank: 'أستاذ التعليم الثانوي (مادة الرياضيات)',
    institution: 'ثانوية ابن خلدون - تيارت',
    role: 'user',
    created_at: '2025-02-10'
  },
  {
    id: 'user-citizen-1',
    name: 'فاطمة الزهراء منصوري',
    email: 'fatima.parent@yahoo.fr',
    phone: '0555987654',
    user_type: 'citizen',
    national_id: '1979140801239',
    institution: 'ولية أمر تلميذ بمتوسطة الأمير عبد القادر',
    role: 'user',
    created_at: '2025-03-01'
  }
];

// Asynchronously sync with server API
async function syncFromServer() {
  try {
    const res = await fetch('/api/concerns');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.items)) {
        localStorage.setItem(STORAGE_KEYS.CONCERNS, JSON.stringify(data.items));
      }
    }
  } catch {
    // offline or static fallback
  }
}

// Initial background sync
if (typeof window !== 'undefined') {
  syncFromServer();
}

export const storage = {
  getConcerns(): ConcernItem[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CONCERNS);
      if (!data) {
        syncFromServer();
        return [];
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  async refreshConcerns(): Promise<ConcernItem[]> {
    await syncFromServer();
    return this.getConcerns();
  },

  getConcernById(id: string): ConcernItem | undefined {
    const list = this.getConcerns();
    return list.find(c => c.id === id || c.ticket_number.toLowerCase() === id.toLowerCase());
  },

  getConcernByTicket(ticket: string): ConcernItem | undefined {
    const clean = ticket.trim().toUpperCase();
    const list = this.getConcerns();
    return list.find(c => c.ticket_number.toUpperCase() === clean || c.phone === clean || c.national_id === clean);
  },

  saveConcern(concernData: Omit<ConcernItem, 'id' | 'ticket_number' | 'created_date' | 'status'> & Partial<ConcernItem>): ConcernItem {
    const list = this.getConcerns();
    const newConcern: ConcernItem = {
      id: 'c-' + Date.now(),
      ticket_number: concernData.ticket_number || makeTicket(),
      queue_number: concernData.queue_number || makeQueueNumber(),
      created_date: new Date().toISOString().split('T')[0],
      status: 'new',
      ...concernData,
    };

    const updated = [newConcern, ...list];
    localStorage.setItem(STORAGE_KEYS.CONCERNS, JSON.stringify(updated));

    // Async server persist
    try {
      fetch('/api/concerns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newConcern)
      }).catch(() => {});
    } catch {}

    return newConcern;
  },

  updateConcern(id: string, updates: Partial<ConcernItem>): ConcernItem | null {
    const list = this.getConcerns();
    const index = list.findIndex(c => c.id === id || c.ticket_number === id);
    if (index === -1) return null;

    const updatedItem = { ...list[index], ...updates };
    list[index] = updatedItem;
    localStorage.setItem(STORAGE_KEYS.CONCERNS, JSON.stringify(list));

    // Async server persist
    try {
      fetch(`/api/concerns/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      }).catch(() => {});
    } catch {}

    return updatedItem;
  },

  deleteConcern(id: string): boolean {
    const list = this.getConcerns();
    const filtered = list.filter(c => c.id !== id && c.ticket_number !== id);
    if (filtered.length === list.length) return false;
    localStorage.setItem(STORAGE_KEYS.CONCERNS, JSON.stringify(filtered));

    // Async server delete
    try {
      fetch(`/api/concerns/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      }).catch(() => {});
    } catch {}

    return true;
  },

  // Users management
  getUsers(): User[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(SEED_USERS));
        return SEED_USERS;
      }
      return JSON.parse(data);
    } catch {
      return SEED_USERS;
    }
  },

  getCurrentUser(): User | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setCurrentUser(user: User | null) {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  },

  registerUser(userData: Omit<User, 'id' | 'role'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...userData,
      id: 'user-' + Date.now(),
      role: 'user',
      created_at: new Date().toISOString().split('T')[0],
    };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
    this.setCurrentUser(newUser);
    return newUser;
  },

  getAdminConfig() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ADMIN_CONFIG);
      if (data) return JSON.parse(data);
    } catch {}
    return {
      username: 'admin@tiaret-edu.dz',
      name: 'أحمد بن علي (المشرف العام)',
      phone: '046421520',
      rank: 'رئيس مصلحة التنظيم والوسائل',
      institution: 'مديرية التربية لولاية تيارت',
      role: 'admin' as const
    };
  },

  async updateAdminCredentials(payload: {
    currentPassword?: string;
    newUsername?: string;
    newName?: string;
    newPhone?: string;
    newPassword?: string;
    newRank?: string;
  }) {
    // Call server API
    const res = await fetch('/api/admin/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: 'فشل تحديث البيانات' }));
      throw new Error(err.error || 'فشل تحديث البيانات');
    }

    const data = await res.json();
    if (data.user) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_CONFIG, JSON.stringify(data.user));
      // If current logged-in user is admin, update it too
      const current = this.getCurrentUser();
      if (current && current.role === 'admin') {
        this.setCurrentUser(data.user);
      }
    }
    return data.user;
  },

  findUser(identifier: string): User | undefined {
    const adminConfig = this.getAdminConfig();
    const clean = identifier.trim().toLowerCase();
    
    if (
      adminConfig.username.toLowerCase() === clean ||
      adminConfig.phone === clean
    ) {
      return {
        id: 'user-admin',
        name: adminConfig.name,
        email: adminConfig.username,
        phone: adminConfig.phone,
        user_type: 'employee',
        rank: adminConfig.rank,
        institution: adminConfig.institution,
        role: 'admin'
      };
    }

    const users = this.getUsers();
    return users.find(u => 
      u.email.toLowerCase() === clean || 
      u.phone === clean || 
      (u.national_id && u.national_id === clean)
    );
  },

  getStats() {
    const list = this.getConcerns();
    return {
      total: list.length,
      new: list.filter(c => c.status === 'new').length,
      in_review: list.filter(c => c.status === 'in_review').length,
      scheduled: list.filter(c => c.status === 'scheduled').length,
      resolved: list.filter(c => c.status === 'resolved').length,
      rejected: list.filter(c => c.status === 'rejected').length,
      urgent: list.filter(c => c.importance === 'urgent').length,
    };
  }
};
