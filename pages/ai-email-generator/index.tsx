import { Layout } from 'src/modules/layout';
import { useState } from 'react';
import { Button } from 'src/components/button';
import { t } from 'i18next';
import { Input } from 'src/components/input';

const AIImageGenerator = () => {
    const [brandName, setBrandName] = useState('');
    const [language, setLanguage] = useState('');
    const [influencerName, setInfluencerName] = useState('');
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [instructions, setInstructions] = useState('');
    const [senderName, setSenderName] = useState('');

    const handleSubmit = async (e: any) => {
        e.preventDefault();
    };

    return (
        <Layout>
            <div className="flex flex-col items-center p-6 w-full">
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col max-w-lg items-center justify-center mb-4 sm:mb-6"
                >
                    <Input
                        label="Sender Name"
                        placeholder="Your Name"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        required
                    />
                    <Input
                        label="Brand Name"
                        placeholder="Brand Name"
                        value={brandName}
                        onChange={(e) => setBrandName(e.target.value)}
                        required
                    />
                    <Input
                        label="Language"
                        placeholder="Language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        required
                    />
                    <Input
                        label="Influencer Name"
                        placeholder="Influencer Name"
                        value={influencerName}
                        onChange={(e) => setInfluencerName(e.target.value)}
                        required
                    />
                    <Input
                        label="Product Name"
                        placeholder="Product Name"
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        required
                    />
                    <Input
                        label="Product Description"
                        placeholder="Product Description"
                        value={productDescription}
                        onChange={(e) => setProductDescription(e.target.value)}
                        required
                    />
                    <Input
                        label="Instructions"
                        placeholder="Instructions"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        required
                    />
                    <Button type="submit">{t('aiEmailGenerator.index.generateEmail')}</Button>
                </form>
            </div>
        </Layout>
    );
};

export default AIImageGenerator;
