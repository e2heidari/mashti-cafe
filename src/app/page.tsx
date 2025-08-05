"use client";

import Navigation from "../components/Navigation";
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import AI Assistant to reduce initial bundle size
const AIAssistant = dynamic(() => import("../components/AIAssistant"), {
  loading: () => <div className="text-white">Loading AI Assistant...</div>,
  ssr: false,
});

export default function Home() {
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookingDetails, setBookingDetails] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "",
    guestCount: "",
    message: "",
  });
  const calendarRef = useRef<HTMLDivElement>(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    eventType: "",
    guestCount: "",
    message: "",
  });

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Debug success notification
  useEffect(() => {
    if (showSuccess) {
      console.log("🎉 showSuccess is now true - rendering notification!");
    }
  }, [showSuccess]);

  // Calendar functions
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (day: number) => {
    const today = new Date();
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return (
      selectedDate <
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
    );
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setBookingForm((prev) => ({
      ...prev,
      eventDate: formatDate(selectedDate),
    }));
    setShowCalendar(false);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    console.log("🚀 Starting booking submission...");

    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      const data = await response.json();
      console.log("📧 API Response:", data);

      if (data.success) {
        console.log("✅ Success! Setting showSuccess to true");
        setSubmitMessage(
          "Booking request sent successfully! We'll contact you soon."
        );

        setShowSuccess(true);

        // Don't reset form immediately - let user see their data in success notification
        // Form will be reset when they close the success notification
      } else {
        console.log("❌ API returned success: false");
        setSubmitMessage("Failed to send booking request. Please try again.");
      }
    } catch (error) {
      console.error("❌ Booking submission error:", error);
      setSubmitMessage("Failed to send booking request. Please try again.");
    } finally {
      console.log("🏁 Setting isSubmitting to false");
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
      {/* Marvel-style background effects */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F0131E' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <Navigation onAIOpen={() => setIsAIOpen(true)} showMenu={false} />

      <main className="flex-1 w-full pt-48 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <section id="locations" className="max-w-6xl mx-auto">
          {/* Marvel-style title */}
          <div className="text-center mb-12">
            <h2
              className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-wider uppercase font-pike"
              style={{
                textShadow:
                  "0 0 20px #F0131E, 0 0 40px #F0131E, 0 0 60px #F0131E",
                WebkitTextStroke: "1px #F0131E",
              }}
            >
              Our Locations
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent mx-auto mb-8"></div>
            <p className="text-lg text-gray-600 font-medium tracking-wide font-sodo">
              Choose Your Destination
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Central Branch - Marvel Style (First on Mobile) */}
            <a
              href="/central"
              className="group relative border-2 border-red-600 rounded-2xl p-8 hover:border-red-400 transition-all duration-500 block text-center transform hover:scale-105 hover:rotate-1 shadow-lg order-1 md:order-2 overflow-hidden min-h-[420px] md:min-h-auto"
              style={{
                backgroundImage: "url('/images/northvan.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow:
                  "0 10px 30px rgba(240, 19, 30, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/60 rounded-2xl"></div>

              {/* Glow effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-13 h-13 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-red-500/50 transition-all duration-300 transform group-hover:scale-110">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 group-hover:text-red-400 transition-colors duration-300 uppercase tracking-wider font-pike">
                    Central Branch
                  </h3>
                  <p className="text-red-300 font-semibold tracking-wide font-lander">
                    North Vancouver
                  </p>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium font-sodo">
                      1544 Lonsdale Ave, North Vancouver
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="font-bold text-white font-pike">
                      (604) 971 0588
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold font-lander">
                      Everyday: 11AM - 12AM
                    </span>
                  </div>
                </div>
              </div>
            </a>

            {/* Coquitlam Branch - Marvel Style (Second on Mobile) */}
            <a
              href="https://streetfoodapp.com/vancouver/mashti"
              className="group relative border-2 border-red-600 rounded-2xl p-8 hover:border-red-400 transition-all duration-500 block text-center transform hover:scale-105 hover:-rotate-1 shadow-lg order-2 md:order-1 overflow-hidden min-h-[420px] md:min-h-auto"
              style={{
                backgroundImage: "url('/images/truck.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow:
                  "0 10px 30px rgba(240, 19, 30, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/60 rounded-2xl"></div>

              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-13 h-13 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-red-500/50 transition-all duration-300 transform group-hover:scale-110">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 group-hover:text-red-400 transition-colors duration-300 uppercase tracking-wider font-pike">
                    Coquitlam Branch
                  </h3>
                  <p className="text-red-300 font-semibold tracking-wide font-lander">
                    Mashti On The Wheel
                  </p>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium font-sodo">
                      Pinetree Way, Coquitlam
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="font-bold text-white font-pike">
                      (604) 971 0588
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold font-lander">
                      Everyday: 11AM - 12AM
                    </span>
                  </div>
                </div>
              </div>
            </a>

            {/* Wholesale - Marvel Style (Third on Mobile) */}
            <a
              href="/wholesale"
              className="group relative border-2 border-red-600 rounded-2xl p-8 hover:border-red-400 transition-all duration-500 block text-center transform hover:scale-105 hover:rotate-1 shadow-lg order-3 md:order-3 overflow-hidden min-h-[420px] md:min-h-auto"
              style={{
                backgroundImage: "url('/images/wholesales.jpeg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                boxShadow:
                  "0 10px 30px rgba(240, 19, 30, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
              }}
            >
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/60 rounded-2xl"></div>

              <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="flex flex-col items-center mb-6">
                  <div className="w-13 h-13 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:shadow-red-500/50 transition-all duration-300 transform group-hover:scale-110">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 group-hover:text-red-400 transition-colors duration-300 uppercase tracking-wider font-pike">
                    Wholesale
                  </h3>
                  <p className="text-red-300 font-semibold tracking-wide font-lander">
                    Go big. Go kilo. Go MASHTI!
                  </p>
                </div>

                <div className="space-y-4 text-gray-300">
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-medium font-sodo">
                      399 Mountain Highway, North Vancouver
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                    </svg>
                    <span className="font-bold text-white font-pike">
                      (604) 971 0588
                    </span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="font-semibold font-lander">
                      Mon-Fri: 8AM - 6PM
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </div>
        </section>

        {/* Book Us for Your Event Section */}
        <section className="max-w-6xl mx-auto mt-16">
          <div className="text-center">
            <button
              onClick={() => {
                setIsBookingOpen(true);
                setSubmitMessage(""); // Clear any previous messages
              }}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-full text-lg md:text-xl tracking-wide font-pike transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border-2 border-red-600 hover:border-red-700"
            >
              Book Us For Your Event
            </button>
          </div>
        </section>
      </main>

      {/* AI Assistant Modal */}
      <AIAssistant isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      {/* Success Notification */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
            {/* Success Icon */}
            <div className="mx-auto mb-6 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Success Title */}
            <h3 className="text-2xl font-bold text-gray-900 mb-4 font-pike">
              Booking Request Sent!
            </h3>

            {/* Success Message */}
            <p className="text-gray-600 mb-6 font-sodo">
              Thank you for your booking request. We&apos;ve received your
              information and will contact you soon to confirm your event
              details.
            </p>

            {/* Booking Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <h4 className="font-semibold text-gray-900 mb-2 font-pike">
                Booking Details:
              </h4>
              <div className="space-y-1 text-sm text-gray-600 font-sodo">
                <p>
                  <strong>Name:</strong> {bookingForm.name}
                </p>
                <p>
                  <strong>Event Date:</strong> {bookingForm.eventDate}
                </p>
                <p>
                  <strong>Event Type:</strong> {bookingForm.eventType}
                </p>
                <p>
                  <strong>Guests:</strong> {bookingForm.guestCount}
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => {
                console.log("🔘 Close button clicked");
                setShowSuccess(false);
                setIsBookingOpen(false);
                // Reset form when closing success notification
                setBookingForm({
                  name: "",
                  email: "",
                  phone: "",
                  eventDate: "",
                  eventType: "",
                  guestCount: "",
                  message: "",
                });
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 font-pike">
                Book Us For Your Event
              </h2>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={bookingForm.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={bookingForm.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingForm.phone}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Date *
                </label>
                <div className="relative" ref={calendarRef}>
                  <input
                    type="text"
                    name="eventDate"
                    value={bookingForm.eventDate}
                    onChange={handleInputChange}
                    onClick={() => setShowCalendar(!showCalendar)}
                    required
                    readOnly
                    placeholder="Select event date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900 cursor-pointer"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>

                  {/* Custom Calendar Popup */}
                  {showCalendar && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-4 min-w-[280px]">
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={prevMonth}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 19l-7-7 7-7"
                            />
                          </svg>
                        </button>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {monthNames[currentDate.getMonth()]}{" "}
                          {currentDate.getFullYear()}
                        </h3>
                        <button
                          onClick={nextMonth}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                        >
                          <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Day Headers */}
                      <div className="grid grid-cols-7 gap-1 mb-2">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                          (day, index) => (
                            <div
                              key={day}
                              className={`text-center text-sm font-medium py-2 ${
                                index === 0 ? "text-red-600" : "text-gray-600"
                              }`}
                            >
                              {day}
                            </div>
                          )
                        )}
                      </div>

                      {/* Calendar Days */}
                      <div className="grid grid-cols-7 gap-1">
                        {Array.from(
                          { length: getFirstDayOfMonth(currentDate) },
                          (_, i) => (
                            <div key={`empty-${i}`} className="h-10"></div>
                          )
                        )}
                        {Array.from(
                          { length: getDaysInMonth(currentDate) },
                          (_, i) => {
                            const day = i + 1;
                            const isSunday =
                              (getFirstDayOfMonth(currentDate) + i) % 7 === 0;
                            const isSelected =
                              bookingForm.eventDate ===
                              formatDate(
                                new Date(
                                  currentDate.getFullYear(),
                                  currentDate.getMonth(),
                                  day
                                )
                              );

                            return (
                              <button
                                key={day}
                                onClick={() => handleDateSelect(day)}
                                disabled={isPastDate(day)}
                                className={`
                                h-10 w-10 rounded-full text-sm font-medium transition-all duration-200
                                ${
                                  isPastDate(day)
                                    ? "text-gray-300 cursor-not-allowed"
                                    : isSelected
                                      ? "bg-red-600 text-white"
                                      : isToday(day)
                                        ? "bg-red-100 text-red-600 border-2 border-red-600"
                                        : isSunday
                                          ? "text-red-600 hover:bg-red-50"
                                          : "text-gray-700 hover:bg-gray-100"
                                }
                              `}
                              >
                                {day}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Select your event date (past dates are disabled)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type *
                </label>
                <select
                  name="eventType"
                  value={bookingForm.eventType}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                >
                  <option value="">Select Event Type</option>
                  <option value="Birthday Party">Birthday Party</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Corporate Event">Corporate Event</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Guests *
                </label>
                <input
                  type="number"
                  name="guestCount"
                  value={bookingForm.guestCount}
                  onChange={handleInputChange}
                  required
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Additional Message
                </label>
                <textarea
                  name="message"
                  value={bookingForm.message}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 text-gray-900"
                  placeholder="Tell us more about your event..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send Booking Request"}
              </button>
              {submitMessage && (
                <p
                  className={`text-center mt-4 ${isSubmitting ? "text-gray-500" : "text-green-600"}`}
                >
                  {submitMessage}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
