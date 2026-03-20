import { Router, type IRouter } from "express";
import { ListResourcesResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const resources = [
  {
    id: "1",
    title: "Business Plan Template",
    description: "A comprehensive business plan template to define your vision, strategy, and financials.",
    category: "Planning",
    url: "https://www.sba.gov/business-guide/plan-your-business/write-your-business-plan",
    icon: "FileText",
  },
  {
    id: "2",
    title: "LLC Formation Guide",
    description: "Step-by-step guide to forming an LLC, protecting your personal assets.",
    category: "Legal",
    url: "https://www.sba.gov/business-guide/launch-your-business/choose-business-structure",
    icon: "Shield",
  },
  {
    id: "3",
    title: "EIN Registration",
    description: "Get your Employer Identification Number (EIN) from the IRS for free.",
    category: "Legal",
    url: "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online",
    icon: "Hash",
  },
  {
    id: "4",
    title: "Small Business Loans",
    description: "Explore SBA loan programs and find funding options for your startup.",
    category: "Finance",
    url: "https://www.sba.gov/funding-programs/loans",
    icon: "DollarSign",
  },
  {
    id: "5",
    title: "Free Logo Maker",
    description: "Design a professional logo for your business with Canva's free tools.",
    category: "Marketing",
    url: "https://www.canva.com/create/logos/",
    icon: "Palette",
  },
  {
    id: "6",
    title: "Domain Registration",
    description: "Find and register the perfect domain name for your business website.",
    category: "Tech",
    url: "https://www.namecheap.com",
    icon: "Globe",
  },
  {
    id: "7",
    title: "Google My Business",
    description: "Set up your free Google Business Profile to get found by local customers.",
    category: "Marketing",
    url: "https://business.google.com",
    icon: "MapPin",
  },
  {
    id: "8",
    title: "QuickBooks Accounting",
    description: "Manage your business finances, invoices, and taxes with QuickBooks.",
    category: "Finance",
    url: "https://quickbooks.intuit.com",
    icon: "Calculator",
  },
  {
    id: "9",
    title: "Shopify E-commerce",
    description: "Launch your online store quickly with Shopify's easy-to-use platform.",
    category: "Tech",
    url: "https://www.shopify.com",
    icon: "ShoppingBag",
  },
  {
    id: "10",
    title: "Trademark Search",
    description: "Search the USPTO database to make sure your brand name is available.",
    category: "Legal",
    url: "https://www.uspto.gov/trademarks/search",
    icon: "Search",
  },
  {
    id: "11",
    title: "SCORE Mentorship",
    description: "Get free, expert business mentoring from experienced entrepreneurs.",
    category: "Planning",
    url: "https://www.score.org",
    icon: "Users",
  },
  {
    id: "12",
    title: "Mailchimp Email Marketing",
    description: "Build and grow your customer email list with Mailchimp's free plan.",
    category: "Marketing",
    url: "https://mailchimp.com",
    icon: "Mail",
  },
];

router.get("/resources", (_req, res) => {
  const data = ListResourcesResponse.parse(resources);
  res.json(data);
});

export default router;
