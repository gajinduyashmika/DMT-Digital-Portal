import React, { useState, useEffect } from 'react';
import { useStore } from '../../store/useStore';
import { Upload, AlertCircle, Check, Info, Car, CheckCircle } from 'lucide-react';
import { SupportButton } from '../../components/SupportButton';
import { useToast } from '../../components/ToastContainer';
import axios from 'axios';

const translations = {
    en: {
        title: 'Register a Vehicle',
        steps: {
            owner: 'Owner Information',
            vehicle: 'Vehicle Details',
            image: 'Vehicle Photo',
            documents: 'Upload Documents',
            vip: 'Special Number',
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
            image: 'වාහන ඡායාරූපය',
            documents: 'ලේඛන උඩුගත කරන්න',
            vip: 'Special Number',
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
            image: 'வாகன புகைப்படம்',
            documents: 'ஆவணங்களை பதிவேற்று',
            vip: 'Special Number',
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
            invoiceProof: 'விலைப்பட்டியல்/க்রய சான்றாக',
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
const vehicleClassToMakes = {
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
    'Test Chemist', 'Truck Driver', 'Tutor', 'Typist', 'Umpire', 'Underwriter', 'Upholsterer', 'Undertaker',
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
    'Voidance Specialist', 'Voider', 'Voidness Specialist', 'Wafer Maker', 'Waiter', 'Waitress',
    'Warden', 'Warehouse Worker', 'Watchmaker', 'Water Treatment Operator', 'Weaver', 'Web Designer',
    'Web Developer', 'Welder', 'Welfare Officer', 'Wholesaler', 'Window Cleaner', 'Woodworker',
    'Worker', 'Writer', 'X-Ray Technician', 'Yoga Instructor', 'Youth Worker', 'Zoologist'
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

        vehicleClass: 'வாகனத்தின் வகை (மோட்டார்சைக்கிள், கார், டிரக், முதலியன).',
        makeOfVehicle: 'வாகனத்தின் உற்பாદক (எ.கா: டொயோட்டா, ஹோண்டா, சுசுகி).',
        modelOfVehicle: 'வாகனத்தின் குறிப்பிட்ட மாதிரி (எ.கா: கரோலா, சிவிக்).',
        yearOfManufacture: 'வாகனம் தயாரிக்கப்பட்ட ஆண்டு.',
        engineNumber: 'ஞ்சின் பிளாக்கில் உள்ள தனிப்பட்ட ஞ்சின் எண்.',
        chassisNumber: 'வாகனத்தின் தனிப்பட்ட சேசி எண் (VIN).',
        colorOfVehicle: 'வாகனத்தின் முதன்மை நிறம்.',
        fuelType: 'வாகனம் பயன்படுத்தும் எரிபொருளின் வகை (பெட்ரோல், டீசல், முதலியன).',
        engineCapacity: 'ஞ்சின் திறன் (cc)',
        numberOfCylinders: 'சிலிண்டர்களின் எண்ணிக்கை',
        importedOrLocal: 'வாகனம் இறக்குமதி செய்யப்பட்டதா அல்லது உள்நாட்டில் தயாரிக்கப்பட்டதா.',
        emissionStandard: 'வாகனம் பூர்த்தி செய்யும் உமிழ்வு தர (யூரோ 2, யூரோ 3, முதலியன).',
        noOfOwners: 'முந்தைய மற்றும் தற்போதைய உரிமையாளர்களின் மொத்த எண்ணிக்கை.',
        nidCopy: 'உங்கள் தேசிய அடையாளத்தின் தெளிவான நகல் (முடிந்தால் இரு பக்கங்களும்).',
        invoiceProof: 'ஆவணம் அல்லது மேலும் ক্রয் சான்றின் பதிப்பு.',
        insuranceDocument: 'வாகனத்திற்கான சரியான காப்பீட்டு ஆவணம்.',
        emissionTest: 'நிர்ணயிக்கப்பட்ட சோதனை மையத்திலிருந்து பெறிய உமிழ்வு சோதனை சான்றிதழ்.',
        inspectionReport: 'DMT அல்லது அனுமதிக்கப்பட்ட ஆய்வு மையத்திலிருந்து வாகன ஆய்வு அறிக்கை.',
    },
};

const FormInputWithInfo = ({
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

    const handleDropdownSelect = (selectedValue) => {
        if (onSuggestionSelect) {
            onSuggestionSelect(selectedValue);
        } else {
            onChange({ target: { name, value: selectedValue } });
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
                            className={`inline-flex items-center justify-center h-4 w-4 rounded-full transition-colors ${isDarkMode ? 'hover:bg-blue-900 text-blue-400' : 'hover:bg-blue-100 text-blue-600'
                                }`}
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            onClick={() => setShowTooltip(!showTooltip)}
                        >
                            <Info className="h-4 w-4" />
                        </button>
                        {showTooltip && (
                            <div
                                className={`absolute left-6 top-0 z-50 w-48 rounded-lg p-2 text-xs shadow-lg transition-opacity ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-white'
                                    }`}
                                style={{ whiteSpace: 'normal' }}
                            >
                                {infoText}
                                <div
                                    className={`absolute top-1 -left-1 h-2 w-2 rotate-45 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-800'
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
                        <div className={`mt-1 w-full rounded border px-3 py-2 transition flex items-center gap-2 cursor-pointer ${isDarkMode
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
                                className={`flex-1 bg-transparent outline-none text-sm ${isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500'
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
                                className={`absolute top-full left-0 right-0 z-40 mt-1 rounded border shadow-lg max-h-64 overflow-y-auto ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
                                    }`}
                            >
                                {filteredAndSortedOptions.length > 0 ? (
                                    filteredAndSortedOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleDropdownSelect(option)}
                                            className={`block w-full text-left px-3 py-2 text-sm hover:bg-blue-500 hover:text-white transition ${value === option ? (isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100') : ''
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
                        className={`mt-1 w-full rounded border px-3 py-2 transition ${isDarkMode
                            ? `bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${error ? 'border-red-500' : ''}`
                            : `bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 ${error ? 'border-red-500' : ''}`
                            }`}
                    />
                )}
                {hasAutocomplete && (
                    <div
                        className={`absolute top-full left-0 right-0 z-40 mt-1 rounded border shadow-lg ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
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
                                className={`block w-full text-left px-3 py-2 text-sm hover:bg-blue-500 hover:text-white transition ${index === 0 ? 'rounded-t' : ''
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

export const RegisterVehicle = () => {
    const { language, isDarkMode } = useStore();
    const { showToast } = useToast();
    console.log('RegisterVehicle component rendered');
    const [showLandingScreen, setShowLandingScreen] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const [formData, setFormData] = useState({
        ownerName: '',
        nationalIdNo: '',
        dateOfBirth: '',
        permanentAddress: '',
        phoneNumber: '',
        emailAddress: '',
        occupation: '',

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
        vipRequested: false,
        vipNumber: '',
        vehicleImage: null,
    });

    const [documents, setDocuments] = useState({
        nidCopy: null,
        invoiceProof: null,
        insuranceDocument: null,
        emissionTest: null,
        inspectionReport: null,
    });

    const [vehicleMakes, setVehicleMakes] = useState([]);
    const [vehicleModels, setVehicleModels] = useState([]);
    const [vehicleImagePreview, setVehicleImagePreview] = useState('');
    const [imageVerificationStatus, setImageVerificationStatus] = useState(null); // 'pending' | 'verified' | 'failed' | null
    const [verifyingImage, setVerifyingImage] = useState(false);
    // Special number availability state
    const [vipAvailability, setVipAvailability] = useState(null);
    const [checkingVip, setCheckingVip] = useState(false);
    // Success screen state
    const [showSuccessScreen, setShowSuccessScreen] = useState(false);
    const [submittedApplication, setSubmittedApplication] = useState(null);
    const [currentOngoingNumber, setCurrentOngoingNumber] = useState('CBS'); // Current ongoing vehicle number prefix

    // Fee preview (client-side; backend authoritative on submit)
    const baseFees = {
        Motorcycle: 1500,
        'Auto Rickshaw': 2000,
        Car: 5000,
        Van: 4000,
        Bus: 6000,
        Truck: 7000,
        Lorry: 6500,
        Tractor: 3000,
    };

    const calculateVipFee = (requestedNumber) => {
        if (!requestedNumber) return 0;

        // Extract letters from requested number (e.g., "CBT-1234" -> "CBT")
        const match = requestedNumber.match(/^([A-Z]+)/);
        if (!match) return 0;

        const requestedLetters = match[1];
        const currentLetters = currentOngoingNumber;

        // Calculate letter increment cost (10,000 LKR per letter increment)
        let letterIncrementCost = 0;
        const currentValue = lettersToNumber(currentLetters);
        const requestedValue = lettersToNumber(requestedLetters);
        const letterDiff = requestedValue - currentValue;

        if (letterDiff > 0) {
            letterIncrementCost = letterDiff * 10000;
        }

        // Check for special digit patterns with different pricing
        const digitMatch = requestedNumber.match(/-?(\d{4})$/);
        let specialDigitCost = 0;

        if (digitMatch) {
            const digits = digitMatch[1];
            const d1 = parseInt(digits[0]);
            const d2 = parseInt(digits[1]);
            const d3 = parseInt(digits[2]);
            const d4 = parseInt(digits[3]);

            // 1. Same digits (0000, 1111, 2222, etc.) - Most expensive
            if (d1 === d2 && d2 === d3 && d3 === d4) {
                specialDigitCost = 400000;
            }
            // 2. Sequential ascending (1234, 2345, 3456, etc.)
            else if (d2 === d1 + 1 && d3 === d2 + 1 && d4 === d3 + 1) {
                specialDigitCost = 275000;
            }
            // 3. Sequential descending (4321, 5432, 6543, etc.)
            else if (d2 === d1 - 1 && d3 === d2 - 1 && d4 === d3 - 1) {
                specialDigitCost = 275000;
            }
            // 4. Double pairs (1122, 2233, 3344, etc.)
            else if (d1 === d2 && d3 === d4 && d1 !== d3) {
                specialDigitCost = 200000;
            }
            // 5. Palindromes (1221, 1331, 2112, etc.)
            else if (d1 === d4 && d2 === d3 && d1 !== d2) {
                specialDigitCost = 150000;
            }
            // 6. Mirror pairs (1001, 2002, 3003, etc.)
            else if (d1 === d4 && d2 === 0 && d3 === 0) {
                specialDigitCost = 115000;
            }
            // 7. Repeating pairs (1212, 2323, 3434, etc.)
            else if (d1 === d3 && d2 === d4 && d1 !== d2) {
                specialDigitCost = 75000;
            }
            // 8. Three same digits (1112, 2223, 3334, etc.)
            else if ((d1 === d2 && d2 === d3) || (d2 === d3 && d3 === d4)) {
                specialDigitCost = 50000;
            }
        }

        return letterIncrementCost + specialDigitCost;
    };

    // Helper function to convert letters to numeric value (A=1, B=2, ..., Z=26)
    const lettersToNumber = (letters) => {
        let value = 0;
        for (let i = 0; i < letters.length; i++) {
            value = value * 26 + (letters.charCodeAt(i) - 64); // A=1, B=2, etc.
        }
        return value;
    };

    const calculateTotalPrice = () => {
        const base = baseFees[formData.vehicleClass] || 0;
        const vip = formData.vipRequested && formData.vipNumber ? calculateVipFee(formData.vipNumber) : 0;
        return base + vip;
    };

    const checkVipAvailability = async () => {
        const desired = (formData.vipNumber || '').trim().toUpperCase();
        if (!desired) {
            setVipAvailability(null);
            return;
        }

        // Validate format based on current ongoing number length
        const expectedLength = currentOngoingNumber.length;
        const formatRegex = expectedLength === 2
            ? /^([A-Z]{2})-(\d{4})$/
            : /^([A-Z]{3})-(\d{4})$/;

        if (!formatRegex.test(desired)) {
            const format = expectedLength === 2 ? 'AB-1234 (2 letters, dash, 4 digits)' : 'ABC-1234 (3 letters, dash, 4 digits)';
            showToast('error', `Invalid format. Use format: ${format}`);
            setVipAvailability(null);
            return;
        }

        const match = desired.match(formatRegex);
        if (!match) {
            setVipAvailability(null);
            return;
        }

        const [currentSeries, currentNumStr] = currentOngoingNumber.split('-');
        const currentNum = parseInt(currentNumStr, 10);

        const requestedValue = lettersToNumber(requestedLetters);
        const currentValue = lettersToNumber(currentSeries);

        // Validation Logic for "Onward"
        let isFuture = false;

        if (requestedValue > currentValue) {
            isFuture = true; // Later series (e.g. CBV > CBU)
        } else if (requestedValue === currentValue) {
            const requestedNum = parseInt(match[2], 10);
            if (requestedNum > currentNum) {
                isFuture = true; // Same series, higher number (e.g. 3920 > 3919)
            }
        }

        if (!isFuture) {
            showToast('error', `Number must be after the current ongoing number (${currentOngoingNumber}).`);
            setVipAvailability(null);
            return;
        }

        try {
            setCheckingVip(true);
            const resp = await axios.get(`http://localhost:5000/api/vehicles/check-number/${encodeURIComponent(desired)}`);
            setVipAvailability({ available: resp.data.available, number: desired });
            if (resp.data.available) {
                showToast('success', `Number ${desired} is available!`);
            } else {
                showToast('error', `Number ${desired} is already taken.`);
            }
        } catch (e) {
            showToast('error', 'Failed to check availability. Please try again.');
            setVipAvailability(null);
        } finally {
            setCheckingVip(false);
        }
    };

    const [occupationSuggestions, setOccupationSuggestions] = useState([]);
    const [showOccupationDropdown, setShowOccupationDropdown] = useState(false);

    useEffect(() => {
        fetchVehicleMakes();
        fetchCurrentOngoingNumber();
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

    // State to hold all ongoing numbers from backend
    const [ongoingNumbersList, setOngoingNumbersList] = useState([]);

    // Update ongoing number when vehicle class changes
    useEffect(() => {
        if (formData.vehicleClass && ongoingNumbersList.length > 0) {
            updateCurrentOngoingForClass(formData.vehicleClass);
        }
    }, [formData.vehicleClass, ongoingNumbersList]);

    const updateCurrentOngoingForClass = (vClass) => {
        let category = 'Car'; // default
        if (['Motorcycle', 'Motor Cycle'].includes(vClass)) category = 'Motor Cycle';
        else if (['Auto Rickshaw', 'Three Wheeler'].includes(vClass)) category = 'Three Wheeler';
        else if (['Van', 'Dual Purpose', 'Truck', 'Lorry'].includes(vClass)) category = 'Dual Purpose';
        else if (['Lorry Trailer', 'Bowser'].includes(vClass)) category = 'Lorry Trailer/Bowser';
        else if (vClass === 'Car') category = 'Car';

        const found = ongoingNumbersList.find(n => n.category === category);
        if (found) {
            setCurrentOngoingNumber(found.lastIssued || `${found.series}-${String(found.lastNumber).padStart(4, '0')}`);
        } else {
            setCurrentOngoingNumber('CBU-3919'); // Fallback
        }
    };

    const fetchCurrentOngoingNumber = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/applications/ongoing-numbers');
            if (response.data && Array.isArray(response.data)) {
                setOngoingNumbersList(response.data);
            }
        } catch (error) {
            console.error('Error fetching ongoing numbers:', error);
        }
    };

    // Helper to get special digit pattern description and cost
    const getSpecialDigitPattern = (digits) => {
        if (!digits || digits.length !== 4) return null;

        const d1 = parseInt(digits[0]);
        const d2 = parseInt(digits[1]);
        const d3 = parseInt(digits[2]);
        const d4 = parseInt(digits[3]);

        if (d1 === d2 && d2 === d3 && d3 === d4) {
            return { name: 'Same digits', cost: 400000 };
        }
        if (d2 === d1 + 1 && d3 === d2 + 1 && d4 === d3 + 1) {
            return { name: 'Sequential ascending', cost: 275000 };
        }
        if (d2 === d1 - 1 && d3 === d2 - 1 && d4 === d3 - 1) {
            return { name: 'Sequential descending', cost: 275000 };
        }
        if (d1 === d2 && d3 === d4 && d1 !== d3) {
            return { name: 'Double pairs', cost: 200000 };
        }
        if (d1 === d4 && d2 === d3 && d1 !== d2) {
            return { name: 'Palindrome', cost: 150000 };
        }
        if (d1 === d4 && d2 === 0 && d3 === 0) {
            return { name: 'Mirror pairs', cost: 115000 };
        }
        if (d1 === d3 && d2 === d4 && d1 !== d2) {
            return { name: 'Repeating pairs', cost: 75000 };
        }
        if ((d1 === d2 && d2 === d3) || (d2 === d3 && d3 === d4)) {
            return { name: 'Three same digits', cost: 50000 };
        }
        return null;
    };

    const ownerFields = ['ownerName', 'nationalIdNo', 'dateOfBirth', 'permanentAddress', 'phoneNumber', 'emailAddress', 'occupation'];
    const vehicleFields = ['vehicleClass', 'makeOfVehicle', 'modelOfVehicle', 'yearOfManufacture', 'engineNumber', 'chassisNumber', 'colorOfVehicle', 'fuelType', 'engineCapacity', 'numberOfCylinders', 'importedOrLocal', 'emissionStandard', 'noOfOwners'];

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

    const fetchVehicleModels = async (make) => {
        try {
            const response = await axios.get(`http://localhost:5000/api/vehicle-makes/models/${make}`);
            setVehicleModels(response.data);
            setFormData(prev => ({ ...prev, modelOfVehicle: '' }));
        } catch (error) {
            console.error('Error fetching vehicle models:', error);
            setVehicleModels([]);
        }
    };

    const handleOccupationChange = (value) => {
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

    const handleMakeChange = (make) => {
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

    const handleModelChange = (model) => {
        setFormData({ ...formData, modelOfVehicle: model });
        if (validationErrors['modelOfVehicle']) {
            setValidationErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors['modelOfVehicle'];
                return newErrors;
            });
        }
    };

    const handleVehicleClassChange = (vehicleClass) => {
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

    const handleVehicleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
            showToast('error', 'Please upload a JPEG or PNG image');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showToast('error', 'Image size must be less than 10MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setVehicleImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        // Update form data
        setFormData({ ...formData, vehicleImage: file });

        // Verify image using AI
        await verifyVehicleImage(file);
    };

    const verifyVehicleImage = async (file) => {
        try {
            setVerifyingImage(true);
            setImageVerificationStatus('pending');

            const formDataToSend = new FormData();
            formDataToSend.append('image', file);

            const response = await axios.post(
                'http://localhost:5000/api/image-verification/verify-vehicle',
                formDataToSend,
                {
                    timeout: 60000, // 60 second timeout
                }
            );

            if (response.data.success === false) {
                setImageVerificationStatus('failed');
                const errorMsg = response.data.error || 'Image verification failed';
                showToast('error', errorMsg);
                return;
            }

            if (response.data.verified) {
                setImageVerificationStatus('verified');
                showToast('success', 'Vehicle image verified successfully!');
            } else {
                setImageVerificationStatus('failed');
                const feedback = response.data.analysis?.feedback || 'Please ensure the image is a clear front view of your vehicle.';
                showToast('error', feedback);
            }
        } catch (error) {
            console.error('Image verification error:', error.message, error.response?.data);
            setImageVerificationStatus('failed');

            let errorMessage = 'Failed to verify image. Please try again.';
            if (error.response?.data?.error) {
                errorMessage = error.response.data.error;
            } else if (error.code === 'ECONNABORTED') {
                errorMessage = 'Image verification timed out. Please try a smaller image.';
            } else if (error.message) {
                errorMessage = error.message;
            }

            showToast('error', errorMessage);
        } finally {
            setVerifyingImage(false);
        }
    };

    const handleInputChange = (e) => {
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
                vipRequested: false,
                vipNumber: '',
                vehicleImage: null,
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

    const handleFileChange = (e, type) => {
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

    const validateStep1 = () => {
        const errors = {};

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

    const validateStep2 = () => {
        const errors = {};


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

    const validateStep3 = () => {
        const errors = {};

        if (!formData.vehicleImage) errors.vehicleImage = 'Vehicle image is required';
        if (imageVerificationStatus !== 'verified') errors.vehicleImage = 'Vehicle image must be verified';

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateStep4 = () => {
        const errors = {};

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
        } else if (currentStep === 4 && validateStep4()) {
            setCurrentStep(5);
        } else if (currentStep === 5) {
            // VIP step does not require validation here; availability is enforced via button disabled
            setCurrentStep(6);
        }
    };

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateStep1() || !validateStep2() || !validateStep3() || !validateStep4()) {
            showToast('error', 'Please complete all required fields');
            return;
        }

        setIsSubmitting(true);

        try {
            const documentsBase64 = {};

            for (const [key, file] of Object.entries(documents)) {
                if (file) {
                    documentsBase64[key] = await convertFileToBase64(file);
                }
            }

            // Convert vehicle image to base64
            let vehicleImageBase64 = null;
            if (formData.vehicleImage) {
                vehicleImageBase64 = await convertFileToBase64(formData.vehicleImage);
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
                vehicleImage: vehicleImageBase64,
                vipRequested: !!formData.vipRequested,
                vipNumber: formData.vipNumber || null,
            };

            const response = await axios.post('http://localhost:5000/api/applications/submit', applicationData);

            if (response.status === 201) {
                const app = response.data.application;

                // Store application data for success screen
                setSubmittedApplication(app);
                setShowSuccessScreen(true);

                showToast('success', 'Application submitted successfully!');
            }
        } catch (error) {
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
            {/* Success Screen */}
            {showSuccessScreen && submittedApplication && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="mb-6">
                        <CheckCircle className="mx-auto h-24 w-24 text-green-500" />
                    </div>
                    <h1 className="mb-4 text-3xl font-bold text-green-600">Application Submitted Successfully!</h1>

                    <div className={`w-full max-w-2xl rounded-lg border-2 p-6 text-left ${isDarkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                        <h2 className="mb-4 text-xl font-semibold">Application Summary</h2>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Application ID:</p>
                                    <p className="font-semibold">{submittedApplication._id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status:</p>
                                    <p className="font-semibold text-yellow-600">{submittedApplication.status}</p>
                                </div>
                            </div>

                            <div className="border-t pt-3">
                                <p className="text-sm text-gray-500">Owner Name:</p>
                                <p className="font-semibold">{submittedApplication.ownerName}</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Vehicle:</p>
                                <p className="font-semibold">{submittedApplication.makeOfVehicle} {submittedApplication.modelOfVehicle} ({submittedApplication.yearOfManufacture})</p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">Requested Vehicle Number:</p>
                                <p className="font-bold text-xl text-red-600">
                                    {submittedApplication.vipRequested && submittedApplication.vipNumber
                                        ? submittedApplication.vipNumber
                                        : 'Will be assigned after approval'}
                                </p>
                            </div>

                            <div className="border-t pt-3">
                                <h3 className="mb-2 font-semibold text-lg">Payment Information</h3>
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 rounded p-4">
                                    <p className="text-sm text-gray-500">Payment Amount:</p>
                                    <p className="font-bold text-2xl text-green-600">LKR {submittedApplication.paymentAmount?.toLocaleString()}</p>

                                    <p className="text-sm text-gray-500 mt-3">Payment Reference:</p>
                                    <p className="font-mono font-bold text-lg">{submittedApplication.paymentReference}</p>

                                    <p className="text-sm mt-3 text-gray-600 dark:text-gray-300">
                                        Please visit your nearest Post Office and make the payment using the reference number above.
                                    </p>
                                </div>
                            </div>

                            {submittedApplication.vipRequested && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-300 rounded p-3">
                                    <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                        ✨ Special Number Requested: {submittedApplication.vipNumber}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                        Special Number fee of LKR {submittedApplication.vipFee?.toLocaleString()} included in total amount.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={() => {
                                setShowSuccessScreen(false);
                                setSubmittedApplication(null);
                                setFormData({
                                    ownerName: '',
                                    nationalIdNo: '',
                                    dateOfBirth: '',
                                    permanentAddress: '',
                                    phoneNumber: '',
                                    emailAddress: localStorage.getItem('userEmail') || '',
                                    occupation: '',
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
                                setShowLandingScreen(true);
                            }}
                            className="rounded-lg bg-red-600 px-8 py-3 text-white font-semibold hover:bg-red-700 transition"
                        >
                            Register Another Vehicle
                        </button>

                        <button
                            onClick={() => window.location.href = '/status'}
                            className="rounded-lg bg-gray-600 px-8 py-3 text-white font-semibold hover:bg-gray-700 transition"
                        >
                            View Application Status
                        </button>
                    </div>
                </div>
            )}

            {/* Landing Screen */}
            {!showSuccessScreen && showLandingScreen && (
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
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold">{translations[language].title}</h1>
                        <SupportButton
                            context={{
                                type: 'registration',
                                reference: `Step ${currentStep}`,
                                title: 'Vehicle Registration'
                            }}
                            variant="outline"
                            label="Get Help"
                        />
                    </div>

                    <div className="mb-8 flex justify-between">
                        {[1, 2, 3, 4, 5, 6].map((step) => (
                            <div
                                key={step}
                                className={`flex items-center ${step < currentStep
                                    ? 'text-green-500'
                                    : step === currentStep
                                        ? 'text-red-500'
                                        : 'text-gray-400'
                                    }`}
                            >
                                <div
                                    className={`flex h-8 w-8 items-center justify-center rounded-full ${step <= currentStep ? 'bg-current' : 'bg-gray-200'
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
                                                ? translations[language].steps.image
                                                : step === 4
                                                    ? translations[language].steps.documents
                                                    : step === 5
                                                        ? translations[language].steps.vip
                                                        : translations[language].steps.confirm}
                                </span>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit}>
                        {currentStep === 1 && (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {ownerFields.map((field) => (
                                    field === 'occupation' ? (
                                        <FormInputWithInfo
                                            key={field}
                                            label={translations[language].form[field]}
                                            name={field}
                                            type="text"
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            onCustomChange={handleOccupationChange}
                                            error={validationErrors[field]}
                                            isDarkMode={isDarkMode}
                                            infoText={fieldInfo[language][field]}
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
                                            label={translations[language].form[field]}
                                            name={field}
                                            type={field === 'dateOfBirth' ? 'date' : field === 'emailAddress' ? 'email' : 'text'}
                                            value={formData[field]}
                                            onChange={handleInputChange}
                                            error={validationErrors[field]}
                                            isDarkMode={isDarkMode}
                                            infoText={fieldInfo[language][field]}
                                        />
                                    )
                                ))}
                            </div>
                        )}

                        {currentStep === 5 && (
                            <div className="space-y-4">
                                <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={!!formData.vipRequested}
                                            onChange={(e) => setFormData({ ...formData, vipRequested: e.target.checked })}
                                        />
                                        <span className="font-medium">Request VIP Registration Number</span>
                                    </label>
                                    {formData.vipRequested && (
                                        <>
                                            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded">
                                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                                    ℹ️ <strong>Current ongoing number:</strong> {currentOngoingNumber}-XXXX
                                                </p>
                                                <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                                                    You can only request {currentOngoingNumber} or later letters. Format: {currentOngoingNumber.length === 2 ? 'AB-1234 (2 letters)' : 'ABC-1234 (3 letters)'}
                                                </p>
                                                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                                                    <p className="font-semibold">Special Digit Patterns:</p>
                                                    <ul className="list-disc list-inside mt-1 space-y-0.5">
                                                        <li>Same digits (1111): LKR 400,000</li>
                                                        <li>Sequential (1234/4321): LKR 275,000</li>
                                                        <li>Double pairs (1122): LKR 200,000</li>
                                                        <li>Palindrome (1221): LKR 150,000</li>
                                                        <li>Repeating (1212): LKR 75,000</li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
                                                <div className="md:col-span-1">
                                                    <input
                                                        type="text"
                                                        className={`w-full rounded border px-3 py-2 ${isDarkMode ? 'bg-gray-800 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                                                        placeholder={`${currentOngoingNumber}-1234`}
                                                        value={formData.vipNumber || ''}
                                                        onChange={(e) => {
                                                            setFormData({ ...formData, vipNumber: e.target.value.toUpperCase() });
                                                            setVipAvailability(null);
                                                        }}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setFormData({ ...formData, vipNumber: `${currentOngoingNumber}-` });
                                                            setVipAvailability(null);
                                                        }}
                                                        className="mt-1 w-full text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400"
                                                    >
                                                        📝 Load Current Prefix
                                                    </button>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={checkVipAvailability}
                                                    className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                                                    disabled={checkingVip}
                                                >
                                                    {checkingVip ? 'Checking...' : 'Check Availability'}
                                                </button>
                                                <div className="md:col-span-2 flex items-center">
                                                    {vipAvailability && (
                                                        <span className={`inline-flex items-center rounded px-3 py-1 text-sm ${vipAvailability.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {vipAvailability.available ? '✓ Available' : '✗ Taken'}
                                                        </span>
                                                    )}
                                                    {formData.vipNumber && (() => {
                                                        const digitMatch = formData.vipNumber.match(/-?(\d{4})$/);
                                                        if (digitMatch) {
                                                            const pattern = getSpecialDigitPattern(digitMatch[1]);
                                                            if (pattern) {
                                                                return (
                                                                    <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                                                                        🌟 {pattern.name}
                                                                    </span>
                                                                );
                                                            }
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className={`rounded-lg p-4 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                                    <h4 className="mb-2 font-semibold">Fee Preview</h4>
                                    <p>Base fee: LKR {baseFees[formData.vehicleClass] || 0}</p>
                                    <p>VIP fee: LKR {formData.vipRequested && formData.vipNumber ? calculateVipFee(formData.vipNumber) : 0}</p>
                                    <p className="font-bold">Total: LKR {calculateTotalPrice()}</p>
                                    <p className="mt-2 text-sm text-gray-500">Final amount and reference are confirmed on submission.</p>
                                    {formData.vipRequested && formData.vipNumber && (() => {
                                        const match = formData.vipNumber.match(/^([A-Z]+)/);
                                        const digitMatch = formData.vipNumber.match(/-?(\d{4})$/);
                                        const pattern = digitMatch ? getSpecialDigitPattern(digitMatch[1]) : null;

                                        if (match) {
                                            const requestedLetters = match[1];
                                            const currentValue = lettersToNumber(currentOngoingNumber);
                                            const requestedValue = lettersToNumber(requestedLetters);
                                            const letterDiff = requestedValue - currentValue;

                                            if (letterDiff > 0 || pattern) {
                                                return (
                                                    <div className="mt-3 text-sm">
                                                        <p className="text-gray-600 dark:text-gray-400 font-semibold">VIP Fee Breakdown:</p>
                                                        <ul className="list-disc list-inside mt-1 text-xs text-gray-500 space-y-1">
                                                            {letterDiff > 0 && <li>Letter increment ({letterDiff} letters × LKR 10,000): LKR {(letterDiff * 10000).toLocaleString()}</li>}
                                                            {pattern && <li>Special pattern "{pattern.name}" ({digitMatch?.[1]}): LKR {pattern.cost.toLocaleString()}</li>}
                                                        </ul>
                                                    </div>
                                                );
                                            }
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>
                        )}

                        {currentStep === 2 && (
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                {vehicleFields.map((field) => {
                                    // Get filtered makes based on vehicle class
                                    const filteredMakesForClass = formData.vehicleClass
                                        ? vehicleClassToMakes[formData.vehicleClass] || []
                                        : vehicleMakes;

                                    return (
                                        field === 'vehicleClass' ? (
                                            <FormInputWithInfo
                                                key={field}
                                                label={translations[language].form[field]}
                                                name={field}
                                                type="text"
                                                value={formData[field]}
                                                onChange={handleInputChange}
                                                error={validationErrors[field]}
                                                isDarkMode={isDarkMode}
                                                infoText={fieldInfo[language][field]}
                                                options={vehicleClasses}
                                                onSuggestionSelect={handleVehicleClassChange}
                                            />
                                        ) : field === 'makeOfVehicle' ? (
                                            <FormInputWithInfo
                                                key={field}
                                                label={translations[language].form[field]}
                                                name={field}
                                                type="text"
                                                value={formData[field]}
                                                onChange={handleInputChange}
                                                error={validationErrors[field]}
                                                isDarkMode={isDarkMode}
                                                infoText={fieldInfo[language][field]}
                                                options={filteredMakesForClass.sort((a, b) => a.localeCompare(b))}
                                                onSuggestionSelect={handleMakeChange}
                                            />
                                        ) : field === 'modelOfVehicle' ? (
                                            <FormInputWithInfo
                                                key={field}
                                                label={translations[language].form[field]}
                                                name={field}
                                                type="text"
                                                value={formData[field]}
                                                onChange={handleInputChange}
                                                error={validationErrors[field]}
                                                isDarkMode={isDarkMode}
                                                infoText={fieldInfo[language][field]}
                                                options={vehicleModels.sort((a, b) => a.localeCompare(b))}
                                                onSuggestionSelect={handleModelChange}
                                            />
                                        ) : field === 'emissionStandard' ? (
                                            <FormInputWithInfo
                                                key={field}
                                                label={translations[language].form[field]}
                                                name={field}
                                                type="text"
                                                value={formData[field]}
                                                onChange={handleInputChange}
                                                error={validationErrors[field]}
                                                isDarkMode={isDarkMode}
                                                infoText={fieldInfo[language][field]}
                                                options={emissionStandardList}
                                            />
                                        ) : (
                                            <FormInputWithInfo
                                                key={field}
                                                label={translations[language].form[field]}
                                                name={field}
                                                type={['yearOfManufacture', 'numberOfCylinders', 'noOfOwners', 'engineCapacity'].includes(field) ? 'number' : 'text'}
                                                value={formData[field]}
                                                onChange={handleInputChange}
                                                error={validationErrors[field]}
                                                isDarkMode={isDarkMode}
                                                infoText={fieldInfo[language][field]}
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
                            <div className="p-6 rounded-lg border-2 border-dashed" style={{
                                borderColor: imageVerificationStatus === 'verified' ? '#10b981' : imageVerificationStatus === 'failed' ? '#ef4444' : isDarkMode ? '#4b5563' : '#d1d5db'
                            }}>
                                <div className="mb-6">
                                    <label className="block text-lg font-semibold mb-2 flex items-center gap-2">
                                        <Car className="w-5 h-5 text-red-500" />
                                        Vehicle Front Image <span className="text-red-500">*</span>
                                    </label>
                                    <p className="text-sm text-gray-500">Upload a clear front view photo of your vehicle for AI verification.</p>
                                </div>

                                <div className="space-y-4">
                                    {vehicleImagePreview ? (
                                        <div className="relative inline-block">
                                            <img src={vehicleImagePreview} alt="Vehicle preview" className="h-48 w-auto rounded-lg object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setVehicleImagePreview('');
                                                    setFormData({ ...formData, vehicleImage: null });
                                                    setImageVerificationStatus(null);
                                                }}
                                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors hover:bg-opacity-50" style={{
                                            borderColor: isDarkMode ? '#4b5563' : '#d1d5db',
                                            backgroundColor: isDarkMode ? 'rgba(75, 85, 99, 0.1)' : 'rgba(209, 213, 219, 0.1)'
                                        }}>
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleVehicleImageChange}
                                                accept="image/jpeg,image/png,image/jpg"
                                            />
                                            <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                            <span className="text-base font-medium">Click to upload or drag image</span>
                                            <span className="text-sm text-gray-500 mt-2">PNG, JPG (max 10MB)</span>
                                        </label>
                                    )}

                                    {verifyingImage && (
                                        <div className="flex items-center justify-center py-6">
                                            <div className="w-6 h-6 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin mr-3" />
                                            <span className="text-base">Analyzing image with AI...</span>
                                        </div>
                                    )}

                                    {imageVerificationStatus === 'verified' && (
                                        <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#d1fae5', border: '1px solid #6ee7b7' }}>
                                            <Check className="w-6 h-6 text-green-600 flex-shrink-0" />
                                            <span className="text-base text-green-700 font-medium">Image verified successfully!</span>
                                        </div>
                                    )}

                                    {imageVerificationStatus === 'failed' && (
                                        <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5' }}>
                                            <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                            <span className="text-base text-red-700 font-medium">Please upload a clear front view of your vehicle</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {currentStep === 4 && (
                            <div className="space-y-6">
                                {['nidCopy', 'invoiceProof', 'insuranceDocument', 'emissionTest', 'inspectionReport'].map((docType) => (
                                    <div key={docType}>
                                        <div className="mb-2 flex items-center gap-2">
                                            <label className="text-sm font-medium">
                                                {translations[language].documents[docType]}
                                            </label>
                                            <div className="relative group">
                                                <button
                                                    type="button"
                                                    className={`inline-flex items-center justify-center h-4 w-4 rounded-full transition-colors ${isDarkMode ? 'hover:bg-blue-900 text-blue-400' : 'hover:bg-blue-100 text-blue-600'
                                                        }`}
                                                    onMouseEnter={(e) => e.currentTarget.nextElementSibling?.classList.add('block')}
                                                    onMouseLeave={(e) => e.currentTarget.nextElementSibling?.classList.remove('block')}
                                                    onClick={(e) => {
                                                        const tooltip = e.currentTarget.nextElementSibling;
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
                                                    className={`hidden absolute left-6 top-0 z-50 w-48 rounded-lg p-2 text-xs shadow-lg ${isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-800 text-white'
                                                        }`}
                                                    style={{ whiteSpace: 'normal' }}
                                                >
                                                    {fieldInfo[language][docType]}
                                                    <div
                                                        className={`absolute top-1 -left-1 h-2 w-2 rotate-45 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-800'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div
                                            className={`rounded-lg border-2 border-dashed p-4 ${validationErrors[docType] ? 'border-red-500' : isDarkMode ? 'border-gray-600' : 'border-gray-300'
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
                                                    <Upload className={`mx-auto h-12 w-12 ${documents[docType] ? 'text-green-500' : 'text-gray-400'}`} />
                                                    <p className="mt-2 text-sm">
                                                        {documents[docType]
                                                            ? documents[docType].name
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

                        {currentStep === 6 && (
                            <div className={`rounded-lg border p-6 ${isDarkMode ? 'border-gray-700 bg-gray-750' : 'border-gray-200 bg-yellow-50'}`}>
                                <div className={`mb-4 p-4 rounded-lg ${isDarkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                                    <div className="flex gap-2">
                                        <AlertCircle className={`h-5 w-5 flex-shrink-0 ${isDarkMode ? 'text-red-400' : 'text-red-600'}`} />
                                        <div>
                                            <p className={`font-semibold ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>Important: Please Review Before Submission</p>
                                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
                                                Click "Submit Application" only when you are ready to submit. You can cancel this application after submission if needed.
                                            </p>
                                        </div>
                                    </div>
                                </div>
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
                                        <p>Registration No: {formData.vipRequested && formData.vipNumber ? (
                                            <span className="inline-flex items-center gap-2">
                                                {formData.vipNumber}
                                                <span className="px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-full">VIP</span>
                                            </span>
                                        ) : 'Auto-assigned after approval'}</p>
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
                                                    <span>{translations[language].documents[key]}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6 border-t pt-4">
                                    <h4 className="mb-2 font-semibold">Payment Summary</h4>
                                    <p>Base fee: LKR {baseFees[formData.vehicleClass] || 0}</p>
                                    <p>VIP fee: LKR {formData.vipRequested && formData.vipNumber ? calculateVipFee(formData.vipNumber) : 0}</p>
                                    <p className="font-bold">Total: LKR {calculateTotalPrice()}</p>
                                    {formData.vipRequested && formData.vipNumber && (() => {
                                        const match = formData.vipNumber.match(/^([A-Z]+)/);
                                        const digitMatch = formData.vipNumber.match(/-?(\d{4})$/);
                                        const pattern = digitMatch ? getSpecialDigitPattern(digitMatch[1]) : null;

                                        if (match) {
                                            const requestedLetters = match[1];
                                            const currentValue = lettersToNumber(currentOngoingNumber);
                                            const requestedValue = lettersToNumber(requestedLetters);
                                            const letterDiff = requestedValue - currentValue;

                                            if (letterDiff > 0 || pattern) {
                                                return (
                                                    <div className="mt-3 text-sm">
                                                        <p className="text-gray-600 dark:text-gray-400 font-semibold">VIP Fee Breakdown:</p>
                                                        <ul className="list-disc list-inside mt-1 text-xs text-gray-500 space-y-1">
                                                            {letterDiff > 0 && <li>Letter increment ({letterDiff} letters × LKR 10,000): LKR {(letterDiff * 10000).toLocaleString()}</li>}
                                                            {pattern && <li>Special pattern "{pattern.name}" ({digitMatch?.[1]}): LKR {pattern.cost.toLocaleString()}</li>}
                                                        </ul>
                                                    </div>
                                                );
                                            }
                                        }
                                        return null;
                                    })()}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-between">
                            {currentStep > 1 && (
                                <button
                                    type="button"
                                    onClick={() => setCurrentStep(currentStep - 1)}
                                    disabled={isSubmitting}
                                    className={`rounded-lg px-4 py-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                        } ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'
                                        }`}
                                >
                                    {language === 'en' ? 'Previous' : language === 'si' ? 'පෙර' : 'முந்தைய'}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleClearForm}
                                disabled={isSubmitting}
                                className={`rounded-lg px-4 py-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                    } ${isDarkMode
                                        ? 'bg-yellow-700 hover:bg-yellow-600'
                                        : 'bg-yellow-200 hover:bg-yellow-300'
                                    }`}
                            >
                                {language === 'en' && 'Clear Form'}
                                {language === 'si' && 'පෝරමය සවිස්තර කරන්න'}
                                {language === 'ta' && 'ஃபாம்ப் அழிக்கவும்'}
                            </button>
                            {currentStep < 5 ? (
                                <button
                                    type="button"
                                    onClick={handleNextStep}
                                    disabled={
                                        isSubmitting || (currentStep === 5 && !!formData.vipRequested && !!vipAvailability && vipAvailability.available === false)
                                    }
                                    className={`ml-auto rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {translations[language].buttons.next}
                                </button>
                            ) : (
                                <div className="ml-auto flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const confirm = window.confirm('Are you sure you want to cancel? Your form data will be saved.');
                                            if (confirm) {
                                                setShowLandingScreen(true);
                                            }
                                        }}
                                        disabled={isSubmitting}
                                        className={`rounded-lg px-4 py-2 text-white font-medium transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed bg-gray-600' : 'bg-red-500 hover:bg-red-600'
                                            }`}
                                    >
                                        {language === 'en' ? 'Cancel' : language === 'si' ? 'අවලංගු කරන්න' : 'ரத்து செய்'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={`rounded-lg px-6 py-2 text-white font-medium transition-all bg-green-600 hover:bg-green-700 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        {isSubmitting ? 'Submitting...' : (language === 'en' ? 'Submit Application' : language === 'si' ? 'අයදුම්පත යොමු කරන්න' : 'விண்ணப்பத்தை சமர්ப்பிக்கவும්')}
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </>
            )}
        </div>
    );
};
