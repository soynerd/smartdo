import React from "react";
import { Outlet } from "react-router-dom";
import { DarkModeIcon, Header } from "./components";

const temp = [
  {
    title: "Packing List for Trip to Goa",
    items: [],
  },
  {
    title: "Clothing:",
    items: [
      {
        label: "Lightweight t-shirts and tops",
        checked: false,
      },
      {
        label: "Shorts and skirts",
        checked: false,
      },
      {
        label: "Swimwear (bathing suits, bikinis, etc.)",
        checked: false,
      },
      {
        label: "Beach cover-ups or sarongs",
        checked: false,
      },
      {
        label: "Flip-flops or sandals",
        checked: false,
      },
      {
        label: "Comfortable shoes for walking",
        checked: false,
      },
      {
        label: "Light jacket or shawl for evenings",
        checked: false,
      },
      {
        label: "Casual evening wear for dinners",
        checked: false,
      },
    ],
  },
  {
    title: "Toiletries:",
    items: [
      {
        label: "Sunscreen (high SPF)",
        checked: false,
      },
      {
        label: "Lip balm with SPF",
        checked: false,
      },
      {
        label: "After-sun lotion or aloe vera gel",
        checked: false,
      },
      {
        label: "Shampoo and conditioner",
        checked: false,
      },
      {
        label: "Toothbrush and toothpaste",
        checked: false,
      },
      {
        label: "Deodorant",
        checked: false,
      },
      {
        label: "Face wash and moisturizer",
        checked: false,
      },
      {
        label: "Razor or hair removal products",
        checked: false,
      },
      {
        label: "Travel-sized perfume or cologne",
        checked: false,
      },
    ],
  },
  {
    title: "Beach Essentials:",
    items: [
      {
        label: "Beach towel",
        checked: false,
      },
      {
        label: "Sunglasses (UV protection)",
        checked: false,
      },
      {
        label: "Wide-brimmed hat or cap",
        checked: false,
      },
      {
        label: "Waterproof phone pouch",
        checked: false,
      },
      {
        label: "Beach bag",
        checked: false,
      },
      {
        label: "Snorkeling gear (optional)",
        checked: false,
      },
    ],
  },
  {
    title: "Electronics:",
    items: [
      {
        label: "Phone and charger",
        checked: false,
      },
      {
        label: "Power bank",
        checked: false,
      },
      {
        label: "Camera or GoPro",
        checked: false,
      },
      {
        label: "Travel adapter (if needed)",
        checked: false,
      },
      {
        label: "Earphones or headphones",
        checked: false,
      },
    ],
  },
  {
    title: "Travel Documents:",
    items: [
      {
        label: "ID proof (Aadhaar card, passport, etc.)",
        checked: false,
      },
      {
        label: "Booking confirmations (hotel, flights, etc.)",
        checked: false,
      },
      {
        label: "Copies of important documents (physical and digital)",
        checked: false,
      },
      {
        label: "Travel insurance details",
        checked: false,
      },
    ],
  },
  {
    title: "Miscellaneous:",
    items: [
      {
        label: "Lightweight backpack for day trips",
        checked: false,
      },
      {
        label: "Reusable water bottle",
        checked: false,
      },
      {
        label: "Portable fan (optional)",
        checked: false,
      },
      {
        label: "Small first-aid kit",
        checked: false,
      },
      {
        label: "Insect repellent",
        checked: false,
      },
      {
        label: "Books, magazines, or a Kindle",
        checked: false,
      },
      {
        label: "Snacks for travel",
        checked: false,
      },
      {
        label: "Cash and credit/debit cards",
        checked: false,
      },
    ],
  },
  {
    title: "Optional Items:",
    items: [
      {
        label: "Yoga mat (if you practice yoga)",
        checked: false,
      },
      {
        label: "Evening accessories (jewelry, clutch, etc.)",
        checked: false,
      },
      {
        label: "Waterproof jacket (if visiting during monsoon)",
        checked: false,
      },
    ],
  },
];
function App() {
  return (
    // <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
    //   <ListConverter data={temp}/>
    // </div>
    <>
      <div className="min-h-screen bg-white text-gray-800 dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <Header />
        <Outlet />
        <DarkModeIcon />
      </div>
    </>
  );
}

export default App;
