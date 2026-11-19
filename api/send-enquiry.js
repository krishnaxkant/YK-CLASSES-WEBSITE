import { handleEnquiry } from "../shared/enquiryMailer.js";

export default async function handler(req, res) {
  return handleEnquiry(req, res);
}
