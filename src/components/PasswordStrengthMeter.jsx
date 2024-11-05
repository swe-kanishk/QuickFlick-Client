import { Check, X } from "lucide-react";
import React, { useCallback, useMemo } from "react";

const PasswordCriteria = React.memo(({ password }) => {
  const criteria = useMemo(() => [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ], [password]);

  return (
    <div className="mt-2 space-y-1">
      {criteria.map(({ label, met }) => (
        <div key={label} className="flex items-center text-xs">
          {met ? <Check className="size-4 text-green-500 mr-2" /> : <X className="size-4 text-gray-500 mr-2" />}
          <span className={met ? "text-green-500" : "text-gray-400"}>{label}</span>
        </div>
      ))}
    </div>
  );
});

export default function PasswordStrengthMeter({ password }) {
  const calculateStrength = useCallback(() => {
    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z\d]/.test(password)) score++;
    return score;
  }, [password]);

  const strength = useMemo(() => calculateStrength(), [calculateStrength]);

  const strengthText = useMemo(() => ["Very weak", "Weak", "Fair", "Good", "Strong"][strength], [strength]);
  const strengthColor = useMemo(() => ["bg-red-500", "bg-red-400", "bg-yellow-500", "bg-yellow-400", "bg-green-500"][strength], [strength]);

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password strength</span>
        <span className="text-xs text-gray-400">{strengthText}</span>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${
              index < strength ? strengthColor : "bg-gray-600"
            }`}
          />
        ))}
      </div>
      <PasswordCriteria password={password} />
    </div>
  );
}
