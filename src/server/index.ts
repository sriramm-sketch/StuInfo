import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateStudentInput } from '../services/validationService.ts';
import { generatePrediction, simulateWhatIf } from '../services/predictionService.ts';
import { generateAICoachPlan } from '../services/aiCoachService.ts';
import {
  getFilteredStudents,
  getStudentById,
  getCohortAnalytics,
  addStudentToCohort,
  exportCohortCSV
} from '../services/educatorService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, '../../public');

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// Helper to parse JSON request bodies
async function parseJsonBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 1e6) {
        // Protect against payload flood (1MB limit)
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

// Helper to send JSON responses
function sendJson(res: http.ServerResponse, statusCode: number, data: any) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

// MIME types for static assets
const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8'
};

// Static file server
function serveStaticFile(req: http.IncomingMessage, res: http.ServerResponse, filePath: string) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // SPA Fallback: serve index.html for unknown client routes
        const indexPath = path.join(PUBLIC_DIR, 'index.html');
        fs.readFile(indexPath, (indexErr, indexContent) => {
          if (indexErr) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(indexContent);
          }
        });
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    }
  });
}

// Main HTTP request listener
const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = url.pathname;

  try {
    // -------------------------------------------------------------
    // REST API ROUTES
    // -------------------------------------------------------------

    // 1. Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      return sendJson(res, 200, {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'StuInfo - Student Performance Prediction System',
        version: '1.0.0',
        nodeVersion: process.version
      });
    }

    // 2. Student Prediction Endpoint
    if (pathname === '/api/predict' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const validation = validateStudentInput(body);

      if (!validation.success || !validation.data) {
        return sendJson(res, 400, {
          success: false,
          errors: validation.errors || { general: 'Validation failed' }
        });
      }

      const prediction = generatePrediction(validation.data);
      return sendJson(res, 200, {
        success: true,
        data: prediction
      });
    }

    // 3. What-If Scenario Simulation
    if (pathname === '/api/what-if' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.baseInputs) {
        return sendJson(res, 400, {
          success: false,
          error: 'baseInputs is required for what-if simulation'
        });
      }

      const simulation = simulateWhatIf(body);
      return sendJson(res, 200, {
        success: true,
        data: simulation
      });
    }

    // 4. AI Academic Coach Endpoint (Groq API or offline fallback)
    if (pathname === '/api/coach' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      if (!body.prediction) {
        return sendJson(res, 400, {
          success: false,
          error: 'prediction object is required'
        });
      }

      const plan = await generateAICoachPlan(body.prediction);
      return sendJson(res, 200, {
        success: true,
        data: plan
      });
    }

    // 5. Educator Analytics Overview
    if (pathname === '/api/educator/analytics' && req.method === 'GET') {
      const analytics = getCohortAnalytics();
      return sendJson(res, 200, {
        success: true,
        data: analytics
      });
    }

    // 6. Educator Student Records (with search & filters)
    if (pathname === '/api/educator/students' && req.method === 'GET') {
      const search = url.searchParams.get('search') || undefined;
      const grade = url.searchParams.get('grade') || undefined;
      const band = url.searchParams.get('band') || undefined;
      const checkInOnly = url.searchParams.get('checkInOnly') === 'true';

      const result = getFilteredStudents({ search, grade, band, checkInOnly });
      return sendJson(res, 200, {
        success: true,
        data: result.students,
        total: result.total
      });
    }

    // 7. Single Student Detail
    if (pathname.startsWith('/api/educator/student/') && req.method === 'GET') {
      const studentId = pathname.replace('/api/educator/student/', '');
      const student = getStudentById(studentId);

      if (!student) {
        return sendJson(res, 404, {
          success: false,
          error: 'Student record not found'
        });
      }

      return sendJson(res, 200, {
        success: true,
        data: student
      });
    }

    // 8. Add Student Record to Educator Cohort
    if (pathname === '/api/educator/student' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const newStudent = addStudentToCohort(body);
      return sendJson(res, 201, {
        success: true,
        data: newStudent
      });
    }

    // 9. Export Cohort CSV
    if (pathname === '/api/educator/export' && req.method === 'GET') {
      const csv = exportCohortCSV();
      res.writeHead(200, {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="student-performance-cohort.csv"',
        'Cache-Control': 'no-cache'
      });
      res.end(csv);
      return;
    }

    // -------------------------------------------------------------
    // STATIC ASSETS & SINGLE PAGE APPLICATION CLIENT
    // -------------------------------------------------------------
    let sanitizedPath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    if (sanitizedPath === '/' || sanitizedPath === '\\') {
      sanitizedPath = '/index.html';
    }

    const staticFilePath = path.join(PUBLIC_DIR, sanitizedPath);

    // If file exists on disk, serve it; otherwise fall back to index.html for client-side routing
    if (fs.existsSync(staticFilePath) && !fs.statSync(staticFilePath).isDirectory()) {
      serveStaticFile(req, res, staticFilePath);
    } else {
      serveStaticFile(req, res, path.join(PUBLIC_DIR, 'index.html'));
    }
  } catch (error: any) {
    console.error('Unhandled Server Error:', error);
    sendJson(res, 500, {
      success: false,
      error: 'Internal server error occurred',
      message: error?.message || 'Unknown error'
    });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(`🚀 StuInfo - Student Performance Prediction System`);
  console.log(`   Running at: http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Demo Prediction Engine: Deterministic Heuristic v1.2`);
  console.log(`   Groq Integration: Configured (Online/Offline resilient)`);
  console.log(`=======================================================`);
});

// Graceful termination
process.on('SIGINT', () => {
  console.log('\nGracefully shutting down...');
  server.close(() => {
    process.exit(0);
  });
});
