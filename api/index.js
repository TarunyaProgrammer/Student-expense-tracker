const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin
// Checks for Service Account via Environment Variable
if (!admin.apps.length) {
    let serviceAccount;
    try {
        if (process.env.FIREBASE_SERVICE_ACCOUNT) {
            serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        } else {
             console.warn("No FIREBASE_SERVICE_ACCOUNT env var found.");
        }
        
        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        } else {
            // Fallback for Vercel if utilizing default credentials (rarely works for Auth check without key)
             admin.initializeApp();
        }
    } catch (e) {
        console.error("Firebase Admin Init Failed:", e);
    }
}

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

// Middleware to verify Firebase ID Token
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send('Unauthorized');
    }

    const idToken = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        req.uid = decodedToken.uid;
        next();
    } catch (error) {
        console.error("Auth Error:", error);
        res.status(403).send('Forbidden');
    }
};

// Health Check
app.get('/api', (req, res) => {
  res.send('Budgettt API Running');
});

// SYNC PUSH (Local -> Cloud)
app.post('/api/sync/push', authenticate, async (req, res) => {
    try {
        const transactions = req.body.transactions; // Array of txns
        if (!Array.isArray(transactions)) {
            return res.status(400).send("Invalid Body");
        }

        const batch = db.batch();
        const userRef = db.collection('users').doc(req.uid).collection('transactions');

        transactions.forEach(txn => {
           if (!txn.id) return;
           const docRef = userRef.doc(txn.id);
           // Force synced=true when saving to cloud
           const payload = { ...txn, synced: true };
           batch.set(docRef, payload);
        });

        await batch.commit();
        res.json({ success: true, count: transactions.length });
    } catch (error) {
        console.error("Push Error", error);
        res.status(500).send(error.message);
    }
});

// SYNC PULL (Cloud -> Local)
app.get('/api/sync/pull', authenticate, async (req, res) => {
    try {
        const userRef = db.collection('users').doc(req.uid).collection('transactions');
        const snapshot = await userRef.get();
        
        const txns = [];
        snapshot.forEach(doc => {
            txns.push(doc.data());
        });

        res.json({ transactions: txns });
    } catch (error) {
        console.error("Pull Error", error);
        res.status(500).send(error.message);
    }
});

// AI INSIGHTS (Mock for MVP)
app.post('/api/insights', authenticate, async (req, res) => {
    // In a real app, we would:
    // 1. Fetch user's recent transactions from Firestore
    // 2. Format them into a prompt
    // 3. Call Gemini API
    // 4. Return the text response
    
    // Privacy-First Mock Response
    setTimeout(() => {
        res.json({
            insight: "Based on your recent activity, you've been spending heavily on 'Food'. \n\nConsider setting a weekly limit of ₹500 for dining out to boost your savings. Your essentials spending looks stable! Keep it up."
        });
    }, 1500);
});

// For Vercel Serverless
module.exports = app;
