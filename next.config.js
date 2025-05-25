/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    MONGODB_URI:"mongodb+srv://sstudent1232:wJNG1NYvHBwrUCBk@cluster0.asfuvaf.mongodb.net/surveydb?retryWrites=true&w=majority",
    JWT_SECRET:"ahjbasbcyeajhbu"
    
  }
}

module.exports = nextConfig
