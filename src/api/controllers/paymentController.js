const axios = require('axios');
const courseService = require('../services/courseService');
const User = require('../models/userModel');
const Payment = require('../models/paymentModel');  

// Initialisation du paiement
exports.initPayment = async (req, res) => {
    const apiKey = '66c5dd3f2a3dbe1475fd1cff:AFPmhIlKUkyQxeTrBVjudQAKFmrCaX';
    const walletId = '66c5dd3f2a3dbe1475fd1d08';
    const { courseId } = req.params;

    try {
        // Récupérez l'utilisateur connecté
        const userResponse = await axios.get('http://127.0.0.1:3000/api/users/me', {
            headers: { 'Authorization': `${req.headers.authorization}` }
        });
        const userId = userResponse.data._id; // Extraire l'ID de l'utilisateur

        // Vérifiez les informations du cours
        const course = await courseService.getCourse(courseId);
        if (!course || !course.price) {
            return res.status(404).json({ message: 'Course not found or price is missing' });
        }

        // Enregistrez le paiement dans la base de données avec le statut 'pending'
        const payment = new Payment({
            userId,
            courseId,
            amount: course.price,
            status: 'pending'
        });
        await payment.save();

        // Ajouter le cours à l'utilisateur une seule fois
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Vérifiez si le cours existe déjà dans purchasedCourses
        if (!user.purchasedCourses.includes(courseId)) {
            user.purchasedCourses.push(courseId);
            await user.save();
        }

        // Préparez les données de paiement pour l'API
        const paymentData = {
            receiverWalletId: walletId,
            amount: (course.price * 100),
            token: 'USD',
            webhook: `https://0bf8-41-225-54-70.ngrok-free.app/api/payments/webhook`,
            description: `Payment for course ${courseId}`,
            successUrl: "http://localhost:3006/my-courses",
            failUrl: "http://localhost:3006/my-courses",
            theme: "light",
            silentWebhook: true
        };

        // Envoyez la demande d'initialisation de paiement
        const response = await axios.post('https://api.preprod.konnect.network/api/v2/payments/init-payment', paymentData, {
            headers: { 'x-api-key': apiKey, 'Content-Type': 'application/json' }
        });

        // Mettez à jour le modèle de paiement avec la référence de paiement reçue
        payment.paymentRef = response.data.paymentRef;
        await payment.save();

        // Répondez avec les détails de paiement
        res.status(200).json({ ...response.data, paymentRef: response.data.paymentRef });
    } catch (error) {
        console.error('Error initializing payment:', error);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// Récupérer les détails du paiement
exports.getPaymentDetails = async (req, res) => {
    const apiKey = '66c5dd3f2a3dbe1475fd1cff:AFPmhIlKUkyQxeTrBVjudQAKFmrCaX';
    const { paymentid } = req.params;

    if (!paymentid) {
        return res.status(400).json({ error: 'Payment ID is required' });
    }

    try {
        const response = await axios.get(`https://api.preprod.konnect.network/api/v2/payments/${paymentid}`, {
            headers: { 'x-api-key': apiKey }
        });

        res.status(200).json(response.data);
    } catch (error) {
        console.error('Error fetching payment details:', error.response ? error.response.data : error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// Gestion du webhook
exports.handleWebhook = async (req, res) => {
    const paymentRef = req.query.payment_ref;

    if (!paymentRef) {
        return res.status(400).json({ message: 'Payment reference is missing' });
    }

    try {
        const apiKey = '66c5dd3f2a3dbe1475fd1cff:AFPmhIlKUkyQxeTrBVjudQAKFmrCaX';
        const response = await axios.get(`https://api.preprod.konnect.network/api/v2/payments/${paymentRef}`, {
            headers: { 'x-api-key': apiKey }
        });

        const paymentDetails = response.data;

        // Mettez à jour le statut du paiement dans la base de données
        const payment = await Payment.findOne({ paymentRef });
        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = paymentDetails.payment.status;
        await payment.save();

        res.status(200).send('Payment status updated successfully');
    } catch (error) {
        console.error('Error handling webhook:', error.response ? error.response.data : error.message);
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: error.message });
        }
    }
};

// Récupérer tous les paiements
exports.getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('userId', 'firstname lastname') // Optionnel : Inclure les infos utilisateur
            .populate('courseId', 'title')           // Optionnel : Inclure les infos du cours
            .sort({ createdAt: -1 });               // Optionnel : Trier par date décroissante

        res.status(200).json(payments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ error: error.message });
    }
};
