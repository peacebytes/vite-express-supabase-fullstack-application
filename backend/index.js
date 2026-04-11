require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// --- Auth ---

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single();

  if (error || !data) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, data.password_hash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  res.json({ id: data.id, username: data.username, role: data.role });
});

// --- Role middleware ---
const requireAdmin = (req, res, next) => {
  if (req.headers['x-user-role'] !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  next();
};

// --- Categories CRUD ---

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: List all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: Array of categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
app.get('/api/categories', async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*').order('created_at');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: A category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: Not found
 */
app.get('/api/categories/:id', async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a category
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Created category
 */
app.post('/api/categories', requireAdmin, async (req, res) => {
  const { name, description, business_size } = req.body;
  const { data, error } = await supabase.from('categories').insert({ name, description, business_size }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       200:
 *         description: Updated category
 */
app.put('/api/categories/:id', requireAdmin, async (req, res) => {
  const { name, description, business_size } = req.body;
  const { data, error } = await supabase.from('categories').update({ name, description, business_size }).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Deleted
 */
app.delete('/api/categories/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('categories').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

// --- AI Tools CRUD ---

/**
 * @swagger
 * /api/ai-tools:
 *   get:
 *     summary: List all AI tools
 *     tags: [AI Tools]
 *     parameters:
 *       - in: query
 *         name: category_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: Array of AI tools
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/AiTool'
 */
app.get('/api/ai-tools', async (req, res) => {
  let query = supabase.from('ai_tools').select('*, categories(name)').order('created_at');
  if (req.query.category_id) query = query.eq('category_id', req.query.category_id);
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/**
 * @swagger
 * /api/ai-tools/{id}:
 *   get:
 *     summary: Get an AI tool by ID
 *     tags: [AI Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: An AI tool
 *       404:
 *         description: Not found
 */
app.get('/api/ai-tools/:id', async (req, res) => {
  const { data, error } = await supabase.from('ai_tools').select('*, categories(name)').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Not found' });
  res.json(data);
});

/**
 * @swagger
 * /api/ai-tools:
 *   post:
 *     summary: Create an AI tool
 *     tags: [AI Tools]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AiToolInput'
 *     responses:
 *       201:
 *         description: Created AI tool
 */
app.post('/api/ai-tools', requireAdmin, async (req, res) => {
  const { name, description, url, learning_notes, youtube_link, how_to_article, subscription, category_id } = req.body;
  const { data, error } = await supabase.from('ai_tools').insert({ name, description, url, learning_notes, youtube_link, how_to_article, subscription, category_id }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
});

/**
 * @swagger
 * /api/ai-tools/{id}:
 *   put:
 *     summary: Update an AI tool
 *     tags: [AI Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AiToolInput'
 *     responses:
 *       200:
 *         description: Updated AI tool
 */
app.put('/api/ai-tools/:id', requireAdmin, async (req, res) => {
  const { name, description, url, learning_notes, youtube_link, how_to_article, subscription, category_id } = req.body;
  const { data, error } = await supabase.from('ai_tools').update({ name, description, url, learning_notes, youtube_link, how_to_article, subscription, category_id }).eq('id', req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

/**
 * @swagger
 * /api/ai-tools/{id}:
 *   delete:
 *     summary: Delete an AI tool
 *     tags: [AI Tools]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Deleted
 */
app.delete('/api/ai-tools/:id', requireAdmin, async (req, res) => {
  const { error } = await supabase.from('ai_tools').delete().eq('id', req.params.id);
  if (error) return res.status(400).json({ error: error.message });
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
