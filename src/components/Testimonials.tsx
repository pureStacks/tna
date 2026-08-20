import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';
import { useCMS } from '../context/CMSContext';

export default function Testimonials() {
  const { data, refreshData } = useCMS();
  const initialTestimonials = data?.testimonials || [];
  
  const [reviews, setReviews] = useState(initialTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [text, setText] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !location || !text) return;

    const newReview = {
      name,
      location,
      text,
      rating,
    };

    try {
      await fetch('/api/public/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      
      setIsSubmitted(true);
      
      // Reset form after a delay if they want to submit another
      setTimeout(() => {
        setShowForm(false);
        setIsSubmitted(false);
        setName('');
        setLocation('');
        setText('');
        setRating(5);
      }, 4000);
    } catch (err) {
      console.error(err);
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
                    <span className="text-sm text-gray-500">{testimonial.location}, Nigeria</span>
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
                className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full font-bold transition-colors"
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
              <p className="text-gray-600">Your feedback helps us continue providing quality service.</p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h4 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Leave Your Feedback</h4>
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* Rating Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Your Rating</label>
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
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
                    <input 
                      type="text" 
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. David"
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">Location (City)</label>
                    <input 
                      type="text" 
                      id="location"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="e.g. Lagos"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="review" className="block text-sm font-semibold text-gray-700 mb-1">Your Review</label>
                  <textarea 
                    id="review"
                    required
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Tell us about your experience with our catfish..."
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-3 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-bold transition-colors shadow-sm"
                  >
                    Submit Review
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
