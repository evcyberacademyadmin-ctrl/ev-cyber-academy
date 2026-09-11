const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getDb } = require('../db/database');
const { authenticateToken, JWT_SECRET } = require('../middleware/auth');

// Default configurable registration form link
const DEFAULT_REGISTRATION_URL = process.env.REGISTRATION_FORM_URL || 'https://forms.gle/GqsnVfsERERKRVCp7';

// ==========================================
// PUBLIC ENDPOINTS
// ==========================================

// Get public website configuration, content, resources, faqs, form schema, and published webinars
router.get('/public/config', async (req, res) => {
  try {
    const db = await getDb();
    
    // Get all site configs
    const rows = await db.all('SELECT key, value FROM site_config');
    const config = {
      registration_form_url: DEFAULT_REGISTRATION_URL
    };
    rows.forEach(r => {
      config[r.key] = r.value;
    });

    // Ensure fallback registration form URL
    if (!config.registration_form_url) {
      config.registration_form_url = DEFAULT_REGISTRATION_URL;
    }

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

    // Get Form Fields
    const formFieldsRaw = await db.all('SELECT * FROM form_fields ORDER BY sort_order ASC, id ASC');
    const formFields = formFieldsRaw.map(f => ({
      ...f,
      options: f.options_json ? JSON.parse(f.options_json) : [],
      required: Boolean(f.required),
      enabled: Boolean(f.enabled)
    }));

    // Get Published Webinars (Pinned first)
    const publishedWebinars = await db.all(
      "SELECT * FROM webinars WHERE LOWER(status) = 'published' ORDER BY is_pinned DESC, sort_order ASC, id DESC"
    );

    const pinnedWebinar = publishedWebinars.find(w => w.is_pinned === 1) || publishedWebinars[0] || null;

    res.json({
      success: true,
      config,
      faqs,
      resources,
      formFields,
      webinars: publishedWebinars,
      pinnedWebinar
    });
  } catch (err) {
    console.error('Error fetching public config:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Get Public Published Webinars
router.get('/public/webinars', async (req, res) => {
  try {
    const db = await getDb();
    const publishedWebinars = await db.all(
      "SELECT * FROM webinars WHERE LOWER(status) = 'published' ORDER BY is_pinned DESC, sort_order ASC, id DESC"
    );
    const pinnedWebinar = publishedWebinars.find(w => w.is_pinned === 1) || publishedWebinars[0] || null;

    res.json({
      success: true,
      webinars: publishedWebinars,
      pinnedWebinar
    });
  } catch (err) {
    console.error('Error fetching webinars:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch webinars' });
  }
});

// Registration Action (Directs to external form without storing leads in database)
router.post('/public/register', async (req, res) => {
  try {
    const db = await getDb();
    const { webinar_id } = req.body || {};

    let targetUrl = DEFAULT_REGISTRATION_URL;

    if (webinar_id) {
      const webinar = await db.get('SELECT registration_form_url FROM webinars WHERE id = ?', [webinar_id]);
      if (webinar && webinar.registration_form_url) {
        targetUrl = webinar.registration_form_url;
      }
    } else {
      const cfg = await db.get('SELECT value FROM site_config WHERE key = ?', ['registration_form_url']);
      if (cfg && cfg.value) {
        targetUrl = cfg.value;
      }
    }

    res.json({
      success: true,
      message: 'Directing to external registration form.',
      redirectUrl: targetUrl
    });
  } catch (err) {
    console.error('Registration link fetch error:', err);
    res.json({
      success: true,
      redirectUrl: DEFAULT_REGISTRATION_URL
    });
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
// ADMIN MULTI-WEBINAR MANAGEMENT
// ==========================================

// 1. List all webinars (Draft & Published)
router.get('/admin/webinars', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const webinars = await db.all('SELECT * FROM webinars ORDER BY is_pinned DESC, sort_order ASC, id DESC');
    res.json({ success: true, count: webinars.length, webinars });
  } catch (err) {
    console.error('Fetch all webinars error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch webinars' });
  }
});

// 2. Create new webinar
router.post('/admin/webinars', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const {
      title,
      short_description = '',
      date = 'Coming Soon',
      start_time = '7:00 PM',
      end_time = '8:00 PM IST',
      thumbnail_url = '',
      youtube_url = '',
      registration_form_url = DEFAULT_REGISTRATION_URL,
      status = 'Published',
      is_pinned = 0,
      sort_order = 0
    } = req.body || {};

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, error: 'Webinar Title is required' });
    }

    const pinVal = is_pinned ? 1 : 0;
    const normalizedStatus = (status || '').toLowerCase() === 'draft' ? 'Draft' : 'Published';

    // Single Pinned Rule: If pinning this new webinar, unpin all other webinars
    if (pinVal === 1) {
      await db.run('UPDATE webinars SET is_pinned = 0');
    }

    const result = await db.run(
      `INSERT INTO webinars (title, short_description, date, start_time, end_time, thumbnail_url, youtube_url, registration_form_url, status, is_pinned, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        short_description.trim(),
        date.trim() || 'Coming Soon',
        start_time.trim() || '7:00 PM',
        end_time.trim() || '8:00 PM IST',
        thumbnail_url.trim(),
        youtube_url.trim(),
        registration_form_url.trim() || DEFAULT_REGISTRATION_URL,
        normalizedStatus,
        pinVal,
        sort_order || 0
      ]
    );

    const newWebinar = await db.get('SELECT * FROM webinars WHERE id = ?', [result.lastID]);
    res.status(201).json({ success: true, id: newWebinar.id, webinar: newWebinar });
  } catch (err) {
    console.error('Create webinar error:', err);
    res.status(500).json({ success: false, error: 'Failed to create webinar' });
  }
});

// 3. Edit / Update existing webinar
router.put('/admin/webinars/:id', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const {
      title,
      short_description,
      date,
      start_time,
      end_time,
      thumbnail_url,
      youtube_url,
      registration_form_url,
      status,
      is_pinned,
      sort_order
    } = req.body || {};

    const existing = await db.get('SELECT * FROM webinars WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Webinar not found' });
    }

    const updatedTitle = title !== undefined ? title.trim() : existing.title;
    if (!updatedTitle) {
      return res.status(400).json({ success: false, error: 'Webinar Title cannot be empty' });
    }

    const pinVal = is_pinned !== undefined ? (is_pinned ? 1 : 0) : existing.is_pinned;
    const normalizedStatus = status !== undefined
      ? ((status || '').toLowerCase() === 'draft' ? 'Draft' : 'Published')
      : existing.status;

    // Single Pinned Rule: If pinning, unpin any other webinar
    if (pinVal === 1) {
      await db.run('UPDATE webinars SET is_pinned = 0 WHERE id != ?', [id]);
    }

    await db.run(
      `UPDATE webinars SET
         title = ?,
         short_description = ?,
         date = ?,
         start_time = ?,
         end_time = ?,
         thumbnail_url = ?,
         youtube_url = ?,
         registration_form_url = ?,
         status = ?,
         is_pinned = ?,
         sort_order = ?
       WHERE id = ?`,
      [
        updatedTitle,
        short_description !== undefined ? short_description.trim() : existing.short_description,
        date !== undefined ? date.trim() : existing.date,
        start_time !== undefined ? start_time.trim() : existing.start_time,
        end_time !== undefined ? end_time.trim() : existing.end_time,
        thumbnail_url !== undefined ? thumbnail_url.trim() : existing.thumbnail_url,
        youtube_url !== undefined ? youtube_url.trim() : existing.youtube_url,
        registration_form_url !== undefined ? registration_form_url.trim() : existing.registration_form_url,
        normalizedStatus,
        pinVal,
        sort_order !== undefined ? sort_order : existing.sort_order,
        id
      ]
    );

    const updated = await db.get('SELECT * FROM webinars WHERE id = ?', [id]);
    res.json({ success: true, id: updated.id, webinar: updated });
  } catch (err) {
    console.error('Update webinar error:', err);
    res.status(500).json({ success: false, error: 'Failed to update webinar' });
  }
});

// 4. Pin / Unpin webinar (1-click action)
router.patch('/admin/webinars/:id/pin', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { is_pinned } = req.body;

    const existing = await db.get('SELECT * FROM webinars WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Webinar not found' });
    }

    const targetPin = is_pinned !== undefined ? (is_pinned ? 1 : 0) : (existing.is_pinned === 1 ? 0 : 1);

    if (targetPin === 1) {
      // Unpin all other webinars first
      await db.run('UPDATE webinars SET is_pinned = 0 WHERE id != ?', [id]);
      await db.run('UPDATE webinars SET is_pinned = 1 WHERE id = ?', [id]);
    } else {
      await db.run('UPDATE webinars SET is_pinned = 0 WHERE id = ?', [id]);
    }

    const updated = await db.get('SELECT * FROM webinars WHERE id = ?', [id]);
    res.json({
      success: true,
      message: targetPin === 1 ? 'Webinar pinned to top' : 'Webinar unpinned',
      id: updated.id,
      webinar: updated
    });
  } catch (err) {
    console.error('Pin webinar error:', err);
    res.status(500).json({ success: false, error: 'Failed to change pin status' });
  }
});

// 5. Publish / Unpublish webinar (1-click action)
router.patch('/admin/webinars/:id/status', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { status } = req.body;

    const existing = await db.get('SELECT * FROM webinars WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Webinar not found' });
    }

    const targetStatus = status
      ? ((status || '').toLowerCase() === 'draft' ? 'Draft' : 'Published')
      : (existing.status === 'Published' ? 'Draft' : 'Published');

    await db.run('UPDATE webinars SET status = ? WHERE id = ?', [targetStatus, id]);

    const updated = await db.get('SELECT * FROM webinars WHERE id = ?', [id]);
    res.json({
      success: true,
      message: `Webinar status changed to ${targetStatus}`,
      id: updated.id,
      webinar: updated
    });
  } catch (err) {
    console.error('Toggle status error:', err);
    res.status(500).json({ success: false, error: 'Failed to change webinar status' });
  }
});

// 6. Delete webinar
router.delete('/admin/webinars/:id', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;

    const existing = await db.get('SELECT * FROM webinars WHERE id = ?', [id]);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Webinar not found' });
    }

    await db.run('DELETE FROM webinars WHERE id = ?', [id]);
    res.json({ success: true, message: 'Webinar deleted successfully' });
  } catch (err) {
    console.error('Delete webinar error:', err);
    res.status(500).json({ success: false, error: 'Failed to delete webinar' });
  }
});


// ==========================================
// ADMIN CONFIGURATION & CONTENT MANAGEMENT
// ==========================================

// Update Global Webinar, Registration Link, Video & Pricing Configs
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
      registration_form_url,
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
      registration_form_url,
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
        const existing = await db.get('SELECT key FROM site_config WHERE key = ?', [key]);
        if (existing) {
          await db.run('UPDATE site_config SET value = ? WHERE key = ?', [String(value), key]);
        } else {
          await db.run('INSERT INTO site_config (key, value) VALUES (?, ?)', [key, String(value)]);
        }
      }
    }

    res.json({ success: true, message: 'Webinar settings and registration form link updated successfully' });
  } catch (err) {
    console.error('Update config error:', err);
    res.status(500).json({ success: false, error: 'Failed to update settings' });
  }
});

// Update FAQs (Bulk replace or save)
router.put('/admin/config/faqs', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const { faqs } = req.body;

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

// Admin Stats & Overview
router.get('/admin/stats', authenticateToken, async (req, res) => {
  try {
    const db = await getDb();
    const webinars = await db.all('SELECT * FROM webinars');
    const faqs = await db.all('SELECT id FROM faqs');
    const resources = await db.all('SELECT id FROM resources');

    const totalWebinars = webinars.length;
    const publishedWebinars = webinars.filter(w => (w.status || '').toLowerCase() === 'published').length;
    const draftWebinars = totalWebinars - publishedWebinars;
    const pinnedWebinar = webinars.find(w => w.is_pinned === 1) || null;

    res.json({
      success: true,
      stats: {
        totalWebinars,
        publishedWebinars,
        draftWebinars,
        pinnedWebinar: pinnedWebinar ? pinnedWebinar.title : 'None',
        faqsCount: faqs.length,
        resourcesCount: resources.length
      }
    });
  } catch (err) {
    console.error('Fetch admin stats error:', err);
    res.status(500).json({ success: false, error: 'Failed to fetch admin stats' });
  }
});

module.exports = router;
