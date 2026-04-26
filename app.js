require("dotenv").config();

const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const express = require('express');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// =====================
// MIDDLEWARE
// =====================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// =====================
// MONGODB CONNECTION
// =====================

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hotel-demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// =====================
// ENQUIRY SCHEMA & MODEL
// =====================

const enquirySchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    checkIn: {
        type: String,
        default: 'Not specified',
    },
    checkOut: {
        type: String,
        default: 'Not specified',
    },
    roomType: {
        type: String,
        default: 'Not selected',
    },
    message: {
        type: String,
        default: '',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);

// =====================
// NODEMAILER TRANSPORTER
// =====================

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// =====================
// ROUTES
// =====================

// Home Page
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/test', (req, res) => {
    res.send("Server working");
});

// =====================
// BOOKING ENQUIRY ROUTE
// =====================

app.post('/send-enquiry', async (req, res) => {
    const { fullName, email, phone, checkIn, checkOut, roomType, message } = req.body;

    // Basic server-side validation
    if (!fullName || !email || !phone) {
        return res.status(400).json({
            success: false,
            message: 'Full name, email, and phone are required.',
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address.',
        });
    }

    // Format room type label
    const roomLabels = {
        deluxe: 'Deluxe Room',
        executive: 'Executive Suite',
        presidential: 'Presidential Suite',
    };
    const roomLabel = roomLabels[roomType] || 'Not selected';

    // ----------------------
    // Email to Hotel (Admin)
    // ----------------------
    const adminMailOptions = {
        from: process.env.EMAIL_USER,
        to: "kovila@proton.me",   // Hotel receives enquiry here
        subject: `New Booking Enquiry from ${fullName}`,
        html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
                
                <!-- Header -->
                <div style="background: linear-gradient(90deg, #143156 75%, #fcb600 100%); padding: 32px 40px;">
                    <h1 style="margin: 0; color: #FEDC52; font-size: 24px; letter-spacing: 2px;">DEMO HOTEL</h1>
                    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">New Booking Enquiry Received</p>
                </div>

                <!-- Body -->
                <div style="padding: 36px 40px; background: #ffffff;">
                    <h2 style="color: #143156; font-size: 20px; margin: 0 0 24px;">Guest Details</h2>

                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #f0f0f0;">
                            <td style="padding: 12px 0; color: #999; font-size: 13px; width: 40%; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</td>
                            <td style="padding: 12px 0; color: #1a1a2e; font-size: 15px; font-weight: 600;">${fullName}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f0f0f0;">
                            <td style="padding: 12px 0; color: #999; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Email</td>
                            <td style="padding: 12px 0; color: #1a1a2e; font-size: 15px;">${email}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f0f0f0;">
                            <td style="padding: 12px 0; color: #999; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Phone</td>
                            <td style="padding: 12px 0; color: #1a1a2e; font-size: 15px;">${phone}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f0f0f0;">
                            <td style="padding: 12px 0; color: #999; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Room Type</td>
                            <td style="padding: 12px 0; color: #1a1a2e; font-size: 15px;">${roomLabel}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f0f0f0;">
                            <td style="padding: 12px 0; color: #999; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Check-in</td>
                            <td style="padding: 12px 0; color: #1a1a2e; font-size: 15px;">${checkIn || 'Not specified'}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #f0f0f0;">
                            <td style="padding: 12px 0; color: #999; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Check-out</td>
                            <td style="padding: 12px 0; color: #1a1a2e; font-size: 15px;">${checkOut || 'Not specified'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px 0; color: #999; font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; vertical-align: top;">Message</td>
                            <td style="padding: 12px 0; color: #1a1a2e; font-size: 15px; line-height: 1.6;">${message || 'No message provided'}</td>
                        </tr>
                    </table>
                </div>

                <!-- Footer -->
                <div style="padding: 20px 40px; background: #f8f9fa; text-align: center; border-top: 1px solid #e5e5e5;">
                    <p style="margin: 0; color: #999; font-size: 12px;">Received at ${new Date().toLocaleString()} &nbsp;|&nbsp; DEMO HOTEL Booking System</p>
                </div>
            </div>
        `,
    };

    // ----------------------
    // Confirmation Email to Guest
    // ----------------------
    const guestMailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `Thank you for your enquiry, ${fullName}!`,
        html: `
            <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; border-radius: 8px; overflow: hidden;">

                <!-- Header -->
                <div style="background: linear-gradient(90deg, #143156 75%, #fcb600 100%); padding: 32px 40px;">
                    <h1 style="margin: 0; color: #FEDC52; font-size: 24px; letter-spacing: 2px;">DEMO HOTEL</h1>
                    <p style="margin: 8px 0 0; color: rgba(255,255,255,0.85); font-size: 14px;">Where Exceptional Experiences Begin</p>
                </div>

                <!-- Body -->
                <div style="padding: 36px 40px; background: #ffffff;">
                    <h2 style="color: #143156; font-size: 20px; margin: 0 0 16px;">Hi ${fullName}, we've got your enquiry!</h2>
                    <p style="color: #555; font-size: 15px; line-height: 1.8; margin: 0 0 24px;">
                        Thank you for reaching out to DEMO HOTEL. We have received your booking enquiry and our team will get back to you within <strong>24 hours</strong>.
                    </p>

                    <!-- Summary Box -->
                    <div style="background: #f8f9fa; border-left: 4px solid #FEDC52; border-radius: 4px; padding: 20px 24px; margin-bottom: 28px;">
                        <h3 style="color: #143156; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 12px;">Your Enquiry Summary</h3>
                        <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Room:</strong> ${roomLabel}</p>
                        <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Check-in:</strong> ${checkIn || 'Not specified'}</p>
                        <p style="margin: 4px 0; color: #555; font-size: 14px;"><strong>Check-out:</strong> ${checkOut || 'Not specified'}</p>
                    </div>

                    <p style="color: #555; font-size: 15px; line-height: 1.8; margin: 0;">
                        If you have any urgent questions, feel free to call us at <strong>+1 (555) 123-4567</strong> or reply to this email.
                    </p>
                </div>

                <!-- Footer -->
                <div style="padding: 20px 40px; background: #143156; text-align: center;">
                    <p style="margin: 0 0 8px; color: rgba(255,255,255,0.7); font-size: 12px;">123 Luxury Avenue, City &nbsp;|&nbsp; +1 (555) 123-4567 &nbsp;|&nbsp; info@demohotel.com</p>
                    <p style="margin: 0; color: rgba(255,255,255,0.4); font-size: 11px;">&copy; 2026 DEMO HOTEL. All rights reserved.</p>
                </div>
            </div>
        `,
    };

    // ----------------------
    // Send Emails & Save to Database
    // ----------------------
    try {
        // Send both emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(guestMailOptions);

        // Save enquiry to MongoDB
        const newEnquiry = new Enquiry({
            fullName,
            email,
            phone,
            checkIn: checkIn || 'Not specified',
            checkOut: checkOut || 'Not specified',
            roomType: roomType || 'Not selected',
            message: message || '',
        });

        await newEnquiry.save();

        console.log('✅ Enquiry saved to database:', newEnquiry._id);

        return res.status(200).json({
            success: true,
            message: 'Enquiry sent successfully and saved to database!',
        });
    } catch (error) {
        console.error('❌ Error:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Failed to process enquiry. Please try again later.',
        });
    }
});

// =====================
// 404 HANDLER
// =====================

app.use((req, res) => {
    res.status(404).send('<h2 style="font-family:sans-serif;text-align:center;margin-top:10vh;">404 — Page Not Found</h2>');
});

// =====================
// START SERVER
// =====================

app.listen(5000, () => {
    console.log(`🏨 DEMO HOTEL server running at http://localhost:${PORT}`);
});
