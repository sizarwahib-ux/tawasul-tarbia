import { storage } from '@/lib/storage';

export const base44 = {
  entities: {
    Concern: {
      async filter(query = {}, options = {}) {
        let items = storage.getConcerns();
        
        // Filter by criteria
        if (query) {
          Object.entries(query).forEach(([key, val]) => {
            if (val !== undefined && val !== null && val !== 'all') {
              items = items.filter(item => item[key] === val);
            }
          });
        }

        // Sorting
        if (options?.sort) {
          if (options.sort === '-priority_rank') {
            items.sort((a, b) => (b.priority_rank || 1) - (a.priority_rank || 1));
          } else if (options.sort === '-created_date') {
            items.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
          }
        }

        return {
          items,
          total: items.length,
          has_more: false,
          next_cursor: undefined,
        };
      },

      async get(id) {
        const item = storage.getConcernById(id);
        if (!item) throw new Error('Not found');
        return item;
      },

      async create(data) {
        return storage.saveConcern(data);
      },

      async update(id, updates) {
        const updated = storage.updateConcern(id, updates);
        if (!updated) throw new Error('Not found');
        return updated;
      },

      async delete(id) {
        return storage.deleteConcern(id);
      }
    }
  },

  auth: {
    async me() {
      const user = storage.getCurrentUser();
      if (!user) {
        // Return null or throw 401
        throw { status: 401, message: 'Not logged in' };
      }
      return user;
    },

    async logout(redirectUrl) {
      storage.setCurrentUser(null);
      if (redirectUrl) {
        window.location.href = redirectUrl;
      }
    },

    redirectToLogin(redirectUrl) {
      window.location.href = '/login?returnTo=' + encodeURIComponent(redirectUrl || window.location.pathname);
    }
  },

  app: {
    async getPublicSettings() {
      return {
        app_name: "منصة انشغالات قطاع التربية لولاية تيارت",
        organization: "مديرية التربية لولاية تيارت - وزارة التربية الوطنية",
        support_phone: "046 42 15 20",
        support_email: "contact@tiaret-edu.dz",
        working_hours: "من الأحد إلى الخميس: 08:00 - 16:30"
      };
    }
  }
};
