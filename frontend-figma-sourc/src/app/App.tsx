import { useState, useEffect } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { SplashScreen } from './components/SplashScreen';
import { WelcomeScreen } from './components/WelcomeScreen';
import { SignupScreen } from './components/auth/SignupScreen';
import { LoginScreen } from './components/LoginScreen';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { EmailVerification } from './components/auth/EmailVerification';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { HomeScreen } from './components/HomeScreen';
import { WeekView } from './components/mealplan/WeekView';
import { MealDetail } from './components/mealplan/MealDetail';
import { MealSwap } from './components/mealplan/MealSwap';
import { RecipeDetail } from './components/mealplan/RecipeDetail';
import { NutritionChatbot } from './components/nutrition/NutritionChatbot';
import { GroceryList } from './components/GroceryList';
import { InviteCaregiver } from './components/caregiver/InviteCaregiver';
import { CaregiverHome } from './components/caregiver/CaregiverHome';
import { CareCircle } from './components/caregiver/CareCircle';
import { DietitianDashboard } from './components/dietitian/DietitianDashboard';
import { PatientDetail } from './components/dietitian/PatientDetail';
import { UpgradeScreen } from './components/upgrade/UpgradeScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { EditProfile } from './components/profile/EditProfile';
import { SettingsScreen } from './components/profile/SettingsScreen';
import { PolishDemo } from './components/polish/PolishDemo';
import { Toast } from './components/polish/Toast';
import { NotificationsList } from './components/notifications/NotificationsList';
import { PaymentCheckout } from './components/payment/PaymentCheckout';
import { HealthMetrics } from './components/health/HealthMetrics';
import { LogMetric } from './components/health/LogMetric';
import { WebNavigation } from './components/navigation/WebNavigation';

