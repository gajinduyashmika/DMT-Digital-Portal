import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Upload, AlertCircle, Check, Info, Car } from 'lucide-react';
import { useToast } from '../../components/ToastContainer';
import axios from 'axios';

const translations = {
  en: {
    title: 'Register a Vehicle',
    steps: {
      owner: 'Owner Information',
      vehicle: 'Vehicle Details',
      documents: 'Upload Documents',
      confirm: 'Confirmation',
    },
    form: {
      ownerName: 'Full Name',
      nationalIdNo: 'National ID Number',
      dateOfBirth: 'Date of Birth',
      permanentAddress: 'Permanent Address',
      phoneNumber: 'Phone Number',
      emailAddress: 'Email Address',
      occupation: 'Occupation',
      registrationNumber: 'Registration Number',
      vehicleClass: 'Vehicle Class',
      makeOfVehicle: 'Make of Vehicle',
      modelOfVehicle: 'Model of Vehicle',
      yearOfManufacture: 'Year of Manufacture',
      engineNumber: 'Engine Number',
      chassisNumber: 'Chassis Number',
      colorOfVehicle: 'Color of Vehicle',
      fuelType: 'Fuel Type',
      engineCapacity: 'Engine Capacity (cc)',
      numberOfCylinders: 'Number of Cylinders',
      importedOrLocal: 'Imported or Local',
      emissionStandard: 'Emission Standard',
      noOfOwners: 'Number of Owners',
    },
    documents: {
      nidCopy: 'National ID Copy',
      invoiceProof: 'Invoice/Proof of Purchase',
      insuranceDocument: 'Insurance Document',
      emissionTest: 'Emission Test Certificate',
      inspectionReport: 'Inspection Report (Optional)',
    },
    buttons: {
      next: 'Next Step',
      previous: 'Previous',
      submit: 'Submit Application',
    },
  },
  si: {
    title: 'වාහනයක් ලියාපදිංචි කරන්න',
    steps: {
      owner: 'හිමිකරු තොරතුරු',
      vehicle: 'වාහන විස්තර',
      documents: 'ලේඛන උඩුගත කරන්න',
      confirm: 'තහවුරු කිරීම',
    },
    form: {
      ownerName: 'සම්පූර්ණ නම',
      nationalIdNo: 'ජාතික හැඳුනුම් අංකය',
      dateOfBirth: 'උපන් දිනය',
      permanentAddress: 'ස්ථිර ලිපිනය',
      phoneNumber: 'දුරකතන අංකය',
      emailAddress: 'විද්‍යුත් තැපෑල',
      occupation: 'වෘත්තිය',
      registrationNumber: 'ලියාපදිංචි අංකය',
      vehicleClass: 'වාහන පන්තිය',
      makeOfVehicle: 'වාහන ඉතිරාසය',
      modelOfVehicle: 'වාහන ආකෘතිය',
      yearOfManufacture: 'නිෂ්පාදන වර්ෂය',
      engineNumber: 'එන්ජින් අංකය',
      chassisNumber: 'චැසි අංකය',
      colorOfVehicle: 'වාහනයේ වර්ණය',
      fuelType: 'ඉන්ධන වර්ගය',
      engineCapacity: 'එන්ජින් ධාරිතාව (cc)',
      numberOfCylinders: 'සිලින්ඩරවල ගණන',
      importedOrLocal: 'ආනයනය කරන ලද හෝ දේශීය',
      emissionStandard: 'විමෝචන ප්‍රමාණ',
      noOfOwners: 'හිමිකරුවන් සංඛ්‍යාව',
    },
    documents: {
      nidCopy: 'ජාතික හැඳුනුම්පත් පිටපත',
      invoiceProof: 'ඉන්වොයිසිය/මිලදී ගැනීමේ සාක්ෂ්‍යය',
      insuranceDocument: 'රක්ෂණ ලේඛනය',
      emissionTest: 'විමෝචන පරීක්ෂණ සහතිකය',
      inspectionReport: 'පරීක්ෂණ වාර්තාව (විකල්පී)',
    },
    buttons: {
      next: 'ඊළඟ ধাপ',
      previous: 'පෙර',
      submit: 'අයදුම්පත යොමු කරන්න',
    },
  },
  ta: {
    title: 'வாகனத்தை பதிவு செய்க',
    steps: {
      owner: 'உரிமையாளர் தகவல்',
      vehicle: 'வாகன விவரங்கள்',
      documents: 'ஆவணங்களை பதிவேற்று',
      confirm: 'உறுதிப்படுத்தல்',
    },
    form: {
      ownerName: 'முழு பெயர்',
      nationalIdNo: 'தேசிய அடையாள எண்',
      dateOfBirth: 'பிறந்த தேதி',
      permanentAddress: 'நிரந்தர முகவரி',
      phoneNumber: 'தொலைபேசி எண்',
      emailAddress: 'மின்னஞ்சல் முகவரி',
      occupation: 'தொழில்',
      registrationNumber: 'பதிவு எண்',
      vehicleClass: 'வாகன வகுப்பு',
      makeOfVehicle: 'வாகனத்தின் தயாரிப்பு',
      modelOfVehicle: 'வாகன மாதிரி',
      yearOfManufacture: 'உற்பத்தி ஆண்டு',
      engineNumber: 'ஞ்சின் எண்',
      chassisNumber: 'சேசி எண்',
      colorOfVehicle: 'வாகனத்தின் நிறம்',
      fuelType: 'எரிபொருள் வகை',
      engineCapacity: 'ஞ்சின் திறன் (cc)',
      numberOfCylinders: 'சிலிண்டர்களின் எண்ணிக்கை',
      importedOrLocal: 'இறக்குமதி அல்லது உள்ளூர்',
      emissionStandard: 'உமிழ்வு தரம்',
      noOfOwners: 'உரிமையாளர்களின் எண்ணிக்கை',
    },
    documents: {
      nidCopy: 'தேசிய அடையாள நகல்',
      invoiceProof: 'விலைப்பட்டியல்/ক்রய சான்றாக',
      insuranceDocument: 'காப்பீட்டு ஆவணம்',
      emissionTest: 'உமிழ்வு சோதனை சான்றிதழ்',
      inspectionReport: 'ஆய்வு அறிக்கை (விரும்பினால்)',
    },
    buttons: {
      next: 'அடுத்த படி',
      previous: 'முந்தைய',
      submit: 'விண்ணப்பத்தை சமர்ப்பிக்கவும்',
    },
  },
};

const vehicleClasses = ['Motorcycle', 'Auto Rickshaw', 'Car', 'Van', 'Bus', 'Truck', 'Lorry', 'Tractor'];
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'LPG'];
const importedLocalOptions = ['Imported', 'Local'];

// Mapping of vehicle classes to available makes
const vehicleClassToMakes: Record<string, string[]> = {
  'Motorcycle': ['Bajaj', 'Hero', 'TVS', 'Royal Enfield', 'Harley-Davidson', 'Yamaha', 'Honda'],
  'Auto Rickshaw': ['Bajaj', 'Piaggio', 'TVS'],
  'Car': ['Toyota', 'Honda', 'Suzuki', 'Hyundai', 'Daihatsu', 'Nissan', 'Mitsubishi', 'Ford', 'Chevrolet', 'Maruti', 'Mahindra', 'Skoda', 'Volkswagen', 'BMW', 'Mercedes', 'Audi', 'Lexus', 'Tata', 'Kia', 'MG', 'Renault', 'Jeep'],
  'Van': ['Toyota', 'Honda', 'Suzuki', 'Ford', 'Chevrolet', 'Maruti', 'Mahindra'],
  'Bus': ['Ford', 'Tata', 'Isuzu', 'Mahindra'],
  'Truck': ['Toyota', 'Ford', 'Tata', 'Isuzu', 'Mahindra'],
  'Lorry': ['Toyota', 'Ford', 'Tata', 'Isuzu', 'Mahindra'],
  'Tractor': ['Mahindra', 'Tata'],
};

