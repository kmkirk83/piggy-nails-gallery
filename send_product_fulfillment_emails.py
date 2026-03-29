#!/usr/bin/env python3
"""
Nail'd - Product Fulfillment Inquiry Email Sender
Sends inquiries to Printify and Printful for print-on-demand partnership
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
        "email": "merchantsupport@printify.com",
        "name": "Printify Merchant Support",
        "subject": "Webhook Integration & Custom Branding Inquiry for Nail'd Print-On-Demand",
        "body": """Hello Printify Team,

I am reaching out on behalf of Nail'd, a premium nail art print-on-demand and subscription company. We are launching a multi-channel sales model and are impressed by Printify's 900+ product catalog and webhook integration capabilities.

ABOUT NAIL'D:
Nail'd offers premium nail art designs through:
- Monthly subscription boxes (3 tiers: Starter, Premium, Elite)
- One-time nail art collections
- Premium aftercare kits
- Custom design studio for user-generated content

We are seeking a fulfillment partner for our **one-time purchase channel** (nail art collections, aftercare kits, individual products).

SERVICE REQUIREMENTS:
- Print-on-demand nail wraps, stickers, and related products
- Custom branded packaging (boxes, tissue paper, branded stickers)
- No inventory required (print as we sell)
- Global shipping capabilities
- Webhook/API integration for automated order processing

TECHNICAL INTEGRATION QUESTIONS:
1. Webhook Support: Do you offer webhook integration for real-time order status updates? What events are supported (order received, printed, shipped, delivered)?
2. Automated Order Processing: Can orders from our Shopify/custom store be automatically processed through your system without manual intervention?
3. Custom Branding: Can we customize packaging with our Nail'd branding? What is the process, timeline, and cost?
4. API Documentation: Can you provide comprehensive API/webhook documentation for our development team?
5. Test Environment: Do you offer a sandbox/test environment for integration testing?

BUSINESS QUESTIONS:
1. Pricing Structure: What are your per-unit costs for nail wraps, stickers, and related products? Do you offer volume discounts?
2. Custom Packaging: What are the costs for custom branded boxes, tissue paper, and stickers? What are the minimum order quantities?
3. Turnaround Time: What is your typical production and shipping timeline?
4. Volume Projections: We are launching with 100-500 one-time purchases monthly, scaling to 1,000+ by Q3 2026. Do you support this volume?
5. Integration Timeline: How long does it take to set up a new merchant account and complete API integration?

COMPETITIVE ADVANTAGES:
We are building a premium brand in the nail art niche with:
- Custom design studio for user-generated nail art
- Social gallery with community ratings and comments
- Subscription model for recurring revenue
- Premium unboxing experience with custom branding

We would appreciate:
- Your current merchant pricing sheet
- API/webhook documentation
- Information about custom packaging options and costs
- Timeline for account setup and integration
- A call to discuss partnership opportunities

We are excited about the potential to partner with Printify and would love to discuss how we can work together to bring premium nail art products to our customers.

Thank you for your time, and I look forward to hearing from you.

Best regards,
Kegan Meng
Nail'd - Founder/CEO
xxearthx@gmail.com
805-380-7870
https://nailed.com"""
    },
    {
        "email": "support@printful.com",
        "name": "Printful Support Team",
        "subject": "Webhook Integration & Custom Branding Inquiry for Nail'd Print-On-Demand",
        "body": """Hello Printful Team,

I am contacting you regarding a potential partnership with Nail'd, a premium nail art print-on-demand and subscription company. We are impressed by Printful's 340+ product catalog, custom packaging options, and excellent customer support.

ABOUT NAIL'D:
Nail'd is a premium nail art company offering:
- Monthly subscription boxes (3 subscription tiers)
- One-time nail art collections and products
- Premium aftercare kits
- User-generated design studio
- Community social gallery with ratings and comments

We are seeking a fulfillment partner for our **one-time purchase channel** (nail art collections, aftercare kits, individual nail art products).

SERVICE REQUIREMENTS:
- Print-on-demand nail wraps, stickers, and nail art products
- Custom branded packaging with our Nail'd branding
- No inventory required (print-on-demand model)
- Global shipping capabilities
- Webhook/API integration for automated order processing from our custom store

TECHNICAL INTEGRATION QUESTIONS:
1. Webhook/API Support: Does Printful offer webhook integration for real-time order status updates? What events are supported (order received, in production, shipped, delivered)?
2. Automated Order Processing: Can orders from our Shopify/custom platform be automatically sent to Printful without manual intervention?
3. Custom Packaging: What custom packaging options do you offer? Can we add our Nail'd branding to boxes, tissue, stickers, and inserts? What are the costs and lead times?
4. API Documentation: Can you provide detailed API and webhook documentation for our development team?
5. Sandbox Environment: Do you offer a test/sandbox environment for integration testing before going live?

BUSINESS QUESTIONS:
1. Product Pricing: What are your per-unit costs for nail wraps, stickers, and related products? Do you offer volume discounts for 100-1,000+ units monthly?
2. Custom Packaging Costs: What are the costs for custom branded boxes, tissue paper, stickers, and branded inserts? What are minimum order quantities?
3. Production Timeline: What is your typical production time and shipping timeline?
4. Scalability: We are launching with 100-500 one-time purchases monthly, scaling to 1,000+ by Q3 2026. Can you support this volume?
5. Onboarding: How long does it take to set up a new merchant account and complete API integration?

BRAND POSITIONING:
Nail'd is positioning itself as a premium brand in the nail art niche with:
- High-quality, trending nail art designs sourced from Instagram and TikTok
- Custom design studio allowing customers to create their own nail art
- Community-driven social gallery with ratings and comments
- Subscription model combined with one-time purchases
- Premium unboxing experience with custom branding

We would appreciate:
- Your current merchant pricing and fee structure
- Custom packaging options and pricing
- API/webhook documentation
- Timeline for account setup and integration
- A call or meeting to discuss partnership opportunities

We are excited about the potential to work with Printful and believe our premium brand positioning aligns well with Printful's quality and support standards.

Thank you for your consideration. I look forward to discussing how we can partner to bring premium nail art products to our customers.

Best regards,
Kegan Meng
Nail'd - Founder/CEO
xxearthx@gmail.com
805-380-7870
https://nailed.com"""
    }
]

def send_emails():
    """Send inquiry emails to Printify and Printful."""
    
    print("🚀 Nail'd - Product Fulfillment Email Sender Started")
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
            print("\n📋 NEXT STEPS:")
            print("1. Review responses from Printify and Printful")
            print("2. Request pricing quotes and custom packaging samples")
            print("3. Schedule calls to discuss webhook integration")
            print("4. Compare pricing and select primary partner")
        
    except smtplib.SMTPAuthenticationError:
        print("❌ Authentication failed!")
        print("   Make sure your App Password is correct")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    send_emails()
