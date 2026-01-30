"use client";

import { Suspense, useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { ArrowRight, CheckCircle } from "lucide-react";
import { api } from "~/trpc/react";
import { DomainLayout } from "~/components/domain-layout";

function ContactContent() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    services: [] as string[],
    role: "",
  });

  const serviceOptions = [
    { value: "custom_applications", label: "Custom Applications" },
    { value: "ai_automation", label: "AI & Automation" },
    { value: "system_integration", label: "System Integration" },
    { value: "technical_consulting", label: "Technical Consulting" },
    { value: "optimization", label: "Optimization Services" },
    { value: "other", label: "Other" },
  ];

  const roleOptions = [
    { value: "", label: "Select your role..." },
    { value: "solo_founder", label: "Solo Founder" },
    { value: "startup_team", label: "Startup Team (2-10)" },
    { value: "smb", label: "Small/Medium Business" },
    { value: "enterprise", label: "Enterprise" },
    { value: "agency_consultant", label: "Agency / Consultant" },
  ];

  const toggleService = (service: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter((s) => s !== service)
        : [...prev.services, service],
    }));
  };
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = api.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      setFormData({ name: "", email: "", phone: "", message: "", services: [], role: "" });
    },
  });

  // Helper to extract readable error message from tRPC/Zod errors
  const getErrorMessage = (error: { message: string } | null) => {
    if (!error) return null;
    try {
      const parsed = JSON.parse(error.message);
      if (Array.isArray(parsed) && parsed[0]?.message) {
        return parsed[0].message as string;
      }
    } catch {
      // Not JSON, return as-is
    }
    return error.message;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitMutation.mutate(formData);
  };

  return (
    <DomainLayout>
    <div className="min-h-screen bg-black">
      {/* Hero */}
      <section className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h1
            className="mb-6 text-4xl font-bold text-white sm:text-5xl"
            style={{
              fontFamily: "var(--font-quattrocento-sans)",
              letterSpacing: "0.02em",
            }}
          >
            Get In{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Touch
            </span>
          </h1>
          <p className="text-lg text-gray-300">
            Have a project in mind or want to learn more about how we can help?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section
        className="px-4 py-20 sm:px-6"
        style={{ backgroundColor: "rgba(23, 23, 23, 0.95)" }}
      >
        <div className="mx-auto max-w-2xl">
          {submitted ? (
            <Card
              className="bg-white/5 backdrop-blur-md"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-8 text-center">
                <CheckCircle
                  className="mx-auto mb-4 h-12 w-12"
                  style={{ color: "#D4AF37" }}
                />
                <h2 className="mb-2 text-2xl font-bold text-white">
                  Message Sent
                </h2>
                <p className="mb-6 text-gray-300">
                  Thank you for reaching out. We'll get back to you soon.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSubmitted(false)}
                  className="border-2 bg-white/5"
                  style={{
                    borderColor: "rgba(212, 175, 55, 0.5)",
                    color: "#D4AF37",
                  }}
                >
                  Send Another Message
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card
              className="bg-white/5 backdrop-blur-md"
              style={{
                borderColor: "rgba(212, 175, 55, 0.3)",
                borderWidth: "1px",
              }}
            >
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Name <span style={{ color: "#D4AF37" }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: "rgba(212, 175, 55, 0.3)",
                      }}
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Email <span style={{ color: "#D4AF37" }}>*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: "rgba(212, 175, 55, 0.3)",
                      }}
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Phone <span className="text-gray-500">(optional)</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: "rgba(212, 175, 55, 0.3)",
                      }}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Your Role <span className="text-gray-500">(optional)</span>
                    </label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                      className="w-full rounded-md border bg-white/5 px-4 py-3 text-white focus:outline-none focus:ring-2"
                      style={{
                        borderColor: "rgba(212, 175, 55, 0.3)",
                      }}
                    >
                      {roleOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          className="bg-black"
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-3 block text-sm font-medium text-gray-300">
                      Services of Interest <span className="text-gray-500">(optional)</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {serviceOptions.map((service) => (
                        <label
                          key={service.value}
                          className="flex cursor-pointer items-center gap-3 rounded-md border bg-white/5 px-4 py-3 transition-colors hover:bg-white/10"
                          style={{
                            borderColor: formData.services.includes(service.value)
                              ? "rgba(212, 175, 55, 0.6)"
                              : "rgba(212, 175, 55, 0.3)",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={formData.services.includes(service.value)}
                            onChange={() => toggleService(service.value)}
                            className="h-4 w-4 rounded border-gray-600 bg-transparent text-yellow-600 focus:ring-yellow-500"
                            style={{ accentColor: "#D4AF37" }}
                          />
                          <span className="text-sm text-gray-300">{service.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="mb-2 block text-sm font-medium text-gray-300"
                    >
                      Message <span style={{ color: "#D4AF37" }}>*</span>
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full rounded-md border bg-white/5 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2"
                      style={{
                        borderColor: "rgba(212, 175, 55, 0.3)",
                      }}
                      placeholder="Tell us about your project or question..."
                    />
                  </div>

                  {submitMutation.error && (
                    <p className="text-sm text-red-400">
                      {getErrorMessage(submitMutation.error)}
                    </p>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    disabled={submitMutation.isPending}
                    className="w-full px-8 text-black shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
                    style={{
                      background:
                        "linear-gradient(135deg, #F6E6C1 0%, #D4AF37 100%)",
                    }}
                  >
                    {submitMutation.isPending ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Message
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

        </div>
      </section>
    </div>
    </DomainLayout>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <ContactContent />
    </Suspense>
  );
}
