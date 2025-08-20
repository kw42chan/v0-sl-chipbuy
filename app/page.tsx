"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Script from "next/script"
import {
  ArrowLeft,
  ShoppingCart,
  User,
  ArrowRight,
  CreditCard,
  Bitcoin,
  QrCode,
  CheckCircle,
  Home,
  InfoIcon,
  Lock,
  Monitor,
  Loader2,
  UserPlus,
  DollarSign,
} from "lucide-react"

export default function ChipsCryptoApp() {
  const [currentScreen, setCurrentScreen] = useState("login")
  const [currentWorkflow, setCurrentWorkflow] = useState("")
  const [selectedCrypto, setSelectedCrypto] = useState("")
  const [screenHistory, setScreenHistory] = useState<string[]>([])
  const [email, setEmail] = useState("")
  const [chipAmount, setChipAmount] = useState("")
  const [redeemAmount, setRedeemAmount] = useState("")
  const [qrCodeLoaded, setQrCodeLoaded] = useState(false)

  const [loginId, setLoginId] = useState("mpel\\")
  const [password, setPassword] = useState("")
  const [stationId, setStationId] = useState("")

  const [patronId, setPatronId] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingEmailStatus, setIsCheckingEmailStatus] = useState(false)
  const [showSimulationOptions, setShowSimulationOptions] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [registrationEmail, setRegistrationEmail] = useState("")
  const [addressLine, setAddressLine] = useState("")
  const [city, setCity] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [country, setCountry] = useState("")
  const [usdAmount, setUsdAmount] = useState("")

  const paymentQRRef = useRef<HTMLDivElement>(null)
  const redeemQRRef = useRef<HTMLDivElement>(null)

  const showScreen = (screenId: string, workflow?: string) => {
    setCurrentScreen(screenId)
    if (workflow) {
      setCurrentWorkflow(workflow)
    }

    if (screenId === "home") {
      setScreenHistory([])
    } else {
      setScreenHistory((prev) => [...prev, screenId])
    }
  }

  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory]
      newHistory.pop()
      const previousScreen = newHistory[newHistory.length - 1]
      setScreenHistory(newHistory)
      setCurrentScreen(previousScreen)
    } else {
      showScreen(currentScreen === "home" ? "login" : "home")
    }
  }

  const submitLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!loginId.replace("mpel\\", "").trim()) {
      alert("Please enter a login ID")
      return
    }
    if (!password.trim()) {
      alert("Please enter a password")
      return
    }
    if (!stationId) {
      alert("Please select a station ID")
      return
    }

    // Simulate login validation - in real app, this would call an API
    showScreen("home")
  }

  const handleLoginIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.startsWith("mpel\\")) {
      setLoginId(value)
    } else {
      setLoginId("mpel\\" + value.replace("mpel\\", ""))
    }
  }

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!patronId.trim()) {
      alert("Please enter a patron ID")
      return
    }

    setIsLoading(true)
    // Simulate checking email registration status
    setTimeout(() => {
      setIsLoading(false)
      setIsCheckingEmailStatus(true)
      showScreen("emailStatus")
    }, 2000)
  }

  const startSimulationCheck = () => {
    console.log("[v0] Starting simulation check")
    setIsCheckingEmailStatus(true)
    setShowSimulationOptions(false)
  }

  useEffect(() => {
    if (isCheckingEmailStatus && currentScreen === "emailStatus") {
      const timer = setTimeout(() => {
        console.log("[v0] Simulation check complete, showing options")
        setIsCheckingEmailStatus(false)
        setShowSimulationOptions(true)
      }, 3000)

      return () => clearTimeout(timer)
    }
  }, [isCheckingEmailStatus, currentScreen])

  const submitRegistration = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !registrationEmail.trim() ||
      !addressLine.trim() ||
      !city.trim() ||
      !zipCode.trim() ||
      !country.trim()
    ) {
      alert("Please fill in all required fields")
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(registrationEmail)) {
      alert("Please enter a valid email address")
      return
    }

    // Simulate registration process
    showScreen("usdAmount")
  }

  const submitUsdAmount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!usdAmount || Number.parseFloat(usdAmount) <= 0) {
      alert("Please enter a valid USD amount")
      return
    }

    showScreen("buyChips")
  }

  const proceedToCheckout = (e: React.FormEvent) => {
    e.preventDefault()
    if (chipAmount && Number.parseInt(chipAmount) > 0) {
      showScreen("crypto")
    }
  }

  const selectCrypto = (crypto: string) => {
    setSelectedCrypto(crypto)
  }

  const generatePaymentQR = () => {
    if (!selectedCrypto) {
      alert("Please select a cryptocurrency first")
      return
    }

    const txId = "abc123" + Math.random().toString(36).substr(2, 9)
    const paymentURL = `https://valenspay.me/pay?tx=${txId}`

    if (qrCodeLoaded && (window as any).QRCode && paymentQRRef.current) {
      paymentQRRef.current.innerHTML = ""
      ;(window as any).QRCode.toCanvas(paymentQRRef.current, paymentURL, {
        width: 256,
        margin: 2,
        color: {
          dark: "#0891b2",
          light: "#ffffff",
        },
      })
    }

    showScreen("paymentQR")
  }

  const proceedToRedeem = (e: React.FormEvent) => {
    e.preventDefault()
    if (redeemAmount && Number.parseInt(redeemAmount) > 0) {
      generateRedeemQR()
    }
  }

  const generateRedeemQR = () => {
    const txId = "xyz789" + Math.random().toString(36).substr(2, 9)
    const redeemURL = `https://valenspay.me/redeem?tx=${txId}`

    if (qrCodeLoaded && (window as any).QRCode && redeemQRRef.current) {
      redeemQRRef.current.innerHTML = ""
      ;(window as any).QRCode.toCanvas(redeemQRRef.current, redeemURL, {
        width: 256,
        margin: 2,
        color: {
          dark: "#0891b2",
          light: "#ffffff",
        },
      })
    }

    showScreen("redeemQR")
  }

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        strategy="beforeInteractive"
      />
      <Script src="https://cdn.jsdelivr.net/npm/qrcode.js/lib/qrcode.min.js" onLoad={() => setQrCodeLoaded(true)} />

      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4 md:p-6">
        <div className="mx-auto max-w-4xl bg-card rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0079C1] to-[#0079C1]/80 text-primary-foreground p-6 md:p-8 relative">
            {currentScreen !== "home" && currentScreen !== "login" && (
              <button
                onClick={goBack}
                className="absolute top-6 left-6 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all duration-200 hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 font-sans">
                <Bitcoin className="inline-block w-8 h-8 mr-3" />
                Chips Crypto
              </h1>
              <p className="text-primary-foreground/90 text-lg font-serif">
                Buy and redeem casino chips with cryptocurrency
              </p>
            </div>
          </div>

          {/* Screen Content */}
          <div className="p-6 md:p-8 min-h-[500px]">
            {currentScreen === "login" && (
              <div className="animate-slide-in max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 font-sans">Login</h2>
                  <p className="text-muted-foreground font-serif">Enter your credentials to access the system</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <form onSubmit={submitLogin} className="space-y-6">
                    <div>
                      <label
                        htmlFor="loginId"
                        className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                      >
                        Login ID
                      </label>
                      <input
                        type="text"
                        id="loginId"
                        placeholder="mpel\username"
                        value={loginId}
                        onChange={handleLoginIdChange}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-mono"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="stationId"
                        className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                      >
                        Station ID
                      </label>
                      <div className="relative">
                        <Monitor className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <select
                          id="stationId"
                          value={stationId}
                          onChange={(e) => setStationId(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif appearance-none"
                          required
                        >
                          <option value="">Select Station ID</option>
                          <option value="FW01">FW01</option>
                          <option value="FW02">FW02</option>
                          <option value="FW03">FW03</option>
                          <option value="FW04">FW04</option>
                          <option value="FW05">FW05</option>
                          <option value="FW06">FW06</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-sans"
                    >
                      <Lock className="w-4 h-4" /> Login
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Home Screen */}
            {currentScreen === "home" && (
              <div className="animate-slide-in">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-foreground mb-2 font-sans">Welcome to Chips Crypto</h2>
                  <p className="text-muted-foreground font-serif">Choose an option to get started</p>
                </div>

                <div className="flex justify-center max-w-md mx-auto">
                  <button
                    onClick={() => showScreen("email", "buy")}
                    className="group bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 hover:border-primary/50 w-full"
                  >
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                      <ShoppingCart className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-2 font-sans">Buy Chips</h3>
                    <p className="text-muted-foreground font-serif">Get casino chips for your gaming experience</p>
                  </button>
                </div>
              </div>
            )}

            {currentScreen === "email" && (
              <div className="animate-slide-in max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 font-sans">Account Verification</h2>
                  <p className="text-muted-foreground font-serif">Enter your Patron ID to continue</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground font-serif">Checking email registration status...</p>
                    </div>
                  ) : (
                    <form onSubmit={submitEmail} className="space-y-6">
                      <div>
                        <label
                          htmlFor="patronId"
                          className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                        >
                          Patron ID
                        </label>
                        <input
                          type="text"
                          id="patronId"
                          placeholder="Enter your Patron ID"
                          value={patronId}
                          onChange={(e) => setPatronId(e.target.value)}
                          className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-sans"
                      >
                        Continue <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )}

            {currentScreen === "emailStatus" && (
              <div className="animate-slide-in max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 font-sans">Email Registration Status</h2>
                  <p className="text-muted-foreground font-serif">Please select your registration status</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  {console.log(
                    "[v0] Render state - isCheckingEmailStatus:",
                    isCheckingEmailStatus,
                    "showSimulationOptions:",
                    showSimulationOptions,
                  )}

                  {isCheckingEmailStatus ? (
                    <div className="text-center py-8">
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                      <p className="text-muted-foreground font-serif mb-4">Checking registration status...</p>
                      <button
                        className="bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 mx-auto font-sans"
                        disabled
                      >
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Checking registration status
                      </button>
                    </div>
                  ) : showSimulationOptions ? (
                    <div className="space-y-4">
                      <div className="text-center py-4">
                        <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-4" />
                        <p className="text-muted-foreground font-serif">
                          Registration status check complete. Please choose an option below.
                        </p>
                      </div>

                      <button
                        onClick={() => showScreen("registration")}
                        className="w-full bg-muted border border-border rounded-xl p-4 text-left hover:shadow-lg hover:scale-105 transition-all duration-300 hover:border-primary/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                            <UserPlus className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-card-foreground font-sans">
                              Email not registered in Valens Pay
                            </h3>
                            <p className="text-muted-foreground font-serif">Register a new account to continue</p>
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={() => showScreen("usdAmount")}
                        className="w-full bg-muted border border-border rounded-xl p-4 text-left hover:shadow-lg hover:scale-105 transition-all duration-300 hover:border-primary/50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-card-foreground font-sans">Email registered</h3>
                            <p className="text-muted-foreground font-serif">Continue with existing account</p>
                          </div>
                        </div>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground font-serif mb-4">Choose simulation scenario</p>
                      <button
                        onClick={startSimulationCheck}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-6 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 mx-auto font-sans"
                      >
                        <Loader2 className="w-4 h-4" />
                        Start Registration Check
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {currentScreen === "registration" && (
              <div className="animate-slide-in max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <UserPlus className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 font-sans">Register New Account</h2>
                  <p className="text-muted-foreground font-serif">Please fill in your information to register</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <form onSubmit={submitRegistration} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="firstName"
                          className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="lastName"
                          className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                        >
                          Last Name
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="registrationEmail"
                        className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                      >
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="registrationEmail"
                        placeholder="john.doe@example.com"
                        value={registrationEmail}
                        onChange={(e) => setRegistrationEmail(e.target.value)}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="addressLine"
                        className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                      >
                        Address Line
                      </label>
                      <input
                        type="text"
                        id="addressLine"
                        placeholder="123 Main Street"
                        value={addressLine}
                        onChange={(e) => setAddressLine(e.target.value)}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-card-foreground mb-2 font-sans">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          placeholder="New York"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="zipCode"
                          className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                        >
                          Zip Code
                        </label>
                        <input
                          type="text"
                          id="zipCode"
                          placeholder="10001"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="country"
                        className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                      >
                        Country of Residence
                      </label>
                      <select
                        id="country"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif appearance-none"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="JP">Japan</option>
                        <option value="SG">Singapore</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-sans"
                    >
                      <UserPlus className="w-4 h-4" /> Register Account
                    </button>
                  </form>
                </div>
              </div>
            )}

            {currentScreen === "usdAmount" && (
              <div className="animate-slide-in max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <DollarSign className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 font-sans">Purchase Amount</h2>
                  <p className="text-muted-foreground font-serif">Enter the USD amount you want to spend on chips</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <form onSubmit={submitUsdAmount} className="space-y-6">
                    <div>
                      <label
                        htmlFor="usdAmount"
                        className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                      >
                        USD Amount
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="number"
                          id="usdAmount"
                          placeholder="100.00"
                          min="1"
                          step="0.01"
                          value={usdAmount}
                          onChange={(e) => setUsdAmount(e.target.value)}
                          className="w-full pl-12 pr-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-sans"
                    >
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Buy Chips Screen */}
            {currentScreen === "buyChips" && (
              <div className="animate-slide-in max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bitcoin className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 font-sans">Buy Casino Chips</h2>
                  <p className="text-muted-foreground font-serif">Enter the number of chips you want to purchase</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <form onSubmit={proceedToCheckout} className="space-y-6">
                    <div>
                      <label
                        htmlFor="chipAmount"
                        className="block text-sm font-medium text-card-foreground mb-2 font-sans"
                      >
                        Number of chips to purchase
                      </label>
                      <input
                        type="number"
                        id="chipAmount"
                        placeholder="1000"
                        min="1"
                        value={chipAmount}
                        onChange={(e) => setChipAmount(e.target.value)}
                        className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent transition-all font-serif"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-sans"
                    >
                      <CreditCard className="w-4 h-4" /> Checkout
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* Crypto Selection Screen */}
            {currentScreen === "crypto" && (
              <div className="animate-slide-in max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Bitcoin className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 font-sans">Select Cryptocurrency</h2>
                  <p className="text-muted-foreground font-serif">Choose your preferred payment method</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {[
                      { id: "BTC", name: "Bitcoin", symbol: "BTC", color: "text-orange-500", icon: "fab fa-bitcoin" },
                      { id: "ETH", name: "Ethereum", symbol: "ETH", color: "text-blue-500", icon: "fab fa-ethereum" },
                      {
                        id: "USDT",
                        name: "Tether",
                        symbol: "USDT",
                        color: "text-green-500",
                        icon: "fas fa-dollar-sign",
                      },
                    ].map((crypto) => (
                      <button
                        key={crypto.id}
                        onClick={() => selectCrypto(crypto.id)}
                        className={`p-6 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                          selectedCrypto === crypto.id
                            ? "border-primary bg-primary/10"
                            : "border-border bg-muted hover:border-primary/50"
                        }`}
                      >
                        <i className={`${crypto.icon} text-3xl ${crypto.color} mb-3 block`}></i>
                        <h4 className="font-semibold text-card-foreground font-sans">{crypto.name}</h4>
                        <p className="text-sm text-muted-foreground font-serif">{crypto.symbol}</p>
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={generatePaymentQR}
                    disabled={!selectedCrypto}
                    className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-sans"
                  >
                    <QrCode className="w-4 h-4" /> Generate Payment QR
                  </button>
                </div>
              </div>
            )}

            {/* Payment QR Screen */}
            {currentScreen === "paymentQR" && (
              <div className="animate-slide-in max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <QrCode className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 font-sans">Payment QR Code</h2>
                  <p className="text-muted-foreground font-serif">Scan this QR code to complete your payment</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="text-center bg-muted rounded-lg p-6 mb-6">
                    <div ref={paymentQRRef} className="flex justify-center mb-4"></div>
                    <p className="text-sm font-medium text-card-foreground mb-2 font-sans">Payment URL:</p>
                    <p className="text-xs text-muted-foreground break-all font-mono bg-background p-2 rounded">
                      https://valenspay.me/pay?tx=abc123...
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-blue-800">
                      <InfoIcon className="w-5 h-5" />
                      <span className="font-medium font-sans">Payment Pending</span>
                    </div>
                    <p className="text-blue-700 text-sm mt-1 font-serif">
                      Your transaction will be processed once payment is confirmed on the blockchain.
                    </p>
                  </div>

                  <button
                    onClick={() => showScreen("home")}
                    className="w-full bg-muted hover:bg-muted/80 text-muted-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-sans"
                  >
                    <Home className="w-4 h-4" /> Return to Home
                  </button>
                </div>
              </div>
            )}

            {/* Redeem QR Screen */}
            {currentScreen === "redeemQR" && (
              <div className="animate-slide-in max-w-md mx-auto">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-2 font-sans">Redemption Successful</h2>
                  <p className="text-muted-foreground font-serif">Your chips have been queued for redemption</p>
                </div>

                <div className="bg-card border border-border rounded-xl p-6">
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium font-sans">Redemption Confirmed!</span>
                    </div>
                    <p className="text-green-700 text-sm mt-1 font-serif">
                      Your chips will be converted to cryptocurrency and sent to your Valens Pay account.
                    </p>
                  </div>

                  <div className="text-center bg-muted rounded-lg p-6 mb-6">
                    <div ref={redeemQRRef} className="flex justify-center mb-4"></div>
                    <p className="text-sm font-medium text-card-foreground mb-2 font-sans">Redemption Reference:</p>
                    <p className="text-xs text-muted-foreground break-all font-mono bg-background p-2 rounded">
                      https://valenspay.me/redeem?tx=xyz789...
                    </p>
                  </div>

                  <button
                    onClick={() => showScreen("home")}
                    className="w-full bg-muted hover:bg-muted/80 text-muted-foreground py-3 px-4 rounded-lg font-medium transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 font-sans"
                  >
                    <Home className="w-4 h-4" /> Return to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
