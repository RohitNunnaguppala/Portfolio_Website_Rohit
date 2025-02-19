import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import emailjs from '@emailjs/browser';
import { Snackbar, Alert } from '@mui/material';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  align-items: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  padding: 32px;
  background-color: ${({ theme }) => theme.card};
  border-radius: 16px;
  box-shadow: rgba(23, 92, 230, 0.15) 0px 4px 24px;
  gap: 12px;
`;

const Title = styled.h2`
  font-size: 32px;
  text-align: center;
  font-weight: 600;
  color: ${({ theme }) => theme.text_primary};
`;

const ContactForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ContactInput = styled.input`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;

const ContactInputMessage = styled.textarea`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.text_secondary};
  outline: none;
  font-size: 18px;
  color: ${({ theme }) => theme.text_primary};
  border-radius: 12px;
  padding: 12px 16px;
  &:focus {
    border: 1px solid ${({ theme }) => theme.primary};
  }
`;

const ContactButton = styled.button`
  width: 100%;
  background: linear-gradient(225deg, hsla(271, 100%, 50%, 1) 0%, hsla(294, 100%, 50%, 1) 100%);
  padding: 13px 16px;
  border-radius: 12px;
  border: none;
  color: ${({ theme }) => theme.text_primary};
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
`;

const ErrorText = styled.span`
  color: red;
  font-size: 14px;
`;

const Contact = () => {
  const form = useRef();
  const [formData, setFormData] = useState({
    from_email: '',
    from_name: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const validateForm = () => {
    let newErrors = {};

    if (!formData.from_email || !/\S+@\S+\.\S+/.test(formData.from_email)) {
      newErrors.from_email = 'Valid email is required';
    }
    if (!formData.from_name.trim()) {
      newErrors.from_name = 'Name is required';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message cannot be empty';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSnackbarMessage('Please fill all fields correctly');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return;
    }

    emailjs.sendForm('service_grge0ev', 'template_gm9kvqn', form.current, 'yjmdSxKkcJL1s69fM')
      .then(() => {
        setSnackbarMessage('Email sent successfully!');
        setSnackbarSeverity('success');
        setSnackbarOpen(true);
        form.current.reset();
        setFormData({ from_email: '', from_name: '', subject: '', message: '' });
      })
      .catch(() => {
        setSnackbarMessage('Failed to send email. Try again later.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      });
  };

  return (
    <Container>
      <Wrapper>
        <Title>Contact Me</Title>
        <ContactForm ref={form} onSubmit={handleSubmit}>
          <ContactInput 
            type="email"
            placeholder="Your Email" 
            name="from_email" 
            value={formData.from_email}
            onChange={(e) => setFormData({ ...formData, from_email: e.target.value })}
          />
          {errors.from_email && <ErrorText>{errors.from_email}</ErrorText>}

          <ContactInput 
            type="text"
            placeholder="Your Name" 
            name="from_name" 
            value={formData.from_name}
            onChange={(e) => setFormData({ ...formData, from_name: e.target.value })}
          />
          {errors.from_name && <ErrorText>{errors.from_name}</ErrorText>}

          <ContactInput 
            type="text"
            placeholder="Subject" 
            name="subject" 
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
          />
          {errors.subject && <ErrorText>{errors.subject}</ErrorText>}

          <ContactInputMessage 
            placeholder="Message" 
            rows="4" 
            name="message" 
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
          {errors.message && <ErrorText>{errors.message}</ErrorText>}

          <ContactButton type="submit">Send</ContactButton>
        </ContactForm>

        <Snackbar 
          open={snackbarOpen} 
          autoHideDuration={4000} 
          onClose={() => setSnackbarOpen(false)}
        >
          <Alert severity={snackbarSeverity} onClose={() => setSnackbarOpen(false)}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Wrapper>
    </Container>
  );
};

export default Contact;
