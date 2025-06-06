/* eslint-disable no-undef */
'use server'

import { ID, Query } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { cookies } from "next/headers"
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils"
import { plaidClient } from "../plaid"
import { revalidatePath } from "next/cache"
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions"

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;


export const getUserInfo = async ({userId}) => {
    try {
        const {database} = await createAdminClient()

        const user = await database.listDocuments(
            DATABASE_ID,
            USER_COLLECTION_ID,
            [Query.equal('userId', [userId])]
        )

        return parseStringify(user.documents[0])
    } catch (error) {
        console.log(error);
    }
}

export const signIn = async ({email, password}) => {
    try {
        const { account } = await createAdminClient(); 
        const session = await account.createEmailPasswordSession(email, password);

        (await cookies()).set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });
        

        const user = await getUserInfo({userId: session.userId})


        return parseStringify(user);
    } catch (error) {
        console.error('Error', error)
    }
}

export const signUp = async ({password, ...userData}) => {

    const {email, firstName, lastName } = userData;

    let newUserAccount;


    try {
        const { account, database } = await createAdminClient();

        newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);

        if(!newUserAccount) throw new Error('Error creating user')

            const dwollaCustomerUrl = await createDwollaCustomer({
                ...userData,
                type: 'personal'
            })

            if(!dwollaCustomerUrl) throw new Error('Error creando cliente Dwolla');

            const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl)
            if (!dwollaCustomerId) throw new Error("Error extrayendo el ID de Dwolla");

            const newUser = await database.createDocument(
                DATABASE_ID,
                USER_COLLECTION_ID,
                ID.unique(),
                {
                    ...userData,
                    userId: newUserAccount.$id,
                    dwollaCustomerId,
                    dwollaCustomerUrl
                }
            )

        const session = await account.createEmailPasswordSession(email, password);

        const cookieStore = await cookies();
        cookieStore.set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });        

    return parseStringify(newUser)
    } catch (error) {
        console.error('Error', error)
    }
}


export async function getLoggedInUser() {
    try {
    const { account } = await createSessionClient();
    const result = await account.get();

    const user = await getUserInfo({userId: result.$id})

    return parseStringify(user)
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const loggoutAccount = async () => {
    try {
        const { account } = await createSessionClient();

        (await cookies()).delete("appwrite-session");

        await account.deleteSession('current');
    } catch (error) {
        console.error(error)
        return null;
    }
}

export const createLinkToken = async (user) => {
    try {
        const tokenParams = {
            client_id: process.env.PLAID_CLIENT_ID,
            secret: process.env.PLAID_SECRET,
            user: {
                client_user_id: user.$id
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ['auth', 'transactions'],
            language: 'en',
            country_codes: ['US']
        }

        console.log("Plaid tokenParams:", tokenParams);

        const response = await plaidClient.linkTokenCreate(tokenParams);
        console.log("Plaid Link Token:", response.data.link_token);

        return parseStringify({linkToken: response.data.link_token})
    } catch (error) {
        console.error("Plaid API Error:", error.response?.data || error.message);
    }
}

export const createBankAccount = async ({userId, bankId, accountId, accessToken, fundingSourceUrl, shareableId }) => {
    try {
        const { database } = await createAdminClient();

        const bankAccount = await database.createDocument(
            DATABASE_ID,
            BANK_COLLECTION_ID,
            ID.unique(),
            {
                userId, 
                bankId, 
                accountId, 
                accessToken, 
                fundingSourceUrl, 
                shareableId,
            }
        )

        return parseStringify(bankAccount);
    } catch (error) {
        console.log(error);
    }
}

export const exchangePublicToken = async ({publicToken, user}) => {
    try {
        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];

        // create a processor token for Dwolla using the access token and account ID
        const request = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla"
        };

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        if (!fundingSourceUrl) throw Error;

        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableId: encryptId(accountData.account_id)
        });

        revalidatePath("/");

        return parseStringify({
            publicTokenExchange: "complete",
        });

    } catch (error) {
        console.error('An error occurred while creating exchanging token:', error);
    }
}

export const getBanks = async ({userId}) => {
    try {
        const {database} = await createAdminClient()

        const banks = await database.listDocuments(
            DATABASE_ID,
            BANK_COLLECTION_ID,
            [Query.equal('userId', [userId])]
        )

        return parseStringify(banks.documents)
    } catch (error) {
        console.log(error);
    }
}

export const getBank = async ({documentId}) => {
    try {
        const {database} = await createAdminClient()

        const bank = await database.listDocuments(
            DATABASE_ID,
            BANK_COLLECTION_ID,
            [Query.equal('$id', [documentId])]
        )

        if (!bank.documents.length) {
            throw new Error(`No bank found with ID: ${documentId}`);
        }

        return parseStringify(bank.documents[0])
    } catch (error) {
        console.log(error);
    }
}

export const getBankByAccountId = async ({accountId}) => {
    try {
        const {database} = await createAdminClient()

        const bank = await database.listDocuments(
            DATABASE_ID,
            BANK_COLLECTION_ID,
            [Query.equal('accountId', [accountId])]
        )

        if (bank.total !== 1) {
            return null;
        }

        return parseStringify(bank.documents[0])
    } catch (error) {
        console.log(error);
    }
}