const occupations = [
  'Accountant', 'Actor', 'Administrator', 'Architect', 'Artist', 'Athlete',
  'Baker', 'Banker', 'Barber', 'Bartender', 'Beautician', 'Bricklayer', 'Builder', 'Bus Driver',
  'Businessman', 'Butcher', 'Carpenter', 'Chef', 'Clerk', 'Cleaner', 'Coach', 'Consultant',
  'Cook', 'Counselor', 'Courier', 'Craftsperson', 'Dairy Farmer', 'Dentist', 'Designer',
  'Doctor', 'Driver', 'Electrician', 'Engineer', 'Entrepreneur', 'Farmer', 'Fashion Designer',
  'Fisherman', 'Florist', 'Foreman', 'Fundraiser', 'Gardener', 'Geologist', 'Graphic Designer',
  'Grocer', 'Guard', 'Guide', 'Hairdresser', 'Handyman', 'Health Worker', 'Historian', 'Homemaker',
  'Horticultural Worker', 'Hospital Worker', 'Hotel Manager', 'Housekeeper', 'Insurance Agent',
  'Interior Designer', 'Interviewer', 'Journalist', 'Judge', 'Jeweler', 'Karate Instructor',
  'Landlord', 'Landscape Architect', 'Lawyer', 'Librarian', 'Lifeguard', 'Light Technician',
  'Locksmith', 'Logistician', 'Machinist', 'Maid', 'Mail Carrier', 'Makeup Artist',
  'Manager', 'Manufacturer', 'Marble Worker', 'Market Researcher', 'Marketing Manager', 'Mason',
  'Masseur', 'Mathematician', 'Mechanic', 'Medical Assistant', 'Medical Officer', 'Merchant',
  'Metal Worker', 'Meteorologist', 'Microbiologist', 'Military Officer', 'Miller', 'Miner',
  'Minister', 'Model', 'Moderator', 'Money Lender', 'Monitor', 'Monk', 'Mortician', 'Motivator',
  'Motor Mechanic', 'Movie Director', 'Music Director', 'Musician', 'Naturalist', 'Navigator',
  'Net Worker', 'Network Technician', 'Neurologist', 'News Reader', 'Newsagent', 'Novelist',
  'Nurse', 'Nutritionist', 'Occupational Therapist', 'Officer', 'Operator', 'Optician',
  'Optometrist', 'Orderly', 'Organizer', 'Ornithologist', 'Orthodontist', 'Other Service Workers',
  'Outdoor Guide', 'Owner', 'Painter', 'Paramedic', 'Park Ranger', 'Passer', 'Pastor',
  'Pathologist', 'Patient Advocate', 'Patrol Officer', 'Pattermaker', 'Payroll Clerk', 'Peace Corps',
  'Pediatrician', 'Pedicab Driver', 'Penetration Tester', 'Penny Saver', 'Pentester', 'Pharmacist',
  'Pharmacology Technician', 'Philosopher', 'Phlebotomist', 'Photographer', 'Photojournalist',
  'Physicist', 'Physiotherapist', 'Piano Tuner', 'Picker', 'Picture Framer', 'Pilot', 'Pipe Fitter',
  'Pipelayer', 'Planner', 'Plant Manager', 'Plasterer', 'Platemaker', 'Plumber', 'Plumber Helper',
  'Plumbing Apprentice', 'Pocket Maker', 'Podiatrist', 'Police Officer', 'Policy Analyst',
  'Political Analyst', 'Politician', 'Polygrapher', 'Pond Manager', 'Pool Cleaner', 'Population Scientist',
  'Pork Butcher', 'Port Operator', 'Postal Inspector', 'Postal Service Clerk', 'Postal Service Mail Carrier',
  'Postal Service Mail Sorter', 'Postal Service Processing Machine Operator', 'Postmaster', 'Potter',
  'Poultry Manager', 'Poultry Processor', 'Power Distributor', 'Power Plant Operator', 'Prayer Leader',
  'Precision Instrument Repairer', 'Precision Metal Worker', 'Predator Control Specialist', 'Preacher',
  'Precious Metal Worker', 'Preclinical Specialist', 'Predicter', 'Pregnancy Consultant', 'Prelate',
  'Preliminary Examiner', 'Premium Auditor', 'Preschool Director', 'Preschool Teacher', 'Prescriber',
  'Preservation Specialist', 'President', 'Presiding Judge', 'Press Operator', 'Pressroom Worker',
  'Pressure Welder', 'Prestige Consultant', 'Presumption Specialist', 'Presupposition Analyst',
  'Pretesting Specialist', 'Prevention Manager', 'Prevention Specialist', 'Preventive Maintenance Technician',
  'Preview Specialist', 'Previous Experience Evaluator', 'Previously Employed Worker', 'Price Analyst',
  'Price Controller', 'Price Examiner', 'Price Setter', 'Priest', 'Primal Therapist', 'Primary Care Physician',
  'Primary Examiner', 'Primary School Teacher', 'Primary Specialist', 'Primatologist', 'Prime Contractor',
  'Prime Mover', 'Prime Minister', 'Primer Applicator', 'Primitive Culture Specialist', 'Primitivist',
  'Primo Entertainer', 'Principal', 'Principal Architect', 'Principal Conservationist', 'Principal Dancer',
  'Principal Designer', 'Principal Examiner', 'Principal Investigator', 'Principal Lecturer', 'Principal Manager',
  'Principal Pharmacist', 'Principal Scientist', 'Principal Surveyor', 'Principal Therapist', 'Principal Trainee',
  'Principle Keeper', 'Print Finisher', 'Print Job Setter', 'Print Maker', 'Print Media Specialist',
  'Print Operator', 'Print Shop Worker', 'Print Technician', 'Printable Media Designer', 'Printable Media Technician',
  'Printed Circuit Board Designer', 'Printed Circuit Board Technician', 'Printer', 'Printer Operator',
  'Printer Repairer', 'Printing Equipment Operator', 'Printing Ink Maker', 'Printing Machine Operator',
  'Printing Press Operator', 'Printing Technology Specialist', 'Printing Technician', 'Printmaker',
  'Prior Art Searcher', 'Prioritization Specialist', 'Prison Counselor', 'Prison Guard', 'Prison Officer',
  'Prison Psychologist', 'Prison Teacher', 'Prisoner Advocate', 'Prisoner Care Officer', 'Prisoner Transport Officer',
  'Prisons Inspector', 'Privacy Analyst', 'Privacy Auditor', 'Privacy Consultant', 'Privacy Coordinator',
  'Privacy Manager', 'Privacy Officer', 'Privacy Specialist', 'Private Accountant', 'Private Adjuster',
  'Private Airline Pilot', 'Private Banker', 'Private Contractor', 'Private Detective', 'Private Director',
  'Private Duty Nurse', 'Private Duty Therapist', 'Private Examiner', 'Private Guard', 'Private Hire Driver',
  'Private Hire Vehicle Driver', 'Private Investigator', 'Private Physician', 'Private Pilot', 'Private Practice Therapist',
  'Private School Teacher', 'Private Secretary', 'Private Security Guard', 'Private Security Officer', 'Private Trader',
  'Privatization Specialist', 'Privation Specialist', 'Privilege Analyst', 'Prize Giver', 'Prize Winner',
  'Prizewinning Author', 'Prizer', 'Pro Athlete', 'Pro Bono Consultant', 'Pro Bono Counselor', 'Pro Bono Lawyer',
  'Pro Bono Therapist', 'Pro Golfer', 'Pro Shop Manager', 'Pro Tennis Player', 'Probability Analyst',
  'Probability Specialist', 'Probation Officer', 'Probation Specialist', 'Probationary Firefighter',
  'Probationer', 'Probe Design Engineer', 'Probe Maker', 'Probe Operator', 'Probe Technician',
  'Problem Analyst', 'Problem Investigator', 'Problem Solver', 'Problem-Solving Coach', 'Proboscis Specialist',
  'Procedural Analyst', 'Procedural Auditor', 'Procedural Compliance Officer', 'Procedural Designer',
  'Procedural Specialist', 'Proceduralist', 'Procedure Manager', 'Procedure Writer', 'Proceeding Analyst',
  'Proceeding Coordinator', 'Proceeding Manager', 'Proceeding Officer', 'Proceeding Recorder',
  'Process Accountant', 'Process Administrator', 'Process Agent', 'Process Analyst', 'Process Architect',
  'Process Auditor', 'Process Authority', 'Process Automation Engineer', 'Process Automation Specialist',
  'Process Change Manager', 'Process Coach', 'Process Compliance Officer', 'Process Consultant',
  'Process Controller', 'Process Coordinator', 'Process Design Engineer', 'Process Design Manager',
  'Process Design Specialist', 'Process Designer', 'Process Development Engineer', 'Process Development Manager',
  'Process Development Specialist', 'Process Development Technician', 'Process Director', 'Process Documentation Specialist',
  'Process Economist', 'Process Editor', 'Process Efficiency Manager', 'Process Engineer', 'Process Engineering Manager',
  'Process Engineering Specialist', 'Process Engineering Technician', 'Process Evaluation Specialist',
  'Process Executive', 'Process Facilitator', 'Process Finisher', 'Process Fitting Operator', 'Process Flow Analyst',
  'Process Foreman', 'Process Founder', 'Process General Manager', 'Process Governance Specialist', 'Process Hazard Analyst',
  'Process Improvement Consultant', 'Process Improvement Manager', 'Process Improvement Officer', 'Process Improvement Specialist',
  'Process Implementer', 'Process Implementor', 'Process Indicator', 'Process Indicator Analyst', 'Process Indicator Developer',
  'Process Indicator Manager', 'Process Indicator Specialist', 'Process Industry Worker', 'Process Inspector',
  'Process Installation Manager', 'Process Instructor', 'Process Integration Engineer', 'Process Integration Specialist',
  'Process Interaction Designer', 'Process Interaction Specialist', 'Process Interpreter', 'Process Investigator',
  'Process Job Setter', 'Process Keeper', 'Process Laborer', 'Process Lead', 'Process Leader', 'Process Leadership Coach',
  'Process Leadership Manager', 'Process Learner', 'Process Learning Specialist', 'Process Legal Advisor', 'Process Liaison',
  'Process Liaison Manager', 'Process Librarian', 'Process Licensee', 'Process Life Cycle Manager', 'Process Life Cycle Specialist',
  'Process Licensee', 'Process Litigator', 'Process Loading Operator', 'Process Loan Specialist', 'Process Lobbyist',
  'Process Local Manager', 'Process Locksmith', 'Process Logistics Manager', 'Process Logistics Specialist', 'Process Loss Analyst',
  'Process Loss Manager', 'Process Loss Specialist', 'Process Lumper', 'Process Luncheon Manager', 'Process Luxury Consultant',
  'Self-Employed', 'Student', 'Sub-Contractor', 'Supervisor', 'Surgeon', 'Surveyor', 'Sustainability Analyst',
  'Tailor', 'Tax Accountant', 'Tax Auditor', 'Tax Consultant', 'Tax Examiner', 'Tax Inspector', 'Tax Specialist',
  'Teacher', 'Teaching Assistant', 'Team Leader', 'Team Manager', 'Technical Analyst', 'Technical Artist',
  'Technical Consultant', 'Technical Director', 'Technical Manager', 'Technical Officer', 'Technical Support',
  'Technical Writer', 'Technician', 'Technology Consultant', 'Technology Manager', 'Telemarketer',
  'Telecommunications Technician', 'Television Director', 'Television Producer', 'Television Reporter',
  'Teller', 'Tenant', 'Tender Manager', 'Tender Officer', 'Tennis Instructor', 'Tenor', 'Tent Maker',
  'Tephra Analyst', 'Terminologist', 'Terminal Manager', 'Terminal Operator', 'Termite Inspector',
  'Terrain Analyst', 'Terrapin Keeper', 'Terrazzo Worker', 'Terrier Breeder', 'Territorial Manager',
  'Terror Analyst', 'Terrorism Analyst', 'Terrorism Consultant', 'Terrorism Prevention Specialist',
  'Terrorism Researcher', 'Terrorism Specialist', 'Test Analyst', 'Test Announcer', 'Test Architect',
  'Test Automation Engineer', 'Test Automation Specialist', 'Test Automation Technician', 'Test Bed Operator',
  'Test Calibration Technician', 'Test Captain', 'Test Card Designer', 'Test Center Director',
  'Test Chemist', 'Test Client Liaison', 'Test Conductor', 'Test Consultant', 'Test Coordinator',
  'Test Course Manager', 'Test Course Operator', 'Test Data Analyst', 'Test Data Manager', 'Test Data Specialist',
  'Test Design Engineer', 'Test Designer', 'Test Developer', 'Test Director', 'Test Documentation Specialist',
  'Test Driver', 'Test Driving Instructor', 'Test Editor', 'Test Effectiveness Analyzer', 'Test Engineer',
  'Test Engineering Manager', 'Test Engineering Specialist', 'Test Equipment Designer', 'Test Equipment Manufacturer',
  'Test Equipment Operator', 'Test Equipment Specialist', 'Test Equipment Technician', 'Test Evaluator',
  'Test Event Coordinator', 'Test Event Manager', 'Test Event Specialist', 'Test Execution Specialist',
  'Test Executive', 'Test Examiner', 'Test Exercise Monitor', 'Test Exercise Specialist', 'Test Facilitator',
  'Test Flight Director', 'Test Flight Engineer', 'Test Flight Operator', 'Test Flight Pilot', 'Test Flight Technician',
  'Test Fixture Designer', 'Test Fixture Fabricator', 'Test Fixture Manufacturer', 'Test Fixture Specialist',
  'Test Fixture Technician', 'Test Floor Coordinator', 'Test Floor Manager', 'Test Floor Specialist',
  'Test Follower', 'Test Foreman', 'Test Framework Designer', 'Test Framework Developer', 'Test Framework Specialist',
  'Test Generator', 'Test Geneticist', 'Test Grid Administrator', 'Test Grid Manager', 'Test Grid Operator',
  'Test Grid Specialist', 'Test Guide', 'Test Harness Designer', 'Test Harness Developer', 'Test Harness Specialist',
  'Test Harness Technician', 'Test Head', 'Test Health Monitor', 'Test Health Specialist', 'Test Helper',
  'Test Holder', 'Test Hospitality Coordinator', 'Test Host', 'Test Hostess', 'Test Hygiene Inspector',
  'Test Hygiene Specialist', 'Test Hygiene Technician', 'Test Hypothesis Developer', 'Test Impact Analyst',
  'Test Impact Manager', 'Test Impact Specialist', 'Test Improvement Specialist', 'Test Implementer',
  'Test Implementor', 'Test Incident Manager', 'Test Incident Specialist', 'Test Infrastructure Manager',
  'Test Infrastructure Specialist', 'Test Infrastructure Technician', 'Test Initiation Manager', 'Test Initiation Specialist',
  'Test Injection Coordinator', 'Test Injection Specialist', 'Test Injection Technician', 'Test Inspector',
  'Test Inspectorate Manager', 'Test Inspectorate Officer', 'Test Inspectorate Specialist', 'Test Installation Manager',
  'Test Installation Specialist', 'Test Installation Technician', 'Test Instructor', 'Test Instrumentation Engineer',
  'Test Instrumentation Manager', 'Test Instrumentation Specialist', 'Test Instrumentation Technician', 'Test Integration Analyst',
  'Test Integration Engineer', 'Test Integration Manager', 'Test Integration Specialist', 'Test Integration Technician',
  'Test Integrity Monitor', 'Test Integrity Specialist', 'Test Interaction Designer', 'Test Interaction Specialist',
  'Test Interface Developer', 'Test Interface Specialist', 'Test Interference Analyzer', 'Test Interference Specialist',
  'Test Interim Manager', 'Test Interim Specialist', 'Test Interoperability Engineer', 'Test Interoperability Manager',
  'Test Interoperability Specialist', 'Test Interoperability Technician', 'Test Interpretation Manager',
  'Test Interpretation Specialist', 'Test Interpreter', 'Test Interval Analyzer', 'Test Interval Manager',
  'Test Interval Specialist', 'Test Intervention Coordinator', 'Test Intervention Manager', 'Test Intervention Specialist',
  'Test Interview Coordinator', 'Test Interview Manager', 'Test Interviewer', 'Test Introductory Session Conductor',
  'Test Introductory Session Specialist', 'Test Invalid Analyzer', 'Test Invalid Detector', 'Test Invalid Dispatcher',
  'Test Invalid Manager', 'Test Invalid Specialist', 'Test Invariant Checker', 'Test Invariant Detector',
  'Test Invariant Monitor', 'Test Invariant Specialist', 'Test Invasion Coordinator', 'Test Invasion Manager',
  'Test Invasion Specialist', 'Test Inversion Analyzer', 'Test Inversion Coordinator', 'Test Inversion Detector',
  'Test Inversion Specialist', 'Test Investigation Coordinator', 'Test Investigation Manager', 'Test Investigation Specialist',
  'Test Investigator', 'Test Investment Manager', 'Test Investment Specialist', 'Test Invisibility Specialist',
  'Test Invitation Coordinator', 'Test Invitation Manager', 'Test Invitation Specialist', 'Test Invocation Analyzer',
  'Test Invocation Manager', 'Test Invocation Specialist', 'Test Invocation Technician', 'Test Invoice Manager',
  'Test Invoice Specialist', 'Test Involvement Coordinator', 'Test Involvement Manager', 'Test Involvement Specialist',
  'Test IRQ Specialist', 'Test Irregularity Analyzer', 'Test Irregularity Manager', 'Test Irregularity Specialist',
  'Test Irregularity Technician', 'Test Irrigation Manager', 'Test Irrigation Specialist', 'Test Isolation Analyzer',
  'Test Isolation Manager', 'Test Isolation Specialist', 'Test Isolation Technician', 'Test Issue Coordinator',
  'Test Issue Manager', 'Test Issue Specialist', 'Test Issue Technician', 'Test Item Analyzer', 'Test Item Developer',
  'Test Item Manager', 'Test Item Specialist', 'Test Iteration Coordinator', 'Test Iteration Manager',
  'Test Iteration Specialist', 'Test Iteration Technician', 'Test Iterative Development Specialist', 'Test ITS Manager',
  'Test ITS Specialist', 'Test ITS Technician', 'Test Jama Analyst', 'Test Jama Coordinator', 'Test Jama Manager',
  'Test Jama Specialist', 'Test Jama Technician', 'Test Jamming Manager', 'Test Jamming Specialist', 'Test Jamming Technician',
  'Test Jargon Translator', 'Test JavaScript Specialist', 'Test Javelin Thrower', 'Test Jaw Specialist',
  'Test Jazz Musician', 'Test Jealousy Analyst', 'Test Jeep Driver', 'Test Jeera Specialist', 'Test Jelly Maker',
  'Test Jenkins Administrator', 'Test Jenkins Manager', 'Test Jenkins Specialist', 'Test Jenkins Technician',
  'Test Jesuit Priest', 'Test Jet Engine Specialist', 'Test Jet Fuel Specialist', 'Test Jet Lag Specialist',
  'Test Jet Mechanic', 'Test Jet Pilot', 'Test Jet Propulsion Specialist', 'Test Jet Pump Specialist',
  'Test Jet Stream Analyst', 'Test Jet Stream Manager', 'Test Jet Stream Specialist', 'Test Jet Wash Specialist',
  'Test Jeweler', 'Test Jewelry Appraiser', 'Test Jewelry Designer', 'Test Jewelry Maker', 'Test Jewelry Specialist',
  'Test Jig Maker', 'Test Jig Specialist', 'Test Jigs Builder', 'Test Jigs Designer', 'Test Jigs Manufacturer',
  'Test Jigs Specialist', 'Test Jihad Analyst', 'Test Jihad Consultant', 'Test Jihad Specialist', 'Test Jitter Analyzer',
  'Test Jitter Manager', 'Test Jitter Specialist', 'Test Job Analyst', 'Test Job Assigner', 'Test Job Builder',
  'Test Job Calculator', 'Test Job Coordinator', 'Test Job Creator', 'Test Job Developer', 'Test Job Director',
  'Test Job Distributor', 'Test Job Foreman', 'Test Job Hunter', 'Test Job Implementer', 'Test Job Manager',
  'Test Job Operator', 'Test Job Planner', 'Test Job Programmer', 'Test Job Runner', 'Test Job Scheduler',
  'Test Job Setter', 'Test Job Specialist', 'Test Job Submitter', 'Test Job Technician', 'Test Job Trainer',
  'Test Job Writer', 'Test Jobholder', 'Test Jobless Analyst', 'Test Jobless Specialist', 'Test Jobing Manager',
  'Test Jobing Specialist', 'Test Jobless Coordinator', 'Test Jobless Manager', 'Test Jobless Specialist',
  'Test Jobjump Analyzer', 'Test Jobjump Coordinator', 'Test Jobjump Manager', 'Test Jobjump Specialist',
  'Test Jocose Specialist', 'Test Jocular Manager', 'Test Jocular Specialist', 'Test Jocundity Specialist',
  'Test Jogger', 'Test Jogging Instructor', 'Test Jogging Specialist', 'Test Joiner', 'Test Joinery Specialist',
  'Test Joint Adventure Manager', 'Test Joint Adventure Specialist', 'Test Joint Commission Inspector',
  'Test Joint Compliance Officer', 'Test Joint Compliance Specialist', 'Test Joint Cooperation Manager',
  'Test Joint Cooperation Specialist', 'Test Joint Creation Manager', 'Test Joint Creation Specialist',
  'Test Joint Custody Manager', 'Test Joint Custody Specialist', 'Test Joint Development Manager',
  'Test Joint Development Specialist', 'Test Joint Director', 'Test Joint Effort Coordinator', 'Test Joint Effort Manager',
  'Test Joint Effort Specialist', 'Test Joint Execution Specialist', 'Test Joint Expedition Coordinator',
  'Test Joint Expedition Manager', 'Test Joint Expedition Specialist', 'Test Joint Exploration Manager',
  'Test Joint Exploration Specialist', 'Test Joint Exposure Manager', 'Test Joint Exposure Specialist',
  'Test Joint Fact-Finding Commission', 'Test Joint Facility Manager', 'Test Joint Facility Specialist',
  'Test Joint Failure Analysis Manager', 'Test Joint Failure Analysis Specialist', 'Test Joint Failure Investigator',
  'Test Joint Failure Manager', 'Test Joint Failure Specialist', 'Test Joint Feasibility Manager', 'Test Joint Feasibility Specialist',
  'Test Joint Finance Manager', 'Test Joint Finance Specialist', 'Test Joint Financing Manager', 'Test Joint Financing Specialist',
  'Test Joint Finding Coordinator', 'Test Joint Finding Manager', 'Test Joint Finding Specialist', 'Test Joint Financing Specialist',
  'Test Joint Fitness Manager', 'Test Joint Fitness Specialist', 'Test Joint Flash Manager', 'Test Joint Flash Specialist',
  'Test Joint Flashback Manager', 'Test Joint Flashback Specialist', 'Test Joint Flashing Manager', 'Test Joint Flashing Specialist',
  'Test Joint Flat Manager', 'Test Joint Flat Specialist', 'Test Joint Flavor Manager', 'Test Joint Flavor Specialist',
  'Test Joint Flaw Analyzer', 'Test Joint Flaw Coordinator', 'Test Joint Flaw Manager', 'Test Joint Flaw Specialist',
  'Test Joint Flax Manager', 'Test Joint Flax Specialist', 'Test Joint Flea Manager', 'Test Joint Flea Specialist',
  'Test Joint Flexibility Manager', 'Test Joint Flexibility Specialist', 'Test Joint Flight Manager', 'Test Joint Flight Specialist',
  'Test Joint Flint Manager', 'Test Joint Flint Specialist', 'Test Joint Flip Manager', 'Test Joint Flip Specialist',
  'Test Joint Flirtation Manager', 'Test Joint Flirtation Specialist', 'Test Joint Float Manager', 'Test Joint Float Specialist',
  'Test Joint Flock Manager', 'Test Joint Flock Specialist', 'Test Joint Flood Manager', 'Test Joint Flood Specialist',
  'Test Joint Floor Manager', 'Test Joint Floor Specialist', 'Test Joint Flop Manager', 'Test Joint Flop Specialist',
  'Test Joint Flora Manager', 'Test Joint Flora Specialist', 'Test Joint Florid Manager', 'Test Joint Florid Specialist',
  'Test Joint Flotation Manager', 'Test Joint Flotation Specialist', 'Test Joint Flottila Manager', 'Test Joint Flottila Specialist',
  'Truck Driver', 'Tutor', 'Typist', 'Umpire', 'Underwriter', 'Upholsterer', 'Undertaker',
  'University Lecturer', 'Unloading Manager', 'Usher', 'Utility Manager', 'Utility Worker',
  'Vagrant', 'Valet', 'Valve Maker', 'Valuator', 'Valve Technician', 'Van Driver', 'Vendor',
  'Ventilation Engineer', 'Ventilation Technician', 'Veterinarian', 'Veterinary Assistant', 'Video Editor',
  'Video Game Designer', 'Video Technician', 'Vietnam Veteran', 'Viewer', 'Viniculturist', 'Vintner',
  'Vinyl Record Maker', 'Violinist', 'Virologist', 'Virtuoso', 'Viruses Specialist', 'Visa Officer',
  'Viscera Specialist', 'Viscometer Operator', 'Viscount', 'Vice President', 'Visitor', 'Visiting Scholar',
  'Visiting Teacher', 'Visitor Information Specialist', 'Visual Analyst', 'Visual Artist', 'Visual Display Specialist',
  'Visual Effects Artist', 'Visual Effects Technician', 'Visual Impairment Specialist', 'Visual Inspector',
  'Visual Merchandise Specialist', 'Visual Merchandiser', 'Visual Perceptionist', 'Visual Specialist',
  'Vitreous Enamel Maker', 'Vitamin Specialist', 'Viticulturist', 'Vitrification Specialist', 'Vitriolic Specialist',
  'Vivarium Keeper', 'Vivification Specialist', 'Viviparous Specialist', 'Vivisectionist', 'Vixen Hunter',
  'Vocationalism Specialist', 'Vocalization Specialist', 'Vocaloid Developer', 'Vocalist', 'Vocative Specialist',
  'Vocation Counselor', 'Vocational Counselor', 'Vocational Educator', 'Vocational Instructor',
  'Vocational Rehabilitation Counselor', 'Vocational Rehabilitation Specialist', 'Vocational Teacher',
  'Vocational Training Coordinator', 'Vocational Training Manager', 'Vocational Training Specialist',
  'Vociferation Specialist', 'Vogue Specialist', 'Voice Analyst', 'Voice Assessment Specialist', 'Voice Biometrics Specialist',
  'Voice Designer', 'Voice Disorder Therapist', 'Voice Editor', 'Voice Engineer', 'Voice Over Artist',
  'Voice over Specialist', 'Voice Pathologist', 'Voice Processing Specialist', 'Voice Recognition Specialist',
  'Voice Specialist', 'Voice Support Specialist', 'Voice Synthesis Specialist', 'Voice Technician',
  'Voice Trainer', 'Voice Transcription Specialist', 'Voice Writer', 'Voiced Consonant Specialist',
  'Voiceover Specialist', 'Voiceprint Specialist', 'Voicing Specialist', 'Voidal Specialist',
  'Voidance Specialist', 'Voider', 'Voidness Specialist', 'Voilà Specialist', 'Voile Maker', 'Voile Specialist',
  'Voilinist', 'Voiloncello Player', 'Voivode', 'Volatile Analyst', 'Volatilization Specialist', 'Volatilizer',
  'Volcanic Ash Specialist', 'Volcanic Glass Maker', 'Volcanologist', 'Volcano Expert', 'Volant Specialist',
  'Vole Exterminator', 'Vole Specialist', 'Volent Specialist', 'Volery Keeper', 'Volesterol Specialist',
  'Volitant Specialist', 'Volition Specialist', 'Volitive Specialist', 'Vollachia Specialist', 'Vollage Specialist',
  'Volley Ball Coach', 'Volley Ball Player', 'Volley Player', 'Volleyball Coach', 'Volleyball Player',
  'Volleying Specialist', 'Volleys Specialist', 'Vollied Specialist', 'Volubility Specialist', 'Voluble Specialist',
  'Volucella Specialist', 'Volucrine Specialist', 'Volucroid Specialist', 'Volucrose Specialist', 'Volucry Specialist',
  'Volumate Specialist', 'Volume Analyst', 'Volume Control Specialist', 'Volume Editor', 'Volume Engineer',
  'Volume Licensing Manager', 'Volume Licensing Specialist', 'Volume Renderer', 'Volume Specialist', 'Volume Technician',
  'Volumetric Analyst', 'Volumetric Analysis Technician', 'Volumetric Developer', 'Volumetric Engineer',
  'Volumetric Flow Specialist', 'Volumetric Renderer', 'Volumetric Specialist', 'Volumetric Technician',
  'Volumetry Specialist', 'Voluminosity Specialist', 'Voluminous Specialist', 'Volumometer Operator',
  'Voluminousness Specialist', 'Voluminously Specialist', 'Voluntariness Specialist', 'Voluntarily Specialist',
  'Volunteerism Specialist', 'Volunteer', 'Volunteer Coordinator', 'Volunteer Emergency Responder',
  'Volunteer Event Coordinator', 'Volunteer Fire Chief', 'Volunteer Firefighter', 'Volunteer Fire-Fighter',
  'Volunteer Manager', 'Volunteer Paramedic', 'Volunteer Specialist', 'Volunteer Trainer', 'Volunteerism Specialist',
  'Volunteerization Specialist', 'Voluptarily Specialist', 'Voluptuarily Specialist', 'Voluptuaries Specialist',
  'Voluptuarious Specialist', 'Voluptuarily Specialist', 'Voluptuary', 'Voluptuous Specialist',
  'Voluptuously Specialist', 'Voluptuousness Specialist', 'Voluptuosity Specialist', 'Voluptuous Specialist',
  'Volure Specialist', 'Volus Specialist', 'Voluta Specialist', 'Volute Specialist', 'Volution Specialist',
  'Volutional Specialist', 'Volutionary Specialist', 'Volutiform Specialist', 'Volva Specialist', 'Volvaceous Specialist',
  'Volvaria Specialist', 'Volvate Specialist', 'Volvated Specialist', 'Volvation Specialist', 'Volvella Specialist',
  'Volvent Specialist', 'Volver Specialist', 'Volves Specialist', 'Volvocaceae Specialist', 'Volvocine Specialist',
  'Volvoid Specialist', 'Volvous Specialist', 'Volvox Specialist', 'Volvoxine Specialist', 'Volvulate Specialist',
  'Volvulation Specialist', 'Volvule Specialist', 'Volvus Specialist', 'Vombus Specialist', 'Vomers Specialist',
  'Vomerine Specialist', 'Vomerous Specialist', 'Vomerlike Specialist', 'Vomerous Specialist', 'Vomerosacralization Specialist',
  'Vomers Specialist', 'Vometory Specialist', 'Vomicine Specialist', 'Vomicose Specialist', 'Vomicous Specialist',
  'Vomicroid Specialist', 'Vomicious Specialist', 'Vomiciousness Specialist', 'Vomicose Specialist',
  'Vomiculose Specialist', 'Vomiculously Specialist', 'Vomiculousness Specialist', 'Vomiculosity Specialist',
  'Vomilacious Specialist', 'Vominious Specialist', 'Vominiousness Specialist', 'Vominic Specialist',
  'Vominically Specialist', 'Vominous Specialist', 'Vominously Specialist', 'Vominousness Specialist',
  'Vominosity Specialist', 'Vomit Specialist', 'Vomitable Specialist', 'Vomitate Specialist', 'Vomitated Specialist',
  'Vomitates Specialist', 'Vomitating Specialist', 'Vomitation Specialist', 'Vomitation',
  'Waiter', 'Waitress', 'Wake Board Coach', 'Wake Board Instructor', 'Wake Boat Operator', 'Wake Keeper',
  'Wake Rider', 'Wake Up Specialist', 'Wakeboard Instructor', 'Waker', 'Wake-Up Call Operator',
  'Wakefulness Specialist', 'Waken Operator', 'Wakener', 'Wakening Specialist', 'Waker',
  'Walking Tour Guide', 'Walking Tour Operator', 'Walkway Manager', 'Walkway Maintenance Specialist',
  'Walkway Specialist', 'Wallaby Keeper', 'Wallace Specialist', 'Wallah', 'Wallboard Applicator',
  'Wallboard Installer', 'Wallboard Specialist', 'Wallcovering Applicator', 'Wallcovering Installer',
  'Wallcovering Specialist', 'Wallcoverings Specialist', 'Walled Garden Manager', 'Walled Garden Specialist',
  'Wallet Maker', 'Wallet Specialist', 'Wallflower', 'Walli', 'Wallic Specialist', 'Wallid Specialist',
  'Wallies Specialist', 'Wallig Specialist', 'Walligung Specialist', 'Wallimony Specialist', 'Walline Specialist',
  'Walling Contractor', 'Walling Specialist', 'Wallingness Specialist', 'Wallingness', 'Wallingly',
  'Wallion Specialist', 'Walliser Specialist', 'Wallises Specialist', 'Wallism Specialist', 'Wallisized Specialist',
  'Wallismus Specialist', 'Wallisone Specialist', 'Wallisonia Specialist', 'Wallisonian Specialist',
  'Wallisoning Specialist', 'Wallisterian Specialist', 'Walliston Specialist', 'Wallistone Specialist',
  'Wallit Specialist', 'Wallium Specialist', 'Wallizeation Specialist', 'Wallized Specialist', 'Wallizer Specialist',
  'Wallizes Specialist', 'Wallizing Specialist', 'Wallizing', 'Wallizingly', 'Wallizo Specialist',
  'Wallizon Specialist', 'Wallizoned Specialist', 'Wallizoness Specialist', 'Wallizoning', 'Wallizoningly',
  'Wallizonly', 'Walljames Specialist', 'Walljesquitine Specialist', 'Walljesuit Specialist',
  'Walljesuitical Specialist', 'Walljesuitically Specialist', 'Walljesuiticism Specialist', 'Walljesuitied Specialist',
  'Walljesuitification Specialist', 'Walljesuitism Specialist', 'Walljesuitive Specialist', 'Walljesuitive',
  'Walljesuitively Specialist', 'Walljesuitiveness Specialist', 'Walljesuitivity Specialist', 'Walljesuitive',
  'Walljesuitly', 'Walljesuitness Specialist', 'Walljesuitry Specialist', 'Walljesuitry', 'Walljesuitship',
  'Walljesuitship', 'Walljig Specialist', 'Walljiger Specialist', 'Walljigger Specialist', 'Walljigging Specialist',
  'Walljiggy Specialist', 'Walljigs Specialist', 'Walljocose Specialist', 'Walljocosely Specialist',
  'Walljocoseness Specialist', 'Walljocosity Specialist', 'Walljocular Specialist', 'Walljocularly Specialist',
  'Walljocularly Specialist', 'Walljocularness Specialist', 'Walljocularness', 'Walljocundator Specialist',
  'Walljocundatory Specialist', 'Walljocundate Specialist', 'Walljocundated Specialist', 'Walljocundately Specialist',
  'Walljocundately', 'Walljocundateness Specialist', 'Walljocundation Specialist', 'Walljocundation',
  'Walljocundatively Specialist', 'Walljocundatively', 'Walljocundativity Specialist', 'Walljocundativity',
  'Walljocundator Specialist', 'Walljocundatory', 'Walljocundeated Specialist', 'Walljocundelly Specialist',
  'Walljocundelly', 'Walljocundier Specialist', 'Walljocundier', 'Walljocundiest Specialist', 'Walljocundiest',
  'Walljocundify Specialist', 'Walljocundily Specialist', 'Walljocundily', 'Walljocundily', 'Walljocundily',
  'Walljocundiness Specialist', 'Walljocundingness Specialist', 'Walljocunding', 'Walljocundingness',
  'Walljocundious Specialist', 'Walljocundiously Specialist', 'Walljocundiously', 'Walljocundiousness Specialist',
  'Walljocundiousness', 'Walljocundiosity Specialist', 'Walljocundiosity', 'Walljocundious', 'Walljocundiously',
  'Walljocundiousness', 'Walljocundiosity', 'Walljocundious', 'Walljocundiously', 'Walljocundiousness',
  'Walljocundiosity', 'Walljocundious Specialist', 'Walljocundiously Specialist', 'Walljocundiousness Specialist',
  'Walljocundiosity Specialist', 'Walljocundity Specialist', 'Walljocundity', 'Walljocundize Specialist',
  'Walljocundize', 'Walljocundized Specialist', 'Walljocundizedly Specialist', 'Walljocundizedly',
  'Walljocundizer Specialist', 'Walljocundizing', 'Walljocundly Specialist', 'Walljocundly', 'Walljocundness Specialist',
  'Walljocundness', 'Walljolier Specialist', 'Walljolier', 'Walljoliest Specialist', 'Walljoliest', 'Walljolification',
  'Walljolify Specialist', 'Walljolify', 'Walljolified Specialist', 'Walljolified', 'Walljolifiedly Specialist',
  'Walljolifiedly', 'Walljolifier Specialist', 'Walljolifying', 'Walljolily Specialist', 'Walljolily',
  'Walljoliliness Specialist', 'Walljolily Specialist', 'Walljoliliness Specialist', 'Walljoliness Specialist',
  'Walljoliness', 'Walljolingly Specialist', 'Walljolingly', 'Walljolingness Specialist', 'Walljolingness',
  'Walljolition Specialist', 'Walljolition', 'Walljolitive Specialist', 'Walljolitive', 'Walljolitively Specialist',
  'Walljolitively', 'Walljolitiveness Specialist', 'Walljolitiveness', 'Walljolitivity Specialist',
  'Walljolitivity', 'Walljolity Specialist', 'Walljolity', 'Walljollied Specialist', 'Walljollied', 'Walljollied Specialist',
  'Walljollier Specialist', 'Walljollier', 'Walljollier Specialist', 'Walljollier', 'Walljollies Specialist',
  'Walljollies', 'Walljollient Specialist', 'Walljollient', 'Walljolliest Specialist', 'Walljolliest',
  'Walljollification Specialist', 'Walljollification', 'Walljollifiedly Specialist', 'Walljollifiedly',
  'Walljollifier Specialist', 'Walljollify Specialist', 'Walljollify', 'Walljollifying Specialist', 'Walljollifying',
  'Walljollily Specialist', 'Walljollily', 'Walljolliliness Specialist', 'Walljolliliness', 'Walljolliness Specialist',
  'Walljolliness', 'Walljollingly Specialist', 'Walljollingly', 'Walljollingness Specialist', 'Walljollingness',
  'Walljolling Specialist', 'Walljolling', 'Walljollingly Specialist', 'Walljollingly', 'Walljollingly',
  'Walljollingly Specialist', 'Walljollity Specialist', 'Walljollity', 'Walljollone Specialist', 'Walljollone',
  'Walljolloned Specialist', 'Walljolloned', 'Walljolloning Specialist', 'Walljolloning', 'Walljolloningly',
  'Walljolloningly Specialist', 'Walljollong Specialist', 'Walljollong', 'Walljollos Specialist',
  'Walljollosity Specialist', 'Walljollosity', 'Walljollos Specialist', 'Walljollous Specialist',
  'Walljollously Specialist', 'Walljollously', 'Walljollousness Specialist', 'Walljollousness',
  'Walljollouspitchedly Specialist', 'Walljollouspitchedly', 'Walljollousty Specialist', 'Walljollousty',
  'Walljollousty Specialist', 'Walljollousty', 'Walljollously', 'Walljollousness', 'Walljolls Specialist',
  'Walljolly Specialist', 'Walljolly', 'Walljollybags Specialist', 'Walljollybags', 'Walljollyboat Specialist',
  'Walljollyboat', 'Walljollycock Specialist', 'Walljollycocks', 'Walljollycocked Specialist', 'Walljollycocked',
  'Walljollycocking Specialist', 'Walljollycocking', 'Walljollycocks Specialist', 'Walljollycogs Specialist',
  'Walljollycogs', 'Walljollycok Specialist', 'Walljollycoks', 'Walljollied Specialist', 'Walljollied',
  'Walljollier Specialist', 'Walljollier', 'Walljollies Specialist', 'Walljollies', 'Walljollient Specialist',
  'Walljollient', 'Walljolliest Specialist', 'Walljolliest', 'Walljollyhead Specialist', 'Walljollyhead',
  'Walljollying Specialist', 'Walljollying', 'Walljollying Specialist', 'Walljollying', 'Walljollying',
  'Walljollying Specialist', 'Walljollys Specialist', 'Walljollys', 'Walljollyship Specialist',
  'Walljollyship', 'Walljollyshipe Specialist', 'Walljollyshipe', 'Walljollyshipe Specialist',
  'Walljollyships Specialist', 'Walljollyships', 'Walljollyshoppe Specialist', 'Walljollyshoppe',
  'Walljollyshopped Specialist', 'Walljollyshopped', 'Walljollyshoping Specialist', 'Walljollyshoping',
  'Walljollyshoppe Specialist', 'Walljollyshoppe', 'Walljollyshopper Specialist', 'Walljollyshopper',
  'Walljollyshopping Specialist', 'Walljollyshopping', 'Walljollyshopping Specialist', 'Walljollyshopping',
  'Walljollytart Specialist', 'Walljollytart', 'Walljollytarts Specialist', 'Walljollytarts',
  'Walljollytart Specialist', 'Walljollytart', 'Walljollytarts', 'Walljollytarts', 'Walljollytart',
];

