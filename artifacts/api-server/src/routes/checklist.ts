import { Router, type IRouter } from "express";
import { GetChecklistResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const checklist = [
  {
    id: "1",
    title: "Choose your business structure",
    description: "Decide between sole proprietorship, LLC, partnership, or corporation based on your needs.",
    category: "Legal",
    order: 1,
  },
  {
    id: "2",
    title: "Register your business name",
    description: "File a DBA (Doing Business As) or register your LLC/corporation name with your state.",
    category: "Legal",
    order: 2,
  },
  {
    id: "3",
    title: "Get your EIN from the IRS",
    description: "Apply for a free Employer Identification Number (EIN) — it's like a SSN for your business.",
    category: "Legal",
    order: 3,
  },
  {
    id: "4",
    title: "Open a business bank account",
    description: "Keep personal and business finances separate to protect yourself legally and simplify taxes.",
    category: "Finance",
    order: 4,
  },
  {
    id: "5",
    title: "Set up business accounting",
    description: "Choose accounting software (QuickBooks, Wave, FreshBooks) and track income and expenses from day one.",
    category: "Finance",
    order: 5,
  },
  {
    id: "6",
    title: "Understand your tax obligations",
    description: "Learn about quarterly estimated taxes, sales tax, and deductions for your business type.",
    category: "Finance",
    order: 6,
  },
  {
    id: "7",
    title: "Write a business plan",
    description: "Define your mission, target market, competitive advantage, and financial projections.",
    category: "Planning",
    order: 7,
  },
  {
    id: "8",
    title: "Validate your idea",
    description: "Talk to potential customers, run surveys, or launch a simple MVP before investing heavily.",
    category: "Planning",
    order: 8,
  },
  {
    id: "9",
    title: "Identify your target customers",
    description: "Create a detailed buyer persona to focus your marketing and product development.",
    category: "Planning",
    order: 9,
  },
  {
    id: "10",
    title: "Register your domain name",
    description: "Secure a .com domain that matches your business name before someone else takes it.",
    category: "Tech",
    order: 10,
  },
  {
    id: "11",
    title: "Build your website",
    description: "Launch a professional website — even a simple one-pager establishes credibility.",
    category: "Tech",
    order: 11,
  },
  {
    id: "12",
    title: "Set up business email",
    description: "Create a professional email address (you@yourbusiness.com) with Google Workspace or Zoho.",
    category: "Tech",
    order: 12,
  },
  {
    id: "13",
    title: "Create social media profiles",
    description: "Claim your brand name on LinkedIn, Instagram, Facebook, and X (Twitter) to build your audience.",
    category: "Marketing",
    order: 13,
  },
  {
    id: "14",
    title: "Set up Google My Business",
    description: "Create a free Business Profile on Google so local customers can find and review you.",
    category: "Marketing",
    order: 14,
  },
  {
    id: "15",
    title: "Define your pricing strategy",
    description: "Research competitors and set pricing that reflects your value while remaining competitive.",
    category: "Marketing",
    order: 15,
  },
  {
    id: "16",
    title: "Get business insurance",
    description: "Protect your business with general liability insurance and any industry-specific coverage.",
    category: "Operations",
    order: 16,
  },
  {
    id: "17",
    title: "Set up operations and workflows",
    description: "Create standard processes for delivering your product/service, handling orders, and supporting customers.",
    category: "Operations",
    order: 17,
  },
  {
    id: "18",
    title: "Launch and announce",
    description: "Tell the world! Share your launch on social media, email your network, and ask for referrals.",
    category: "Operations",
    order: 18,
  },
];

router.get("/checklist", (_req, res) => {
  const data = GetChecklistResponse.parse(checklist);
  res.json(data);
});

export default router;
