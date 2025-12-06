import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Upload, AlertCircle, Check, Info } from 'lucide-react';

const translations = {
  en: {
    title: 'Register New Vehicle',
    steps: {
      vehicle: 'Vehicle Details',
      documents: 'Upload Documents',
      confirm: 'Confirmation',
    },
    form: {
      fullName: 'Full Name',
      nid: 'National ID / Passport No.',
      phone: 'Phone Number',
      email: 'Email Address',
      address: 'Residential Address',
      regNumber: 'Vehicle Registration Number',
      vehicleType: 'Vehicle Type',
      chassisNumber: 'Chassis Number',
      engineNumber: 'Engine Number',
      makeModel: 'Vehicle Make & Model',
      fuelType: 'Fuel Type',
      year: 'Year of Manufacture',
      owners: 'Number of Previous Owners',
      ownershipType: 'Ownership Type',
    },
    documents: {
      nid: 'National ID / Passport Copy',
      invoice: 'Vehicle Invoice / Purchase Receipt',
      insurance: 'Vehicle Insurance Document',
      emission: 'Emission Test Certificate',
      approval: 'DMT Approval Letter (If applicable)',
    },
    buttons: {
      next: 'Next Step',
      previous: 'Previous',
      submit: 'Submit Application',
    },
  },
  si: {
    title: 'නව වාහනයක් ලියාපදිංචි කරන්න',
    steps: {
      vehicle: 'වාහන විස්තර',
      documents: 'ලේඛන උඩුගත කරන්න',
      confirm: 'තහවුරු කිරීම',
    },
    form: {
      fullName: 'සම්පූර්ණ නම',
      nid: 'ජාතික හැඳුනුම්පත / විදේශ ගමන් බලපත්‍ර අංකය',
      phone: 'දුරකථන අංකය',
      email: 'විද්‍යුත් තැපෑල',
      address: 'පදිංචි ලිපිනය',
      regNumber: 'වාහන ලියාපදිංචි අංකය',
      vehicleType: 'වාහන වර්ගය',
      chassisNumber: 'චැසි අංකය',
      engineNumber: 'එන්ජින් අංකය',
      makeModel: 'වාහන නිෂ්පාදනය සහ මාදිලිය',
      fuelType: 'ඉන්ධන වර්ගය',
      year: 'නිෂ්පාදන වර්ෂය',
      owners: 'පෙර හිමිකරුවන් ගණන',
      ownershipType: 'හිමිකාරීත්ව වර්ගය',
    },
    documents: {
      nid: 'ජාතික හැඳුනුම්පත / විදේශ ගමන් බලපත්‍ර පිටපත',
      invoice: 'වාහන ඉන්වොයිසිය / මිලදී ගැනීමේ කුවිතාන්සිය',
      insurance: 'වාහන රක්ෂණ ලේඛනය',
      emission: 'විමෝචන පරීක්ෂණ සහතිකය',
      approval: 'DMT අනුමැති ලිපිය (අදාළ නම්)',
    },
    buttons: {
      next: 'ඊළඟ පියවර',
      previous: 'පෙර',
      submit: 'අයදුම්පත යොමු කරන්න',
    },
  },
  ta: {
    title: 'புதிய வாகனத்தை பதிவு செய்க',
    steps: {
      vehicle: 'வாகன விவரங்கள்',
      documents: 'ஆவணங்களை பதிவேற்றவும்',
      confirm: 'உறுதிப்படுத்தல்',
    },
    form: {
      fullName: 'முழு பெயர்',
      nid: 'தேசிய அடையாள அட்டை / கடவுச்சீட்டு எண்',
      phone: 'தொலைபேசி எண்',
      email: 'மின்னஞ்சல் முகவரி',
      address: 'வசிப்பிட முகவரி',
      regNumber: 'வாகன பதிவு எண்',
      vehicleType: 'வாகன வகை',
      chassisNumber: 'சாசி எண்',
      engineNumber: 'இயந்திர எண்',
      makeModel: 'வாகன தயாரிப்பு & மாதிரி',
      fuelType: 'எரிபொருள் வகை',
      year: 'உற்பத்தி ஆண்டு',
      owners: 'முந்தைய உரிமையாளர்களின் எண்ணிக்கை',
      ownershipType: 'உரிமை வகை',
    },
    documents: {
      nid: 'தேசிய அடையாள அட்டை / கடவுச்சீட்டு நகல்',
      invoice: 'வாகன விலைப்பட்டியல் / கொள்முதல் ரசீது',
      insurance: 'வாகன காப்பீட்டு ஆவணம்',
      emission: 'உமிழ்வு சோதனை சான்றிதழ்',
      approval: 'DMT ஒப்புதல் கடிதம் (பொருந்தினால்)',
    },
    buttons: {
      next: 'அடுத்த படி',
      previous: 'முந்தைய',
      submit: 'விண்ணப்பத்தை சமர்ப்பிக்கவும்',
    },
  },
};

