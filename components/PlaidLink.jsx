/* eslint-disable react/prop-types */
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation';
import { usePlaidLink } from 'react-plaid-link';
import { createLinkToken, exchangePublicToken } from '@/lib/actions/user.actions';

const PlaidLink = ({user, variant}) => {

        const router = useRouter();

    const [token, setToken] = useState('');

    useEffect(() => {
        const getLinkToken = async () => {
        const data = await createLinkToken(user);

            setToken(data?.linkToken)
        }
        getLinkToken();
    }, [user])

    const onSuccess = useCallback(async (public_token) => {
        await exchangePublicToken({
            publicToken: public_token,
            user,
        })
        router.push('/')

    }, [user])

    const config = {
        token,
        onSuccess,
    }

    const {open, ready} = usePlaidLink(config)

  return (
    <>
        {variant === 'primary' ? (
            <Button onClick={() => open()} disabled={!ready} className="plaidlink-primary">
                Connect Bank
            </Button>
        ) : variant === 'ghost' ? (
            <Button>
                Connect Bank
            </Button>
        ): (
            <Button>
                Connect bank
            </Button>
        )}
    </>
  )
}

export default PlaidLink