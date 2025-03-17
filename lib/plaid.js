import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

const configuration = new Configuration({
    basePath: PlaidEnvironments.sandbox,
    baseOptions: {
        headers: {
            'Content-Type': 'application/json',
        }
    }
});

export const plaidClient = new PlaidApi(configuration);
