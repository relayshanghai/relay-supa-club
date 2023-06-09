import { useTranslation } from 'react-i18next';

const SignUpPage = () => {
    const { t } = useTranslation();

    return (
        <div>
            <h1>Sign Up</h1>
            <div>{t('login.firstName')}</div>
        </div>
    );
};

export default SignUpPage;
