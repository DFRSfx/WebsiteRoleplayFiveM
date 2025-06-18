// server/index.js
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import { body, validationResult } from 'express-validator';
import mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de segurança
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // máximo 5 tentativas
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false
});

// Configuração da base de dados MariaDB
const pool = mariadb.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'enigmarp',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'enigmarp_db',
  connectionLimit: 10,
  acquireTimeout: 30000,
  timeout: 30000
});

// Middleware para verificar JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso requerido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido' });
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar se é admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado. Permissões de administrador requeridas.' });
  }
  next();
};

// Validadores
const loginValidators = [
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Password deve ter pelo menos 6 caracteres')
];

const registerValidators = [
  body('username').isLength({ min: 3, max: 50 }).trim().withMessage('Username deve ter entre 3-50 caracteres'),
  body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 8 }).withMessage('Password deve ter pelo menos 8 caracteres')
];

const organizationValidators = [
  body('nome').isLength({ min: 3, max: 100 }).trim().withMessage('Nome deve ter entre 3-100 caracteres'),
  body('descricao').isLength({ min: 10, max: 500 }).trim().withMessage('Descrição deve ter entre 10-500 caracteres'),
  body('corHex').matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Cor deve ser um hex válido'),
  body('requisitos').isArray({ min: 1 }).withMessage('Pelo menos um requisito é necessário'),
  body('beneficios').isArray({ min: 1 }).withMessage('Pelo menos um benefício é necessário')
];

// Inicialização da base de dados
const initDatabase = async () => {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Criar tabela de utilizadores
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('user', 'moderator', 'admin', 'chefe_organizacao') DEFAULT 'user',
        active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        discord_username VARCHAR(100),
        failed_login_attempts INT DEFAULT 0,
        locked_until TIMESTAMP NULL
      )
    `);

    // Criar tabela de organizações
    await conn.query(`
      CREATE TABLE IF NOT EXISTS organizations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        slug VARCHAR(100) UNIQUE NOT NULL,
        descricao TEXT,
        cor_hex VARCHAR(7) DEFAULT '#0066cc',
        icone VARCHAR(50) DEFAULT 'building',
        aceita_candidaturas BOOLEAN DEFAULT TRUE,
        ativo BOOLEAN DEFAULT TRUE,
        chefe_id INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (chefe_id) REFERENCES users(id)
      )
    `);

    // Criar tabela de requisitos das organizações
    await conn.query(`
      CREATE TABLE IF NOT EXISTS organization_requirements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organization_id INT NOT NULL,
        requirement_text TEXT NOT NULL,
        order_index INT DEFAULT 0,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
      )
    `);

    // Criar tabela de benefícios das organizações
    await conn.query(`
      CREATE TABLE IF NOT EXISTS organization_benefits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organization_id INT NOT NULL,
        benefit_text TEXT NOT NULL,
        order_index INT DEFAULT 0,
        FOREIGN KEY (organization_id) REFERENCES organizations(id) ON DELETE CASCADE
      )
    `);

    // Criar tabela de candidaturas
    await conn.query(`
      CREATE TABLE IF NOT EXISTS organization_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        organization_id INT NOT NULL,
        nome_personagem VARCHAR(100) NOT NULL,
        nome_jogador VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        discord_username VARCHAR(100) NOT NULL,
        idade_personagem INT NOT NULL,
        horas_jogadas INT NOT NULL,
        experiencia_previa TEXT,
        motivacao TEXT NOT NULL,
        disponibilidade VARCHAR(255),
        informacao_adicional TEXT,
        estado ENUM('pendente', 'em_analise', 'aprovada', 'rejeitada') DEFAULT 'pendente',
        notas_admin TEXT,
        avaliado_por INT,
        data_avaliacao TIMESTAMP NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (organization_id) REFERENCES organizations(id),
        FOREIGN KEY (avaliado_por) REFERENCES users(id)
      )
    `);

    // Criar tabela de candidaturas à staff
    await conn.query(`
      CREATE TABLE IF NOT EXISTS staff_applications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        age INT NOT NULL,
        discord_username VARCHAR(100) NOT NULL,
        experience TEXT NOT NULL,
        why_join TEXT NOT NULL,
        hours_per_week INT NOT NULL,
        status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Criar utilizador admin padrão
    const adminExists = await conn.query('SELECT id FROM users WHERE role = "admin" LIMIT 1');
    if (adminExists.length === 0) {
      const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', 12);
      await conn.query(`
        INSERT INTO users (username, email, password_hash, role)
        VALUES (?, ?, ?, ?)
      `, ['admin', 'admin@enigmarp.com', adminPassword, 'admin']);
    }

    // Inserir organizações padrão se não existirem
    const orgExists = await conn.query('SELECT id FROM organizations LIMIT 1');
    if (orgExists.length === 0) {
      const organizations = [
        {
          nome: 'Polícia de Los Santos',
          slug: 'policia-ls',
          descricao: 'Força policial responsável por manter a ordem e segurança em Los Santos.',
          cor_hex: '#0066cc',
          icone: 'shield',
          requisitos: [
            'Mínimo 50 horas no servidor',
            'Registo criminal limpo',
            'Excelentes competências de comunicação'
          ],
          beneficios: [
            'Salário competitivo e benefícios',
            'Acesso a veículos e equipamento policial',
            'Oportunidades de progressão na carreira'
          ]
        },
        {
          nome: 'Serviços Médicos de Emergência',
          slug: 'sme',
          descricao: 'Equipa médica responsável por salvar vidas e prestar cuidados de emergência.',
          cor_hex: '#dc3545',
          icone: 'heart-pulse',
          requisitos: [
            'Mínimo 30 horas no servidor',
            'Conhecimentos básicos de roleplay médico',
            'Boas competências de comunicação'
          ],
          beneficios: [
            'Salário estável e pacote de benefícios',
            'Acesso a veículos e equipamento médico',
            'Formação médica especializada'
          ]
        }
      ];

      for (const org of organizations) {
        const result = await conn.query(`
          INSERT INTO organizations (nome, slug, descricao, cor_hex, icone)
          VALUES (?, ?, ?, ?, ?)
        `, [org.nome, org.slug, org.descricao, org.cor_hex, org.icone]);

        const orgId = result.insertId;

        // Inserir requisitos
        for (let i = 0; i < org.requisitos.length; i++) {
          await conn.query(`
            INSERT INTO organization_requirements (organization_id, requirement_text, order_index)
            VALUES (?, ?, ?)
          `, [orgId, org.requisitos[i], i]);
        }

        // Inserir benefícios
        for (let i = 0; i < org.beneficios.length; i++) {
          await conn.query(`
            INSERT INTO organization_benefits (organization_id, benefit_text, order_index)
            VALUES (?, ?, ?)
          `, [orgId, org.beneficios[i], i]);
        }
      }
    }

    console.log('Base de dados inicializada com sucesso!');
  } catch (error) {
    console.error('Erro ao inicializar base de dados:', error);
  } finally {
    if (conn) conn.release();
  }
};

