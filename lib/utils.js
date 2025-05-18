import { clsx } from "clsx";
import qs from "query-string";
import { twMerge } from "tailwind-merge"
import { z } from "zod";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString) => {
  const dateTimeOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    month: "short", // abbreviated month name (e.g., 'Oct')
    day: "numeric", // numeric day of the month (e.g., '25')
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const dateDayOptions = {
    weekday: "short", // abbreviated weekday name (e.g., 'Mon')
    year: "numeric", // numeric year (e.g., '2023')
    month: "2-digit", // abbreviated month name (e.g., 'Oct')
    day: "2-digit", // numeric day of the month (e.g., '25')
  };

  const dateOptions = {
    month: "short", // abbreviated month name (e.g., 'Oct')
    year: "numeric", // numeric year (e.g., '2023')
    day: "numeric", // numeric day of the month (e.g., '25')
  };

  const timeOptions = {
    hour: "numeric", // numeric hour (e.g., '8')
    minute: "numeric", // numeric minute (e.g., '30')
    hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
  };

  const formattedDateTime = new Date(dateString).toLocaleString(
    "en-US",
    dateTimeOptions
  );

  const formattedDateDay = new Date(dateString).toLocaleString(
    "en-US",
    dateDayOptions
  );

  const formattedDate = new Date(dateString).toLocaleString(
    "en-US",
    dateOptions
  );

  const formattedTime = new Date(dateString).toLocaleString(
    "en-US",
    timeOptions
  );

  return {
    dateTime: formattedDateTime,
    dateDay: formattedDateDay,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};

export function formatAmount(amount) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  return formatter.format(amount);
}

export function extractCustomerIdFromUrl(url) {
  // Split the URL string by '/'
  const parts = url.split("/");

  // Extract the last part, which represents the customer ID
  const customerId = parts[parts.length - 1];

  console.log(customerId);

  return customerId;
}

export const parseStringify = (value) => JSON.parse(JSON.stringify(value));

export function encryptId(id) {
  return btoa(id);
}

export function decryptId(id) {
  return atob(id);
}

export const authFormSchema = (type) => z.object({
  // * sign up
  firstName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  lastName: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  address1: type === 'sign-in' ? z.string().optional() : z.string().max(50),
  city: type === 'sign-in' ? z.string().optional() : z.string().max(50),
  state: type === 'sign-in' ? z.string().optional() : z.string().min(2),
  postalCode: type === 'sign-in' ? z.string().optional() : z.string().min(3).max(8),
  dateOfBirth: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  ssn: type === 'sign-in' ? z.string().optional() : z.string().min(3),
  // * both
  email: z.string().email(),
  password: z.string().min(8),
})

export function formUrlQuery({ params, key, value }) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function getAccountTypeColors(type) {
  switch (type) {
    case "depository":
      return {
        bg: "bg-blue-25",
        lightBg: "bg-blue-100",
        title: "text-blue-900",
        subText: "text-blue-700",
      };

    case "credit":
      return {
        bg: "bg-success-25",
        lightBg: "bg-success-100",
        title: "text-success-900",
        subText: "text-success-700",
      };

    default:
      return {
        bg: "bg-green-25",
        lightBg: "bg-green-100",
        title: "text-green-900",
        subText: "text-green-700",
      };
  }
}

export const getTransactionStatus = (date) => {
  const today = new Date();
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(today.getDate() - 2);

  return date > twoDaysAgo ? "Processing" : "Success";
};

export const removeSpecialCharacters = (value) => {
  return value.replace(/[^\w\s]/gi, "");
};

export function countTransactionCategories(transactions) {
  const categoryCounts = {};
  let totalCount = 0;

  // Iterar sobre cada transacción
  if (transactions) {
    transactions.forEach((transaction) => {
      const category = transaction.category;

      if (Object.prototype.hasOwnProperty.call(categoryCounts, category)) {
        categoryCounts[category]++;
      } else {
        categoryCounts[category] = 1;
      }

      totalCount++;
    });
  }

  // Convertir a array de objetos
  const aggregatedCategories = Object.keys(categoryCounts).map((category) => ({
    name: category,
    count: categoryCounts[category],
    totalCount,
  }));

  // Ordenar por count descendente
  aggregatedCategories.sort((a, b) => b.count - a.count);

  return aggregatedCategories;
}