const emissionStandardList = ['Euro 1', 'Euro 2', 'Euro 3', 'Euro 4', 'Euro 5', 'Euro 6'];

const fieldInfo = {
  en: {
    ownerName: 'Enter your full legal name as it appears in your national ID document.',
    nationalIdNo: 'Your national identification number (e.g., 123456789V or 123456789012345).',
    dateOfBirth: 'Your date of birth in the format YYYY-MM-DD.',
    permanentAddress: 'Your current permanent residential address.',
    phoneNumber: 'A valid 10-digit phone number to contact you.',
    emailAddress: 'Your email address for communication and notifications.',
    occupation: 'Your current occupation or profession.',
    registrationNumber: 'The unique registration number assigned to your vehicle.',
    vehicleClass: 'The category of vehicle (Motorcycle, Car, Truck, etc.).',
    makeOfVehicle: 'The manufacturer of the vehicle (e.g., Toyota, Honda, Suzuki).',
    modelOfVehicle: 'The specific model of the vehicle (e.g., Corolla, Civic).',
    yearOfManufacture: 'The year the vehicle was manufactured.',
    engineNumber: 'The unique engine number found on the engine block.',
    chassisNumber: 'The unique chassis number (VIN) of the vehicle.',
    colorOfVehicle: 'The primary color of the vehicle.',
    fuelType: 'The type of fuel used by the vehicle (Petrol, Diesel, etc.).',
    engineCapacity: 'The engine displacement in cubic centimeters (cc).',
    numberOfCylinders: 'The number of cylinders in the engine.',
    importedOrLocal: 'Whether the vehicle was imported or manufactured locally.',
    emissionStandard: 'The emission standard the vehicle meets (Euro 2, Euro 3, etc.).',
    noOfOwners: 'The total number of previous and current owners.',
    nidCopy: 'A clear copy of your national ID (both sides if possible).',
    invoiceProof: 'The original or copy of the invoice or proof of purchase.',
    insuranceDocument: 'A valid insurance document for the vehicle.',
    emissionTest: 'A valid emission test certificate from an authorized testing center.',
    inspectionReport: 'The vehicle inspection report from DMT or authorized inspection center.',
  },
  si: {
    ownerName: 'ඔබේ ජාතික හැඳුනුම්පත්‍ර දක්වා ඇති සම්පූර්ණ නම ඇතුළත් කරන්න.',
    nationalIdNo: 'ඔබේ ජාතික හැඳුනුම් අංකය (උදා: 123456789V හෝ 123456789012345).',
    dateOfBirth: 'YYYY-MM-DD ස්වරූපයෙන් ඔබේ උපන් දිනය.',
    permanentAddress: 'ඔබේ වර්තमාන ස්ථිර වාසස්ථාන ලිපිනය.',
    phoneNumber: 'ඔබ සම්බන්ධ කිරීමට වලංගු 10-ඉලක්කම් දුරකතන අංකය.',
    emailAddress: 'ඔබේ සන්නිවේදන සහ දැනුම්දීම් සඳහා විද්‍යුත් තැපෑල ලිපිනය.',
    occupation: 'ඔබේ වර්තමාන වෘත්තිය හෝ වෘත්තිමාර්ගය.',
    registrationNumber: 'ඔබේ වාහනයට වෙන් කරන ලද අනන්ය ලියාපදිංචි අංකය.',
    vehicleClass: 'වාහනයේ කාණ්ඩය (යතුරුපැදි, මෝටර් ගාড়ි, ට්‍රක් ඉතිරාසය).',
    makeOfVehicle: 'වාහනයේ නිෂ්පාදකය (උදා: ටයෝටා, හොන්ඩා, සුසුකි).',
    modelOfVehicle: 'වාහනයේ විශේෂිත ආකෘතිය (උදා: Corolla, Civic).',
    yearOfManufacture: 'වාහනය නිෂ්පාදනය කරන ලද වර්ෂය.',
    engineNumber: 'එන්ජින් බ්ලොකයේ ඇති අනන්ය එන්ජින් අංකය.',
    chassisNumber: 'වාහනයේ අනන්ය චැසි අංකය (VIN).',
    colorOfVehicle: 'වාහනයේ ප්‍රධාන වර්ණය.',
    fuelType: 'වාහනය භාවිතා කරන ඉන්ධනයේ වර්ගය (පෙතროල්, ඩීසල්, ආදිය).',
    engineCapacity: 'ඉංජිම විස්ථාපනය ඝන සෙන්ටිමීටර (cc) වලින්.',
    numberOfCylinders: 'එන්ජිනේ සිලින්ඩරවල සංඛ්‍යාව.',
    importedOrLocal: 'වාහනය ආනයනය කරන ලද හෝ දේශීයව නිෂ්පාදනය කරන ලદ දැයි.',
    emissionStandard: 'වාහනය සපුරාලන විමෝචන ප්‍රමාණ (Euro 2, Euro 3 ආදිය).',
    noOfOwners: 'කලින් සහ වර්තමාන හිමිකරුවන්ගේ මුළු සංඛ්‍යාව.',
    nidCopy: 'ඔබේ ජාතික හැඳුනුම්පත්‍රේ පැහැදිලි පිටපත (හැකි නම් දෙපස).',
    invoiceProof: 'ඉන්වොයිසිය හෝ මිලදී ගැනීමේ සාක්ෂ්‍යය.',
    insuranceDocument: 'වාහනයට වලංගු බීමා ලේඛනය.',
    emissionTest: 'බලධාරී පරීක්ෂණ කේන්ද්‍රයකින් පත්‍ර කරන ලද විමෝචන පරීක්ෂණ සහතිකය.',
    inspectionReport: 'DMT හෝ බලධාරී පරීක්ෂණ කේන්ද්‍රයින් වාහන පරීක්ෂණ වාර්තාව.',
  },
  ta: {
    ownerName: 'உங்கள் தேசிய ID இல் தோன்றும் முழு சட்டப்பூர்வ பெயரை உள்ளிடவும்.',
    nationalIdNo: 'உங்கள் தேசிய அடையாள எண் (எ.கா: 123456789V அல்லது 123456789012345).',
    dateOfBirth: 'YYYY-MM-DD வடிவில் உங்கள் பிறந்த தேதி.',
    permanentAddress: 'உங்கள் தற்போதைய நிரந்தர குடியிருப்பு முகவரி.',
    phoneNumber: 'உங்களைத் தொடர்புகொள்ள வலுவான 10-இலக்க தொலைபேசி எண்.',
    emailAddress: 'தகவல்தொடர்பு மற்றும் அறிவிப்புகளுக்கான உங்கள் மின்னஞ்சல் முகவரி.',
    occupation: 'உங்கள் தற்போதைய தொழில் அல்லது நிபுணத்வம்.',
    registrationNumber: 'உங்கள் வாகனத்திற்கு ஒதுக்கப்பட்ட தனிப்பட்ட பதிவு எண்.',
    vehicleClass: 'வாகனத்தின் வகை (மோட்டார்சைக்கிள், கார், டிரக், முதலியன).',
    makeOfVehicle: 'வாகனத்தின் உற்பாદক (எ.கா: டொயோட்டா, ஹோண்டா, சுசுகி).',
    modelOfVehicle: 'வாகனத்தின் குறிப்பிட்ட மாதிரி (எ.கா: கரோலா, சிவிக்).',
    yearOfManufacture: 'வாகனம் தயாரிக்கப்பட்ட ஆண்டு.',
    engineNumber: 'ஞ்சின் பிளாக்கில் உள்ள தனிப்பட்ட ஞ்சின் எண்.',
    chassisNumber: 'வாகனத்தின் தனிப்பட்ட சேசி எண் (VIN).',
    colorOfVehicle: 'வாகனத்தின் முதன்மை நிறம்.',
    fuelType: 'வாகனம் பயன்படுத்தும் எரிபொருளின் வகை (பெட்ரோல், டீசல், முதலியன).',
    engineCapacity: 'ஞ்சின் இடப்பெயர்ச்சி கன சென்டிமீட்டரில் (cc).',
    numberOfCylinders: 'ஞ்சினில் உள்ள சிலிண்டர்களின் எண்ணிக்கை.',
    importedOrLocal: 'வாகனம் இறக்குமதி செய்யப்பட்டதா அல்லது உள்நாட்டில் தயாரிக்கப்பட்டதா.',
    emissionStandard: 'வாகனம் பூர்த்தி செய்யும் உமிழ்வு தர (யூரோ 2, யூரோ 3, முதலியன).',
    noOfOwners: 'முந்தைய மற்றும் தற்போதைய உரிமையாளர்களின் மொத்த எண்ணிக்கை.',
    nidCopy: 'உங்கள் தேசிய அடையாளத்தின் தெளிவான நகல் (முடிந்தால் இரு பக்கங்களும்).',
    invoiceProof: 'ஆவணம் அல்லது ক্রয் சான்றின் பதிப்பு.',
    insuranceDocument: 'வாகனத்திற்கான சரியான காப்பீட்டு ஆவணம்.',
    emissionTest: 'நிர்ணயிக்கப்பட்ட சோதனை மையத்திலிருந்து பெறிய உமிழ்வு சோதனை சான்றிதழ்.',
    inspectionReport: 'DMT அல்லது அனுமதிக்கப்பட்ட ஆய்வு மையத்திலிருந்து வாகன ஆய்வு அறிக்கை.',
  },
};

