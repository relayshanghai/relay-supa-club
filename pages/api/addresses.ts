import type { NextApiHandler } from 'next';
import type { Address, AddressesUpdate, AddressesGet, AddressesInsert } from 'src/backend/database/addresses';
import {
    addressesUpdateSchema,
    updateAddressCall,
    addressesGet,
    getAddressCall,
    addressesInsertSchema,
    insertAddressCall,
} from 'src/backend/database/addresses';

import httpCodes from 'src/constants/httpCodes';
import { ApiHandlerWithContext } from 'src/utils/api-handler';

export type AddressGetQuery = AddressesGet;
export type AddressesPutRequestBody = AddressesUpdate;
export type AddressesPutRequestResponse = Address;
export type AddressesPostRequestBody = AddressesInsert;
export type AddressesPostRequestResponse = Address;

const getHandler: NextApiHandler = async (req, res) => {
    const validated = addressesGet.safeParse(req);

    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }

    const id = validated.data.query.id;
    const result: Address = await getAddressCall()(id);

    return res.status(httpCodes.OK).json(result);
};

const putHandler: NextApiHandler = async (req, res) => {
    const validated = addressesUpdateSchema.safeParse(req.body);
    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }
    const update = validated.data;
    const result: Address = await updateAddressCall()(update);
    return res.status(httpCodes.OK).json(result);
};

const postHandler: NextApiHandler = async (req, res) => {
    const validated = addressesInsertSchema.safeParse(req.body);
    if (!validated.success) {
        return res.status(httpCodes.BAD_REQUEST).json({ error: validated.error });
    }
    const insert = validated.data;
    const result: Address = await insertAddressCall()(insert);
    return res.status(httpCodes.OK).json(result);
};

export default ApiHandlerWithContext({ getHandler, putHandler, postHandler });
