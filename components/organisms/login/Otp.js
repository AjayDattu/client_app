"use client";

import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Typography, Divider, Space, message } from "antd";
import { MobileOutlined, LockOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "@/lib/firebase";
import useAuthStore from "@/store/authStore";

const { Title, Text, Link } = Typography;

export default function OtpLogin() {
  const [form] = Form.useForm();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: phone input, 2: OTP input
  const { setUser } = useAuthStore();

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });
    }
  }, []);

  const sendOtp = async () => {
    try {
      await form.validateFields(['phone']);
      const phoneValue = form.getFieldValue('phone');
      
      if (!phoneValue || phoneValue.length < 10) {
        message.error("Please enter a valid phone number");
        return;
      }
      
      setIsLoading(true);
      try {
        const appVerifier = window.recaptchaVerifier;
        const formattedPhone = phoneValue.startsWith('+') ? phoneValue : `+${phoneValue}`;
        const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
        setConfirmationResult(result);
        setPhone(phoneValue);
        message.success("OTP sent to your phone");
        setStep(2);
      } catch (err) {
        message.error("Error sending OTP. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } catch (errorInfo) {
      console.log('Validation failed:', errorInfo);
    }
  };

  const verifyOtp = async () => {
    try {
      await form.validateFields(['otp']);
      const otpValue = form.getFieldValue('otp');
      
      if (!otpValue || otpValue.length < 6) {
        message.error("Please enter a valid OTP");
        return;
      }
      
      setIsLoading(true);
      try {
        const userCredential = await confirmationResult.confirm(otpValue);
        setUser({ uid: userCredential.user.uid, phoneNumber: userCredential.user.phoneNumber });
        message.success("Login successful!");
        // Redirect or handle successful login here
      } catch (err) {
        message.error("Invalid OTP. Please try again.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } catch (errorInfo) {
      console.log('Validation failed:', errorInfo);
    }
  };

  return (
    <div style={{ 
      height: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%)",
      padding: "16px"
    }}>
      <div id="recaptcha-container"></div>
      
      <Card 
        style={{ width: "100%", maxWidth: "420px" }}
        bodyStyle={{ padding: 0 }}
      >
        <div style={{ 
          background: "#1890ff", 
          padding: "24px", 
          color: "white"
        }}>
          <Title level={3} style={{ color: "white", margin: 0 }}>Secure Login</Title>
          <Text style={{ color: "rgba(255, 255, 255, 0.85)" }}>Verify your identity with OTP</Text>
        </div>
        
        <div style={{ padding: "24px" }}>
          <Form
            form={form}
            layout="vertical"
            name="login_form"
          >
            {step === 1 ? (
              <>
                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[
                    { required: true, message: 'Please enter your phone number' },
                    { min: 10, message: 'Phone number must be at least 10 digits' }
                  ]}
                >
                  <Input 
                    size="large"
                    prefix={<MobileOutlined />} 
                    placeholder="Enter your phone number"
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Form.Item>

                <Form.Item>
                  <Button 
                    type="primary" 
                    size="large"
                    block
                    loading={isLoading}
                    onClick={sendOtp}
                  >
                    Send OTP
                  </Button>
                </Form.Item>
              </>
            ) : (
              <>
                <Form.Item
                  name="otp"
                  label={
                    <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                      <span>Verification Code</span>
                      <Button 
                        type="link" 
                        style={{ padding: 0 }}
                        onClick={() => setStep(1)}
                        icon={<ArrowLeftOutlined />}
                      >
                        Change number
                      </Button>
                    </div>
                  }
                  rules={[
                    { required: true, message: 'Please enter verification code' },
                    { len: 6, message: 'OTP must be 6 digits' }
                  ]}
                >
                  <Input 
                    size="large"
                    prefix={<LockOutlined />} 
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </Form.Item>
                
                <Text type="secondary" style={{ display: "block", marginBottom: "16px" }}>
                  We&apos;ve sent a code to {phone}
                </Text>

                <Form.Item>
                  <Button 
                    type="primary" 
                    size="large"
                    block
                    loading={isLoading}
                    onClick={verifyOtp}
                  >
                    Verify & Login
                  </Button>
                </Form.Item>
              </>
            )}
          </Form>

          <Divider plain>
            <Text type="secondary">Terms & Conditions</Text>
          </Divider>
          
          <Text type="secondary" style={{ display: "block", textAlign: "center" }}>
            By continuing, you agree to our <Link>Terms</Link> and <Link>Privacy Policy</Link>.
          </Text>
        </div>
      </Card>
    </div>
  );
}