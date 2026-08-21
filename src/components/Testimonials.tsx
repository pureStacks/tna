import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquarePlus, CheckCircle2, Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCMS } from '../context/CMSContext';
import { apiFetch, parseApiResponse } from '../lib/api';

export default function Testimonials() {
  const { data } = useCMS();
  const initialTestimonials = data?.testimonials || [];
  
  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);

  const cleanLocation = (raw: string = '') => {
    return raw.split('||')[0].split('[email:')[0].trim();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Please enter your name');
    if (!email.trim() || !email.includes('@')) {
      return toast.error('Please enter a valid email address so we can reply to you');
    }
    if (!location.trim()) return toast.error('Please enter your location');
    if (!text.trim()) return toast.error('Please enter your review');

    const newReview = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      location: location.trim(),
      text: text.trim(),
      rating,
    };

    setSubmitting(true);
    try {
      const res = await apiFetch('/api/public/review', {
        method: 'POST',
        body: JSON.stringify(newReview)
      });
      
      const result = await parseApiResponse(res);
      if (result.ok) {
        setIsSubmitted(true);
        // Reset form after a delay if they want to submit another
        setTimeout(() => {
          setShowForm(false);
          setIsSubmitted(false);
          setName('');
          setEmail('');
          setLocation('');
          setText('');
          setRating(5);
        }, 4000);
      } else {
        toast.error(result.error || 'Failed to submit review');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-green-700 font-bold tracking-wider uppercase text-sm mb-3">Testimonials</h2>
          <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            What Our Customers Are Saying
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <AnimatePresence>
            {initialTestimonials.map((testimonial: any, index: number) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full"
              >
                <div className="flex text-yellow-400 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-5 h-5 ${i < testimonial.rating ? 'fill-current' : 'text-gray-200'}`} 
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-8 flex-grow">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-800 font-bold mr-4">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-bold text-gray-900">{testimonial.name}</h5>
                    <span className="text-sm text-gray-500">{cleanLocation(testimonial.location) || 'Nigeria'}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Review Submission Section */}
        <div className="max-w-2xl mx-auto mt-12 bg-white rounded-2xl shadow-md border border-gray-100 p-8">
          {!showForm && !isSubmitted ? (
            <div className="text-center">
              <MessageSquarePlus className="w-12 h-12 text-green-700 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Have you ordered from us?</h4>
              <p className="text-gray-600 mb-6">We would love to hear about your experience.</p>
              <button 
                onClick={() => setShowForm(true)}
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full font-bold transition-colors shadow-sm"
              >
                Write a Review
              </button>
            </div>
          ) : isSubmitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h4 className="text-2xl font-bold text-gray-900 mb-2">Thank you for your review!</h4>
              <p className="text-gray-600">Your feedback has been received and our team may follow up with you via email.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">Leave Your Feedback</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Please provide your details so our team can follow up and reply to you.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Rating Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating *</label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-8 h-8 ${
                            star <= (hoveredRating || rating) 
                              ? 'text-yellow-400 fill-current' 
                              : 'text-gray-200'
                          }`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Your Name *</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900"
                      placeholder="e.g. David Adebayo"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">City / Location *</label>
                    <input 
                      type="text" 
                      id="location"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900"
                      placeholder="e.g. Oshogbo, Osun State"
                    />
                  </div>
                </div>

                {/* Email Address - Requested before submission so admin can reply */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                      Your Email Address *
                    </label>
                    <span className="text-xs text-green-700 font-medium">Used for admin reply</span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input 
                      type="email" 
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900"
                      placeholder="e.g. yourname@example.com"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">
                    Your email is kept confidential and will not be displayed on the public website. It allows our administration team to reply to your feedback.
                  </p>
                </div>

                <div>
                  <label htmlFor="review" className="block text-sm font-semibold text-gray-700 mb-1">Your Review *</label>
                  <textarea 
                    id="review"
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none text-gray-900"
                    placeholder="Tell us about your experience with our catfish..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2.5 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={submitting}
                    className="bg-green-700 hover:bg-green-800 text-white px-8 py-2.5 rounded-lg font-bold transition-colors shadow-sm disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>

              </form>
            </motion.div>
          )}
        </div>

      </div>
    </section>
  );
}

