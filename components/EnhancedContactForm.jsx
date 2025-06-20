'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, User, Mail, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/lib/ThemeContext';

export const EnhancedContactForm = () => {
  const { theme, colors } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Name is required';
        } else if (value.trim().length < 2) {
          newErrors.name = 'Name must be at least 2 characters';
        } else {
          delete newErrors.name;
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email';
        } else {
          delete newErrors.email;
        }
        break;

      case 'subject':
        if (!value.trim()) {
          newErrors.subject = 'Subject is required';
        } else if (value.trim().length < 3) {
          newErrors.subject = 'Subject must be at least 3 characters';
        } else {
          delete newErrors.subject;
        }
        break;

      case 'message':
        if (!value.trim()) {
          newErrors.message = 'Message is required';
        } else if (value.trim().length < 10) {
          newErrors.message = 'Message must be at least 10 characters';
        } else {
          delete newErrors.message;
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = Object.keys(formData).every(field => 
      validateField(field, formData[field])
    );

    if (!isValid) return;

    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  const formFields = [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      icon: User,
      placeholder: 'Enter your full name'
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      icon: Mail,
      placeholder: 'Enter your email address'
    },
    {
      name: 'subject',
      label: 'Subject',
      type: 'text',
      icon: MessageCircle,
      placeholder: 'What would you like to discuss?'
    }
  ];

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle 
            size={64} 
            className="mx-auto mb-4"
            style={{ color: colors.accent }}
          />
        </motion.div>
        <h3 
          className="text-2xl font-bold mb-2"
          style={{ color: colors.primary }}
        >
          Message Sent Successfully!
        </h3>
        <p style={{ color: colors.text }}>
          Thank you for reaching out. I'll get back to you as soon as possible.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card 
        className="glass-card max-w-2xl mx-auto"
        style={{ 
          backgroundColor: theme === 'dark' ? `${colors.primary}10` : 'rgba(255,255,255,0.9)',
          border: `1px solid ${colors.primary}30`
        }}
      >
        <CardContent className="p-8">
          <motion.h3 
            className="text-3xl font-bold text-center mb-2"
            style={{ color: colors.primary }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Let's Work Together
          </motion.h3>
          <motion.p 
            className="text-center mb-8"
            style={{ color: theme === 'dark' ? '#a0aec0' : colors.muted }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Have a project in mind? Let's discuss how we can bring your ideas to life.
          </motion.p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {formFields.map((field, index) => {
              const Icon = field.icon;
              return (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * (index + 1) }}
                  className="relative"
                >
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: colors.primary }}
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <Icon 
                      size={20} 
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
                      style={{ 
                        color: focusedField === field.name ? colors.accent : colors.muted 
                      }}
                    />
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={field.placeholder}
                      className="w-full pl-12 pr-4 py-3 rounded-lg border-2 transition-all duration-300 bg-transparent"
                      style={{
                        borderColor: errors[field.name] 
                          ? '#ef4444' 
                          : focusedField === field.name 
                            ? colors.accent 
                            : theme === 'dark' ? '#374151' : '#e5e7eb',
                        color: colors.text,
                        backgroundColor: theme === 'dark' ? `${colors.primary}10` : 'rgba(255,255,255,0.5)'
                      }}
                    />
                  </div>
                  <AnimatePresence>
                    {errors[field.name] && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center mt-2 text-sm text-red-500"
                      >
                        <AlertCircle size={16} className="mr-2" />
                        {errors[field.name]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Message textarea */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="relative"
            >
              <label 
                className="block text-sm font-semibold mb-2"
                style={{ color: colors.primary }}
              >
                Message
              </label>
              <div className="relative">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  onFocus={() => setFocusedField('message')}
                  onBlur={() => setFocusedField(null)}
                  placeholder="Tell me about your project, ideas, or just say hello!"
                  rows={5}
                  className="w-full p-4 rounded-lg border-2 transition-all duration-300 bg-transparent resize-none"
                  style={{
                    borderColor: errors.message 
                      ? '#ef4444' 
                      : focusedField === 'message' 
                        ? colors.accent 
                        : theme === 'dark' ? '#374151' : '#e5e7eb',
                    color: colors.text,
                    backgroundColor: theme === 'dark' ? `${colors.primary}10` : 'rgba(255,255,255,0.5)'
                  }}
                />
              </div>
              <AnimatePresence>
                {errors.message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center mt-2 text-sm text-red-500"
                  >
                    <AlertCircle size={16} className="mr-2" />
                    {errors.message}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting || Object.keys(errors).length > 0}
                className="btn-enhanced px-8 py-3 text-white font-semibold rounded-lg transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
                  opacity: isSubmitting || Object.keys(errors).length > 0 ? 0.7 : 1
                }}
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <motion.div
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="send"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center"
                    >
                      <Send size={20} className="mr-2" />
                      Send Message
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 