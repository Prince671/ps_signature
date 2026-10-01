import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import emailjs from "@emailjs/browser";
import ScrollReveal from "../ui/ScrollReveal";
import { useGeolocation } from "../../hooks/useGeolocation";
import TextReveal from "../ui/TextReveal";
import MagneticButton from "../ui/MagneticButton";

const Contact = () => {
  const ref = useRef(null);
  const formRef = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const { locData } = useGeolocation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    submitting: false,
    submitted: false,
    error: null,
  });

  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("princesoni.cs21@gmail.com");
    } catch {
      const helper = document.createElement("textarea");
      helper.value = "princesoni.cs21@gmail.com";
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      const didCopy = document.execCommand("copy");
      helper.remove();
      if (!didCopy) return;
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;

    // Map form field names to state property names
    const stateMapping = {
      name: "name",
      email: "email",
      message: "message",
    };

    setFormData({
      ...formData,
      [stateMapping[fieldName] || fieldName]: fieldValue,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Honeypot anti-spam check
    const honeypot = formRef.current?.querySelector('[name="website"]');
    if (honeypot && honeypot.value) {
      // Bot detected — silently ignore
      setStatus({ submitting: false, submitted: true, error: null });
      return;
    }

    setStatus({ submitting: true, submitted: false, error: null });

    // Fetch user info with fallbacks (helps if one is blocked by adblockers)
    let ip = locData.ip;
    let location = locData.fullLocation;
    let deviceName =
      typeof navigator !== "undefined" ? navigator.userAgent : "Unknown";

    // EmailJS configuration
    const serviceId = import.meta.env.VITE_SERVICE_ID;
    const templateId = import.meta.env.VITE_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      setStatus({
        submitting: false,
        submitted: false,
        error: "The contact form is temporarily unavailable. Please email princesoni.cs21@gmail.com directly.",
      });
      return;
    }

    // Append info to message so it displays in email regardless of template
    const detailedMessage = `${formData.message}\n\n---\nSender Info:\nIP: ${ip}\nLocation: ${location}\nDevice: ${deviceName}`;

    // Prepare form data for EmailJS to match your template variables
    const templateParams = {
      name: formData.name,
      email: formData.email,
      message: detailedMessage,
      title: `Portfolio Contact from ${formData.name}`, // Matches {{title}} in your screenshot
      ip: ip,
      location: location,
      device: deviceName,
    };

    try {
      await emailjs.send(serviceId, templateId, templateParams, publicKey);
      setStatus({ submitting: false, submitted: true, error: null });
      setFormData({ name: "", email: "", message: "" });
      window.setTimeout(() => {
        setStatus((prev) => ({ ...prev, submitted: false }));
      }, 5000);
    } catch (error) {
      console.error("Failed to send email:", error);
      setStatus({
        submitting: false,
        submitted: false,
        error: "Failed to send message. Please try again or email princesoni.cs21@gmail.com directly.",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section id="contact" className="section-padding bg-transparent">
      <div className="container-custom" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <ScrollReveal delay={0}>
            <h4 className="font-mono text-sm text-muted mb-2">
              <span className="text-red">// 06</span> &mdash; GET IN TOUCH
            </h4>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-accent">
              <span className="glitch-hover" data-text="CONTACT ME">
                CONTACT ME
              </span>
            </h2>
            <div
              className="w-16 h-[2px]"
              style={{ backgroundColor: "var(--color-red)", opacity: 0.6 }}
            ></div>
          </ScrollReveal>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.h3
              variants={itemVariants}
              className="text-xl font-medium mb-6"
            >
              Let's start a conversation
            </motion.h3>

            <div className="text-muted mb-8 text-lg font-mono leading-relaxed">
              <TextReveal text="Have a project in mind? Want to discuss collaboration opportunities? I'm always open to discussing new projects, creative ideas or opportunities to be part of your vision." />
            </div>

            <motion.div variants={containerVariants} className="space-y-6">
              <motion.div variants={itemVariants} className="flex items-start">
                <div
                  className="mr-5 p-3 bg-primary"
                  style={{
                    border: "2px solid var(--color-border-strong)",
                    boxShadow: "4px 4px 0px var(--color-border-strong)",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-accent"
                  >
                    <path
                      d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C19.5304 19 20.0391 18.7893 20.4142 18.4142C20.7893 18.0391 21 17.5304 21 17V7C21 6.46957 20.7893 5.96086 20.4142 5.58579C20.0391 5.21071 19.5304 5 19 5H5C4.46957 5 3.96086 5.21071 3.58579 5.58579C3.21071 5.96086 3 6.46957 3 7V17C3 17.5304 3.21071 18.0391 3.58579 18.4142C3.96086 18.7893 4.46957 19 5 19Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Email</h4>
                  <div className="flex items-center gap-3">
                    <a
                      href="mailto:princesoni.cs21@gmail.com"
                      className="text-muted hover:text-light transition-colors break-all"
                    >
                      princesoni.cs21@gmail.com
                    </a>
                    <button
                      type="button"
                      onClick={copyEmail}
                      className="p-1.5 rounded-md hover:bg-secondary/40 text-muted hover:text-light transition-all flex-shrink-0"
                      title="Copy email address"
                    >
                      {copied ? (
                        <svg
                          className="w-4 h-4 text-green-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <rect
                            x="9"
                            y="9"
                            width="13"
                            height="13"
                            rx="2"
                            ry="2"
                          ></rect>
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-start">
                <div
                  className="mr-5 p-3 bg-primary"
                  style={{
                    border: "2px solid var(--color-border-strong)",
                    boxShadow: "4px 4px 0px var(--color-border-strong)",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-accent"
                  >
                    <path
                      d="M5 4H9L11 9L8.5 10.5C9.57 12.6715 11.3285 14.43 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Phone</h4>
                  <a
                    href="tel:+916265441667"
                    className="text-muted hover:text-light transition-colors"
                  >
                    +91-6265441667
                  </a>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-start">
                <div
                  className="mr-5 p-3 bg-primary"
                  style={{
                    border: "2px solid var(--color-border-strong)",
                    boxShadow: "4px 4px 0px var(--color-border-strong)",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="text-accent"
                  >
                    <path
                      d="M9 19C9 20.1046 7.65685 21 6 21C4.34315 21 3 20.1046 3 19C3 17.8954 4.34315 17 6 17C7.65685 17 9 17.8954 9 19ZM9 19V5C9 3.89543 9.89543 3 11 3H21C22.1046 3 23 3.89543 23 5V19C23 20.1046 22.1046 21 21 21M21 21C19.3431 21 18 20.1046 18 19C18 17.8954 19.3431 17 21 17C22.6569 17 24 17.8954 24 19C24 20.1046 22.6569 21 21 21ZM15 19C15 20.1046 13.6569 21 12 21C10.3431 21 9 20.1046 9 19C9 17.8954 10.3431 17 12 17C13.6569 17 15 17.8954 15 19Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Connect</h4>
                  <div className="flex flex-wrap gap-6 mt-4">
                    <a
                      href="https://github.com/Prince671"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted hover:text-light transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.49C9.34 21.581 9.522 21.276 9.522 21.008C9.522 20.766 9.513 20.011 9.508 19.172C6.726 19.791 6.143 17.898 6.143 17.898C5.699 16.754 5.064 16.451 5.064 16.451C4.187 15.818 5.131 15.829 5.131 15.829C6.104 15.898 6.626 16.868 6.626 16.868C7.498 18.412 8.974 17.945 9.541 17.687C9.63 17.058 9.888 16.592 10.175 16.32C7.956 16.046 5.62 15.233 5.62 11.477C5.62 10.386 6.01 9.491 6.646 8.787C6.546 8.531 6.202 7.57 6.747 6.181C6.747 6.181 7.563 5.908 9.497 7.211C10.29 7.002 11.151 6.898 12.001 6.894C12.849 6.899 13.71 7.002 14.505 7.211C16.437 5.908 17.252 6.181 17.252 6.181C17.798 7.57 17.454 8.531 17.354 8.787C17.991 9.491 18.379 10.386 18.379 11.477C18.379 15.246 16.038 16.044 13.813 16.313C14.172 16.647 14.492 17.308 14.492 18.313C14.492 19.754 14.479 20.674 14.479 21.007C14.479 21.278 14.659 21.586 15.167 21.49C19.137 20.162 22 16.418 22 12C22 6.477 17.523 2 12 2Z" />
                      </svg>
                    </a>

                    <a
                      href="https://leetcode.com/u/prince-67/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted hover:text-light transition-colors"
                    >
                      <img
                        src="https://leetcode.com/_next/static/images/logo-dark-c96c407d175e36c81e236fcfdd682a0b.png"
                        alt="LeetCode Logo"
                        className="w-6 h-6"
                      />
                    </a>

                    <a
                      href="https://www.linkedin.com/in/princesoni67/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted hover:text-light transition-colors"
                    >
                      <svg
                        className="w-6 h-6"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="neo-card p-6 md:p-8 transition-all duration-300"
              style={{
                boxShadow: "8px 8px 0px var(--color-border-strong)",
                borderColor: "var(--color-border-strong)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--color-red)";
                e.currentTarget.style.boxShadow =
                  "8px 8px 0px var(--color-red)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor =
                  "var(--color-border-strong)";
                e.currentTarget.style.boxShadow =
                  "8px 8px 0px var(--color-border-strong)";
              }}
            >
              <h3 className="text-xl font-medium mb-6 uppercase tracking-widest border-b-2 border-border-strong pb-2 transition-colors duration-300">
                Send Message
              </h3>

              {/* Honeypot field — hidden from humans, catches bots */}
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  opacity: 0,
                  height: 0,
                  overflow: "hidden",
                }}
                aria-hidden="true"
              >
                <input
                  type="text"
                  name="website"
                  tabIndex="-1"
                  autoComplete="off"
                />
              </div>

              <div className="mb-6 flex flex-col items-start w-full relative group">
                <label
                  htmlFor="name"
                  className="absolute -top-3 left-4 bg-primary px-2 font-mono text-[10px] tracking-widest uppercase transition-colors group-focus-within:text-red group-hover:text-red z-10"
                  style={{ color: "var(--color-muted)" }}
                >
                  [ NAME ]
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent p-4 text-light font-mono focus:outline-none transition-all duration-200 z-0"
                  style={{
                    border: "2px solid var(--color-border-strong)",
                    borderRadius: "0px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-red)";
                    e.target.style.boxShadow = "4px 4px 0px var(--color-red)";
                    e.target.style.transform = "translate(-2px, -2px)";
                    e.target.dataset.focused = "true";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border-strong)";
                    e.target.style.boxShadow = "none";
                    e.target.style.transform = "translate(0px, 0px)";
                    e.target.dataset.focused = "false";
                  }}
                  onMouseEnter={(e) => {
                    if (e.target.dataset.focused !== "true")
                      e.target.style.borderColor = "var(--color-red)";
                  }}
                  onMouseLeave={(e) => {
                    if (e.target.dataset.focused !== "true")
                      e.target.style.borderColor = "var(--color-border-strong)";
                  }}
                  required
                />
              </div>

              <div className="mb-6 flex flex-col items-start w-full relative group">
                <label
                  htmlFor="email"
                  className="absolute -top-3 left-4 bg-primary px-2 font-mono text-[10px] tracking-widest uppercase transition-colors group-focus-within:text-red group-hover:text-red z-10"
                  style={{ color: "var(--color-muted)" }}
                >
                  [ EMAIL_ADDRESS ]
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-transparent p-4 text-light font-mono focus:outline-none transition-all duration-200 z-0"
                  style={{
                    border: "2px solid var(--color-border-strong)",
                    borderRadius: "0px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-red)";
                    e.target.style.boxShadow = "4px 4px 0px var(--color-red)";
                    e.target.style.transform = "translate(-2px, -2px)";
                    e.target.dataset.focused = "true";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border-strong)";
                    e.target.style.boxShadow = "none";
                    e.target.style.transform = "translate(0px, 0px)";
                    e.target.dataset.focused = "false";
                  }}
                  onMouseEnter={(e) => {
                    if (e.target.dataset.focused !== "true")
                      e.target.style.borderColor = "var(--color-red)";
                  }}
                  onMouseLeave={(e) => {
                    if (e.target.dataset.focused !== "true")
                      e.target.style.borderColor = "var(--color-border-strong)";
                  }}
                  required
                />
              </div>

              <div className="mb-8 flex flex-col items-start w-full relative group">
                <label
                  htmlFor="message"
                  className="absolute -top-3 left-4 bg-primary px-2 font-mono text-[10px] tracking-widest uppercase transition-colors group-focus-within:text-red group-hover:text-red z-10"
                  style={{ color: "var(--color-muted)" }}
                >
                  [ DATA_PAYLOAD ]
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full bg-transparent p-4 text-light font-mono focus:outline-none transition-all duration-200 z-0 resize-none"
                  style={{
                    border: "2px solid var(--color-border-strong)",
                    borderRadius: "0px",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--color-red)";
                    e.target.style.boxShadow = "6px 6px 0px var(--color-red)";
                    e.target.style.transform = "translate(-3px, -3px)";
                    e.target.dataset.focused = "true";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--color-border-strong)";
                    e.target.style.boxShadow = "none";
                    e.target.style.transform = "translate(0px, 0px)";
                    e.target.dataset.focused = "false";
                  }}
                  onMouseEnter={(e) => {
                    if (e.target.dataset.focused !== "true")
                      e.target.style.borderColor = "var(--color-red)";
                  }}
                  onMouseLeave={(e) => {
                    if (e.target.dataset.focused !== "true")
                      e.target.style.borderColor = "var(--color-border-strong)";
                  }}
                  required
                ></textarea>
              </div>

              <MagneticButton className="w-full" strength={10}>
                <button
                  type="submit"
                  className={`glitch-click w-full py-4 font-mono font-bold text-sm tracking-[0.2em] uppercase transition-all duration-100 flex items-center justify-center gap-3 ${status.submitting ? "opacity-50 cursor-not-allowed hidden-shadow" : "hover:bg-accent hover:text-primary cursor-pointer"}`}
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-accent)",
                    border: "2px solid var(--color-accent)",
                    boxShadow: status.submitting
                      ? "0px 0px 0px transparent"
                      : "6px 6px 0px var(--color-accent)",
                    transform: status.submitting
                      ? "translate(0px, 0px)"
                      : "translate(-3px, -3px)",
                  }}
                  disabled={status.submitting}
                  onMouseDown={(e) => {
                    if (!status.submitting) {
                      e.currentTarget.style.transform = "translate(3px, 3px)";
                      e.currentTarget.style.boxShadow =
                        "0px 0px 0px var(--color-accent)";
                    }
                  }}
                  onMouseUp={(e) => {
                    if (!status.submitting) {
                      e.currentTarget.style.transform = "translate(-3px, -3px)";
                      e.currentTarget.style.boxShadow =
                        "6px 6px 0px var(--color-accent)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!status.submitting) {
                      e.currentTarget.style.transform = "translate(-3px, -3px)";
                      e.currentTarget.style.boxShadow =
                        "6px 6px 0px var(--color-accent)";
                    }
                  }}
                >
                  {status.submitting ? "[ SENDING... ]" : "[ SEND MESSAGE]"}
                </button>
              </MagneticButton>

              {status.submitted && (
                <div className="mt-4 p-3 bg-green-500 bg-opacity-20 border border-green-500 text-green-300 text-center">
                  Message sent successfully!
                </div>
              )}

              {status.error && (
                <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 text-red-300 text-center">
                  {status.error}
                </div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
