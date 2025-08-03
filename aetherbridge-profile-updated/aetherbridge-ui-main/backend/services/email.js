const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = null;
    this.initialized = false;
  }

  /**
   * Initialize email service
   */
  async initialize() {
    try {
      console.log('📧 Initializing email service...');
      
      // Create transporter
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      
      // Verify connection
      await this.transporter.verify();
      
      this.initialized = true;
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      console.log('⚠️ Email service not available, continuing without it...');
    }
  }

  /**
   * Send application status update email
   */
  async sendApplicationStatusUpdate(userEmail, applicationData) {
    try {
      if (!this.initialized) {
        console.log('Email service not available, skipping email send');
        return;
      }

      const { status, targetInstitution, targetProgram, adminComments } = applicationData;
      
      const subject = `Application Status Update - ${status.toUpperCase()}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6f00ff;">AetherBridge Application Update</h2>
          <p>Dear Student,</p>
          <p>Your application for <strong>${targetProgram}</strong> at <strong>${targetInstitution}</strong> has been updated.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Status: <span style="color: ${this.getStatusColor(status)};">${status.toUpperCase()}</span></h3>
            ${adminComments ? `<p><strong>Comments:</strong> ${adminComments}</p>` : ''}
          </div>
          <p>You can view the full details of your application in your AetherBridge dashboard.</p>
          <p>Best regards,<br>The AetherBridge Team</p>
        </div>
      `;

      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userEmail,
        subject,
        html,
      });

      console.log(`✅ Application status email sent to ${userEmail}`);
    } catch (error) {
      console.error('❌ Failed to send application status email:', error);
    }
  }

  /**
   * Send credential verification email
   */
  async sendCredentialVerificationEmail(userEmail, credentialData) {
    try {
      if (!this.initialized) {
        console.log('Email service not available, skipping email send');
        return;
      }

      const { title, issuer, status } = credentialData;
      
      const subject = `Credential Verification - ${status.toUpperCase()}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6f00ff;">AetherBridge Credential Verification</h2>
          <p>Dear Student,</p>
          <p>Your credential <strong>${title}</strong> from <strong>${issuer}</strong> has been verified on the blockchain.</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Status: <span style="color: ${this.getStatusColor(status)};">${status.toUpperCase()}</span></h3>
            <p>Your credential is now securely stored on the blockchain and can be verified by institutions worldwide.</p>
          </div>
          <p>You can view your verified credentials in your AetherBridge dashboard.</p>
          <p>Best regards,<br>The AetherBridge Team</p>
        </div>
      `;

      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userEmail,
        subject,
        html,
      });

      console.log(`✅ Credential verification email sent to ${userEmail}`);
    } catch (error) {
      console.error('❌ Failed to send credential verification email:', error);
    }
  }

  /**
   * Send NFT minting confirmation email
   */
  async sendNFTMintingEmail(userEmail, nftData) {
    try {
      if (!this.initialized) {
        console.log('Email service not available, skipping email send');
        return;
      }

      const { tokenId, transactionHash, blockchainLink } = nftData;
      
      const subject = 'NFT Credential Minted Successfully';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6f00ff;">NFT Credential Minted</h2>
          <p>Dear Student,</p>
          <p>Your credential has been successfully minted as an NFT on the Ethereum blockchain!</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">NFT Details:</h3>
            <p><strong>Token ID:</strong> ${tokenId}</p>
            <p><strong>Transaction Hash:</strong> ${transactionHash}</p>
            <p><a href="${blockchainLink}" style="color: #6f00ff;">View on Blockchain Explorer</a></p>
          </div>
          <p>Your NFT credential is now tradeable and can be displayed in your digital wallet.</p>
          <p>Best regards,<br>The AetherBridge Team</p>
        </div>
      `;

      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userEmail,
        subject,
        html,
      });

      console.log(`✅ NFT minting email sent to ${userEmail}`);
    } catch (error) {
      console.error('❌ Failed to send NFT minting email:', error);
    }
  }

  /**
   * Send welcome email
   */
  async sendWelcomeEmail(userEmail, userName) {
    try {
      if (!this.initialized) {
        console.log('Email service not available, skipping email send');
        return;
      }

      const subject = 'Welcome to AetherBridge - Your Academic Mobility Platform';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6f00ff;">Welcome to AetherBridge!</h2>
          <p>Dear ${userName},</p>
          <p>Welcome to AetherBridge, your gateway to global academic mobility and verified credentials!</p>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">What you can do:</h3>
            <ul>
              <li>Submit applications for credit equivalency</li>
              <li>Use AI-powered course comparison</li>
              <li>View blockchain-verified credentials</li>
              <li>Mint credentials as NFTs</li>
              <li>Connect with global mentors</li>
            </ul>
          </div>
          <p>Get started by exploring your dashboard and submitting your first application!</p>
          <p>Best regards,<br>The AetherBridge Team</p>
        </div>
      `;

      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userEmail,
        subject,
        html,
      });

      console.log(`✅ Welcome email sent to ${userEmail}`);
    } catch (error) {
      console.error('❌ Failed to send welcome email:', error);
    }
  }

  /**
   * Get status color for email styling
   */
  getStatusColor(status) {
    switch (status.toLowerCase()) {
      case 'approved':
      case 'verified':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'rejected':
      case 'revoked':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  }

  /**
   * Send generic notification email
   */
  async sendNotificationEmail(userEmail, subject, message) {
    try {
      if (!this.initialized) {
        console.log('Email service not available, skipping email send');
        return;
      }

      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6f00ff;">AetherBridge Notification</h2>
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            ${message}
          </div>
          <p>Best regards,<br>The AetherBridge Team</p>
        </div>
      `;

      await this.transporter.sendMail({
        from: process.env.SMTP_USER,
        to: userEmail,
        subject,
        html,
      });

      console.log(`✅ Notification email sent to ${userEmail}`);
    } catch (error) {
      console.error('❌ Failed to send notification email:', error);
    }
  }
}

// Create singleton instance
const emailService = new EmailService();

module.exports = {
  emailService,
  initializeEmail: () => emailService.initialize(),
}; 