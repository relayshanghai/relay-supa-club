import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { FormWizard } from './form-wizard';
import { Input } from '../input';
import { SingleSelect } from '../ui';
import { companyCategories } from './company-categories';
import { Radio } from '../ui/radio';
import { OnboardPaymentSection } from './onboard-payment-section';
import { validateSignupInput } from 'src/utils/validation/signup';
import { useFields } from 'src/hooks/use-fields';
import type { SignupInputTypes } from 'src/utils/validation/signup';

const SignUpPage = ({ selectedPriceId }: { selectedPriceId: string }) => {
    const { t } = useTranslation();
    const {
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();
    const {
        values: { firstName, lastName, email, password, confirmPassword, phoneNumber, companyName, companyWebsite },
        setFieldValue,
    } = useFields({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        companyName: '',
        companyWebsite: '',
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedSize, setSelectedSize] = useState('');
    const [validationErrors, setValidationErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
    });

    const handleCompanySizeChange = (newValue: string) => {
        setSelectedSize(newValue);
    };

    const formData = {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phoneNumber,
        companyName,
        companySize: selectedSize,
        companyWebsite,
    };
    const steps = [
        {
            title: t('signup.step1title'),
            num: 1,
        },
        {
            title: t('signup.step2title'),
            num: 2,
        },
        {
            title: t('signup.step3title'),
            num: 3,
        },
        {
            title: t('signup.step4title'),
            num: 4,
        },
        {
            title: t('signup.step5title'),
            num: 5,
        },
    ];

    const companySizeOptions = [
        { label: '1-10', value: '1-10' },
        { label: '11-50', value: '11-50' },
        { label: '50 +', value: '50+' },
    ];
    //TODO: phone validation need to be updated
    const setAndValidate = (type: SignupInputTypes, value: string) => {
        setFieldValue(type, value);
        const validationError = validateSignupInput(type, value, password);
        if (validationError) {
            setValidationErrors({ ...validationErrors, [type]: t(validationError) });
        } else {
            setValidationErrors({ ...validationErrors, [type]: '' });
        }
    };

    return (
        <div>
            {steps.map(
                (step) =>
                    step.num === currentStep && (
                        <FormWizard
                            title={step.title}
                            key={step.num}
                            steps={steps}
                            currentStep={currentStep}
                            setCurrentStep={setCurrentStep}
                            handleSubmit={handleSubmit}
                            formData={formData}
                        >
                            {currentStep === 1 && (
                                <>
                                    <Input
                                        error={validationErrors.firstName}
                                        label={t('signup.firstName')}
                                        value={firstName}
                                        placeholder={t('signup.firstNamePlaceholder')}
                                        required
                                        onChange={(e) => setAndValidate('firstName', e.target.value)}
                                    />
                                    <Input
                                        error={validationErrors.lastName}
                                        label={t('signup.lastName')}
                                        placeholder={t('signup.lastNamePlaceholder')}
                                        value={lastName}
                                        required
                                        onChange={(e) => setAndValidate('lastName', e.target.value)}
                                    />
                                    <Input
                                        error={validationErrors.phoneNumber}
                                        label={t('signup.phoneNumber')}
                                        placeholder={t('signup.phoneNumberPlaceholder')}
                                        value={phoneNumber}
                                        onChange={(e) => setAndValidate('phoneNumber', e.target.value)}
                                    />
                                </>
                            )}

                            {currentStep === 2 && (
                                <>
                                    <Input
                                        error={validationErrors.email}
                                        label={t('signup.email')}
                                        type="email"
                                        placeholder="you@site.com"
                                        value={email}
                                        required
                                        onChange={(e) => setAndValidate('email', e.target.value)}
                                    />
                                    <Input
                                        error={validationErrors.password}
                                        label={t('signup.password')}
                                        type="password"
                                        placeholder={t('signup.passwordPlaceholder')}
                                        value={password}
                                        required
                                        onChange={(e) => setAndValidate('password', e.target.value)}
                                    />
                                    <Input
                                        error={validationErrors.confirmPassword}
                                        label={t('signup.confirmPassword')}
                                        type="password"
                                        placeholder={t('signup.confirmPasswordPlaceholder')}
                                        value={confirmPassword}
                                        required
                                        onChange={(e) => setAndValidate('confirmPassword', e.target.value)}
                                    />
                                </>
                            )}

                            {currentStep === 3 && (
                                <>
                                    <SingleSelect
                                        fieldName="companyCategory"
                                        errors={errors}
                                        isRequired
                                        control={control}
                                        options={companyCategories}
                                        valueName="companyCategory"
                                        setValue={setValue}
                                    />
                                </>
                            )}

                            {currentStep === 4 && (
                                <>
                                    <Input
                                        label={t('signup.company')}
                                        value={companyName}
                                        placeholder={t('signup.companyPlaceholder')}
                                        required
                                        onChange={(e) => setFieldValue('companyName', e.target.value)}
                                    />
                                    <Input
                                        label={t('signup.website')}
                                        value={companyWebsite}
                                        placeholder="www.site.com"
                                        onChange={(e) => setFieldValue('companyWebsite', e.target.value)}
                                    />

                                    <Radio
                                        label={t('signup.companySize')}
                                        options={companySizeOptions}
                                        onValueChange={handleCompanySizeChange}
                                    />
                                </>
                            )}
                            {currentStep === 5 && <OnboardPaymentSection priceId={selectedPriceId} />}
                        </FormWizard>
                    ),
            )}
        </div>
    );
};

export default SignUpPage;
