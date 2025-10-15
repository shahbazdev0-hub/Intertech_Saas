// require("dotenv").config();
// // require("express-async-errors");
// const express = require("express");
// const app = express();

// // extra security packages
// const helmet = require("helmet");
// const cors = require("cors");
// // const xss = require("xss-clean");
// const rateLimiter = require("express-rate-limit");

// // connect db
// const connectDB = require("./database/connect");

// // routers
// const authRouter = require("./routes/auth");
// const saleRouter = require("./routes/sale");
// const autoSaleRouter = require("./routes/auto-sale");
// const leadRouter = require("./routes/lead");
// const saleHistoryRouter = require("./routes/sale-history");

// // error handler
// const notFoundMiddleware = require("./middleware/not-found");
// const errorHandlerMiddleware = require("./middleware/error-handler");
// const auth = require("./middleware/authentication");

// app.use(express.json());
// app.use(
//   rateLimiter({
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//   })
// );
// app.use(helmet());
// const allowedOrigins = [
//   process.env.FRONTEND_APP_URL ||
//     "https://sales-automation-frontend.vercel.app",
//   "http://localhost:5173", // For local development
// ];
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // Allow requests with no origin (like Postman)
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("Not allowed by CORS"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true, // Set true if frontend sends cookies or tokens
//   })
// );
// // app.use(
// // cors()
// // cors({
// //   origin: (origin, callback) => {
// //     // Allow requests with no origin (e.g., Postman, curl)
// //     if (!origin) return callback(null, true);
// //     if (allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// //   methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
// //   allowedHeaders: ["Content-Type", "Authorization"],
// //   credentials: false, // Set to true if using cookies
// // })
// // );
// // app.use(xss());

// // routes
// app.use("/api/v1/auth", authRouter);
// app.use("/api/v1/sales", saleRouter);
// app.use("/api/v1/leads", leadRouter);
// app.use("/api/v1/auto-sales", autoSaleRouter);
// app.use("/api/v1/sale-history", saleHistoryRouter);

// app.use(notFoundMiddleware);
// app.use(errorHandlerMiddleware);

// const port = process.env.PORT;

// const start = async () => {
//   try {
//     await connectDB(process.env.MONGO_URI);
//     app.listen(port, () => {
//       console.log(`Server is up and listening on port ${port}`);
//     });
//   } catch (error) {
//     console.log(error);
//   }
// };
// start();



require("dotenv").config();
// require("express-async-errors");
const express = require("express");
const app = express();

// extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

// connect db
const connectDB = require("./database/connect");

// routers
const authRouter = require("./routes/auth");
const saleRouter = require("./routes/sale");
const autoSaleRouter = require("./routes/auto-sale");
const leadRouter = require("./routes/lead");
const saleHistoryRouter = require("./routes/sale-history");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const auth = require("./middleware/authentication");

app.use(express.json());
app.use(
  rateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  })
);
app.use(helmet());
const allowedOrigins = [
  process.env.FRONTEND_APP_URL,
  "https://futurenowconsulting.com",
  "http://localhost:5173", // For local development
];
// app.use(cors());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., Postman, curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: false, // Set to true if using cookies
  })
);
app.use(xss());

