import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Upload, Check } from 'lucide-react';

const translations = {
  en: {
    title: 'Transfer Vehicle Ownership',
    steps: {
      details: 'Enter Details',
      documents: 'Upload Documents',
      confirm: 'Confirmation',
    },
    form: {
      sellerName: 'Seller Full Name',
      sellerNid: 'Seller National ID / Passport No.',
      sellerEmail: 'Seller Email',
      sellerPhone: 'Seller Phone Number',
      buyerName: 'Buyer Full Name',
      buyerNid: 'Buyer National ID / Passport No.',
      buyerEmail: 'Buyer Email',
      buyerPhone: 'Buyer Phone Number',
      vehicleNumber: 'Current Vehicle Registration Number',
      transferReason: 'Transfer Reason',
    },
    documents: {
      sellerProof: "Seller's ID Copy",
      buyerProof: "Buyer's ID Copy",
      agreement: 'Sale Agreement / Deed of Transfer',
      inspection: 'Vehicle Inspection Report',
      insurance: 'Updated Insurance Document',
    },
    buttons: {
      next: 'Next Step',
      previous: 'Previous',
      submit: 'Submit Transfer Request',
    },
  },
  si: {
    title: 'වාහන අයිතිය මාරු කිරීම',
    steps: {
      details: 'විස්තර ඇතුළත් කරන්න',
      documents: 'ලේඛන උඩුගත කරන්න',
      confirm: 'තහවුරු කිරීම',
    },
    form: {
      sellerName: 'විකුණන්නාගේ සම්පූර්ණ නම',
      sellerNid: 'විකුණන්නාගේ ජාතික හැඳුනුම්පත / විදේශ ගමන් බලපත්‍ර අංකය',
      sellerEmail: 'විකුණන්නාගේ විද්‍යුත් තැපෑල',
      sellerPhone: 'විකුණන්නාගේ දුරකථන අංකය',
      buyerName: 'මිලදී ගන්නාගේ සම්පූර්ණ නම',
      buyerNid: 'මිලදී ගන්නාගේ ජාතික හැඳුනුම්පත / විදේශ ගමන් බලපත්‍ර අංකය',
      buyerEmail: 'මිලදී ගන්නාගේ විද්‍යුත් තැපෑල',
      buyerPhone: 'මිලදී ගන්නාගේ දුරකථන අංකය',
      vehicleNumber: 'වර්තමාන වාහන ලියාපදිංචි අංකය',
      transferReason: 'මාරු කිරීමේ හේතුව',
    },
    documents: {
      sellerProof: 'විකුණන්නාගේ හැඳුනුම්පත් පිටපත',
      buyerProof: 'මිලදී ගන්නාගේ හැඳුනුම්පත් පිටපත',
      agreement: 'විකිණීමේ ගිවිසුම / මාරු කිරීමේ ඔප්පුව',
      inspection: 'වාහන පරීක්ෂණ වාර්තාව',
      insurance: 'යාවත්කාලීන රක්ෂණ ලේඛනය',
    },
    buttons: {
      next: 'ඊළඟ පියවර',
      previous: 'පෙර',
      submit: 'මාරු කිරීමේ ඉල්ලීම යොමු කරන්න',
    },
  },
  ta: {
    title: 'வாகன உரிமை மாற்றம்',
    steps: {
      details: 'விவரங்களை உள்ளிடவும்',
      documents: 'ஆவணங்களை பதிவேற்றவும்',
      confirm: 'உறுதிப்படுத்தல்',
    },
    form: {
      sellerName: 'விற்பனையாளரின் முழு பெயர்',
      sellerNid: 'விற்பனையாளரின் தேசிய அடையாள அட்டை / கடவுச்சீட்டு எண்',
      sellerEmail: 'விற்பனையாளரின் மின்னஞ்சல்',
      sellerPhone: 'விற்பனையாளரின் தொலைபேசி எண்',
      buyerName: 'வாங்குபவரின் முழு பெயர்',
      buyerNid: 'வாங்குபவரின் தேசிய அடையாள அட்டை / கடவுச்சீட்டு எண்',
      buyerEmail: 'வாங்குபவரின் மின்னஞ்சல்',
      buyerPhone: 'வாங்குபவரின் தொலைபேசி எண்',
      vehicleNumber: 'தற்போதைய வாகன பதிவு எண்',
      transferReason: 'மாற்றத்திற்கான காரணம்',
    },
    documents: {
      sellerProof: 'விற்பனையாளரின் அடையாள அட்டை நகல்',
      buyerProof: 'வாங்குபவரின் அடையாள அட்டை நகல்',
      agreement: 'விற்பனை ஒப்பந்தம் / உரிமை மாற்ற பத்திரம்',
      inspection: 'வாகன ஆய்வு அறிக்கை',
      insurance: 'புதுப்பிக்கப்பட்ட காப்பீட்டு ஆவணம்',
    },
    buttons: {
      next: 'அடுத்த படி',
      previous: 'முந்தைய',
      submit: 'மாற்ற கோரிக்கையை சமர்ப்பிக்கவும்',
    },
  },
};

const transferReasons = ['Sale', 'Gift', 'Inheritance', 'Lease Return'];

export const TransferVehicle = () => {
  const { language, isDarkMode } = useStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    sellerName: '',
    sellerNid: '',
    sellerEmail: '',
    sellerPhone: '',
    buyerName: '',
    buyerNid: '',
    buyerEmail: '',
    buyerPhone: '',
    vehicleNumber: '',
    transferReason: '',
  });

  const [documents, setDocuments] = useState({
    sellerProof: null,
    buyerProof: null,
    agreement: null,
    inspection: null,
    insurance: null,
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
    alert('Transfer request submitted successfully!');
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
                step === 1 ? 'details' : step === 2 ? 'documents' : 'confirm'
              ]}
            </span>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        {/* Step 1: Details */}
        {currentStep === 1 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {Object.entries(translations[language].form).map(([key, label]) => (
              <div key={key} className="relative">
                {key === 'transferReason' ? (
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
                    {transferReasons.map((reason) => (
                      <option key={reason} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={key.includes('Email') ? 'email' : 'text'}
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
                    <Upload className="mx- auto h-12 w-12 text-gray-400" />
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