#!/usr/bin/env python3
"""
Nail'd - Fulfillment Provider Inquiry Email Sender
This script sends professional inquiry emails to fulfillment providers.

SETUP INSTRUCTIONS:
1. Enable 2-Factor Authentication on your Gmail account
2. Create an App Password: https://myaccount.google.com/apppasswords
3. Replace YOUR_APP_PASSWORD below with the 16-character password Google gives you
4. Run: python3 send_inquiry_emails.py
"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import sys

# Gmail Configuration
SENDER_EMAIL = "xxearthx@gmail.com"
SENDER_NAME = "Kegan Meng"
APP_PASSWORD = "euhh tsho abfe pvys"  # Gmail App Password
SMTP_SERVER = "smtp.gmail.com"
SMTP_PORT = 587

# Recipient Information
recipients = [
    {
        "email": "contact@universalfulfillment.com",
        "name": "Universal Fulfillment Team",
        "subject": "Webhook Integration & Pricing Inquiry for Nail'd Subscription Box Service",
        "body": """Hello Universal Fulfillment Team,

I am reaching out on behalf of Nail'd, a premium print-on-demand nail art subscription box service. We are launching a tiered subscription model and are impressed by your 20+ years of expertise in subscription box fulfillment.

SERVICE REQUIREMENTS:
- Monthly subscription box fulfillment (3 subscription tiers: Starter, Premium, Elite)
- Custom branded packaging (boxes, tissue paper, branded stickers, inserts)
- Same-day shipping coordination for launch day delivery
- Shopify integration for automated order processing

TECHNICAL INTEGRATION QUESTIONS:
1. Webhook Support: Do you offer webhook integration to automatically sync orders from our Shopify store to your fulfillment system? What is the API documentation and setup process?
2. Real-time Order Status: Can we receive real-time webhook notifications when orders are packed, shipped, and delivered?
3. Inventory Sync: Does your system support automatic inventory level syncing to prevent overselling?

BUSINESS QUESTIONS:
1. Pricing Structure: What are your per-box fulfillment fees for different subscription tiers? Are there volume discounts?
2. Revenue Percentage: What percentage of order value do you typically charge for fulfillment services (including packaging, assembly, and shipping)?
3. Custom Packaging: What are the costs for custom box design, branded tissue paper, and custom stickers?
4. Minimum Orders: Do you have order minimums, or can we start with smaller volumes?

We are launching with an estimated 500-1,000 subscription boxes monthly in the first quarter, scaling to 5,000+ by Q3. We prioritize premium unboxing experiences and custom branding to differentiate our brand in the competitive nail art market.

Could you provide:
- Your current pricing sheet for subscription box fulfillment
- API/webhook documentation
- Sample custom packaging options
- A timeline for onboarding

We would appreciate a call to discuss partnership opportunities. Please let us know your availability.

Thank you for your time, and I look forward to partnering with Universal Fulfillment.

Best regards,
Kegan Meng
Nail'd - Founder/CEO
xxearthx@gmail.com
805-380-7870"""
    },
    {
        "email": "info@sundanceusa.com",
        "name": "SunDance USA Team",
        "subject": "Custom Packaging & Fulfillment Partnership Inquiry for Nail'd",
        "body": """Hello SunDance Team,

I am contacting you regarding a potential partnership with Nail'd, a premium nail art subscription and print-on-demand company. We are impressed by your in-house custom packaging capabilities and USA-made manufacturing standards.

ABOUT NAIL'D:
We offer premium nail art designs through multiple channels: monthly subscription boxes, one-time purchases, and aftercare kits. We are seeking a fulfillment partner who can provide custom branded packaging that elevates our unboxing experience and reinforces our brand identity.

SERVICE REQUIREMENTS:
- Custom packaging design and manufacturing (branded boxes, tissue paper, inserts, stickers)
- Subscription box fulfillment and kitting services
- Pick & pack operations for one-time purchases
- Scalable operations (500-5,000+ boxes monthly)
- USA-made products for premium brand positioning

