const sendEmail = (to , subject , token) => {
  const url = `http://localhost:4000/confirmation/${token}`
 // let openUrl = () => { window.open(url)}
  return {
    to,
    subject,
    html : 
    `<!DOCTYPE html>
    <html>
    <head>
    <style>
    .container {
      position: relative;
    }
    
    .center {
      position: absolute;
      top: 50%;
      width: 100%;
      text-align: center;
      font-size: 18px;
      background-color : #ffb3ff;
      height : 300px;
      padding : 2rem;
    }
    
    .button {
      background-color:#800033;
      border: none;
      padding: 16px 32px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      transition-duration: 0.4s;
      cursor: pointer;
      color: white;
      border-radius : 2px;
    }

    
    .button:hover {
      background-color: transparent;
      color: black;
      border: 2px solid #800033;
    }
    
    </style>
    </head>
    <body>
    
    <div class="container">
     
      <div class="center">
      <br/>
      <p>
      برای تایید آدرس ایمیل و فعال سازی حساب کاربری خود در سایت ترجمه، روی لینک زیر کلیک کنید.
      </p>
     
   <a href="${url}">${url}</a>
  
      
      <br/>
      <br/>
      <br/>
      <br/>
      <hr/>
      <p>اگر با این آدرس ایمیل در سایت ترجمه ثبت نام نکرده اید، این پیام را نادیده بگیرید.</p>
      </div>
    </div>
    
    </body>
    </html>
    `
  }
}



module.exports = sendEmail;