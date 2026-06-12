import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Bot, User as UserIcon, Sparkles } from 'lucide-react';
import Container from '../layout/Container';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
}

interface NutritionChatbotProps {
  onClose: () => void;
  messages?: Message[];
  onSend?: (text: string) => void | Promise<void>;
  isStreaming?: boolean;
}

export const NutritionChatbot = ({
  onClose,
  messages: externalMessages,
  onSend: externalOnSend,
  isStreaming: externalIsStreaming,
}: NutritionChatbotProps) => {
  const isExternal = externalMessages !== undefined && externalOnSend !== undefined;

  const [internalMessages, setInternalMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hi! I'm your AI nutrition assistant. Ask me anything about Nigerian foods, nutrition facts, or whether a meal is safe for your conditions. 🍲",
      timestamp: new Date()
    }
  ]);
  const messages: Message[] = isExternal ? (externalMessages as Message[]) : internalMessages;
  const setMessages = isExternal ? () => undefined : setInternalMessages;
  const [inputText, setInputText] = useState('');
  const [internalIsTyping, setIsTyping] = useState(false);
  const isTyping = isExternal ? !!externalIsStreaming : internalIsTyping;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Food safety queries
    if (lowerMessage.includes('jollof') || lowerMessage.includes('rice')) {
      return "🍚 **Jollof Rice** can be enjoyed in moderation! For diabetes and hypertension:\n\n✅ Use brown rice instead of white rice (lower glycemic index)\n✅ Reduce oil and salt\n✅ Add more vegetables\n✅ Limit portion to 1 derica (about 200g)\n\nNutrition per serving:\n• Calories: ~320 kcal\n• Carbs: 45g\n• Protein: 8g\n• Safe for both conditions when prepared this way!";
    }
    
    if (lowerMessage.includes('eba') || lowerMessage.includes('garri')) {
      return "🥘 **Eba (Garri)** needs careful portioning:\n\n⚠️ High glycemic index - can spike blood sugar\n✅ Limit to hand-fistful size (about 100g)\n✅ Pair with vegetable soups like efo riro or edikang ikong\n✅ Eat earlier in the day, not for dinner\n\nNutrition per small serving:\n• Calories: ~180 kcal\n• Carbs: 42g\n• Best eaten with protein-rich soups!";
    }
    
    if (lowerMessage.includes('plantain')) {
      return "🍌 **Plantain** has benefits but needs moderation:\n\n✅ High in potassium (good for blood pressure)\n⚠️ Medium-high glycemic load\n✅ Choose boiled or roasted over fried\n✅ Limit to 1 small plantain per meal\n\nNutrition per medium plantain:\n• Calories: ~220 kcal\n• Carbs: 57g\n• Potassium: 893mg\n\nNote: Watch portions if you have kidney concerns!";
    }
    
    if (lowerMessage.includes('beans') || lowerMessage.includes('moin moin') || lowerMessage.includes('akara')) {
      return "🫘 **Beans dishes** are excellent choices!\n\n✅ Low glycemic index\n✅ High in protein and fiber\n✅ Helps control blood sugar\n✅ Heart-healthy\n\n**Moin Moin**: Steam instead of frying, limit palm oil\n**Akara**: Bake or air-fry when possible\n\nNutrition per serving (Moin Moin):\n• Calories: ~180 kcal\n• Carbs: 20g\n• Protein: 12g\n• Safe for diabetes & hypertension! ✨";
    }
    
    if (lowerMessage.includes('soup') || lowerMessage.includes('efo') || lowerMessage.includes('ogbono') || lowerMessage.includes('egusi')) {
      return "🍲 **Nigerian Soups** - Great base for healthy meals!\n\n✅ **Efo Riro, Edikang Ikong**: Excellent! Lots of vegetables\n⚠️ **Ogbono, Egusi**: Good, but watch the palm oil amount\n\n**Tips for all soups:**\n✅ Use fish/lean meat instead of beef\n✅ Reduce palm oil by half\n✅ No maggi cubes (high sodium)\n✅ Add extra vegetables\n\nPair with small swallow portions for best results!";
    }
    
    if (lowerMessage.includes('pap') || lowerMessage.includes('ogi') || lowerMessage.includes('akamu')) {
      return "🥛 **Pap/Ogi/Akamu** - Good breakfast choice!\n\n✅ Low in fat\n✅ Easy to digest\n⚠️ Has moderate carbs - watch portion\n\n**Best practices:**\n✅ 1 cup maximum\n✅ Don't add sugar - use a little milk if needed\n✅ Pair with protein (moin moin, eggs, akara)\n\nNutrition per cup:\n• Calories: ~120 kcal\n• Carbs: 28g\n• Safe for both conditions!";
    }
    
    if (lowerMessage.includes('yam') || lowerMessage.includes('pounded yam')) {
      return "🍠 **Yam & Pounded Yam**:\n\n⚠️ High glycemic index\n⚠️ Can raise blood sugar quickly\n\n**If you must eat yam:**\n✅ Boiled yam is better than pounded\n✅ Very small portions (2-3 small slices)\n✅ Pair with vegetable soup\n✅ Eat early in the day\n\nConsider alternatives: Sweet potato or cocoyam (lower GI)";
    }
    
    if (lowerMessage.includes('pepper soup') || lowerMessage.includes('catfish')) {
      return "🌶️ **Pepper Soup** - Excellent choice!\n\n✅ Low in carbs\n✅ High in protein\n✅ Spices have health benefits\n✅ Use fish or chicken, avoid goat meat\n\n**Tips:**\n✅ Go easy on the salt\n✅ Use lots of fresh herbs\n✅ Add vegetables if desired\n\nPerfect for diabetes & hypertension! 🔥";
    }
    
    // Nutrition facts queries
    if (lowerMessage.includes('sodium') || lowerMessage.includes('salt')) {
      return "🧂 **Sodium/Salt Guidelines:**\n\nFor hypertension, keep sodium under **1,500-2,000mg per day**\n\n**High sodium foods to limit:**\n❌ Maggi/seasoning cubes (1 cube = ~1,000mg!)\n❌ Canned foods\n❌ Processed meats\n\n**Flavor alternatives:**\n✅ Fresh herbs (scent leaf, uziza)\n✅ Onions, garlic, ginger\n✅ Fresh peppers\n✅ Lemon/lime juice";
    }
    
    if (lowerMessage.includes('sugar') || lowerMessage.includes('diabetes')) {
      return "🩸 **Managing Blood Sugar:**\n\n**Foods that help:**\n✅ Non-starchy vegetables\n✅ Lean proteins (fish, chicken)\n✅ Whole grains (brown rice, oats)\n✅ Beans and legumes\n\n**Foods to limit:**\n❌ White rice, white bread\n❌ Sugary drinks\n❌ Sweets and pastries\n❌ Fried foods\n\n**Pro tips:**\n• Eat protein + fiber with every meal\n• Watch portion sizes\n• Space meals 4-5 hours apart";
    }
    
    if (lowerMessage.includes('oil') || lowerMessage.includes('palm oil')) {
      return "🛢️ **Cooking Oils:**\n\n**Best choices:**\n✅ Olive oil (cold salads)\n✅ Canola oil (cooking)\n✅ Groundnut oil (moderate heat)\n\n**Palm oil:**\n⚠️ Use sparingly - high in saturated fat\n✅ Better than trans fats in margarine\n✅ Use 1-2 tbsp maximum per pot of soup\n\n**General rule:** Less oil is better for both conditions!";
    }
    
    if (lowerMessage.includes('fruit')) {
      return "🍎 **Fruits for Diabetes & Hypertension:**\n\n**Best choices (lower sugar):**\n✅ Watermelon (small portions)\n✅ Oranges\n✅ Papaya (pawpaw)\n✅ Garden eggs\n✅ Guava\n\n**Eat in moderation:**\n⚠️ Banana (medium size max)\n⚠️ Mango (half at a time)\n⚠️ Pineapple (small portions)\n\n**Tip:** Pair fruit with nuts to reduce sugar spike!";
    }
    
    // General queries
    if (lowerMessage.includes('portion') || lowerMessage.includes('how much')) {
      return "📏 **Portion Control Tips:**\n\n**Easy measuring:**\n• Swallow: Hand-fistful (about 100g)\n• Rice: 1 derica or 1 cup cooked\n• Protein: Palm-size piece\n• Vegetables: Fill half your plate!\n\n**General meal structure:**\n🥗 50% vegetables\n🍗 25% protein\n🍚 25% carbs\n\nThis balance helps control both blood sugar and blood pressure!";
    }
    
    if (lowerMessage.includes('breakfast')) {
      return "🌅 **Healthy Nigerian Breakfasts:**\n\n✅ Moin moin + pap\n✅ Boiled yam + eggs (small portion yam)\n✅ Oats + milk (unsweetened)\n✅ Akara + pap (4-5 akara max)\n✅ Boiled plantain + beans\n✅ Bread (2 slices wheat) + eggs + avocado\n\n**Breakfast tips:**\n• Include protein\n• Don't skip it!\n• Avoid sugary cereals and drinks";
    }
    
    if (lowerMessage.includes('snack')) {
      return "🥜 **Healthy Nigerian Snacks:**\n\n✅ Garden eggs + groundnuts\n✅ Coconut pieces (small handful)\n✅ Roasted cashews (10-12 nuts)\n✅ Cucumber slices\n✅ Oranges\n✅ Boiled groundnuts (half cup)\n✅ Tiger nuts (handful)\n\n❌ Avoid:\n• Chin chin\n• Puff puff\n• Meat pie\n• Biscuits";
    }
    
    // Default response
    return "I'd be happy to help! You can ask me about:\n\n🍲 Specific Nigerian foods (jollof rice, eba, beans, soups, etc.)\n📊 Nutrition facts (calories, carbs, protein)\n✅ Whether a food is safe for diabetes & hypertension\n🥗 Portion sizes and meal planning\n🧂 Sodium and sugar content\n\nWhat would you like to know?";
  };

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text) return;

    if (isExternal) {
      setInputText('');
      await externalOnSend!(text);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: getBotResponse(userMessage.text),
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-5 border-b"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E7E4DD' }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#A8BCF0' }}
          >
            <Bot size={22} style={{ color: '#1E2A5E' }} />
          </div>
          <div>
            <h1 style={{
              fontFamily: 'Sora, sans-serif',
              fontSize: '1.125rem',
              fontWeight: 700,
              color: '#1E2A5E'
            }}>
              AI Nutrition Assistant
            </h1>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#6E9A6E' }} />
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.75rem',
                color: '#5E6680'
              }}>
                Online
              </p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2" style={{ color: '#5E6680' }}>
          <X size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-6">
        <Container maxWidth="dashboard">
          <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {message.sender === 'bot' && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#A8BCF0' }}
              >
                <Bot size={16} style={{ color: '#1E2A5E' }} />
              </div>
            )}

            <div
              className="max-w-[75%] px-4 py-3 rounded-2xl"
              style={{
                backgroundColor: message.sender === 'user' ? '#3D6BE5' : '#FFFFFF',
                color: message.sender === 'user' ? '#FFFFFF' : '#1E2A5E',
                borderBottomRightRadius: message.sender === 'user' ? '4px' : '16px',
                borderBottomLeftRadius: message.sender === 'bot' ? '4px' : '16px',
                border: message.sender === 'bot' ? '1px solid #E7E4DD' : 'none',
                whiteSpace: 'pre-line'
              }}
            >
              <p style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.9375rem',
                lineHeight: 1.5
              }}>
                {message.text}
              </p>
            </div>

            {message.sender === 'user' && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#E8A92E' }}
              >
                <UserIcon size={16} style={{ color: '#1E2A5E' }} />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: '#A8BCF0' }}
            >
              <Bot size={16} style={{ color: '#1E2A5E' }} />
            </div>
            <div
              className="px-4 py-3 rounded-2xl"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7E4DD',
                borderBottomLeftRadius: '4px'
              }}
            >
              <div className="flex gap-1">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: '#3D6BE5', animationDelay: '0ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: '#3D6BE5', animationDelay: '150ms' }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ backgroundColor: '#3D6BE5', animationDelay: '300ms' }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
        </Container>
      </div>

      {/* Suggested Questions (only show if no messages yet) */}
      {messages.length === 1 && (
        <Container maxWidth="dashboard">
          <div className="pb-4">
          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.8125rem',
            color: '#5E6680',
            marginBottom: '0.75rem'
          }}>
            Try asking:
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              'Is jollof rice safe for me?',
              'How much eba can I eat?',
              'Best Nigerian breakfast ideas',
              'Tell me about plantain'
            ].map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => setInputText(suggestion)}
                className="px-3 py-2 rounded-full text-left"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E7E4DD',
                  color: '#3D6BE5',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  cursor: 'pointer'
                }}
              >
                {suggestion}
              </button>
            ))}
          </div>
          </div>
        </Container>
      )}

      {/* Input Area */}
      <div
        className="py-4 border-t"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E7E4DD' }}
      >
        <Container maxWidth="dashboard">
          <div className="flex gap-3 items-end">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about any Nigerian food..."
            rows={1}
            className="flex-1 px-4 py-3 rounded-xl resize-none"
            style={{
              backgroundColor: '#FBFAF7',
              border: '1.5px solid #E7E4DD',
              color: '#1E2A5E',
              fontFamily: 'Inter, sans-serif',
              fontSize: '0.9375rem',
              outline: 'none',
              maxHeight: '120px'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#3D6BE5';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = '#E7E4DD';
            }}
          />
          <button
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-3 rounded-xl transition-all"
            style={{
              backgroundColor: inputText.trim() ? '#3D6BE5' : '#E7E4DD',
              color: '#FFFFFF',
              border: 'none',
              cursor: inputText.trim() ? 'pointer' : 'not-allowed'
            }}
          >
            <Send size={20} />
          </button>
        </div>
        </Container>
      </div>
    </div>
  );
};
