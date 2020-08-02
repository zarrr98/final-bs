const strings = {
  welcomeTopic: "خوش آمدید",
  welcomeTextEmployer: ` عزیز، سلام
    از اینکه شما را در جمع کاربران سایت ترجمه می بینیم بسیار خرسندیم. امیدواریم بتوانیم همواره رضایت شما را جلب کنیم.
    این سایت یک سرویس آنلاین است که شما از طریق آن می توانید پروژه های ترجمه خود را با خیال راحت به مترجمان متخصص بسپارید. قیمت گذاری بر روی پروژه ها به صورت مناقصه ای بوده و شما می توانید از بین پیشنهادها مناسب ترین مترجم را برای پروژه خود انتخاب کنید.
    جهت اطلاعات بیشتر می توانید تب راهنما را مشاهده نمایید و یا با شماره 09121234567 تماس حاصل فرمایید.`,
  welcomeTextTranslator: ` عزیز، سلام
    از اینکه شما را در جمع کاربران سایت ترجمه می بینیم بسیار خرسندیم. امیدواریم بتوانیم همواره رضایت شما را جلب کنیم.
    این سایت یک سرویس آنلاین است که شما از طریق آن می توانید پروژه های ترجمه را پذیرفته و ترجمه کنید و کسب درامد کنید. مبلغ ترجمه با پیشنهاد شما و براساس میزان تجربه شما و به صورت مناقصه ای تعیین میشود.
    جهت اطلاعات بیشتر می توانید تب راهنما را مشاهده نمایید و یا با شماره 09121234567 تماس حاصل فرمایید.`,
  translatorAppliedTopic: (adName) => {
    return ` درخواست جدید به آگهی "${adName}" `;
  },
  translatorAppliedText: (translatorName, adName) => {
    return `مترجم ${translatorName} به آگهی "${adName}" شما درخواست ترجمه داده است.
        شما میتوانید جزئیات و وضعیت پروژه را در پنل کاربری و در قسمت پروژه های درخواست داده شده مشاهده نمایید. هم چنین
         می توانید با مشاهده صفحه پروفایل مترجم و مشاهده تجربیات او، 
        در صورت تمایل این مترجم را برای ترجمه پروژه خود انتخاب کنید.`;
  },
  translatorChoosedTopic: (adName) => {
    return ` شما برای ترجمه پروژه  
        "${adName}"
        انتخاب شدید!`;
  },
  translatorChoosedText: (adName) => {
    return `مترجم عزیز شما برای ترجمه پروژه ترجمه 
        "${adName}"
        که قبلا به آن درخواست داده بودید، توسط کارفرمای پروژه انتخاب شدید. 
        لطفا از تب پنل کاربری در قسمت پروژه های درحال انجام، محتوایی که باید ترجمه کنید را دریافت نمایید و 
        از همان قسمت، قبل از به پایان رسیدن مهلت ترجمه، فایل ترجمه شده را آپلود نمایید.`;
  },
  translatedFileUploadedTopic: (adName) => {
    return `فایل ترجمه شده ی پروژه ترجمه ی 
        "${adName}"
        بارگذاری شد`;
  },
  translatedFileUploadedText: (adName) => {
    return `مترجم پروژه ترجمه ی 
        "${adName}"
         فایل ترجمه شده آن را ترجمه و ارسال کرده است. شما میتوانید از تب پنل کاربری و قسمت پروژه های درحال انجام، 
         فایل ترجمه شده را دریافت و بررسی کنید.
         در صورت رضایت، کارمزد مترجم را به حساب او واریز نمایید و 
         سپس تکمیل پروژه را تایید کنید. درصورت عدم رضایت از ترجمه، با پشتیبانی سایت به شماره 09121234567 تماس بگیرید تا در صورت لزوم تیم ما 
         ترجمه شما را انجام دهد.`;
  },

  translatorDoneTheProjectTopic: (adName) => {
    return `مترجم پروژه ی 
        "${adName}" 
        تکمیل آن را تایید کرد`;
  },
  translatorDoneTheProjectText: (adName, employerDone) => {
    let rest = employerDone
      ? `. با تایید شما و مترجم، گردش کار این پروژه به پایان رسید. شما میتوانید پروژه 
      "${adName}" را
       در تب پنل کاربری و در قسمت پروژه های انجام شده مشاهده نمایید و از آن جا به فایل های قابل ترجمه و ترجمه شده دسترسی داشته باشید.`
      : `اما شما هنوز این کار را نکرده اید. لطفا در صورت عدم وجود مشکل، از تب پنل
        کاربری و قسمت پروژه های درحال انجام، وارد وضعیت پروژه 
        "${adName}"
         شده و تکمیل پروژه را تایید نمایید. در صورت هرگونه مشکل میتوانید آن را با ما از طریق شماره تلفن 09121234567 در میان بگذارید.`;

    return `مترجم پروژه ی 
        "${adName}"
         تکمیل این پروژه را تایید کرده است 
         ${rest}`;
  },

  employerDoneTheProjectTopic: (adName) => {
    return `کارفرمای پروژه ی 
        "${adName}" 
        تکمیل آن را تایید کرد`;
  },
  employerDoneTheProjectText: (adName, translatorDone) => {
    let rest = translatorDone
      ? `. با تایید شما و کارفرما، گردش کار این پروژه به پایان رسید. شما میتوانید پروژه 
      "${adName}" را
       در تب پنل کاربری و در قسمت پروژه های انجام شده مشاهده نمایید و از آن جا به فایل های قابل ترجمه و ترجمه شده دسترسی داشته باشید.`
      : `اما شما هنوز این کار را نکرده اید. لطفا در صورت عدم وجود مشکل، از تب پنل
        کاربری و قسمت پروژه های درحال انجام،  تکمیل این پروژه را تایید نمایید. در صورت وجود هرگونه مشکل میتوانید آن را با ما از طریق شماره تلفن 09121234567 در میان بگذارید.`;

    return `کارفرمای پروژه ی 
        "${adName}"
         تکمیل این پروژه را تایید کرده است 
         ${rest}`;
  },
};

module.exports = strings;
