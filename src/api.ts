import axios from "axios";

export const simpro = axios.create({
  baseURL: "https://enterprise-sandbox-uk.simprosuite.com/api/v1.0",
  headers: {
    Authorization: "Bearer 1e161d6cb68b1103a48f1b472939e099afb47c89",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
