"use client";

import { useEffect, useState } from "react";

import Navigation from "@/components/Navigation";

export default function CareersPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedRole, setSelectedRole] = useState<{
    title?: string;
    location?: string;
  } | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>("");

  type JobRole = {
    _id: string;
    title: string;
    location?: string;
    type?: string;
    postedAt?: string;
  };
  function OpenRoles({ onApply }: { onApply: (role?: JobRole) => void }) {
    const [roles, setRoles] = useState<JobRole[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      async function load() {
        try {
          const res = await fetch("/api/open-roles");
          const json: { roles?: JobRole[]; message?: string } =
            await res.json();
          if (!res.ok) throw new Error(json.message || "Failed to load roles");
          setRoles(json.roles || []);
        } catch (e) {
          const msg = e instanceof Error ? e.message : "Failed to load roles";
          setError(msg);
        } finally {
          setLoading(false);
        }
      }
      load();
    }, []);

    if (loading)
      return (
        <div className="max-w-3xl mx-auto mb-6 text-neutral-600">
          Loading open roles…
        </div>
      );
    if (error)
      return <div className="max-w-3xl mx-auto mb-6 text-red-600">{error}</div>;
    if (roles.length === 0) {
      return (
        <>
          <h2 className="text-2xl font-bold mb-2 font-pike text-neutral-900 text-center">
            Open Roles
          </h2>
          <p className="text-neutral-600 text-center">
            There are currently no open roles. Please check back soon.
          </p>
        </>
      );
    }

    // Helper to format postedAt relative time
    const formatPosted = (iso?: string): string | null => {
      if (!iso) return null;
      const then = new Date(iso).getTime();
      if (Number.isNaN(then)) return null;
      const diffMs = Date.now() - then;
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      if (days <= 0) return "Posted today";
      if (days === 1) return "Posted 1 day ago";
      if (days < 30) return `Posted ${days} days ago`;
      const months = Math.floor(days / 30);
      if (months === 1) return "Posted 1 month ago";
      return `Posted ${months} months ago`;
    };

    return (
      <>
        <h2 className="text-2xl font-bold mb-3 font-pike text-neutral-900 text-center">
          Open Roles
        </h2>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-8 max-w-4xl mx-auto divide-y">
          {roles.map((r) => {
            const meta: string[] = [];
            if (r.location) meta.push(r.location);
            if (r.type) meta.push(r.type);
            const posted = formatPosted(r.postedAt);
            return (
              <div
                key={r._id}
                className="py-4 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="text-lg font-semibold text-neutral-900">
                    {r.title}
                  </div>
                  <div className="text-sm text-neutral-600">
                    {meta.join(" • ")}
                    {posted ? (meta.length ? ` • ${posted}` : posted) : ""}
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    onApply(r);
                  }}
                  className="shrink-0 inline-flex items-center bg-[#e80812] text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 transition"
                >
                  Apply
                </button>
              </div>
            );
          })}
        </div>
      </>
    );
  }
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    const form = event.currentTarget;
    const data = new FormData(form);

    const resume = data.get("resume") as File | null;
    if (!resume) {
      setErrorMessage("Please attach your resume (PDF or DOC/DOCX).");
      return;
    }
    if (resume.size > 5 * 1024 * 1024) {
      setErrorMessage("Resume file is too large. Max 5MB.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/careers", {
        method: "POST",
        body: data,
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Submission failed");
      }
      setSuccessMessage("Thanks! Your application was submitted successfully.");
      form.reset();
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-[70vh] bg-neutral-50 text-neutral-900">
      <Navigation onAIOpen={() => {}} showMenu={false} />
      <div className="h-[110px] md:h-[140px] lg:h-[150px]" />
      <div className="max-w-4xl mx-auto px-4 py-12">
        {showForm && (
          <div className="max-w-6xl mx-auto px-4 mb-6">
            <button
              onClick={() => {
                setShowForm(false);
                setSelectedRole(null);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="bg-gray-600 text-white px-4 sm:px-6 py-2 rounded-full font-semibold hover:bg-gray-700 transition-colors font-pike text-sm sm:text-base"
            >
              ← Back to Careers
            </button>
          </div>
        )}
        <h1 className="text-3xl font-bold mb-2 font-pike text-neutral-900">
          Careers at Mashti Cafe
        </h1>
        <p className="text-neutral-600 mb-6 font-sodo">
          Join our team! Fill out the form and upload your resume. We’ll get
          back to you.
        </p>
        {(successMessage || errorMessage || showForm) && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            {successMessage && (
              <div className="mb-6 p-4 rounded-lg bg-green-50 text-green-800 border border-green-200">
                {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-50 text-red-800 border border-red-200">
                {errorMessage}
              </div>
            )}

            {showForm && (
              <form id="apply" onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-800 mb-1">
                      Full Name
                    </label>
                    <input
                      name="name"
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white placeholder:text-neutral-400"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-800 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white placeholder:text-neutral-400"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-800 mb-1">
                      Phone
                    </label>
                    <input
                      name="phone"
                      required
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white placeholder:text-neutral-400"
                      placeholder="+1 (___) ___-____"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-800 mb-1">
                      Position
                    </label>
                    {selectedRole?.title ? (
                      <input
                        name="position"
                        readOnly
                        value={selectedRole.title}
                        className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-neutral-700"
                      />
                    ) : (
                      <select
                        name="position"
                        required
                        className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <option value="">Select a role</option>
                        <option value="Barista">Barista</option>
                        <option value="Kitchen Staff">Kitchen Staff</option>
                        <option value="Front of House">Front of House</option>
                        <option value="Shift Lead">Shift Lead</option>
                        <option value="Other">Other</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-800 mb-1">
                      Preferred Location
                    </label>
                    {selectedRole?.location ? (
                      <input
                        name="location"
                        readOnly
                        value={selectedRole.location}
                        className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 text-neutral-700"
                      />
                    ) : (
                      <select
                        name="location"
                        className="w-full border border-gray-300 rounded-lg p-3 bg-white focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        <option value="">Select location</option>
                        <option value="Central">Central</option>
                        <option value="Coquitlam">Coquitlam</option>
                        <option value="Either">Either</option>
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-800 mb-1">
                      LinkedIn
                    </label>
                    <input
                      name="linkedin"
                      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white placeholder:text-neutral-400"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-800 mb-1">
                    Cover Message
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-300 bg-white placeholder:text-neutral-400"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-800 mb-1">
                    Resume (PDF, DOC, DOCX — max 5MB)
                  </label>
                  <div className="flex items-center gap-3">
                    <label
                      htmlFor="resume-upload"
                      className="inline-flex items-center bg-[#e80812] text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600 cursor-pointer"
                    >
                      Choose file
                    </label>
                    <span className="text-sm text-neutral-600">
                      {selectedFileName || "No file chosen"}
                    </span>
                  </div>
                  <input
                    id="resume-upload"
                    type="file"
                    name="resume"
                    required
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    className="hidden"
                    onChange={(e) =>
                      setSelectedFileName(e.target.files?.[0]?.name || "")
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-[#e80812] text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-60"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            )}
          </div>
        )}
        {!showForm && (
          <OpenRoles
            onApply={(role) => {
              setSelectedRole({ title: role?.title, location: role?.location });
              setShowForm(true);
              setTimeout(() => {
                const el = document.getElementById("apply");
                if (el)
                  el.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 0);
            }}
          />
        )}
      </div>
    </div>
  );
}