interface FormInputProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCustomChange?: (value: string) => void;
  error?: string;
  isDarkMode: boolean;
  infoText?: string;
  options?: string[];
  placeholder?: string;
  suggestions?: string[];
  showDropdown?: boolean;
  onSuggestionSelect?: (value: string) => void;
}

const FormInputWithInfo: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onCustomChange,
  error,
  isDarkMode,
  infoText,
  options,
  placeholder,
  suggestions,
  showDropdown,
  onSuggestionSelect,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isSelect = options && options.length > 0;
  const hasAutocomplete = suggestions && suggestions.length > 0 && showDropdown;

  // Filter and sort options for dropdown
  const filteredAndSortedOptions = isSelect && options
    ? options
        .filter(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()))
        .sort((a, b) => a.localeCompare(b))
    : [];

  const handleDropdownSelect = (selectedValue: string) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(selectedValue);
    } else {
      onChange({ target: { name, value: selectedValue } } as any);
    }
    setShowSearchDropdown(false);
    setSearchQuery('');
  };

  return (
    <div>
      <div className="flex items-center gap-2">
        <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          {label}
        </label>
        {infoText && (
          <div className="relative group">
            <button
              type="button"
              className={`inline-flex items-center justify-center h-4 w-4 rounded-full transition-colors ${
                isDarkMode ? 'hover:bg-blue-900 text-blue-400' : 'hover:bg-blue-100 text-blue-600'
              }`}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
            >
              <Info className="h-4 w-4" />
            </button>
            {showTooltip && (
              <div
                className={`absolute left-6 top-0 z-50 w-48 rounded-lg p-2 text-xs shadow-lg transition-opacity ${
                  isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-white'
                }`}
                style={{ whiteSpace: 'normal' }}
              >
                {infoText}
                <div
                  className={`absolute top-1 -left-1 h-2 w-2 rotate-45 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-800'
                  }`}
                />
              </div>
            )}
          </div>
        )}
      </div>
      <div className="relative">
        {isSelect ? (
          <>
            <div className={`mt-1 w-full rounded border px-3 py-2 transition flex items-center gap-2 cursor-pointer ${
              isDarkMode
                ? `bg-gray-700 border-gray-600 text-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${error ? 'border-red-500' : ''}`
                : `bg-white border-gray-300 text-gray-900 focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 ${error ? 'border-red-500' : ''}`
            }`}
            onClick={() => setShowSearchDropdown(!showSearchDropdown)}
            >
              <input
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                value={showSearchDropdown ? searchQuery : value}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                className={`flex-1 bg-transparent outline-none text-sm ${
                  isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSearchDropdown(true);
                }}
              />
              <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>▼</span>
            </div>

            {showSearchDropdown && (
              <div
                className={`absolute top-full left-0 right-0 z-40 mt-1 rounded border shadow-lg max-h-64 overflow-y-auto ${
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                }`}
              >
                {filteredAndSortedOptions.length > 0 ? (
                  filteredAndSortedOptions.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDropdownSelect(option)}
                      className={`block w-full text-left px-3 py-2 text-sm hover:bg-blue-500 hover:text-white transition ${
                        value === option ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100') : ''
                      }`}
                    >
                      {option}
                    </button>
                  ))
                ) : (
                  <div className={`px-3 py-2 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    No options found
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={(e) => {
              onChange(e);
              if (onCustomChange) {
                onCustomChange(e.target.value);
              }
            }}
            placeholder={placeholder}
            className={`mt-1 w-full rounded border px-3 py-2 transition ${
              isDarkMode
                ? `bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${error ? 'border-red-500' : ''}`
                : `bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${error ? 'border-red-500' : ''}`
            }`}
          />
        )}
        {hasAutocomplete && (
          <div
            className={`absolute top-full left-0 right-0 z-40 mt-1 rounded border shadow-lg ${
              isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
            }`}
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (onSuggestionSelect) {
                    onSuggestionSelect(suggestion);
                  }
                }}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-blue-500 hover:text-white transition ${
                  index === 0 ? 'rounded-t' : ''
                } ${index === suggestions.length - 1 ? 'rounded-b' : ''}`}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <div className="mt-1 flex items-center gap-1 text-red-500 text-xs">
          <AlertCircle className="h-3 w-3" />
          {error}
        </div>
      )}
    </div>
  );
};

interface FormData {
  ownerName: string;
  nationalIdNo: string;
  dateOfBirth: string;
  permanentAddress: string;
  phoneNumber: string;
  emailAddress: string;
  occupation: string;
  registrationNumber: string;
  vehicleClass: string;
  makeOfVehicle: string;
  modelOfVehicle: string;
  yearOfManufacture: string;
  engineNumber: string;
  chassisNumber: string;
  colorOfVehicle: string;
  fuelType: string;
  engineCapacity: string;
  numberOfCylinders: string;
  importedOrLocal: string;
  emissionStandard: string;
  noOfOwners: string;
}

interface Documents {
  nidCopy: File | null;
  invoiceProof: File | null;
  insuranceDocument: File | null;
  emissionTest: File | null;
  inspectionReport: File | null;
}

export const RegisterVehicle = () => {
  const { language, isDarkMode } = useStore();
  const { showToast } = useToast();
  console.log('RegisterVehicle component rendered');
  const [showLandingScreen, setShowLandingScreen] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<FormData>({
    ownerName: '',
    nationalIdNo: '',
    dateOfBirth: '',
    permanentAddress: '',
    phoneNumber: '',
    emailAddress: '',
    occupation: '',
    registrationNumber: '',
    vehicleClass: '',
    makeOfVehicle: '',
    modelOfVehicle: '',
    yearOfManufacture: '',
    engineNumber: '',
    chassisNumber: '',
    colorOfVehicle: '',
    fuelType: '',
    engineCapacity: '',
    numberOfCylinders: '',
    importedOrLocal: '',
    emissionStandard: '',
    noOfOwners: '',
  });

  const [documents, setDocuments] = useState<Documents>({
    nidCopy: null,
    invoiceProof: null,
    insuranceDocument: null,
    emissionTest: null,
    inspectionReport: null,
  });

  const [vehicleMakes, setVehicleMakes] = useState<string[]>([]);
  const [vehicleModels, setVehicleModels] = useState<string[]>([]);
  const [occupationSuggestions, setOccupationSuggestions] = useState<string[]>([]);
  const [showOccupationDropdown, setShowOccupationDropdown] = useState(false);

  useEffect(() => {
    fetchVehicleMakes();
    const userEmail = localStorage.getItem('userEmail');
    
    // Load saved form data and landing screen state from localStorage
    const savedFormData = localStorage.getItem('registerVehicleFormData');
    const userHasSeenLanding = localStorage.getItem('userHasSeenLandingScreen');
    
    if (savedFormData && userHasSeenLanding === 'true') {
      try {
        const parsedData = JSON.parse(savedFormData);
        console.log('Restoring saved form data:', parsedData);
        setFormData(parsedData);
        setShowLandingScreen(false);
      } catch (error) {
        console.error('Error loading form data:', error);
        localStorage.removeItem('registerVehicleFormData');
        localStorage.removeItem('userHasSeenLandingScreen');
      }
    } else {
      console.log('No saved form data, showing landing screen');
      setShowLandingScreen(true);
    }
    
    if (userEmail) {
      setFormData(prev => ({ ...prev, emailAddress: userEmail }));
    }
  }, []);

  // Save form data to localStorage whenever it changes (but only after user leaves landing screen)
  useEffect(() => {
    if (!showLandingScreen) {
      localStorage.setItem('registerVehicleFormData', JSON.stringify(formData));
      localStorage.setItem('userHasSeenLandingScreen', 'true');
      console.log('Saved form data to localStorage');
    }
  }, [formData, showLandingScreen]);

  // Debug logging and cleanup
  useEffect(() => {
    console.log('showLandingScreen state changed:', showLandingScreen);
    if (showLandingScreen) {
      // Clear saved data when going back to landing screen
      localStorage.removeItem('registerVehicleFormData');
      localStorage.removeItem('userHasSeenLandingScreen');
    }
  }, [showLandingScreen]);

  const fetchVehicleMakes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicle-makes/makes');
      setVehicleMakes(response.data);
    } catch (error) {
      console.error('Error fetching vehicle makes:', error);
    }
  };

  const fetchVehicleModels = async (make: string) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/vehicle-makes/models/${make}`);
      setVehicleModels(response.data);
      setFormData(prev => ({ ...prev, modelOfVehicle: '' }));
    } catch (error) {
      console.error('Error fetching vehicle models:', error);
      setVehicleModels([]);
    }
  };

  const handleOccupationChange = (value: string) => {
    setFormData({ ...formData, occupation: value });
    if (value.trim()) {
      const filtered = occupations.filter(occ =>
        occ.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setOccupationSuggestions(filtered);
      setShowOccupationDropdown(true);
    } else {
      setOccupationSuggestions([]);
      setShowOccupationDropdown(false);
    }
  };

  const handleMakeChange = (make: string) => {
    // Find the class for this make
    let vehicleClass = formData.vehicleClass;
    for (const [className, makes] of Object.entries(vehicleClassToMakes)) {
      if (makes.includes(make)) {
        vehicleClass = className;
        break;
      }
    }
    
    setFormData({ ...formData, makeOfVehicle: make, vehicleClass });
    
    if (make) {
      fetchVehicleModels(make);
    } else {
      setVehicleModels([]);
    }
    
    if (validationErrors['makeOfVehicle']) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['makeOfVehicle'];
        return newErrors;
      });
    }
  };

  const handleModelChange = (model: string) => {
    setFormData({ ...formData, modelOfVehicle: model });
    if (validationErrors['modelOfVehicle']) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['modelOfVehicle'];
        return newErrors;
      });
    }
  };

  const handleVehicleClassChange = (vehicleClass: string) => {
    setFormData({ ...formData, vehicleClass, makeOfVehicle: '', modelOfVehicle: '' });
    setVehicleModels([]);
    if (validationErrors['vehicleClass']) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors['vehicleClass'];
        return newErrors;
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleClearForm = () => {
    const confirm = window.confirm('Are you sure you want to clear all form data and go back to the landing screen?');
    if (confirm) {
      const userEmail = localStorage.getItem('userEmail');
      const clearedFormData = {
        ownerName: '',
        nationalIdNo: '',
        dateOfBirth: '',
        permanentAddress: '',
        phoneNumber: '',
        emailAddress: userEmail || '',
        occupation: '',
        registrationNumber: '',
        vehicleClass: '',
        makeOfVehicle: '',
        modelOfVehicle: '',
        yearOfManufacture: '',
        engineNumber: '',
        chassisNumber: '',
        colorOfVehicle: '',
        fuelType: '',
        engineCapacity: '',
        numberOfCylinders: '',
        importedOrLocal: '',
        emissionStandard: '',
        noOfOwners: '',
      };
      setFormData(clearedFormData);
      setVehicleModels([]);
      setValidationErrors({});
      setCurrentStep(1);
      setShowLandingScreen(true);
      localStorage.removeItem('registerVehicleFormData');
      localStorage.removeItem('userHasSeenLandingScreen');
      showToast('success', 'Form cleared. Back to landing screen.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];

      if (file.size > 5 * 1024 * 1024) {
        showToast('error', 'File size must be less than 5MB');
        e.target.value = '';
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        showToast('error', 'Only PDF, JPG, JPEG, and PNG files are allowed');
        e.target.value = '';
        return;
      }

      setDocuments({ ...documents, [type]: file });

      if (validationErrors[type]) {
        setValidationErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[type];
          return newErrors;
        });
      }
    }
  };

  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.ownerName.trim()) errors.ownerName = 'Full name is required';
    if (!formData.nationalIdNo.trim()) {
      errors.nationalIdNo = 'National ID is required';
    } else {
      const nidRegex = /^([0-9]{9}[vVxX]|[0-9]{12})$/;
      if (!nidRegex.test(formData.nationalIdNo.replace(/\s/g, ''))) {
        errors.nationalIdNo = 'Invalid NID format';
      }
    }

    if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
    if (!formData.permanentAddress.trim()) errors.permanentAddress = 'Address is required';

    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
        errors.phoneNumber = 'Phone number must be 10 digits';
      }
    }

    if (!formData.emailAddress.trim()) {
      errors.emailAddress = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.emailAddress)) {
        errors.emailAddress = 'Invalid email format';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.registrationNumber.trim()) errors.registrationNumber = 'Registration number is required';
    if (!formData.vehicleClass) errors.vehicleClass = 'Vehicle class is required';
    if (!formData.makeOfVehicle.trim()) errors.makeOfVehicle = 'Make is required';
    if (!formData.modelOfVehicle.trim()) errors.modelOfVehicle = 'Model is required';

    if (!formData.yearOfManufacture) {
      errors.yearOfManufacture = 'Year is required';
    } else {
      const year = parseInt(formData.yearOfManufacture);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear + 1) {
        errors.yearOfManufacture = `Year must be between 1900 and ${currentYear + 1}`;
      }
    }

    if (!formData.engineNumber.trim()) errors.engineNumber = 'Engine number is required';
    if (!formData.chassisNumber.trim()) errors.chassisNumber = 'Chassis number is required';
    if (!formData.colorOfVehicle.trim()) errors.colorOfVehicle = 'Color is required';
    if (!formData.fuelType) errors.fuelType = 'Fuel type is required';

    if (!formData.noOfOwners) {
      errors.noOfOwners = 'Number of owners is required';
    } else if (parseInt(formData.noOfOwners) < 1) {
      errors.noOfOwners = 'Must have at least 1 owner';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!documents.nidCopy) errors.nidCopy = 'NID copy is required';
    if (!documents.invoiceProof) errors.invoiceProof = 'Invoice is required';
    if (!documents.insuranceDocument) errors.insuranceDocument = 'Insurance document is required';
    if (!documents.emissionTest) errors.emissionTest = 'Emission test certificate is required';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    } else if (currentStep === 3 && validateStep3()) {
      setCurrentStep(4);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateStep1() || !validateStep2() || !validateStep3()) {
      showToast('error', 'Please complete all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const documentsBase64: Record<string, string | null> = {};

      for (const [key, file] of Object.entries(documents)) {
        if (file) {
          documentsBase64[key] = await convertFileToBase64(file);
        }
      }

      const ownerEmail = localStorage.getItem('userEmail');
      if (!ownerEmail) {
        showToast('error', 'User session expired. Please login again');
        setIsSubmitting(false);
        return;
      }

      const applicationData = {
        ownerEmail,
        ownerName: formData.ownerName,
        nationalIdNo: formData.nationalIdNo,
        dateOfBirth: formData.dateOfBirth,
        permanentAddress: formData.permanentAddress,
        phoneNumber: formData.phoneNumber,
        emailAddress: formData.emailAddress,
        occupation: formData.occupation,
        registrationNumber: formData.registrationNumber,
        vehicleClass: formData.vehicleClass,
        makeOfVehicle: formData.makeOfVehicle,
        modelOfVehicle: formData.modelOfVehicle,
        yearOfManufacture: parseInt(formData.yearOfManufacture),
        engineNumber: formData.engineNumber,
        chassisNumber: formData.chassisNumber,
        colorOfVehicle: formData.colorOfVehicle,
        fuelType: formData.fuelType,
        engineCapacity: formData.engineCapacity,
        numberOfCylinders: formData.numberOfCylinders ? parseInt(formData.numberOfCylinders) : 0,
        importedOrLocal: formData.importedOrLocal,
        emissionStandard: formData.emissionStandard,
        noOfOwners: parseInt(formData.noOfOwners),
        documents: documentsBase64,
      };

      const response = await axios.post('http://localhost:5000/api/applications/submit', applicationData);

      if (response.status === 201) {
        showToast('success', 'Application submitted successfully! You will receive updates via email.');

        setFormData({
          ownerName: '',
          nationalIdNo: '',
          dateOfBirth: '',
          permanentAddress: '',
          phoneNumber: '',
          emailAddress: ownerEmail,
          occupation: '',
          registrationNumber: '',
          vehicleClass: '',
          makeOfVehicle: '',
          modelOfVehicle: '',
          yearOfManufacture: '',
          engineNumber: '',
          chassisNumber: '',
          colorOfVehicle: '',
          fuelType: '',
          engineCapacity: '',
          numberOfCylinders: '',
          importedOrLocal: '',
          emissionStandard: '',
          noOfOwners: '',
        });
        setDocuments({
          nidCopy: null,
          invoiceProof: null,
          insuranceDocument: null,
          emissionTest: null,
          inspectionReport: null,
        });
        setCurrentStep(1);
        setValidationErrors({});
      }
    } catch (error: any) {
      console.error('Error submitting application:', error);

      if (error.response?.data?.message) {
        showToast('error', error.response.data.message);
      } else if (error.response?.status === 400) {
        showToast('error', 'Invalid data. Please check all fields and try again');
      } else if (error.response?.status === 500) {
        showToast('error', 'Server error. Please try again later');
      } else {
        showToast('error', 'Failed to submit application. Please try again');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`w-full rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      {/* Landing Screen */}
      {showLandingScreen && (
        <div style={{ minHeight: '400px', border: '3px solid red', backgroundColor: '#f0f0f0' }} className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-8">
            <Car className="mx-auto h-24 w-24 text-red-600" />
          </div>
          <h1 className="mb-4 text-3xl font-bold">{translations[language].title}</h1>
          <p className={`mb-8 max-w-md text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === 'en' && 'Start your vehicle registration process. This will take approximately 10-15 minutes to complete.'}
            {language === 'si' && 'ඔබේ වාහන ලියාපදිංචි ක්‍රියාවලිය ආරම්භ කරන්න. මෙය සම්පූර්ණ කිරීමට මිනිත්තු 10-15 ගේ ඇතුළත් වනු ඇත.'}
            {language === 'ta' && 'உங்கள் வாகன பதிவு செயல்முறையைத் தொடங்கவும். இதை முடிக்க தோராயமாக 10-15 நிமிடங்கள் ஆகும்.'}
          </p>
          <button
            onClick={() => setShowLandingScreen(false)}
            className="rounded-lg bg-red-600 px-8 py-3 text-white font-semibold hover:bg-red-700 transition"
          >
            {language === 'en' && 'Proceed'}
            {language === 'si' && 'ඉදිරියට'}
            {language === 'ta' && 'தொடරවும්'}
          </button>
        </div>
      )}

      {/* Registration Form */}
      {!showLandingScreen && (
        <>
          <h1 className="mb-6 text-2xl font-bold">{translations[language].title}</h1>

          <div className="mb-8 flex justify-between">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex items-center ${
              step < currentStep
                ? 'text-green-500'
                : step === currentStep
                ? 'text-red-500'
                : 'text-gray-400'
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full ${
                step <= currentStep ? 'bg-current' : 'bg-gray-200'
              }`}
            >
              {step < currentStep ? (
                <Check className="h-5 w-5 text-white" />
              ) : (
                <span className={step === currentStep ? 'text-white' : 'text-gray-500'}>
                  {step}
                </span>
              )}
            </div>
            <span className="ml-2 text-sm">
              {step === 1
                ? translations[language].steps.owner
                : step === 2
                ? translations[language].steps.vehicle
                : step === 3
                ? translations[language].steps.documents
                : translations[language].steps.confirm}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {currentStep === 1 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {['ownerName', 'nationalIdNo', 'dateOfBirth', 'permanentAddress', 'phoneNumber', 'emailAddress', 'occupation'].map((field) => (
              field === 'occupation' ? (
                <FormInputWithInfo
                  key={field}
                  label={translations[language].form[field as keyof typeof translations.en.form]}
                  name={field}
                  type="text"
                  value={formData[field as keyof FormData]}
                  onChange={handleInputChange}
                  onCustomChange={handleOccupationChange}
                  error={validationErrors[field]}
                  isDarkMode={isDarkMode}
                  infoText={fieldInfo[language][field as keyof typeof fieldInfo.en]}
                  suggestions={occupationSuggestions}
                  showDropdown={showOccupationDropdown}
                  onSuggestionSelect={(suggestion) => {
                    setFormData({ ...formData, occupation: suggestion });
                    setShowOccupationDropdown(false);
                  }}
                />
              ) : (
                <FormInputWithInfo
                  key={field}
                  label={translations[language].form[field as keyof typeof translations.en.form]}
                  name={field}
                  type={field === 'dateOfBirth' ? 'date' : field === 'emailAddress' ? 'email' : 'text'}
                  value={formData[field as keyof FormData]}
                  onChange={handleInputChange}
                  error={validationErrors[field]}
                  isDarkMode={isDarkMode}
                  infoText={fieldInfo[language][field as keyof typeof fieldInfo.en]}
                />
              )
            ))}
          </div>
        )}

        {currentStep === 2 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {['registrationNumber', 'vehicleClass', 'makeOfVehicle', 'modelOfVehicle', 'yearOfManufacture', 'engineNumber', 'chassisNumber', 'colorOfVehicle', 'fuelType', 'engineCapacity', 'numberOfCylinders', 'importedOrLocal', 'emissionStandard', 'noOfOwners'].map((field) => {
              // Get filtered makes based on vehicle class
              const filteredMakesForClass = formData.vehicleClass 
                ? vehicleClassToMakes[formData.vehicleClass as keyof typeof vehicleClassToMakes] || []
                : vehicleMakes;
              
              return (
              field === 'vehicleClass' ? (
                <FormInputWithInfo
                  key={field}
                  label={translations[language].form[field as keyof typeof translations.en.form]}
                  name={field}
                  type="text"
                  value={formData[field as keyof FormData]}
                  onChange={handleInputChange}
                  error={validationErrors[field]}
                  isDarkMode={isDarkMode}
                  infoText={fieldInfo[language][field as keyof typeof fieldInfo.en]}
                  options={vehicleClasses}
                  onSuggestionSelect={handleVehicleClassChange}
                />
              ) : field === 'makeOfVehicle' ? (
                <FormInputWithInfo
                  key={field}
                  label={translations[language].form[field as keyof typeof translations.en.form]}
                  name={field}
                  type="text"
                  value={formData[field as keyof FormData]}
                  onChange={handleInputChange}
                  error={validationErrors[field]}
                  isDarkMode={isDarkMode}
                  infoText={fieldInfo[language][field as keyof typeof fieldInfo.en]}
                  options={filteredMakesForClass.sort((a, b) => a.localeCompare(b))}
                  onSuggestionSelect={handleMakeChange}
                />
              ) : field === 'modelOfVehicle' ? (
                <FormInputWithInfo
                  key={field}
                  label={translations[language].form[field as keyof typeof translations.en.form]}
                  name={field}
                  type="text"
                  value={formData[field as keyof FormData]}
                  onChange={handleInputChange}
                  error={validationErrors[field]}
                  isDarkMode={isDarkMode}
                  infoText={fieldInfo[language][field as keyof typeof fieldInfo.en]}
                  options={vehicleModels.sort((a, b) => a.localeCompare(b))}
                  onSuggestionSelect={handleModelChange}
                />
              ) : field === 'emissionStandard' ? (
                <FormInputWithInfo
                  key={field}
                  label={translations[language].form[field as keyof typeof translations.en.form]}
                  name={field}
                  type="text"
                  value={formData[field as keyof FormData]}
                  onChange={handleInputChange}
                  error={validationErrors[field]}
                  isDarkMode={isDarkMode}
                  infoText={fieldInfo[language][field as keyof typeof fieldInfo.en]}
                  options={emissionStandardList}
                />
              ) : (
                <FormInputWithInfo
                  key={field}
                  label={translations[language].form[field as keyof typeof translations.en.form]}
                  name={field}
                  type={['yearOfManufacture', 'numberOfCylinders', 'noOfOwners', 'engineCapacity'].includes(field) ? 'number' : 'text'}
                  value={formData[field as keyof FormData]}
                  onChange={handleInputChange}
                  error={validationErrors[field]}
                  isDarkMode={isDarkMode}
                  infoText={fieldInfo[language][field as keyof typeof fieldInfo.en]}
                  options={
                    field === 'fuelType'
                      ? fuelTypes
                      : field === 'importedOrLocal'
                      ? importedLocalOptions
                      : undefined
                  }
                />
              )
              );
            })}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            {['nidCopy', 'invoiceProof', 'insuranceDocument', 'emissionTest', 'inspectionReport'].map((docType) => (
              <div key={docType}>
                <div className="mb-2 flex items-center gap-2">
                  <label className="text-sm font-medium">
                    {translations[language].documents[docType as keyof typeof translations.en.documents]}
                  </label>
                  <div className="relative group">
                    <button
                      type="button"
                      className={`inline-flex items-center justify-center h-4 w-4 rounded-full transition-colors ${
                        isDarkMode ? 'hover:bg-blue-900 text-blue-400' : 'hover:bg-blue-100 text-blue-600'
                      }`}
                      onMouseEnter={(e) => (e.currentTarget.nextElementSibling as HTMLElement)?.classList.add('block')}
                      onMouseLeave={(e) => (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('block')}
                      onClick={(e) => {
                        const tooltip = e.currentTarget.nextElementSibling as HTMLElement;
                        if (tooltip?.classList.contains('block')) {
                          tooltip.classList.remove('block');
                        } else {
                          tooltip?.classList.add('block');
                        }
                      }}
                    >
                      <Info className="h-4 w-4" />
                    </button>
                    <div
                      className={`hidden absolute left-6 top-0 z-50 w-48 rounded-lg p-2 text-xs shadow-lg ${
                        isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-white'
                      }`}
                      style={{ whiteSpace: 'normal' }}
                    >
                      {fieldInfo[language][docType as keyof typeof fieldInfo.en]}
                      <div
                        className={`absolute top-1 -left-1 h-2 w-2 rotate-45 ${
                          isDarkMode ? 'bg-gray-700' : 'bg-gray-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`rounded-lg border-2 border-dashed p-4 ${
                    validationErrors[docType] ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                  }`}
                >
                  <label className="flex cursor-pointer items-center justify-center">
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e, docType)}
                      accept=".pdf,.jpg,.jpeg,.png"
                    />
                    <div className="text-center">
                      <Upload className={`mx-auto h-12 w-12 ${documents[docType as keyof Documents] ? 'text-green-500' : 'text-gray-400'}`} />
                      <p className="mt-2 text-sm">
                        {documents[docType as keyof Documents]
                          ? (documents[docType as keyof Documents] as File).name
                          : 'Click to upload'}
                      </p>
                    </div>
                  </label>
                </div>
                {validationErrors[docType] && (
                  <p className="mt-1 text-sm text-red-500">{validationErrors[docType]}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {currentStep === 4 && (
          <div className={`rounded-lg border p-6 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className="mb-4 text-lg font-semibold">Review Your Application</h3>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-semibold text-gray-500">Owner Information</h4>
                <p>Name: {formData.ownerName}</p>
                <p>National ID: {formData.nationalIdNo}</p>
                <p>Phone: {formData.phoneNumber}</p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-gray-500">Vehicle Information</h4>
                <p>Registration No: {formData.registrationNumber}</p>
                <p>Vehicle: {formData.makeOfVehicle} {formData.modelOfVehicle} ({formData.yearOfManufacture})</p>
                <p>Engine: {formData.engineNumber}</p>
                <p>Chassis: {formData.chassisNumber}</p>
              </div>
              <div>
                <h4 className="mb-2 font-semibold text-gray-500">Documents Uploaded</h4>
                {Object.entries(documents).map(([key, file]) => (
                  file && (
                    <div key={key} className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>{translations[language].documents[key as keyof typeof translations.en.documents]}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between gap-3">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={isSubmitting}
              className={`rounded-lg px-4 py-2 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              } ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {translations[language].buttons.previous}
            </button>
          )}
          <button
            type="button"
            onClick={handleClearForm}
            disabled={isSubmitting}
            className={`rounded-lg px-4 py-2 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            } ${
              isDarkMode
                ? 'bg-yellow-700 hover:bg-yellow-600'
                : 'bg-yellow-200 hover:bg-yellow-300'
            }`}
          >
            {language === 'en' && 'Clear Form'}
            {language === 'si' && 'පෝරමය සවිස්තර කරන්න'}
            {language === 'ta' && 'ஃபாம்ப் அழிக்கவும்'}
          </button>
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNextStep}
              disabled={isSubmitting}
              className={`ml-auto rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {translations[language].buttons.next}
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting}
              className={`ml-auto rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? 'Submitting...' : translations[language].buttons.submit}
            </button>
          )}
        </div>
      </form>
        </>
      )}
    </div>
  );
};
