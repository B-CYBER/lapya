import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, Lock, Check } from 'lucide-react';
import Container from '../layout/Container';

interface PaymentCheckoutProps {
  plan: {
    name: string;
    price: string;
    period: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export const PaymentCheckout = ({ plan, onClose, onSuccess }: PaymentCheckoutProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank' | 'ussd'>('card');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end"
      style={{ backgroundColor: 'rgba(30, 42, 94, 0.6)' }}
    >
      <div
        className="w-full rounded-t-3xl pb-8"
        style={{
          backgroundColor: '#FBFAF7',
          maxHeight: '90vh',
          animation: 'slideUp 0.3s ease-out'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-5 border-b" style={{ borderColor: '#E7E4DD' }}>
          <h2 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1.25rem',
            fontWeight: 700,
            color: '#1E2A5E'
          }}>
            Complete Payment
          </h2>
          <button onClick={onClose} className="p-2" style={{ color: '#5E6680' }}>
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="pt-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <Container maxWidth="form">
          {/* Plan Summary */}
          <div
            className="p-5 rounded-2xl mb-6"
            style={{
              background: 'linear-gradient(135deg, #1E2A5E 0%, #3D6BE5 100%)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.8125rem',
                color: '#A8BCF0',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                SUBSCRIBING TO
              </p>
            </div>
            <h3 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#F4D27A',
              marginBottom: '0.5rem'
            }}>
              {plan.name} Plan
            </h3>
            <div className="flex items-baseline gap-2">
              <span style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '2rem',
                fontWeight: 700,
                color: '#FFFFFF'
              }}>
                {plan.price}
              </span>
              <span style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '1rem',
                color: '#A8BCF0'
              }}>
                {plan.period}
              </span>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="mb-6">
            <h3 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1rem',
              fontWeight: 700,
              color: '#1E2A5E',
              marginBottom: '1rem'
            }}>
              Select payment method
            </h3>

            <div className="space-y-3">
              {/* Card Payment */}
              <button
                onClick={() => setPaymentMethod('card')}
                className="w-full p-4 rounded-2xl text-left transition-all"
                style={{
                  backgroundColor: paymentMethod === 'card' ? 'rgba(61, 107, 229, 0.08)' : '#FFFFFF',
                  border: `2px solid ${paymentMethod === 'card' ? '#3D6BE5' : '#E7E4DD'}`,
                  cursor: 'pointer'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(61, 107, 229, 0.12)' }}
                    >
                      <CreditCard size={24} style={{ color: '#3D6BE5' }} />
                    </div>
                    <div>
                      <p style={{
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#1E2A5E',
                        marginBottom: '0.125rem'
                      }}>
                        Card Payment
                      </p>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        color: '#5E6680'
                      }}>
                        Debit or credit card
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'card' && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#3D6BE5' }}
                    >
                      <Check size={14} style={{ color: '#FFFFFF' }} />
                    </div>
                  )}
                </div>
              </button>

              {/* Bank Transfer */}
              <button
                onClick={() => setPaymentMethod('bank')}
                className="w-full p-4 rounded-2xl text-left transition-all"
                style={{
                  backgroundColor: paymentMethod === 'bank' ? 'rgba(61, 107, 229, 0.08)' : '#FFFFFF',
                  border: `2px solid ${paymentMethod === 'bank' ? '#3D6BE5' : '#E7E4DD'}`,
                  cursor: 'pointer'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(61, 107, 229, 0.12)' }}
                    >
                      <Building2 size={24} style={{ color: '#3D6BE5' }} />
                    </div>
                    <div>
                      <p style={{
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#1E2A5E',
                        marginBottom: '0.125rem'
                      }}>
                        Bank Transfer
                      </p>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        color: '#5E6680'
                      }}>
                        Transfer from your bank
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'bank' && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#3D6BE5' }}
                    >
                      <Check size={14} style={{ color: '#FFFFFF' }} />
                    </div>
                  )}
                </div>
              </button>

              {/* USSD */}
              <button
                onClick={() => setPaymentMethod('ussd')}
                className="w-full p-4 rounded-2xl text-left transition-all"
                style={{
                  backgroundColor: paymentMethod === 'ussd' ? 'rgba(61, 107, 229, 0.08)' : '#FFFFFF',
                  border: `2px solid ${paymentMethod === 'ussd' ? '#3D6BE5' : '#E7E4DD'}`,
                  cursor: 'pointer'
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: 'rgba(61, 107, 229, 0.12)' }}
                    >
                      <Smartphone size={24} style={{ color: '#3D6BE5' }} />
                    </div>
                    <div>
                      <p style={{
                        fontFamily: 'Sora, sans-serif',
                        fontSize: '0.9375rem',
                        fontWeight: 600,
                        color: '#1E2A5E',
                        marginBottom: '0.125rem'
                      }}>
                        USSD
                      </p>
                      <p style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '0.75rem',
                        color: '#5E6680'
                      }}>
                        Pay with USSD code
                      </p>
                    </div>
                  </div>
                  {paymentMethod === 'ussd' && (
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: '#3D6BE5' }}
                    >
                      <Check size={14} style={{ color: '#FFFFFF' }} />
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div
            className="p-4 rounded-xl mb-6"
            style={{
              backgroundColor: 'rgba(110, 154, 110, 0.12)',
              border: '1px solid rgba(110, 154, 110, 0.3)'
            }}
          >
            <div className="flex items-start gap-3">
              <Lock size={20} style={{ color: '#6E9A6E', marginTop: '0.125rem' }} />
              <div>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  color: '#1E2A5E',
                  lineHeight: 1.6
                }}>
                  <strong>Secure payment powered by Paystack.</strong> Your payment information is encrypted and never stored on our servers.
                </p>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                color: '#5E6680'
              }}>
                Subtotal
              </p>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                {plan.price}
              </p>
            </div>
            <div className="flex items-center justify-between mb-3 pb-3 border-b" style={{ borderColor: '#E7E4DD' }}>
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                color: '#5E6680'
              }}>
                VAT (7.5%)
              </p>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: '#1E2A5E'
              }}>
                ₦{Math.round(parseInt(plan.price.replace(/[₦,]/g, '')) * 0.075).toLocaleString()}
              </p>
            </div>
            <div className="flex items-center justify-between">
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#1E2A5E'
              }}>
                Total
              </p>
              <p style={{
                fontFamily: 'Sora, sans-serif',
                fontSize: '1.125rem',
                fontWeight: 700,
                color: '#3D6BE5'
              }}>
                ₦{Math.round(parseInt(plan.price.replace(/[₦,]/g, '')) * 1.075).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-xl mb-4 transition-all"
            style={{
              backgroundColor: isProcessing ? '#E7E4DD' : '#3D6BE5',
              color: '#FFFFFF',
              fontFamily: 'Inter, sans-serif',
              fontSize: '1rem',
              fontWeight: 500,
              border: 'none',
              cursor: isProcessing ? 'not-allowed' : 'pointer',
              boxShadow: isProcessing ? 'none' : '0 4px 16px rgba(61, 107, 229, 0.2)'
            }}
          >
            {isProcessing ? 'Processing...' : `Pay ₦${Math.round(parseInt(plan.price.replace(/[₦,]/g, '')) * 1.075).toLocaleString()}`}
          </button>

          {/* Terms */}
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.75rem',
            color: '#5E6680',
            textAlign: 'center',
            lineHeight: 1.6,
            marginBottom: '1rem'
          }}>
            By completing this purchase, you agree to our{' '}
            <span style={{ color: '#3D6BE5', fontWeight: 500 }}>Terms of Service</span>
            {' '}and{' '}
            <span style={{ color: '#3D6BE5', fontWeight: 500 }}>Privacy Policy</span>.
            Your subscription will auto-renew.
          </p>
        </Container>
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};
