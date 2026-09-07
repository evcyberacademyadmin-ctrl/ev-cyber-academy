const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');

let dbPromise = null;

async function getDb() {
  if (!dbPromise) {
    const dbPath = path.join(__dirname, 'database.sqlite');
    dbPromise = open({
      filename: dbPath,
      driver: sqlite3.Database
    }).then(async (db) => {
      await initDatabase(db);
      return db;
    });
  }
  return dbPromise;
}

async function initDatabase(db) {
  // Site config table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS site_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `);

  // Admin users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Registrations table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      full_name TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      email TEXT NOT NULL,
      college_company TEXT,
      current_status TEXT,
      experience TEXT,
      main_goal TEXT,
      status TEXT DEFAULT 'New',
      notes TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // FAQs table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      sort_order INTEGER DEFAULT 0
    )
  `);

  // Resources / Toolkit table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS resources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT DEFAULT 'tool',
      badge TEXT DEFAULT 'Included Free',
      sort_order INTEGER DEFAULT 0
    )
  `);

  // Dynamic Registration Form Fields Table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS form_fields (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      field_name TEXT UNIQUE NOT NULL,
      label TEXT NOT NULL,
      type TEXT NOT NULL, -- text, tel, email, select
      placeholder TEXT DEFAULT '',
      options_json TEXT DEFAULT '[]',
      required INTEGER DEFAULT 1,
      enabled INTEGER DEFAULT 1,
      sort_order INTEGER DEFAULT 0
    )
  `);

  // Seed default admin user
  const adminUser = await db.get('SELECT * FROM users WHERE username = ?', ['vimalthehacker']);
  if (!adminUser) {
    // Remove the old default admin if it exists
    await db.run('DELETE FROM users WHERE username = ?', ['admin']);
    
    const hashed = await bcrypt.hash('adminsshvimal-2008', 10);
    await db.run('INSERT INTO users (username, password_hash) VALUES (?, ?)', ['vimalthehacker', hashed]);
    console.log('[DB] Seeded admin user (vimalthehacker)');
  }

  // Seed site configs if empty
  const defaultConfigs = [
    { key: 'webinar_name', value: 'EV-WEB-2' },
    { key: 'theme_mode', value: 'cyber-dark' },
    { key: 'webinar_title', value: '2-Day FREE Cyber Security Webinar' },
    { key: 'webinar_subtitle', value: 'Start Your Cyber Security Journey From Zero' },
    { key: 'webinar_desc', value: 'Learn the fundamentals of Cyber Security, networking, reconnaissance and practical security concepts in a beginner-friendly 2-day webinar.' },
    { key: 'webinar_date', value: 'Coming Soon' },
    { key: 'webinar_time', value: '7:00 PM – 8:00 PM IST' },
    { key: 'youtube_url', value: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    { key: 'founder_title', value: 'Before You Register, Watch This' },
    { key: 'lfhp_original_price', value: '15000' },
    { key: 'lfhp_offer_price', value: '4000' },
    { key: 'lfhp_title', value: 'LFHP — Learn the Fundamentals of Hacking' },
    { key: 'lfhp_desc', value: 'EV-WEB-2 gives you the foundation. If you want structured practical Cyber Security training after the webinar, continue your journey with LFHP.' },
    { key: 'lfhp_cta_text', value: 'JOIN LFHP NOW' },
    { key: 'day1_title', value: 'DAY 1: Cyber Security Fundamentals' },
    { key: 'day1_topics', value: JSON.stringify([
      'Cyber Security fundamentals',
      'Basic networking concepts',
      'IP basics',
      'DNS basics',
      'Reconnaissance fundamentals',
      'Introduction to security tools',
      'Understanding how security professionals approach problems'
    ]) },
    { key: 'day2_title', value: 'DAY 2: Practical Security Basics' },
    { key: 'day2_topics', value: JSON.stringify([
      'IP Reconnaissance in practice',
      'DNS Reconnaissance techniques',
      'Basic Port Scanning workflows',
      'Understanding open ports and network services',
      'EV Cyber Academy proprietary tools walkthrough',
      'Beginner practical security concepts'
    ]) }
  ];

  for (const cfg of defaultConfigs) {
    const existing = await db.get('SELECT key FROM site_config WHERE key = ?', [cfg.key]);
    if (!existing) {
      await db.run('INSERT INTO site_config (key, value) VALUES (?, ?)', [cfg.key, cfg.value]);
    }
  }

  // Seed FAQs if empty
  const faqCount = await db.get('SELECT COUNT(*) as count FROM faqs');
  if (faqCount.count === 0) {
    const defaultFaqs = [
      { question: 'Is this webinar really free?', answer: 'Yes! EV-WEB-2 is 100% free for 2 days. There are no hidden fees or payment required to attend.', sort_order: 1 },
      { question: 'Do I need Cyber Security experience?', answer: 'No previous experience is required! The webinar is designed specifically for complete beginners, college students, and anyone starting from scratch.', sort_order: 2 },
      { question: 'Who can attend?', answer: 'College students, working professionals, job seekers, ethical hacking enthusiasts, or anyone interested in Cyber Security and Pentesting.', sort_order: 3 },
      { question: 'What time is the webinar?', answer: 'The webinar runs for 2 consecutive days, 1 hour per day, from 7:00 PM to 8:00 PM IST.', sort_order: 4 },
      { question: 'What will I learn?', answer: 'Day 1 covers Cyber Security fundamentals, networking, IP & DNS basics. Day 2 covers IP/DNS recon, port scanning, and practical security concepts.', sort_order: 5 },
      { question: 'Will I receive the free toolkit & resources?', answer: 'Yes! All registered attendees will receive access to our beginner security tools, IP/DNS recon scripts, and installation guides.', sort_order: 6 },
      { question: 'Do I need a laptop?', answer: 'Having a laptop or desktop computer is recommended for following along with the practical demonstrations, but you can also watch on a phone or tablet.', sort_order: 7 },
      { question: 'What happens after the webinar?', answer: 'You will have a solid foundation in cyber security basics. If you wish to advance further, you can optionally enroll in our structured LFHP program.', sort_order: 8 }
    ];
    for (const faq of defaultFaqs) {
      await db.run('INSERT INTO faqs (question, answer, sort_order) VALUES (?, ?, ?)', [faq.question, faq.answer, faq.sort_order]);
    }
  }

  // Seed Resources if empty
  const resCount = await db.get('SELECT COUNT(*) as count FROM resources');
  if (resCount.count === 0) {
    const defaultResources = [
      { title: 'IP / DNS Recon Tool', description: 'Essential beginner scripts for domain and IP reconnaissance.', type: 'tool', badge: 'Included Free', sort_order: 1 },
      { title: 'Basic Port Scanner', description: 'Lightweight scanner to understand open ports and active services.', type: 'tool', badge: 'Included Free', sort_order: 2 },
      { title: 'EV Cyber Academy Tools', description: 'Custom academy tools developed for practical hands-on learning.', type: 'software', badge: 'Academy Exclusive', sort_order: 3 },
      { title: 'Installation Resources', description: 'Step-by-step Linux and security tool setup guides.', type: 'guide', badge: 'Beginner Ready', sort_order: 4 },
      { title: 'Beginner Learning Roadmap', description: 'Curated study path from Cyber Security basics to practical pentesting.', type: 'guide', badge: 'PDF Roadmap', sort_order: 5 }
    ];
    for (const res of defaultResources) {
      await db.run('INSERT INTO resources (title, description, type, badge, sort_order) VALUES (?, ?, ?, ?, ?)', [res.title, res.description, res.type, res.badge, res.sort_order]);
    }
  }

  // Seed Dynamic Form Fields if empty
  const fieldsCount = await db.get('SELECT COUNT(*) as count FROM form_fields');
  if (fieldsCount.count === 0) {
    const defaultFields = [
      {
        field_name: 'full_name',
        label: 'Full Name',
        type: 'text',
        placeholder: 'e.g. Rahul Sharma',
        options_json: '[]',
        required: 1,
        enabled: 1,
        sort_order: 1
      },
      {
        field_name: 'whatsapp',
        label: 'WhatsApp Number',
        type: 'tel',
        placeholder: 'e.g. 9876543210',
        options_json: '[]',
        required: 1,
        enabled: 1,
        sort_order: 2
      },
      {
        field_name: 'email',
        label: 'Email Address',
        type: 'email',
        placeholder: 'e.g. rahul@example.com',
        options_json: '[]',
        required: 1,
        enabled: 1,
        sort_order: 3
      },
      {
        field_name: 'college_company',
        label: 'College / Company',
        type: 'text',
        placeholder: 'e.g. ABC Institute of Tech / Self',
        options_json: '[]',
        required: 1,
        enabled: 1,
        sort_order: 4
      },
      {
        field_name: 'current_status',
        label: 'Current Status',
        type: 'select',
        placeholder: 'Select current status',
        options_json: JSON.stringify(['Student', 'Working', 'Job Seeker', 'Other']),
        required: 1,
        enabled: 1,
        sort_order: 5
      },
      {
        field_name: 'experience',
        label: 'Cyber Security Experience',
        type: 'select',
        placeholder: 'Select experience level',
        options_json: JSON.stringify(['Complete Beginner', 'Basic Knowledge', 'Already Learning']),
        required: 1,
        enabled: 1,
        sort_order: 6
      },
      {
        field_name: 'main_goal',
        label: 'Main Goal',
        type: 'select',
        placeholder: 'Select main goal',
        options_json: JSON.stringify(['Learn Cyber Security', 'Ethical Hacking', 'Pentesting', 'Career / Job', 'College Learning', 'Exploring']),
        required: 1,
        enabled: 1,
        sort_order: 7
      }
    ];
    for (const f of defaultFields) {
      await db.run(
        `INSERT INTO form_fields (field_name, label, type, placeholder, options_json, required, enabled, sort_order) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [f.field_name, f.label, f.type, f.placeholder, f.options_json, f.required, f.enabled, f.sort_order]
      );
    }
  }

  console.log('[DB] Database tables initialized successfully.');
}

module.exports = { getDb };
