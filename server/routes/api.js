const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/database');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

// Get public website configuration, content, resources, faqs, form schema
router.get('/public/config', async (req, res) => {
  try {
    const db = await getDb();
    
    // Get all site configs
    const rows = await db.all('SELECT key, value FROM site_config');
    const config = {};
    rows.forEach(r => {
      config[r.key] = r.value;
    });

    // Parse JSON fields safely
    if (config.day1_topics) {
      try { config.day1_topics = JSON.parse(config.day1_topics); } catch (e) { config.day1_topics = []; }
    }
    if (config.day2_topics) {
      try { config.day2_topics = JSON.parse(config.day2_topics); } catch (e) { config.day2_topics = []; }
    }

    // Get FAQs
    const faqs = await db.all('SELECT * FROM faqs ORDER BY sort_order ASC, id ASC');

    // Get Resources
    const resources = await db.all('SELECT * FROM resources ORDER BY sort_order ASC, id ASC');

    // Get enabled form fields
    const formFieldsRaw = await db.all('SELECT * FROM form_fields WHERE enabled = 1 ORDER BY sort_order ASC, id ASC');
    const formFields = formFieldsRaw.map(f => ({
      ...f,
      options: f.options_json ? JSON.parse(f.options_json) : [],
      required: Boolean(f.required)
    }));

    res.json({
      success: true,
      config,
      faqs,
      resources,
      formFields
    });
  } catch (err) {
    console.error('Error fetching public config:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Submit FREE Webinar Registration
router.post('/public/register', async (req, res) => {
  try {
    const db = await getDb();
    const body = req.body || {};

    const full_name = (body.full_name || '').trim();
    const whatsapp = (body.whatsapp || '').trim();
    const email = (body.email || '').trim();
    const college_company = (body.college_company || '').trim();
    const current_status = (body.current_status || '').trim();
    const experience = (body.experience || '').trim();
    const main_goal = (body.main_goal || '').trim();

    // Server-side validation
    if (!full_name || full_name.length < 2) {
      return res.status(400).json({ success: false, error: 'Please enter a valid full name (at least 2 characters).' });
    }

    // Validate WhatsApp (10-15 digits)
    const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');
    if (!cleanWhatsapp || cleanWhatsapp.length < 10 || cleanWhatsapp.length > 15) {
      return res.status(400).json({ success: false, error: 'Please enter a valid WhatsApp / Mobile number (10-15 digits).' });
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid email address.' });
    }

    // Check for duplicate registration (same WhatsApp or Email within last 24h)
    const existing = await db.get(
      'SELECT id, created_at FROM registrations WHERE whatsapp = ? OR email = ? ORDER BY id DESC LIMIT 1',
      [cleanWhatsapp, email]
    );

    if (existing) {
      // Return existing registration ID so user is shown success screen
      return res.json({
        success: true,
        alreadyRegistered: true,
        message: 'You are already registered with this WhatsApp or Email!',
        registration: {
          id: existing.id,
          full_name,
          whatsapp: cleanWhatsapp,
          email,
          created_at: existing.created_at
        }
      });
    }

    // Insert registration
    const result = await db.run(
      `INSERT INTO registrations (full_name, whatsapp, email, college_company, current_status, experience, main_goal, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'New')`,
      [full_name, cleanWhatsapp, email, college_company, current_status, experience, main_goal]
    );

    const newRecord = await db.get('SELECT * FROM registrations WHERE id = ?', [result.lastID]);

    res.status(201).json({
      success: true,
      message: 'Registration successful!',
      registration: newRecord
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: 'Failed to process registration. Please try again.' });
  }
});


// ==========================================
// ADMIN AUTHENTICATION
// ==========================================

router.post('/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ success: false, error: 'Username and password required' });
    }

    const db = await getDb();
    const user = await db.get('SELECT * FROM users WHERE username = ?', [username.trim()]);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      token,
      user: { id: user.id, username: user.username }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


// ==========================================
// ADMIN DASHBOARD & REGISTRATIONS
// ==========================================

// Get Dashboard Stats
router.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();

    const totalReg = await db.get('SELECT COUNT(*) as count FROM registrations');
    
    // Today's count
    const todayReg = await db.get(
      "SELECT COUNT(*) as count FROM registrations WHERE DATE(created_at) = DATE('now')"
    );

    // Beginners count
    const beginnerReg = await db.get(
      "SELECT COUNT(*) as count FROM registrations WHERE experience LIKE '%Beginner%'"
    );

    // Students count
    const studentReg = await db.get(
      "SELECT COUNT(*) as count FROM registrations WHERE current_status LIKE '%Student%'"
    );

    // LFHP Interested leads
    const lfhpLeads = await db.get(
      "SELECT COUNT(*) as count FROM registrations WHERE status = 'Interested' OR status = 'LFHP Offered' OR status = 'Converted'"
    );

    res.json({
      success: true,
      stats: {
        total: totalReg.count,
        today: todayReg.count,
        beginners: beginnerReg.count,
        students: studentReg.count,
        lfhpInterested: lfhpLeads.count
      }
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch statistics' });
  }
});

// Get Registrations List (with search, filter, pagination)
router.get('/admin/registrations', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { search = '', status = 'All' } = req.query;

    let query = 'SELECT * FROM registrations WHERE 1=1';
    const params = [];

    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }

    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query += ' AND (full_name LIKE ? OR whatsapp LIKE ? OR email LIKE ? OR college_company LIKE ? OR main_goal LIKE ?)';
      params.push(term, term, term, term, term);
    }

    query += ' ORDER BY id DESC';

    const registrations = await db.all(query, params);
    res.json({ success: true, count: registrations.length, registrations });
  } catch (err) {
    console.error('Fetch registrations error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch registrations' });
  }
});