TECHNICAL INTEGRATION QUESTIONS:
1. Webhook/API Integration: Do you offer webhook or API integration for automated order processing from Shopify? What is the technical setup?
2. Real-time Tracking: Can you provide real-time order status updates via webhooks or API?
3. Inventory Management: Do you support automated inventory syncing to prevent stockouts?

BUSINESS QUESTIONS:
1. Custom Packaging Costs: What is the lead time and cost for custom box design, branded tissue, stickers, and inserts?
2. Fulfillment Pricing: What are your per-unit fulfillment fees including packaging, assembly, and shipping?
3. Revenue Percentage: What percentage of order value do you typically charge for end-to-end fulfillment services?
4. Volume Discounts: Do you offer tiered pricing for monthly volumes of 500, 1,000, 5,000+ units?
5. Minimum Order Quantities: What are your minimum order quantities for custom packaging?

We would like to schedule a consultation, receive samples of your custom packaging options, and get a detailed pricing proposal. Could you provide availability for a call this week?

Thank you for your consideration. I look forward to exploring a partnership with SunDance.

Best regards,
Kegan Meng
Nail'd - Founder/CEO
xxearthx@gmail.com
805-380-7870"""
    },
    {
        "email": "support@printful.com",
        "name": "Printful Team",
        "subject": "Webhook Integration & Custom Branding Inquiry for Nail'd",
        "body": """Hello Printful Team,

I am reaching out on behalf of Nail'd, a premium nail art company launching a multi-channel sales model including print-on-demand nail wraps, one-time purchases, and custom branded products.

We are interested in leveraging Printful's print-on-demand and dropshipping capabilities for our one-time purchase channel while we manage subscription boxes through a separate fulfillment partner.

SERVICE REQUIREMENTS:
- Print-on-demand nail wraps with custom designs
- Custom branded packaging (boxes, tissue, stickers)
- Dropshipping integration with our Shopify store
- Global shipping capabilities
- No inventory requirements

TECHNICAL INTEGRATION QUESTIONS:
1. Webhook Support: Does Printful offer webhook integration for real-time order status updates? What events are supported (order received, printed, shipped, delivered)?
2. Automated Order Processing: Can orders from our Shopify store be automatically processed through your system without manual intervention?
3. Custom Branding: Can we customize packaging with our Nail'd branding? What is the process and lead time?
4. API Documentation: Can you provide API/webhook documentation for our development team?

BUSINESS QUESTIONS:
1. Pricing Structure: What are your per-unit costs for nail wrap printing? Do you offer volume discounts?
2. Custom Packaging: What are the costs for custom branded boxes, tissue paper, and stickers?
3. Revenue Percentage: What is your typical markup or revenue share model?
4. Storage Fees: What are your monthly storage fees for custom packaging inventory?

We are launching with an estimated 100-500 one-time purchases monthly, scaling to 1,000+ by Q3. We want to test designs and market demand without holding inventory, making print-on-demand ideal for this channel.

Could you provide:
- Detailed pricing for nail wrap printing and custom packaging
- API/webhook documentation
- Information about custom branding options
- Timeline for account setup and first order

We would appreciate a quick call to discuss how Printful can support our launch.

Thank you, and I look forward to partnering with Printful.

Best regards,
Kegan Meng
Nail'd - Founder/CEO
xxearthx@gmail.com
805-380-7870"""
    },
    {
        "email": "sales@getnimbl.com",
        "name": "Nimbl Team",
        "subject": "Subscription Box & Webhook Integration Inquiry for Nail'd",
        "body": """Hello Nimbl Team,

I am contacting you regarding a potential fulfillment partnership with Nail'd, a premium nail art subscription and ecommerce company. We are impressed by your specialized subscription box fulfillment services and are interested in learning more about your technical capabilities.

SERVICE REQUIREMENTS:
- Subscription box fulfillment (3 subscription tiers)
- Custom branded packaging and kitting
- Pick & pack operations for one-time purchases
- Scalable operations (500-5,000+ boxes monthly)
- Real-time order tracking and updates

