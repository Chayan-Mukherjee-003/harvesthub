const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/', auth(['retailer']), async (req,res)=>{
  const { reg } = req.body;
  try{
    const r = await axios.post(
      `https://api.attestr.com/api/v1/public/checkx/fssai`,
      { reg },
      {
        headers:{
          'Content-Type':'application/json',
          Authorization:`Basic ${process.env.ATTESTR_AUTH_TOKEN}`
        }
      }
    );
    res.json(r.data);
  }catch(e){
    res.status(400).json({error:'FSSAI check failed', details:e.response?.data});
  }
});
module.exports = router;