// STRICT Network Access Control - Blocks Even Localhost on Wrong Networks
const networkAccessControl = (req, res, next) => {
  const os = require('os');
  
  // Function to generate Access Denied HTML page
  const generateAccessDeniedHTML = (jsonData) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Access Denied - Unauthorized Network</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                color: #333;
            }
            
            .container {
                background: white;
                border-radius: 15px;
                padding: 40px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                text-align: center;
                max-width: 500px;
                width: 90%;
                animation: slideIn 0.6s ease-out;
            }
            
            @keyframes slideIn {
                from {
                    opacity: 0;
                    transform: translateY(-30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .icon {
                font-size: 80px;
                color: #e74c3c;
                margin-bottom: 20px;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            
            h1 {
                color: #e74c3c;
                margin-bottom: 15px;
                font-size: 2.5em;
                font-weight: 700;
            }
            
            .subtitle {
                color: #7f8c8d;
                font-size: 1.2em;
                margin-bottom: 30px;
                font-weight: 500;
            }
            
            .message {
                background: #f8f9fa;
                border-left: 4px solid #e74c3c;
                padding: 20px;
                margin: 25px 0;
                border-radius: 5px;
                text-align: left;
            }
            
            .message h3 {
                color: #e74c3c;
                margin-bottom: 10px;
            }
            
            .info-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
                margin: 20px 0;
                font-size: 0.9em;
            }
            
            .info-item {
                background: #ecf0f1;
                padding: 15px;
                border-radius: 8px;
                border: 1px solid #bdc3c7;
            }
            
            .info-item strong {
                color: #2c3e50;
                display: block;
                margin-bottom: 5px;
            }
            
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #ecf0f1;
                color: #95a5a6;
                font-size: 0.9em;
            }
            
            .timestamp {
                font-family: 'Courier New', monospace;
                background: #2c3e50;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                display: inline-block;
                margin-top: 10px;
            }
            
            @media (max-width: 600px) {
                .container {
                    padding: 25px;
                }
                
                h1 {
                    font-size: 2em;
                }
                
                .info-grid {
                    grid-template-columns: 1fr;
                }
                
                .icon {
                    font-size: 60px;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="icon">🚫</div>
            <h1>Access Denied</h1>
            <p class="subtitle">Unauthorized Network Access</p>
            
            <div class="message">
                <h3>Access Restricted</h3>
                <p>${jsonData.message}</p>
            </div>
            
            <div class="info-grid">
                ${jsonData.blockedIP ? `<div class="info-item">
                    <strong>Blocked IP:</strong>
                    ${jsonData.blockedIP}
                </div>` : ''}
                ${jsonData.authorizedNetwork ? `<div class="info-item">
                    <strong>Authorized Network:</strong>
                    ${jsonData.authorizedNetwork}
                </div>` : ''}
                ${jsonData.currentServerNetwork ? `<div class="info-item">
                    <strong>Current Server Network:</strong>
                    ${jsonData.currentServerNetwork}
                </div>` : ''}
                ${jsonData.serverIPs ? `<div class="info-item">
                    <strong>Server IPs:</strong>
                    ${Array.isArray(jsonData.serverIPs) ? jsonData.serverIPs.join(', ') : jsonData.serverIPs}
                </div>` : ''}
            </div>
            
            <div class="footer">
                <p>This application is restricted to authorized networks only.</p>
                <p>If you believe this is an error, please contact your system administrator.</p>
                ${jsonData.timestamp ? `<div class="timestamp">${jsonData.timestamp}</div>` : ''}
            </div>
        </div>
    </body>
    </html>`;
  };
  
  // Get all network interfaces of the server machine
  const getServerNetworkInfo = () => {
    const interfaces = os.networkInterfaces();
    const ips = [];
    
    for (const name of Object.keys(interfaces)) {
      for (const net of interfaces[name]) {
        if (net.family === 'IPv4' && !net.internal) {
          ips.push(net.address);
        }
      }
    }
    return ips;
  };
  
  const serverIPs = getServerNetworkInfo();
  console.log(`🖥️ Server's current IPs: ${serverIPs.join(', ')}`);
  
  // Check if server is on authorized network
  const isServerOnAuthorizedNetwork = serverIPs.some(ip => ip.startsWith('192.168.20.'));
  
  if (!isServerOnAuthorizedNetwork) {
    console.log(`🚫 SERVER BLOCKED: Not on authorized network (192.168.20.x)`);
    console.log(`🚫 Current server IPs: ${serverIPs.join(', ')}`);
    const jsonResponse = {
      success: false,
      error: 'Access Denied',
      message: 'Access Denied - Server not on authorized network',
      serverIPs: serverIPs,
      authorizedNetwork: '192.168.20.x',
      timestamp: new Date().toISOString()
    };
    return res.status(403).type('html').send(generateAccessDeniedHTML(jsonResponse));
  }
  
  // Get client IP
  let clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                 req.headers['x-real-ip'] ||
                 req.connection.remoteAddress ||
                 req.socket.remoteAddress ||
                 req.ip;
  
  if (clientIP?.startsWith('::ffff:')) {
    clientIP = clientIP.substring(7);
  }
  
  console.log(`🔍 Request from IP: ${clientIP}`);
  
  // Even for localhost, check if server is on correct network
  if (clientIP === '127.0.0.1' || clientIP === '::1' || clientIP === '::ffff:127.0.0.1') {
    if (isServerOnAuthorizedNetwork) {
      console.log(`✅ Localhost access allowed (server on authorized network)`);
      return next();
    } else {
      console.log(`🚫 Localhost BLOCKED (server not on authorized network)`);
      const jsonResponse = {
        success: false,
        error: 'Access Denied',
        message: 'Access Denied - Server must be on authorized network',
        currentServerNetwork: serverIPs[0]?.substring(0, serverIPs[0].lastIndexOf('.')) + '.x',
        authorizedNetwork: '192.168.20.x'
      };
      return res.status(403).type('html').send(generateAccessDeniedHTML(jsonResponse));
    }
  }
  
  // For external IPs, only allow 192.168.20.x
  if (clientIP && clientIP.startsWith('192.168.20.')) {
    console.log(`✅ Authorized network access: ${clientIP}`);
    return next();
  }
  
  // Block all other IPs
  console.log(`🚫 ACCESS DENIED for IP: ${clientIP}`);
  const jsonResponse = {
    success: false,
    error: 'Access Denied',
    message: 'Access Denied - Only authorized network allowed',
    blockedIP: clientIP,
    timestamp: new Date().toISOString()
  };
  return res.status(403).type('html').send(generateAccessDeniedHTML(jsonResponse));
};

// Apply network access control to all routes
app.use(networkAccessControl);

// Health check endpoint
app.get("/api/v1/auth/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/sales", saleRouter);
app.use("/api/v1/leads", leadRouter);
app.use("/api/v1/auto-sales", autoSaleRouter);
app.use("/api/v1/sale-history", saleHistoryRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT;
console.log(process.env.MONGO_URI);
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is up and listening on port ${port}`);
    });
  } catch (error) {
    console.log(error.message);
  }
};
start();