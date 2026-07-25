"use client";

import { createBooking } from "@/lib/actions/bookings";
import { CalendarDays, CheckCircle2, Mail, MapPin, Phone, User } from "lucide-react";
import { useState } from "react";

const initialState = {
    fullName: '',
    email: '',
    phone: '',
    package: 'Basic Package',
    eventType: 'Portrait',
    eventDate: '',
    location: '',
    message: '',
};


const ContactPage = () => {
    const [form, setForm] = useState(initialState);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const data = await createBooking(form);

            if (data?.success) {
                setSuccess(true);
                setForm(initialState);
            } else {
                setError(data?.message || 'Failed to send booking request.');
            }
        } catch (err) {
            console.error('Booking submit error:', err);
            setError(err.message || 'Failed to send booking request.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="rounded-xl border border-neutral-800 bg-black p-10 text-center space-y-3 pt-30">
                <CheckCircle2 className="w-10 h-10 text-red-500 mx-auto" />
                <h3 className="text-xl font-bold text-white">Request sent</h3>
                <p className="text-neutral-400 text-sm">
                    Thanks — I'll get back to you shortly to confirm the details.
                </p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-2 text-sm text-red-500 hover:text-red-400 font-semibold"
                >
                    Send another request
                </button>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-black text-white pt-30 pb-20 px-6">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

                {/* Left Side */}
                <div>
                    <p className="text-red-500 uppercase tracking-[0.3em] text-xs font-mono mb-3">
                        Booking
                    </p>

                    <h1 className="text-5xl font-black uppercase leading-tight">
                        Book Your <br /> Next Session
                    </h1>

                    <p className="mt-6 text-neutral-400 leading-relaxed max-w-lg">
                        Fill out the booking form and I'll get back to you within
                        24 hours. Whether it's a portrait, wedding, commercial shoot,
                        or a custom project, let's create something unforgettable.
                    </p>

                    <div className="mt-10 space-y-6">

                        <div className="flex items-center gap-4">
                            <Mail className="text-red-500" />
                            <span>hello@yourstudio.com</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <Phone className="text-red-500" />
                            <span>+880 1234-567890</span>
                        </div>

                        <div className="flex items-center gap-4">
                            <MapPin className="text-red-500" />
                            <span>Dhaka, Bangladesh</span>
                        </div>

                    </div>
                </div>

                {/* Right Side */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-3xl p-8">

                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="text-sm text-neutral-400">Full Name</label>
                            <div className="relative mt-2">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                                <input
                                    type="text"
                                    name="fullName"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-red-500 text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-neutral-400">Email Address</label>
                            <div className="relative mt-2">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="john@email.com"
                                    className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-red-500 text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-neutral-400">Phone Number</label>
                            <div className="relative mt-2">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+880..."
                                    className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-red-500 text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-neutral-400">Select Package</label>
                            <select
                                name="package"
                                value={form.package}
                                onChange={handleChange}
                                className="w-full mt-2 bg-black border border-neutral-800 rounded-xl py-3 px-4 outline-none focus:border-red-500 text-white"
                            >
                                <option>Basic Package</option>
                                <option>Premium Package</option>
                                <option>Luxury Package</option>
                                <option>Custom Package</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-neutral-400">Event Type</label>
                            <select
                                name="eventType"
                                value={form.eventType}
                                onChange={handleChange}
                                className="w-full mt-2 bg-black border border-neutral-800 rounded-xl py-3 px-4 outline-none focus:border-red-500 text-white"
                            >
                                <option>Portrait</option>
                                <option>Wedding</option>
                                <option>Commercial</option>
                                <option>Fashion</option>
                                <option>Travel</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-neutral-400">Event Date</label>
                            <div className="relative mt-2">
                                <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                                <input
                                    type="date"
                                    name="eventDate"
                                    value={form.eventDate}
                                    onChange={handleChange}
                                    className="w-full bg-black border border-neutral-800 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-red-500 text-white"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-neutral-400">Event Location</label>
                            <input
                                type="text"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                placeholder="Dhaka, Bangladesh"
                                className="mt-2 w-full bg-black border border-neutral-800 rounded-xl py-3 px-4 outline-none focus:border-red-500 text-white"
                            />
                        </div>

                        <div>
                            <label className="text-sm text-neutral-400">Tell me about your project</label>
                            <textarea
                                name="message"
                                value={form.message}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Describe your event..."
                                className="mt-2 w-full bg-black border border-neutral-800 rounded-xl py-3 px-4 outline-none resize-none focus:border-red-500 text-white"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-red-500">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full rounded-xl bg-red-500 py-4 font-semibold hover:bg-red-600 transition disabled:opacity-50 text-white"
                        >
                            {submitting ? 'Sending...' : 'Send Booking Request'}
                        </button>

                    </form>

                </div>
            </div>
        </section>
    );
};

export default ContactPage;