// Rotas de autenticação
app.post('/api/auth/login', loginLimiter, loginValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, remember } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    
    // Verificar se a conta está bloqueada
    const user = await conn.query(`
      SELECT * FROM users 
      WHERE email = ? AND active = TRUE
    `, [email]);

    if (user.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const userData = user[0];

    // Verificar se a conta está temporariamente bloqueada
    if (userData.locked_until && new Date() < new Date(userData.locked_until)) {
      return res.status(423).json({ 
        error: 'Conta temporariamente bloqueada devido a muitas tentativas falhadas' 
      });
    }

    // Verificar password
    const passwordMatch = await bcrypt.compare(password, userData.password_hash);

    if (!passwordMatch) {
      // Incrementar tentativas falhadas
      let failedAttempts = userData.failed_login_attempts + 1;
      let lockedUntil = null;

      if (failedAttempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
      }

      await conn.query(`
        UPDATE users 
        SET failed_login_attempts = ?, locked_until = ?
        WHERE id = ?
      `, [failedAttempts, lockedUntil, userData.id]);

      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Reset tentativas falhadas e atualizar último login
    await conn.query(`
      UPDATE users 
      SET failed_login_attempts = 0, locked_until = NULL, last_login = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [userData.id]);

    // Gerar JWT
    const tokenExpiry = remember ? '30d' : '24h';
    const token = jwt.sign(
      { 
        id: userData.id, 
        username: userData.username, 
        email: userData.email,
        role: userData.role 
      },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: tokenExpiry }
    );

    res.json({
      success: true,
      token,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        role: userData.role
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    if (conn) conn.release();
  }
});

app.post('/api/auth/register', registerValidators, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;
  let conn;

  try {
    conn = await pool.getConnection();
    
    // Verificar se já existe
    const existing = await conn.query(`
      SELECT id FROM users WHERE email = ? OR username = ?
    `, [email, username]);

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email ou username já existe' });
    }

    // Hash da password
    const passwordHash = await bcrypt.hash(password, 12);

    // Inserir utilizador
    const result = await conn.query(`
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `, [username, email, passwordHash]);

    res.status(201).json({ 
      success: true, 
      message: 'Conta criada com sucesso',
      userId: result.insertId 
    });

  } catch (error) {
    console.error('Erro no registo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Rotas das organizações
app.get('/api/organizations', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    
    const organizations = await conn.query(`
      SELECT o.*, u.username as chefe_username
      FROM organizations o
      LEFT JOIN users u ON o.chefe_id = u.id
      WHERE o.ativo = TRUE
      ORDER BY o.nome
    `);

    // Buscar requisitos e benefícios para cada organização
    for (const org of organizations) {
      const requirements = await conn.query(`
        SELECT requirement_text 
        FROM organization_requirements 
        WHERE organization_id = ? 
        ORDER BY order_index
      `, [org.id]);

      const benefits = await conn.query(`
        SELECT benefit_text 
        FROM organization_benefits 
        WHERE organization_id = ? 
        ORDER BY order_index
      `, [org.id]);

      org.requisitos = requirements.map(r => r.requirement_text);
      org.beneficios = benefits.map(b => b.benefit_text);
    }

    res.json(organizations);
  } catch (error) {
    console.error('Erro ao buscar organizações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    if (conn) conn.release();
  }
});

app.get('/api/organizations/:slug', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    
    const org = await conn.query(`
      SELECT * FROM organizations WHERE slug = ? AND ativo = TRUE
    `, [req.params.slug]);

    if (org.length === 0) {
      return res.status(404).json({ error: 'Organização não encontrada' });
    }

    const organization = org[0];

    // Buscar requisitos e benefícios
    const requirements = await conn.query(`
      SELECT requirement_text 
      FROM organization_requirements 
      WHERE organization_id = ? 
      ORDER BY order_index
    `, [organization.id]);

    const benefits = await conn.query(`
      SELECT benefit_text 
      FROM organization_benefits 
      WHERE organization_id = ? 
      ORDER BY order_index
    `, [organization.id]);

    organization.requisitos = requirements.map(r => r.requirement_text);
    organization.beneficios = benefits.map(b => b.benefit_text);

    res.json(organization);
  } catch (error) {
    console.error('Erro ao buscar organização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Candidaturas às organizações
app.post('/api/organizations/:id/apply', async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    
    const {
      nomePersonagem,
      nomeJogador,
      email,
      discordUsername,
      idadePersonagem,
      horasJogadas,
      experienciaPrevia,
      motivacao,
      disponibilidade,
      informacaoAdicional
    } = req.body;

    // Verificar se a organização existe e aceita candidaturas
    const org = await conn.query(`
      SELECT id FROM organizations 
      WHERE id = ? AND ativo = TRUE AND aceita_candidaturas = TRUE
    `, [req.params.id]);

    if (org.length === 0) {
      return res.status(404).json({ error: 'Organização não encontrada ou não aceita candidaturas' });
    }

    // Verificar se já existe candidatura do mesmo email
    const existing = await conn.query(`
      SELECT id FROM organization_applications 
      WHERE organization_id = ? AND email = ? AND estado IN ('pendente', 'em_analise')
    `, [req.params.id, email]);

    if (existing.length > 0) {
      return res.status(409).json({ error: 'Já existe uma candidatura pendente com este email' });
    }

    // Inserir candidatura
    const result = await conn.query(`
      INSERT INTO organization_applications (
        organization_id, nome_personagem, nome_jogador, email, discord_username,
        idade_personagem, horas_jogadas, experiencia_previa, motivacao,
        disponibilidade, informacao_adicional
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      req.params.id, nomePersonagem, nomeJogador, email, discordUsername,
      idadePersonagem, horasJogadas, experienciaPrevia, motivacao,
      disponibilidade, informacaoAdicional
    ]);

    res.status(201).json({ 
      success: true, 
      message: 'Candidatura submetida com sucesso',
      applicationId: result.insertId 
    });

  } catch (error) {
    console.error('Erro ao submeter candidatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Listar candidaturas (requer autenticação)
app.get('/api/applications', authenticateToken, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    
    const applications = await conn.query(`
      SELECT a.*, o.nome as organization_name, o.cor_hex, u.username as avaliado_por_username
      FROM organization_applications a
      JOIN organizations o ON a.organization_id = o.id
      LEFT JOIN users u ON a.avaliado_por = u.id
      ORDER BY a.created_at DESC
    `);

    res.json(applications);
  } catch (error) {
    console.error('Erro ao buscar candidaturas:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Atualizar status de candidatura (requer admin)
app.patch('/api/applications/:id/status', authenticateToken, requireAdmin, async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    
    const { estado, notasAdmin } = req.body;
    
    await conn.query(`
      UPDATE organization_applications 
      SET estado = ?, notas_admin = ?, avaliado_por = ?, data_avaliacao = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [estado, notasAdmin, req.user.id, req.params.id]);

    res.json({ success: true, message: 'Status atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar candidatura:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  } finally {
    if (conn) conn.release();
  }
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Algo correu mal!' });
});

// Inicializar servidor
const startServer = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
  });
};

startServer().catch(console.error);