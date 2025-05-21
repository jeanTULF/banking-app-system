This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

```bash
#NEXT
NEXT_PUBLIC_SITE_URL=

#APPWRITE
NEXT_PUBLIC_APPWRITE_PROJECT=67c501220030895df18a
NEXT_PUBLIC_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
APPWRITE_DATABASE_ID=67c50294003a233df06d
APPWRITE_USER_COLLECTION_ID=67c502b2002cbc0e759f
APPWRITE_BANK_COLLECTION_ID=67c502f4002afcddd3d4
APPWRITE_TRANSACTION_COLLECTION_ID=67c502e2003a6646f0f7
NEXT_APPWRITE_KEY=standard_44d952530f9cbb34028fb5482cc079dcad3f74817943f89de63811b69704b57e90a8d7934d4630208ee1bdacdb4c9e8fee0de8d4e0e7cbeeb04c13951d069690b8c80770bc47a5ec0ad3cdeeced20c9178c5e429ba173a4bdaf4d448ecab2f8bc78b97cbf822aa275c56da54e0c03e6a903f80ae9596e63bf91e61ea36583196

#PLAID
PLAID_CLIENT_ID=67cdea2aa291e80023d19dd1
PLAID_SECRET=60a6e6df847238796dd4f00ecd8d20
PLAID_ENV=sandbox   
PLAID_PRODUCTS=auth, transactions, identity
PLAID_COUNTRY_CODES=US, CA

#DWOLLA
DWOLLA_KEY=6PotWmLFD8ByeUChM5eYid72ZRGAMuZczdlAif7kZ8s9hMwTSG
DWOLLA_SECRET=Pgy3ZGoF0mRCCACtmgLKBuvWEHzcAv5CqqN1pOhpWhHTjjIazf
DWOLLA_BASE_URL=https://api-sandbox.dwolla.com
DWOLLA_ENV=sandbox
```