const vehicleTypes = ['Car', 'Bike', 'Van', 'Bus', 'Truck'];
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const ownershipTypes = ['Personal', 'Commercial'];

export const RegisterVehicle = () => {
  const { language, isDarkMode } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    nid: '',
    phone: '',
    email: '',
    address: '',
    regNumber: '',
    vehicleType: '',
    chassisNumber: '',
    engineNumber: '',
    makeModel: '',
    fuelType: '',
    year: '',
    owners: '',
    ownershipType: '',
  });

  const [documents, setDocuments] = useState({
    nid: null,
    invoice: null,
    insurance: null,
    emission: null,
    approval: null,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    if (e.target.files?.[0]) {
      setDocuments({ ...documents, [type]: e.target.files[0] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Application submitted successfully!');
  };

  return (
    <div className={`rounded-lg p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <h1 className="mb-6 text-2xl font-bold">{translations[language].title}</h1>

      {/* Progress Steps */}
      <div className="mb-8 flex justify-between">
        {[1, 2, 3].map((step) => (
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
            <span className="ml-2">
              {translations[language].steps[
                step === 1 ? 'vehicle' : step === 2 ? 'documents' : 'confirm'
              ]}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Vehicle Details */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Object.entries(translations[language].form).map(([key, label]) => (
              <div key={key} className="relative">
                {key === 'vehicleType' ? (
                  <select
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border p-2.5 ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700'
                        : 'border-gray-300 bg-white'
                    }`}
                    required
                  >
                    <option value="">{label}</option>
                    {vehicleTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                ) : key === 'fuelType' ? (
                  <select
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border p-2.5 ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700'
                        : 'border-gray-300 bg-white'
                    }`}
                    required
                  >
                    <option value="">{label}</option>
                    {fuelTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                ) : key === 'ownershipType' ? (
                  <select
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border p-2.5 ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700'
                        : 'border-gray-300 bg-white'
                    }`}
                    required
                  >
                    <option value="">{label}</option>
                    {ownershipTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={key === 'email' ? 'email' : key === 'year' ? 'number' : 'text'}
                    name={key}
                    value={formData[key as keyof typeof formData]}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border p-2.5 ${
                      isDarkMode
                        ? 'border-gray-600 bg-gray-700'
                        : 'border-gray-300 bg-white'
                    }`}
                    placeholder={label as string}
                    required
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step 2: Document Upload */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {Object.entries(translations[language].documents).map(([key, label]) => (
              <div
                key={key}
                className={`rounded-lg border-2 border-dashed p-4 ${
                  isDarkMode ? 'border-gray-600' : 'border-gray-300'
                }`}
              >
                <label className="flex cursor-pointer items-center justify-center">
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, key)}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2">{label as string}</p>
                    <p className="text-sm text-gray-500">
                      {documents[key as keyof typeof documents]
                        ? documents[key as keyof typeof documents]?.name
                        : 'Click or drag file to upload'}
                    </p>
                  </div>
                </label>
              </div>
            ))}
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && (
          <div className={`rounded-lg border p-6 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h3 className="mb-4 text-lg font-semibold">Review Your Information</h3>
            <div className="space-y-4">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="font-medium">
                    {translations[language].form[key as keyof typeof translations.en.form]}
                  </span>
                  <span>{value}</span>
                </div>
              ))}
              <div className="mt-6">
                <h4 className="mb-2 font-medium">Uploaded Documents:</h4>
                {Object.entries(documents).map(([key, file]) => (
                  <div key={key} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>
                      {
                        translations[language].documents[
                          key as keyof typeof translations.en.documents
                        ]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className={`rounded-lg px-4 py-2 ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {translations[language].buttons.previous}
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              {translations[language].buttons.next}
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              {translations[language].buttons.submit}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};