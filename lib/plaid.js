import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;

if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
    throw new Error('Missing Plaid environment variables');
}

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
        }
    }
});

export const plaidClient = new PlaidApi(configuration);
