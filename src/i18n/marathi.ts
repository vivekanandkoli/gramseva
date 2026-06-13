export type Locale = 'mr' | 'en';

export interface TString {
  mr: string;
  en: string;
}

export const strings = {
  // ── AUTH ──
  appName: { mr: 'ग्रामसेवा', en: 'GramSeva' },
  tagline: { mr: 'शेतकऱ्यांचा विश्वासू साथीदार', en: "The farmer's trusted partner" },
  getStarted: { mr: 'सुरू करा', en: 'Get Started' },
  existingAccount: { mr: 'आधीचे खाते आहे?', en: 'Already have an account?' },
  login: { mr: 'लॉगिन करा', en: 'Login' },
  register: { mr: 'नोंदणी करा', en: 'Register' },
  enterOtp: { mr: 'OTP टाका', en: 'Enter OTP' },
  sendOtp: { mr: 'OTP पाठवा', en: 'Send OTP' },
  resendOtp: { mr: 'OTP पुन्हा पाठवा', en: 'Resend OTP' },
  phoneNumber: { mr: 'मोबाईल नंबर', en: 'Mobile Number' },
  invalidPhone: { mr: 'कृपया योग्य १० अंकी नंबर टाका', en: 'Please enter a valid 10-digit number' },
  wrongOtp: { mr: 'चुकीचा OTP. पुन्हा प्रयत्न करा', en: 'Wrong OTP. Try again' },
  whoAreYou: { mr: 'तुम्ही कोण आहात?', en: 'Who are you?' },
  roleFarmer: { mr: 'शेतकरी', en: 'Farmer' },
  roleWorker: { mr: 'मजूर / कंत्राटदार', en: 'Worker / Contractor' },
  roleMachinery: { mr: 'यंत्र मालक', en: 'Machinery Owner' },
  completeRegistration: { mr: 'नोंदणी पूर्ण करा', en: 'Complete Registration' },
  yourName: { mr: 'तुमचे नाव', en: 'Your Name' },
  villageName: { mr: 'गावाचे नाव', en: 'Village Name' },
  taluka: { mr: 'तालुका', en: 'Taluka' },
  selectSkills: { mr: 'तुमची कौशल्ये निवडा', en: 'Select your skills' },
  dailyRate: { mr: 'रोजची मजुरी (₹)', en: 'Daily rate (₹)' },

  // ── FARMER ──
  greeting: { mr: 'नमस्कार', en: 'Hello' },
  whatToday: { mr: 'आज काय हवे?', en: 'What do you need today?' },
  bookService: { mr: 'सेवा बुक करा', en: 'Book a Service' },
  myBookings: { mr: 'माझ्या बुकिंग्स', en: 'My Bookings' },
  moreServices: { mr: 'आणखी सेवा', en: 'More Services' },
  seeAll: { mr: 'सर्व पाहा', en: 'See All' },
  selectDate: { mr: 'तारीख निवडा', en: 'Select Date' },
  selectTime: { mr: 'वेळ निवडा', en: 'Select Time' },
  howManyAcres: { mr: 'किती एकर?', en: 'How many acres?' },
  howManyWorkers: { mr: 'किती मजूर हवे?', en: 'How many workers?' },
  surveyNumber: { mr: 'गट नंबर', en: 'Survey Number' },
  specialInstructions: { mr: 'विशेष सूचना', en: 'Special Instructions' },
  estimatedCost: { mr: 'अंदाजित खर्च', en: 'Estimated Cost' },
  sendBooking: { mr: 'बुकिंग पाठवा', en: 'Send Booking' },
  bookingRecorded: { mr: 'बुकिंग नोंदवली!', en: 'Booking Recorded!' },
  searchingWorkers: { mr: 'मजूर शोधत आहोत...', en: 'Searching for workers...' },
  shareOnWhatsApp: { mr: 'WhatsApp वर शेअर करा', en: 'Share on WhatsApp' },
  goHome: { mr: 'मुख्यपृष्ठावर जा', en: 'Go to Home' },
  bookAnother: { mr: 'आणखी एक बुकिंग करा', en: 'Book Another' },
  rebook: { mr: 'पुन्हा बुक करा', en: 'Book Again' },
  noBookingsYet: { mr: 'अजून कोणतीही बुकिंग नाही', en: 'No bookings yet' },
  change: { mr: 'बदला', en: 'Change' },
  showOnMap: { mr: 'नकाशावर दाखवा', en: 'Show on Map' },

  // ── STATUS ──
  statusPending: { mr: 'प्रतीक्षेत', en: 'Pending' },
  statusSearching: { mr: 'शोधत आहोत', en: 'Searching' },
  statusConfirmed: { mr: 'पुष्टी झाली', en: 'Confirmed' },
  statusInProgress: { mr: 'काम सुरू', en: 'In Progress' },
  statusCompleted: { mr: 'पूर्ण झाले', en: 'Completed' },
  statusCancelled: { mr: 'रद्द केले', en: 'Cancelled' },

  // ── WORKER ──
  availableJobs: { mr: 'उपलब्ध काम', en: 'Available Jobs' },
  mySkills: { mr: 'माझे कौशल्य', en: 'My Skills' },
  todaysEarning: { mr: 'आजची कमाई', en: "Today's Earnings" },
  iAmAvailable: { mr: 'मी उपलब्ध आहे', en: 'I am available' },
  notAvailable: { mr: 'उपलब्ध नाही - काम मिळणार नाही', en: 'Not available — no jobs will come' },
  accept: { mr: 'स्वीकार करा', en: 'Accept' },
  decline: { mr: 'नाकारा', en: 'Decline' },
  distance: { mr: 'अंतर', en: 'Distance' },
  wageRate: { mr: 'मजुरी दर', en: 'Wage Rate' },
  myJobs: { mr: 'माझे काम', en: 'My Jobs' },
  earnings: { mr: 'कमाई', en: 'Earnings' },
  todaysJobs: { mr: 'आजचे काम', en: "Today's Jobs" },
  upcomingJobs: { mr: 'आगामी काम', en: 'Upcoming Jobs' },
  completedJobs: { mr: 'पूर्ण झालेले', en: 'Completed' },
  startWork: { mr: 'काम सुरू झाले', en: 'Work Started' },
  finishWork: { mr: 'काम पूर्ण झाले', en: 'Work Completed' },
  callFarmer: { mr: 'शेतकऱ्याला कॉल करा', en: 'Call Farmer' },
  editSkills: { mr: 'कौशल्य बदला', en: 'Edit Skills' },
  addUpi: { mr: 'UPI ID जोडा', en: 'Add UPI ID' },
  viewReceipt: { mr: 'पावती पाहा', en: 'View Receipt' },
  received: { mr: 'मिळाले', en: 'Received' },

  // ── COORDINATOR ──
  assignWorker: { mr: 'मजूर जोडा', en: 'Assign Worker' },
  talkedOnPhone: { mr: 'फोनवर बोललो', en: 'Talked on phone' },
  addNewBooking: { mr: 'नवीन बुकिंग जोडा', en: 'Add New Booking' },
  sendToWhatsAppGroup: { mr: 'WhatsApp ग्रुपला पाठवा', en: 'Send to WhatsApp Group' },
  todaysReport: { mr: 'आजचा रिपोर्ट', en: "Today's Report" },
  selectForBooking: { mr: 'बुकिंगसाठी निवडा', en: 'Select for Booking' },

  // ── PROFILE & RATING ──
  myAccount: { mr: 'माझे खाते', en: 'My Account' },
  giveRating: { mr: 'रेटिंग द्या', en: 'Submit Rating' },
  skip: { mr: 'वगळा', en: 'Skip' },
  deleteAccount: { mr: 'खाते बंद करा', en: 'Delete Account' },
  needHelp: { mr: 'मदत हवी?', en: 'Need Help?' },
  callNow: { mr: 'कॉल करा', en: 'Call Now' },

  // ── MACHINERY ──
  bookNow: { mr: 'बुक करा', en: 'Book Now' },
  addNewMachine: { mr: 'नवीन यंत्र जोडा', en: 'Add New Machine' },
  perHour: { mr: 'प्रति तास', en: 'per hour' },
  perAcre: { mr: 'प्रति एकर', en: 'per acre' },
  perDay: { mr: 'प्रति दिवस', en: 'per day' },

  // ── COMMON ──
  back: { mr: 'मागे जा', en: 'Back' },
  next: { mr: 'पुढे', en: 'Next' },
  save: { mr: 'जतन करा', en: 'Save' },
  cancel: { mr: 'रद्द करा', en: 'Cancel' },
  yes: { mr: 'हो', en: 'Yes' },
  no: { mr: 'नाही', en: 'No' },
  home: { mr: 'मुख्यपृष्ठ', en: 'Home' },
  history: { mr: 'इतिहास', en: 'History' },
  newBooking: { mr: 'बुकिंग', en: 'Booking' },
  help: { mr: 'मदत', en: 'Help' },
  loading: { mr: 'लोड होत आहे...', en: 'Loading...' },
  errorGeneric: { mr: 'काहीतरी चूक झाली. पुन्हा प्रयत्न करा', en: 'Something went wrong. Try again' },
  errorNetwork: { mr: 'इंटरनेट नाही — जुनी माहिती दाखवत आहोत', en: 'No internet — showing cached data' },
  successSaved: { mr: 'यशस्वीरित्या जतन झाले', en: 'Saved successfully' },
  required: { mr: 'हे आवश्यक आहे', en: 'This is required' },
} satisfies Record<string, TString>;

export type StringKey = keyof typeof strings;