// Update Registration Status / Notes
router.patch('/admin/registrations/:id', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { status, notes } = req.body;

    const existing = await db.get('SELECT * FROM registrations WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Registration not found' });
    }

    const newStatus = status || existing.status;
    const newNotes = notes !== undefined ? notes : existing.notes;

    await db.run(
      'UPDATE registrations SET status = ?, notes = ? WHERE id = ?',
      [newStatus, newNotes, id]
    );

    const updated = await db.get('SELECT * FROM registrations WHERE id = ?', [id]);
    res.json({ success: true, registration: updated });
  } catch (err) {
    console.error('Update registration error:', err);
    res.status(500).json({ success: false, error: 'Failed to update registration' });
  }
});

// Delete Registration
router.delete('/admin/registrations/:id', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;

    await db.run('DELETE FROM registrations WHERE id = ?', [id]);
    res.json({ success: true, message: 'Registration deleted' });
  } catch (err) {
    console.error('Delete registration error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete registration' });
  }
});


// ==========================================
// ADMIN CONFIGURATION & CONTENT MANAGEMENT
// ==========================================

// Update Webinar & Video & Pricing Configs
router.put('/admin/config/webinar', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const {
      webinar_name,
      theme_mode,
      webinar_title,
      webinar_subtitle,
      webinar_desc,
      webinar_date,
      webinar_time,
      youtube_url,
      founder_title,
      lfhp_original_price,
      lfhp_offer_price,
      lfhp_title,
      lfhp_desc,
      lfhp_cta_text,
      day1_title,
      day1_topics,
      day2_title,
      day2_topics
    } = req.body;

    const updates = {
      webinar_name,
      theme_mode,
      webinar_title,
      webinar_subtitle,
      webinar_desc,
      webinar_date,
      webinar_time,
      youtube_url,
      founder_title,
      lfhp_original_price,
      lfhp_offer_price,
      lfhp_title,
      lfhp_desc,
      lfhp_cta_text,
      day1_title,
      day1_topics: Array.isArray(day1_topics) ? JSON.stringify(day1_topics) : day1_topics,
      day2_title,
      day2_topics: Array.isArray(day2_topics) ? JSON.stringify(day2_topics) : day2_topics
    };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        await db.run(
          `INSERT INTO site_config (key, value) VALUES (?, ?)
           ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
          [key, String(value)]
        );
      }
    }

    res.json({ success: true, message: 'Webinar settings updated successfully' });
  } catch (err) {
    console.error('Update config error:', err);
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
});

// Update FAQs (Bulk replace or save)
router.put('/admin/config/faqs', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { faqs } = req.body; // Array of { id?, question, answer, sort_order }

    if (!Array.isArray(faqs)) {
      return res.status(400).json({ success: false, error: 'faqs must be an array' });
    }

    await db.run('DELETE FROM faqs');

    for (let i = 0; i < faqs.length; i++) {
      const f = faqs[i];
      await db.run(
        'INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)',
        [f.question, f.answer, f.sort_order || (i + 1)]
      );
    }

    const updated = await db.all('SELECT * FROM faqs ORDER BY sort_order ASC');
    res.json({ success: true, faqs: updated });
  } catch (err) {
    console.error('Update FAQs error:', err);
    res.status(500).json({ success: false, error: 'Failed to update FAQs' });
  }
});

// Update Resources / Toolkit
router.put('/admin/config/resources', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { resources } = req.body;

    if (!Array.isArray(resources)) {
      return res.status(400).json({ success: false, error: 'resources must be an array' });
    }

    await db.run('DELETE FROM resources');

    for (let i = 0; i < resources.length; i++) {
      const r = resources[i];
      await db.run(
        'INSERT INTO resources (title, description, type, badge, sort_order) VALUES (?, ?, ?, ?, ?)',
        [r.title, r.description, r.type || 'tool', r.badge || 'Included Free', r.sort_order || (i + 1)]
      );
    }

    const updated = await db.all('SELECT * FROM resources ORDER BY sort_order ASC');
    res.json({ success: true, resources: updated });
  } catch (err) {
    console.error('Update resources error:', err);
    res.status(500).json({ success: false, error: 'Failed to update resources' });
  }
});

// Update Dynamic Form Fields (Form Builder)
router.put('/admin/config/form-fields', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { fields } = req.body;

    if (!Array.isArray(fields)) {
      return res.status(400).json({ success: false, error: 'fields must be an array' });
    }

    await db.run('DELETE FROM form_fields');

    for (let i = 0; i < fields.length; i++) {
      const f = fields[i];
      const field_name = (f.field_name || `field_${Date.now()}_${i}`).toLowerCase().replace(/[^a-z0-9_]/g, '_');
      const options_json = Array.isArray(f.options) ? JSON.stringify(f.options) : (f.options_json || '[]');

      await db.run(
        `INSERT INTO form_fields (field_name, label, type, placeholder, options_json, required, enabled, sort_order)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          field_name,
          f.label || 'Untitled Field',
          f.type || 'text',
          f.placeholder || '',
          options_json,
          f.required ? 1 : 0,
          f.enabled !== false ? 1 : 0,
          f.sort_order || (i + 1)
        ]
      );
    }

    const updated = await db.all('SELECT * FROM form_fields ORDER BY sort_order ASC');
    const formFields = updated.map(f => ({
      ...f,
      options: f.options_json ? JSON.parse(f.options_json) : [],
      required: Boolean(f.required),
      enabled: Boolean(f.enabled)
    }));

    res.json({ success: true, formFields });
  } catch (err) {
    console.error('Update form fields error:', err);
    res.status(500).json({ success: false, error: 'Failed to update form fields' });
  }
});

module.exports = router;
