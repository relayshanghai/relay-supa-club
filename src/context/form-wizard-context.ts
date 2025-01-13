import { createContext, useContext } from 'react';

// Define the context and its type
interface FormWizardContextType {
    currentStep: number;
    setCurrentStep: (step: number) => void;
}

export const FormWizardContext = createContext<FormWizardContextType | undefined>(undefined);

// Create a custom hook for easier access
export const useFormWizard = () => {
    const context = useContext(FormWizardContext);
    if (!context) {
        throw new Error('useFormWizard must be used within a FormWizardProvider');
    }
    return context;
};
