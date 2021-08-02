import { toast } from "react-toastify";

const printDate = (date) => {
  const monthsInEng = ['JANURARY', 'FEBURARY', 'MARCH', 'APRAL', 'MAY', 'JUNE',
  'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];

  var currentYear = new Date().getFullYear();
  if (currentYear === date.getFullYear()) {
    return monthsInEng[date.getMonth()] + " " + date.getDate();
  } else {
    return monthsInEng[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
  }
};

export const timeSince = (timestamp) => {
  const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
  
  var postDate = new Date(timestamp);
  //console.log(printDate(postDate));

  var interval = Math.floor(seconds / 86401);
  if (interval > 30) {
    return printDate(postDate);
  } else if(interval > 1 && interval <= 30) {
    return interval + " days ago";
  } else if(interval === 1) {
    return interval + " day ago";
  }

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    let ret = interval + " hour";
    if (interval > 1) {
      ret += "s";
    }
    return ret + " ago";
  }

  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    let ret = interval + " minute";
    if (interval > 1) {
      ret += "s";
    }
    return ret + " ago";
  }

  return Math.floor(seconds) + " seconds ago";
};

export const client = (endpoint, { body, ...customConfig } = {}) => {
  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json" };
  
  if (token) {
    headers.token = `${token}`;
  }

  const config = {
    method: body ? "POST" : "GET",
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return fetch(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`, config).then(
    async (res) => {
      const data = await res.json();

      if (res.ok) {
        return data;
      } else if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.reload();
        toast.error("token expired!");
      } else {
        return Promise.reject(data);
      }
    }
  );
};

export const uploadImage = (file) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "instagram");

  return fetch(process.env.REACT_APP_CLOUDINARY_URL, {
    method: "POST",
    body: data,
  }).then((res) => res.json());
};
