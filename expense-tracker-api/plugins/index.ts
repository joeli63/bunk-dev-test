module.exports = (on: any, config: any) => {
    const dotenv = require('dotenv');
    const dotenvConfig = dotenv.config();
  
    if (dotenvConfig.error) {
      throw dotenvConfig.error;
    }
  
    config.env.API_URL = process.env.API_URL;
  
    return config;
  };
  