TECHNICAL INTEGRATION QUESTIONS:
1. Webhook/API Integration: Do you offer webhook or API integration for automated order syncing from Shopify? What events are supported?
2. Real-time Status Updates: Can you provide real-time webhook notifications for order status changes (packed, shipped, delivered)?
3. Inventory Sync: Does your system support automatic inventory level syncing?
4. Custom Integrations: If we have custom requirements, do you offer custom API development?

BUSINESS QUESTIONS:
1. Fulfillment Pricing: What are your per-box fulfillment fees for subscription boxes?
2. Revenue Percentage: What percentage of order value do you typically charge for end-to-end fulfillment?
3. Custom Packaging: What are the costs for custom branded packaging, tissue, stickers, and inserts?
4. Volume Discounts: Do you offer tiered pricing for different monthly volumes?
5. Onboarding Timeline: How long does it take to set up a new fulfillment account?

We are launching a premium nail art subscription service with a focus on custom branding and premium unboxing experiences. We need a fulfillment partner who can scale with us and provide technical integration for automated order processing.

We would like to schedule a call to discuss your webhook/API capabilities, custom packaging options, pricing structure, and onboarding timeline.

Thank you, and I look forward to exploring a partnership with Nimbl.

Best regards,
Kegan Meng
Nail'd - Founder/CEO
xxearthx@gmail.com
805-380-7870"""
    }
]

def send_emails():
    """Send inquiry emails to all fulfillment providers."""
    
    # Validate app password
    if APP_PASSWORD == "YOUR_APP_PASSWORD":
        print("❌ ERROR: You must set your Gmail App Password first!")
        print("\nSTEPS TO GET YOUR APP PASSWORD:")
        print("1. Go to: https://myaccount.google.com/apppasswords")
        print("2. Select 'Mail' and 'Windows Computer' (or your device)")
        print("3. Google will generate a 16-character password")
        print("4. Copy it and replace 'YOUR_APP_PASSWORD' in this script")
        print("5. Run the script again")
        sys.exit(1)
    
    print("🚀 Nail'd - Email Sender Started")
    print(f"📧 Sending from: {SENDER_EMAIL}")
    print(f"📤 Recipients: {len(recipients)}")
    print("-" * 60)
    
    sent_count = 0
    failed_count = 0
    
    try:
        # Connect to Gmail SMTP server
        print("🔗 Connecting to Gmail SMTP server...")
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()
        server.login(SENDER_EMAIL, APP_PASSWORD)
        print("✅ Connected and authenticated!")
        print("-" * 60)
        
        # Send emails to each recipient
        for recipient in recipients:
            try:
                print(f"\n📧 Sending to: {recipient['name']}")
                print(f"   Email: {recipient['email']}")
                print(f"   Subject: {recipient['subject']}")
                
                # Create message
                message = MIMEMultipart("alternative")
                message["Subject"] = recipient['subject']
                message["From"] = f"{SENDER_NAME} <{SENDER_EMAIL}>"
                message["To"] = recipient['email']
                
                # Add body
                part = MIMEText(recipient['body'], "plain")
                message.attach(part)
                
                # Send email
                server.sendmail(SENDER_EMAIL, recipient['email'], message.as_string())
                print("   ✅ Sent successfully!")
                sent_count += 1
                
            except Exception as e:
                print(f"   ❌ Failed to send: {str(e)}")
                failed_count += 1
        
        # Close connection
        server.quit()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 SUMMARY")
        print("=" * 60)
        print(f"✅ Successfully sent: {sent_count}/{len(recipients)}")
        if failed_count > 0:
            print(f"❌ Failed: {failed_count}/{len(recipients)}")
        print("=" * 60)
        
        if sent_count == len(recipients):
            print("\n🎉 All emails sent successfully!")
            print("📬 Check your sent folder in Gmail to confirm")
            print("⏰ Expect responses within 24-48 hours")
        
    except smtplib.SMTPAuthenticationError:
        print("❌ Authentication failed!")
        print("   Make sure your App Password is correct")
        print("   Get it from: https://myaccount.google.com/apppasswords")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    send_emails()
