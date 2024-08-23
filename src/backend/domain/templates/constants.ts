import { type OutreachEmailTemplateVariableEntity } from 'src/backend/database/sequence-email-template/sequence-email-template-variable-entity';

type GlobalTemplateVariableType = OutreachEmailTemplateVariableEntity & {
    editable?: boolean;
};

export const GlobalTemplateVariables: GlobalTemplateVariableType[] = [
    {
        id: '3d8c257a-1e57-4f9e-b4aa-8b9c8e271a29',
        name: 'influencerAccountName',
        category: 'Influencers',
        editable: false,
    },
    { id: 'f715c2b9-591b-4c59-825e-04941c8b3a2e', name: 'recentPostTitle', category: 'Influencers', editable: false },
    { id: '9b61aee1-4495-4f88-99c7-56a2c2cda10b', name: 'recentPostURL', category: 'Influencers', editable: false },
    {
        id: 'c3f84964-ff0d-42da-9441-d4cf8f8d77b0',
        name: 'marketingManagerName',
        category: 'Product',
        editable: false,
    },
    { id: 'b39d04e3-b226-4038-8f90-246b314ea2a4', name: 'productDescription', category: 'Product', editable: false },
    { id: '84eb507d-0ad8-4887-9826-d89d2fa8f98d', name: 'productLink', category: 'Product', editable: false },
    { id: '6c53b6a4-72a3-4e70-8f68-73d2251d08a5', name: 'productName', category: 'Product', editable: false },
    { id: '21ecb0d9-0246-4674-b056-beb71a20fd67', name: 'brandName', category: 'Product', editable: false },
    { id: 'b640e2b4-5209-496b-91f2-6e9fdc93a792', name: 'productPrice', category: 'Product', editable: false },
    { id: 'd5ae013f-0674-4ad7-8e5b-e50fd1bfe5d0', name: 'productPriceCurrency', category: 'Product', editable: false },
];
