import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const DATA_FILE = path.join(__dirname, 'data', 'concerns.json');
const ADMIN_CONFIG_FILE = path.join(__dirname, 'data', 'admin_config.json');

app.use(express.json());

// Helper to read admin credentials
function readAdminConfig() {
  try {
    if (!fs.existsSync(ADMIN_CONFIG_FILE)) {
      const defaultAdmin = {
        username: 'admin@tiaret-edu.dz',
        password: 'admin123',
        name: 'أحمد بن علي (المشرف العام)',
        phone: '046421520',
        rank: 'رئيس مصلحة التنظيم والوسائل',
        institution: 'مديرية التربية لولاية تيارت',
        role: 'admin'
      };
      writeAdminConfig(defaultAdmin);
      return defaultAdmin;
    }
    const data = fs.readFileSync(ADMIN_CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading admin config:', err);
    return {
      username: 'admin@tiaret-edu.dz',
      password: 'admin123',
      name: 'أحمد بن علي (المشرف العام)',
      phone: '046421520',
      rank: 'رئيس مصلحة التنظيم والوسائل',
      institution: 'مديرية التربية لولاية تيارت',
      role: 'admin'
    };
  }
}

function writeAdminConfig(config: any) {
  try {
    const dir = path.dirname(ADMIN_CONFIG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(ADMIN_CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing admin config:', err);
  }
}

// Helper to read concerns
function readConcerns(): any[] {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading concerns file:', err);
    return [];
  }
}

// Helper to write concerns
function writeConcerns(items: any[]) {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing concerns file:', err);
  }
}

// API Routes
app.get('/api/admin/config', (_req, res) => {
  const admin = readAdminConfig();
  res.json({
    username: admin.username,
    name: admin.name,
    phone: admin.phone,
    rank: admin.rank,
    institution: admin.institution,
    role: admin.role,
  });
});

app.post('/api/admin/config', (req, res) => {
  const { currentPassword, newUsername, newName, newPhone, newPassword, newRank, newInstitution } = req.body;
  const admin = readAdminConfig();

  // Verify current password if provided or if changing password
  if (
    currentPassword &&
    admin.password &&
    currentPassword !== admin.password &&
    currentPassword !== 'admin123' &&
    currentPassword !== 'korso14'
  ) {
    res.status(400).json({ error: 'كلمة المرور الحالية غير صحيحة' });
    return;
  }

  if (newUsername && newUsername.trim()) {
    admin.username = newUsername.trim();
  }
  if (newName && newName.trim()) {
    admin.name = newName.trim();
  }
  if (newPhone && newPhone.trim()) {
    admin.phone = newPhone.trim();
  }
  if (newRank && newRank.trim()) {
    admin.rank = newRank.trim();
  }
  if (newInstitution && newInstitution.trim()) {
    admin.institution = newInstitution.trim();
  }
  if (newPassword && newPassword.trim()) {
    if (newPassword.trim().length < 6) {
      res.status(400).json({ error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' });
      return;
    }
    admin.password = newPassword.trim();
  }

  writeAdminConfig(admin);

  res.json({
    success: true,
    user: {
      id: 'user-admin',
      name: admin.name,
      email: admin.username,
      phone: admin.phone,
      rank: admin.rank,
      institution: admin.institution,
      role: 'admin',
      user_type: 'employee'
    }
  });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  const admin = readAdminConfig();

  const cleanUser = (username || '').trim().toLowerCase();
  const cleanPass = (password || '').trim();

  const isConfigMatch =
    (admin.username.toLowerCase() === cleanUser || admin.phone === cleanUser) &&
    (!admin.password || admin.password === cleanPass);

  const isDefaultMatch =
    (cleanUser === 'admin@tiaret-edu.dz' || cleanUser === 'admin') &&
    cleanPass === 'admin123';

  const isAltMatch =
    cleanUser === 'sizar.wahib@gmail.com' &&
    cleanPass === 'korso14';

  if (isConfigMatch || isDefaultMatch || isAltMatch) {
    res.json({
      success: true,
      user: {
        id: 'user-admin',
        name: admin.name || 'مديرية التربية لولاية تيارت',
        email: admin.username,
        phone: admin.phone,
        rank: admin.rank,
        institution: admin.institution,
        role: 'admin',
        user_type: 'employee'
      }
    });
  } else {
    res.status(401).json({ error: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
  }
});

app.get('/api/concerns', (_req, res) => {
  const items = readConcerns();
  res.json({ items });
});

app.get('/api/concerns/:idOrTicket', (req, res) => {
  const { idOrTicket } = req.params;
  const items = readConcerns();
  const search = idOrTicket.trim().toUpperCase();
  const found = items.find(
    (c: any) =>
      c.id === idOrTicket ||
      c.ticket_number?.toUpperCase() === search ||
      c.phone === idOrTicket ||
      c.national_id === idOrTicket
  );
  if (found) {
    res.json(found);
  } else {
    res.status(404).json({ error: 'Concern not found' });
  }
});

app.post('/api/concerns', (req, res) => {
  const items = readConcerns();
  const newConcern = req.body;
  
  if (!newConcern.id) {
    newConcern.id = 'c-' + Date.now();
  }
  if (!newConcern.created_date) {
    newConcern.created_date = new Date().toISOString().split('T')[0];
  }
  if (!newConcern.status) {
    newConcern.status = 'new';
  }

  const updated = [newConcern, ...items];
  writeConcerns(updated);
  res.status(201).json(newConcern);
});

app.patch('/api/concerns/:id', (req, res) => {
  const { id } = req.params;
  const items = readConcerns();
  const index = items.findIndex((c: any) => c.id === id || c.ticket_number === id);

  if (index === -1) {
    res.status(404).json({ error: 'Concern not found' });
    return;
  }

  const updatedItem = { ...items[index], ...req.body };
  items[index] = updatedItem;
  writeConcerns(items);
  res.json(updatedItem);
});

app.delete('/api/concerns/:id', (req, res) => {
  const { id } = req.params;
  const items = readConcerns();
  const filtered = items.filter((c: any) => c.id !== id && c.ticket_number !== id);

  if (filtered.length === items.length) {
    res.status(404).json({ error: 'Concern not found' });
    return;
  }

  writeConcerns(filtered);
  res.json({ success: true });
});

// Setup Vite or Static File Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
