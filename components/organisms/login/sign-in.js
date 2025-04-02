import { useState } from "react";
import { Button, Card, Typography, Divider, Spin, Layout, Space } from "antd";
import { MobileOutlined } from "@ant-design/icons";
import Image from 'next/image';
import BannerSrc from "@/components/assets/Login-rafiki.svg";
import GoogleLogin from "@/components/organisms/login/Google";
import OtpLogin from "@/components/organisms/login/Otp";

const { Title, Text } = Typography;
const { Content, Footer } = Layout;

export default function Sign() {
  const [activeComponent, setActiveComponent] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleClick = () => {
    setIsLoading(true);
    // Simulate loading for demo purposes
    setTimeout(() => {
      setIsLoading(false);
      setActiveComponent("google");
    }, 1000);
  };

  const handlePhoneClick = () => {
    setIsLoading(true);
    // Simulate loading for demo purposes
    setTimeout(() => {
      setIsLoading(false);
      setActiveComponent("otp");
    }, 1000);
  };

  // If OTP is selected, render only OtpLogin component
  if (activeComponent === "otp") {
    return (
      <div className="h-screen">
        <OtpLogin />
      </div>
    );
  }

  // If Google is selected, render Google login in a more minimal container

  // Main login selection screen
  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #EBF4FF 0%, #F9FAFB 100%)' }}>
      <Content style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        padding: '16px' 
      }}>
        <Card 
          style={{ 
            width: '100%', 
            maxWidth: '400px', 
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}
          bodyStyle={{ padding: 0 }}
          bordered={false}
        >
          {/* Header */}
          <div style={{ 
            background: '#8A2BE2', // Purple color
            padding: '24px 16px',
            textAlign: 'center'
          }}>
            <Title level={3} style={{ color: 'white', margin: 0 }}>Welcome Back</Title>
            <Text style={{ color: 'rgba(235, 244, 255, 0.9)' }}>Sign in to continue</Text>
          </div>
          
          {/* Banner Image */}
          <div style={{ position: 'relative', height: '220px', width: '100%' }}>
            <Image 
              src={BannerSrc} 
              alt="Sign In Animation" 
              layout="fill" 
              objectFit="contain" 
            />
          </div>
          
          {/* Content */}
          <div style={{ padding: '24px' }}>
            {isLoading ? (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                padding: '40px 0' 
              }}>
                <Spin size="large" style={{ 
                  '--ant-primary-color': '#8A2BE2' 
                }} />
              </div>
            ) : (
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '24px' 
              }}>
                <Text style={{ 
                  textAlign: 'center', 
                  color: '#4B5563', 
                  fontSize: '16px',
                  fontWeight: 500
                }}>
                  Choose how you&apos;d like to sign in
                </Text>
                
                <div style={{ width: '100%' }}>
                      <GoogleLogin />
                </div>

                {/* <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px' 
                }}>
                  <div style={{ 
                    height: '1px', 
                    flex: '1', 
                    background: '#E5E7EB' 
                  }}></div>
                  <Text style={{ 
                    color: '#9CA3AF', 
                    fontWeight: 500 
                  }}>OR</Text>
                  <div style={{ 
                    height: '1px', 
                    flex: '1', 
                    background: '#E5E7EB' 
                  }}></div>
                </div> */}

                {/* <Button 
                  type="primary"
                  block
                  onClick={handlePhoneClick}
                  style={{ 
                    height: 'auto',
                    padding: '14px 20px',
                    borderRadius: '12px',
                    background: '#8A2BE2',
                    border: 'none',
                    boxShadow: '0 4px 6px rgba(138, 43, 226, 0.25)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    gap: '10px' 
                  }}>
                    <MobileOutlined style={{ fontSize: '20px' }} />
                    <span style={{ 
                      fontWeight: 600, 
                      fontSize: '16px' 
                    }}>
                      Continue with Phone
                    </span>
                  </div>
                </Button> */}

                <div style={{ 
                  textAlign: 'center', 
                  marginTop: '8px' 
                }}>
                  <Text style={{ 
                    color: '#6B7280', 
                    fontSize: '14px' 
                  }}>
                    Don&apos;t have an account?{" "}
                    <a href="#" style={{ 
                      color: '#8A2BE2', 
                      fontWeight: 500 
                    }}>
                      Sign up
                    </a>
                  </Text>
                </div>
              </div>
            )}
          </div>
        </Card>
      </Content>
      
      <Footer style={{ 
        textAlign: 'center', 
        background: 'transparent', 
        padding: '16px' 
      }}>
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: '8px' 
        }}>
          <Text style={{ 
            color: '#6B7280', 
            fontSize: '14px' 
          }}>
            © 2025 Your Company. All rights reserved.
          </Text>
          
          <Space size={16}>
            <a href="#" style={{ 
              color: '#6B7280', 
              fontSize: '14px' 
            }}>Terms</a>
            <a href="#" style={{ 
              color: '#6B7280', 
              fontSize: '14px' 
            }}>Privacy</a>
            <a href="#" style={{ 
              color: '#6B7280', 
              fontSize: '14px' 
            }}>Help</a>
          </Space>
        </div>
      </Footer>
    </Layout>
  );
}