type Screen = 'landing' | 'splash' | 'welcome' | 'signup' | 'login' | 'forgotPassword' | 'emailVerification' | 'onboarding' | 'home' | 'week' | 'mealDetail' | 'mealSwap' | 'recipeDetail' | 'nutritionChatbot' | 'groceryList' | 'inviteCaregiver' | 'caregiverHome' | 'careCircle' | 'dietitianDashboard' | 'patientDetail' | 'upgrade' | 'profile' | 'editProfile' | 'settings' | 'polishDemo' | 'notifications' | 'paymentCheckout' | 'healthMetrics' | 'logMetric';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [mealToSwap, setMealToSwap] = useState<any>(null);
  const [toast, setToast] = useState<{
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
  } | null>(null);
  const [paymentPlan, setPaymentPlan] = useState<any>(null);
  const [previousScreen, setPreviousScreen] = useState<Screen>('home');
  const [userEmail, setUserEmail] = useState<string>('ngozi.okafor@email.com');
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [userName, setUserName] = useState<string>('Mama');
  const [userPlan, setUserPlan] = useState<'free' | 'care'>('free');

  // Auto-advance from splash to welcome after 2 seconds
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('welcome');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleGetStarted = () => {
    setCurrentScreen('signup');
  };

  const handleOpenLogin = () => {
    setCurrentScreen('login');
  };

  const handleSignup = (data: { email: string; password: string; firstName: string; lastName: string }) => {
    setUserEmail(data.email);
    setCurrentScreen('onboarding');
  };

  const handleBackFromSignup = () => {
    setCurrentScreen('welcome');
  };

  const handleBackFromLogin = () => {
    setCurrentScreen('welcome');
  };

  const handleLogin = () => {
    setCurrentScreen('home');
  };

  const handleForgotPassword = () => {
    setCurrentScreen('forgotPassword');
  };

  const handleBackFromForgotPassword = () => {
    setCurrentScreen('login');
  };

  const handleEmailVerified = () => {
    setCurrentScreen('home');
  };

  const handleOnboardingComplete = () => {
    setCurrentScreen('emailVerification');
  };

  const handleNavigateToWeek = () => {
    setCurrentScreen('week');
  };

  const handleMealClick = (meal: any) => {
    setSelectedMeal(meal);
    setCurrentScreen('mealDetail');
  };

  const handleBackToWeek = () => {
    setCurrentScreen('week');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleOpenScanner = () => {
    setCurrentScreen('nutritionChatbot');
  };

  const handleCloseScanner = () => {
    setCurrentScreen('home');
  };

  const handleCapture = () => {
    setCurrentScreen('scanAnalyzing');
  };

  const handleAnalyzingComplete = () => {
    setCurrentScreen('scanResult');
  };

  const handleLogMeal = () => {
    // Show success toast and return to home
    setCurrentScreen('home');
  };

  const handleScanAgain = () => {
    setCurrentScreen('scanCamera');
  };

  const handleOpenGroceryList = () => {
    setCurrentScreen('groceryList');
  };

  const handleBackFromGroceryList = () => {
    setCurrentScreen('home');
  };

  const handleOpenInviteCaregiver = () => {
    setCurrentScreen('inviteCaregiver');
  };

  const handleCloseInviteCaregiver = () => {
    setCurrentScreen('home');
  };

  const handleInviteSent = () => {
    // Show success toast or confirmation
    setCurrentScreen('careCircle');
  };

  const handleOpenCaregiverHome = () => {
    setCurrentScreen('caregiverHome');
  };

  const handleOpenCareCircle = () => {
    setCurrentScreen('careCircle');
  };

  const handleBackFromCareCircle = () => {
    setCurrentScreen('home');
  };

  const handleOpenDietitianDashboard = () => {
    setCurrentScreen('dietitianDashboard');
  };

  const handlePatientClick = (patientId: string) => {
    setSelectedPatientId(patientId);
    setCurrentScreen('patientDetail');
  };

  const handleBackFromPatientDetail = () => {
    setCurrentScreen('dietitianDashboard');
  };

  const handleOpenUpgrade = () => {
    setCurrentScreen('upgrade');
  };

  const handleCloseUpgrade = () => {
    setCurrentScreen('home');
  };

  const handleSelectPlan = (planId: string) => {
    // Handle plan selection - show payment flow
    handleSelectPlanForPayment(planId);
  };

  const handleOpenProfile = () => {
    setCurrentScreen('profile');
  };

  const handleBackFromProfile = () => {
    setCurrentScreen('home');
  };

  const handleOpenEditProfile = () => {
    setCurrentScreen('editProfile');
  };

  const handleBackFromEditProfile = () => {
    setCurrentScreen('profile');
  };

  const handleSaveProfile = (data: any) => {
    setToast({
      type: 'success',
      message: 'Profile updated successfully!'
    });
    setCurrentScreen('profile');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleBackFromSettings = () => {
    setCurrentScreen('profile');
  };

  const handleOpenPolishDemo = () => {
    setCurrentScreen('polishDemo');
  };

  const handleBackFromPolishDemo = () => {
    setCurrentScreen('home');
  };

  const handleOpenNotifications = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('notifications');
  };

  const handleBackFromNotifications = () => {
    setCurrentScreen(previousScreen);
  };

  const handleSelectPlanForPayment = (planId: string) => {
    // Determine plan details
    const plans = {
      care: {
        name: 'Care',
        priceMonthly: '₦1,500',
        priceAnnual: '₦15,000'
      }
    };

    setPaymentPlan({
      name: 'Care',
      price: '₦1,500',
      period: '/month'
    });
    setCurrentScreen('paymentCheckout');
  };

  const handleClosePayment = () => {
    setCurrentScreen('upgrade');
  };

  const handlePaymentSuccess = () => {
    setToast({
      type: 'success',
      message: 'Payment successful! Welcome to Care plan.'
    });
    setCurrentScreen('home');
  };

  const handleOpenHealthMetrics = () => {
    setPreviousScreen(currentScreen);
    setCurrentScreen('healthMetrics');
  };

  const handleBackFromHealthMetrics = () => {
    setCurrentScreen(previousScreen);
  };

  const handleOpenLogMetric = () => {
    setCurrentScreen('logMetric');
  };

  const handleCloseLogMetric = () => {
    setCurrentScreen('healthMetrics');
  };

  const handleSaveMetric = (data: any) => {
    setToast({
      type: 'success',
      message: `${data.type === 'bp' ? 'Blood pressure' : data.type === 'weight' ? 'Weight' : 'Blood sugar'} reading saved!`
    });
    setCurrentScreen('healthMetrics');
  };

  const handleOpenMealSwap = (meal: any) => {
    setMealToSwap(meal);
    setCurrentScreen('mealSwap');
  };

  const handleCloseMealSwap = () => {
    setCurrentScreen('mealDetail');
  };

  const handleConfirmSwap = (newMeal: any) => {
    // Update the meal in the plan
    setSelectedMeal(newMeal);
    setToast({
      type: 'success',
      message: `Meal swapped to ${newMeal.name}!`
    });
    setCurrentScreen('mealDetail');
  };

  const handleOpenRecipe = (recipe: any) => {
    setSelectedRecipe(recipe);
    setCurrentScreen('recipeDetail');
  };

  const handleBackFromRecipe = () => {
    setCurrentScreen('mealDetail');
  };

  const authenticatedScreens = [
    'home', 'week', 'mealDetail', 'mealSwap', 'recipeDetail',
    'nutritionChatbot', 'groceryList',
    'inviteCaregiver', 'caregiverHome', 'careCircle',
    'dietitianDashboard', 'patientDetail', 'upgrade',
    'profile', 'editProfile', 'settings', 'polishDemo',
    'notifications', 'paymentCheckout', 'healthMetrics', 'logMetric'
  ];

  const showNavigation = authenticatedScreens.includes(currentScreen);

  return (
    <div className="w-full h-screen bg-white">
      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}

      {showNavigation && (
        <WebNavigation
          currentScreen={currentScreen}
          onNavigateHome={handleBackToHome}
          onNavigateToWeek={handleNavigateToWeek}
          onOpenCareCircle={handleOpenCareCircle}
          onOpenProfile={handleOpenProfile}
          onOpenScanner={handleOpenScanner}
          onOpenNotifications={handleOpenNotifications}
          onOpenHealthMetrics={handleOpenHealthMetrics}
        />
      )}

      <div className="w-full h-full relative" style={{ paddingTop: showNavigation ? '64px' : '0' }}>
        {currentScreen === 'landing' && <LandingPage onGetStarted={handleGetStarted} />}

        {currentScreen === 'splash' && <SplashScreen />}

        {currentScreen === 'welcome' && (
          <WelcomeScreen onGetStarted={handleGetStarted} onOpenLogin={handleOpenLogin} />
        )}

        {currentScreen === 'signup' && (
          <SignupScreen
            onBack={handleBackFromSignup}
            onSignup={handleSignup}
            onOpenLogin={handleOpenLogin}
          />
        )}

        {currentScreen === 'login' && (
          <LoginScreen
            onBack={handleBackFromLogin}
            onLogin={handleLogin}
            onForgotPassword={handleForgotPassword}
          />
        )}

        {currentScreen === 'forgotPassword' && (
          <ForgotPassword onBack={handleBackFromForgotPassword} />
        )}

        {currentScreen === 'emailVerification' && (
          <EmailVerification
            email={userEmail}
            onVerified={handleEmailVerified}
          />
        )}

        {currentScreen === 'onboarding' && (
          <OnboardingFlow onComplete={handleOnboardingComplete} />
        )}

        {currentScreen === 'home' && (
          <HomeScreen
            userName={userName}
            userPlan={userPlan}
            onNavigateToWeek={handleNavigateToWeek}
            onOpenScanner={handleOpenScanner}
            onOpenGroceryList={handleOpenGroceryList}
            onOpenCareCircle={handleOpenCareCircle}
            onOpenUpgrade={handleOpenUpgrade}
            onOpenProfile={handleOpenProfile}
            onOpenPolishDemo={handleOpenPolishDemo}
            onOpenNotifications={handleOpenNotifications}
            onOpenHealthMetrics={handleOpenHealthMetrics}
          />
        )}

        {currentScreen === 'week' && (
          <WeekView 
            userPlan={userPlan}
            onMealClick={handleMealClick} 
            onBack={handleBackToHome} 
          />
        )}

        {currentScreen === 'mealDetail' && selectedMeal && (
          <MealDetail
            meal={selectedMeal}
            onBack={handleBackToWeek}
            onSwap={handleOpenMealSwap}
            onViewRecipe={handleOpenRecipe}
          />
        )}

        {currentScreen === 'mealSwap' && mealToSwap && (
          <MealSwap
            mealType={mealToSwap.type?.toLowerCase() || 'lunch'}
            currentMeal={mealToSwap}
            onClose={handleCloseMealSwap}
            onSwap={handleConfirmSwap}
          />
        )}

        {currentScreen === 'recipeDetail' && selectedRecipe && (
          <RecipeDetail
            recipe={selectedRecipe}
            onBack={handleBackFromRecipe}
          />
        )}

        {currentScreen === 'nutritionChatbot' && (
          <NutritionChatbot onClose={handleCloseScanner} />
        )}

        {currentScreen === 'groceryList' && (
          <GroceryList onBack={handleBackFromGroceryList} />
        )}

        {currentScreen === 'inviteCaregiver' && (
          <InviteCaregiver onClose={handleCloseInviteCaregiver} onInviteSent={handleInviteSent} />
        )}

        {currentScreen === 'caregiverHome' && (
          <CaregiverHome
            patientName="Mama"
            onViewWeek={handleNavigateToWeek}
            onViewGroceryList={handleOpenGroceryList}
          />
        )}

        {currentScreen === 'careCircle' && (
          <CareCircle
            onBack={handleBackFromCareCircle}
            onInviteCaregiver={handleOpenInviteCaregiver}
          />
        )}

        {currentScreen === 'dietitianDashboard' && (
          <DietitianDashboard onPatientClick={handlePatientClick} />
        )}

        {currentScreen === 'patientDetail' && selectedPatientId && (
          <PatientDetail
            patientId={selectedPatientId}
            onBack={handleBackFromPatientDetail}
          />
        )}

        {currentScreen === 'upgrade' && (
          <UpgradeScreen
            onClose={handleCloseUpgrade}
            onSelectPlan={handleSelectPlan}
          />
        )}

        {currentScreen === 'profile' && (
          <ProfileScreen
            onBack={handleBackFromProfile}
            onOpenSettings={handleOpenSettings}
            onOpenCareCircle={handleOpenCareCircle}
            onOpenUpgrade={handleOpenUpgrade}
            onEditProfile={handleOpenEditProfile}
            onOpenHealthMetrics={handleOpenHealthMetrics}
          />
        )}

        {currentScreen === 'editProfile' && (
          <EditProfile
            onBack={handleBackFromEditProfile}
            onSave={handleSaveProfile}
          />
        )}

        {currentScreen === 'settings' && (
          <SettingsScreen onBack={handleBackFromSettings} />
        )}

        {currentScreen === 'polishDemo' && (
          <PolishDemo onBack={handleBackFromPolishDemo} />
        )}

        {currentScreen === 'notifications' && (
          <NotificationsList
            onBack={handleBackFromNotifications}
            onOpenSettings={handleOpenSettings}
          />
        )}

        {currentScreen === 'paymentCheckout' && paymentPlan && (
          <PaymentCheckout
            plan={paymentPlan}
            onClose={handleClosePayment}
            onSuccess={handlePaymentSuccess}
          />
        )}

        {currentScreen === 'healthMetrics' && (
          <HealthMetrics
            onBack={handleBackFromHealthMetrics}
            onAddMetric={handleOpenLogMetric}
          />
        )}

        {currentScreen === 'logMetric' && (
          <LogMetric
            onClose={handleCloseLogMetric}
            onSave={handleSaveMetric}
          />
        )}
      </div>
    </div>
  );
}