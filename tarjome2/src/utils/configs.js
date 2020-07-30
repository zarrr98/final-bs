import strings from "./strings";

export const URL = {
  protocol: "http",
  baseURL: "localhost",
  port: "4000",
};

export const Fields = [];
for (const key in strings.field) {
  Fields.push(strings.field[key]);
}

export const Languages = [];
for (const key in strings.language) {
  Languages.push(strings.language[key]);
}

export const navigationItems = {
  translatorNavigationItems: [
    { title: strings.navbar.mainPage, path: "/" },
    { title: strings.navbar.advertisements, path: "/advertisements" },
    { title: strings.navbar.help, path: "/help" },
  ],
  employerNavigationItems: [
    { title: strings.navbar.mainPage, path: "/" },
    { title: strings.navbar.translators, path: "/translators" },
    { title: strings.navbar.help, path: "/help" },
  ],
  notLoggedInNavigationItems: [
    { title: strings.navbar.mainPage, path: "/" },
    { title: strings.navbar.help, path: "/help" },
  ],
};

export const cardPictures = [
  require("../assets/images/ax3.png"),
  require("../assets/images/ax2.jpg"),
  require("../assets/images/ax1.jpg"),
  require("../assets/images/ax4.jpg"),
  require("../assets/images/a2.jpg"),
  require("../assets/images/ax6.jpg"),
];

export const ParticleParams = {
  particles: {
    number: {
      value: 200,
      density: {
        enable: true,
        value_area: 1000,
      },
    },
    line_linked: {
      enable: true,
      distance: 170,
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulses",
      },
      onclick: {
        enable: true,
        mode: "push",
      },
    },
    modes: {
      repulse: {
        distance: 25,
      },
    },
  },
};

export const AccpetedTypeFiles = `application/pdf, .rar, .srt, video/x-matroska, video/mp4, audio/mpeg, application/zip, application/x-zip-compressed, text/html,
image/gif, image/jpeg, image/png, image/bmp, text/plain, application/rtf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document,
audio/midi, audio/x-midi, audio/wav, video/3gpp, audio/3gpp, video/x-msvideo, text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.ms-powerpoint, application/rar , application/vnd.rar, application/x-rar-compressed, audio/aac, audio/AMR,
video/ogg, application/x-subrip`;

export const StorageSetItem = (key, value, isObj) => {
  let val;
  if (isObj) {
    val = JSON.stringify(value);
  } else {
    val = value;
  }

  localStorage.setItem(key, val);
};

export const StrorageGetItem = (key, isObj) => {
  let value = localStorage.getItem(key);
  if (isObj) {
    return JSON.parse(value);
  } else {
    return value;
  }
};
